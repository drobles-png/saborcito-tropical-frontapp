import { ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { admin } from '@/config/admin'

const POLL_MS = 15000
const SOUND_KEY = 'admin_sound'

// Estado de módulo: el layout sondea y la vista de pedidos lo lee.
const activeCount = ref(0)
const unseen = ref(0)
const arrivals = ref(0) // sube cada vez que llegan pedidos: la vista de pedidos recarga al verlo
const freshIds = ref(new Set<string>())
const soundEnabled = ref(readSoundPref())

let since = new Date().toISOString()
let timer: ReturnType<typeof setInterval> | undefined
let flashTimer: ReturnType<typeof setInterval> | undefined
let baseTitle = ''
let audio: AudioContext | undefined

function readSoundPref() {
  try {
    return localStorage.getItem(SOUND_KEY) === '1'
  } catch {
    return false
  }
}

// El navegador solo deja sonar audio creado o reanudado tras un gesto del usuario.
function ensureAudio() {
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctx) return
  audio ??= new Ctx()
  if (audio.state === 'suspended') audio.resume().catch(() => {})
}

function chime() {
  if (!soundEnabled.value || !audio) return
  const t = audio.currentTime
  ;[880, 1320, 1760].forEach((freq, i) => {
    const osc = audio!.createOscillator()
    const gain = audio!.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    const start = t + i * 0.13
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(0.25, start + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35)
    osc.connect(gain).connect(audio!.destination)
    osc.start(start)
    osc.stop(start + 0.4)
  })
}

function flashTitle() {
  if (flashTimer) return
  let on = false
  flashTimer = setInterval(() => {
    // El router cambia el título al navegar: tomamos el vigente como base.
    if (!document.title.startsWith('(')) baseTitle = document.title
    on = !on
    document.title = on ? `(${unseen.value}) ${admin.alerts.newOne}` : baseTitle
  }, 1000)
}

function acknowledge() {
  unseen.value = 0
  if (flashTimer) clearInterval(flashTimer)
  flashTimer = undefined
  if (baseTitle && document.title.startsWith('(')) document.title = baseTitle
}

async function refreshBadge() {
  try {
    activeCount.value = (await adminService.orders({ status: 'active', limit: 1 })).total
  } catch {
    /* el siguiente sondeo lo intenta otra vez */
  }
}

async function poll() {
  try {
    const { items } = await adminService.orders({ since, limit: 20 })
    if (items.length) {
      // El API filtra con $gte: +1 ms para no volver a avisar el mismo pedido
      since = new Date(new Date(items[0]!.createdAt).getTime() + 1).toISOString()
      // shortcut: los de tarjeta sin pagar no avisan (la cocina no los atiende); si se pagan después no suenan.
      const fresh = items.filter((o) => o.paymentMethod !== 'card' || o.paymentStatus === 'paid')
      if (fresh.length) {
        fresh.forEach((o) => freshIds.value.add(o.id))
        unseen.value += fresh.length
        arrivals.value++
        useToastStore().success(fresh.length === 1 ? `${admin.alerts.newOne} ${fresh[0]!.code}` : admin.alerts.newMany(fresh.length))
        chime()
        flashTitle()
      }
    }
  } catch {
    /* sin red: reintenta en el siguiente ciclo */
  }
  await refreshBadge()
}

function schedule() {
  clearInterval(timer)
  timer = setInterval(poll, POLL_MS)
}

function onVisibility() {
  if (document.hidden) {
    clearInterval(timer)
    timer = undefined
  } else {
    poll()
    schedule()
  }
}

function onGesture() {
  if (soundEnabled.value) ensureAudio()
}

function start() {
  since = new Date().toISOString()
  refreshBadge()
  schedule()
  document.addEventListener('visibilitychange', onVisibility)
  document.addEventListener('pointerdown', onGesture, { once: true })
}

function stop() {
  clearInterval(timer)
  timer = undefined
  acknowledge()
  document.removeEventListener('visibilitychange', onVisibility)
  document.removeEventListener('pointerdown', onGesture)
}

function toggleSound() {
  soundEnabled.value = !soundEnabled.value
  try {
    localStorage.setItem(SOUND_KEY, soundEnabled.value ? '1' : '0')
  } catch {
    /* modo privado: vale solo esta sesión */
  }
  if (soundEnabled.value) {
    ensureAudio()
    chime()
  }
}

export function useOrderAlerts() {
  return { activeCount, unseen, arrivals, freshIds, soundEnabled, start, stop, toggleSound, acknowledge, refreshBadge }
}
