import type { CreateOrderResponse } from '@/types'

const CDN = 'https://cdn.payphonetodoesposible.com/box/v2.0/'
let loader: Promise<void> | null = null

// CSS y JS de la Cajita se piden una sola vez por visita, y solo si alguien paga con tarjeta.
function load(): Promise<void> {
  if (window.PPaymentButtonBox) return Promise.resolve()
  if (loader) return loader
  loader = new Promise<void>((resolve, reject) => {
    if (!document.querySelector(`link[href^="${CDN}"]`)) {
      const css = document.createElement('link')
      css.rel = 'stylesheet'
      css.href = `${CDN}payphone-payment-box.css`
      document.head.appendChild(css)
    }
    const script = document.createElement('script')
    script.type = 'module'
    script.src = `${CDN}payphone-payment-box.js`
    script.onload = () => resolve()
    script.onerror = () => {
      script.remove()
      loader = null // permite reintentar
      reject(new Error('payphone'))
    }
    document.head.appendChild(script)
  })
  return loader
}

/** 0991234567 → +593991234567, como lo pide Payphone. */
function intlPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return digits.startsWith('0') ? `+593${digits.slice(1)}` : `+${digits}`
}

export async function renderPayphone(
  config: NonNullable<CreateOrderResponse['payphone']>,
  buyer: { email: string; phone: string },
  containerId = 'pp-button',
) {
  await load()
  if (!window.PPaymentButtonBox) throw new Error('payphone')
  new window.PPaymentButtonBox({
    token: config.token,
    clientTransactionId: config.clientTransactionId,
    amount: config.amount,
    amountWithoutTax: config.amountWithoutTax,
    currency: config.currency,
    storeId: config.storeId,
    reference: config.reference,
    lang: 'es',
    defaultMethod: 'card',
    timeZone: -5,
    phoneNumber: intlPhone(buyer.phone),
    ...(buyer.email ? { email: buyer.email } : {}),
  }).render(containerId)
}
