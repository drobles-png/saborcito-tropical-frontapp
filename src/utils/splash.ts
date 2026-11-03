/**
 * "Splash" coral como el de la O del logo: mancha orgánica con picos y gotitas.
 * Determinista (semilla fija) para que no cambie entre recargas. viewBox -150..150.
 */
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
}

export function splashShape(seed = 7, size = 100) {
  const rand = rng(seed)
  const n = 26
  const pts: Array<[number, number]> = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    const spike = i % 5 === 2 ? 1.22 + rand() * 0.12 : 0.86 + rand() * 0.1
    pts.push([Math.cos(a) * size * spike, Math.sin(a) * size * spike])
  }
  // Catmull-Rom → Bézier cúbica: contorno suave que pasa por todos los puntos.
  const at = (i: number) => pts[(i + n) % n] as [number, number]
  let d = `M${at(0)[0].toFixed(1)},${at(0)[1].toFixed(1)}`
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += `C${c1[0]!.toFixed(1)},${c1[1]!.toFixed(1)} ${c2[0]!.toFixed(1)},${c2[1]!.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`
  }
  const drops = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 + rand()
    const r = size * (1.32 + rand() * 0.14)
    return { cx: Math.cos(a) * r, cy: Math.sin(a) * r, r: 3 + rand() * 7 }
  })
  return { d: d + 'Z', drops }
}
