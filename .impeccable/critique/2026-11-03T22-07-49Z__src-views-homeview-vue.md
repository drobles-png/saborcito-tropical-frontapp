---
target: tienda saborcito TROPICAL (home, menú, compra)
total_score: 28
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "file:C:\\Users\\cjura\\bakano\\clientes-pagina-web\\saborcito-tropical\\saborcito-tropical-web\\saborcito-tropical-frontapp\\src\\views\\HomeView.vue"
target_fingerprint: "sha256:276b85c3a486d20d34d4d407be943d2f3d6bf088b044563bfab13dd27b92969d"
target_path: "C:\\Users\\cjura\\bakano\\clientes-pagina-web\\saborcito-tropical\\saborcito-tropical-web\\saborcito-tropical-frontapp\\src\\views\\HomeView.vue"
timestamp: 2026-11-03T22-07-49Z
slug: src-views-homeview-vue
---
Method: dual-agent (A: revisión de diseño · B: detector + navegador)

Heurísticas Nielsen: 1=3 2=4 3=3 4=3 5=3 6=2 7=2 8=3 9=3 10=2 → 28/40 (Bueno)

Especificidad: alta. Hero lima, Fredoka + Caveat Brush, recortes reales, trama del vaso, billetes de vuelto. Genérico: "3 pasos" y "Te esperamos".

Prioridades (todas atendidas en el mismo pase):
- [P1] Huecos de ~200px entre campos del checkout (flex-basis en columna).
- [P1] Búsqueda deja tarjetas invisibles (reveal de ScrollTrigger).
- [P1] CTA del hero bajo el pliegue en móvil.
- [P2] Sin "pedir lo de siempre" para el que repite.
- [P2] Steppers de 32px y carrito sin sugerencias.
- [P3] La tarjeta no muestra que ya está en el pedido; toast tapa la bolsa.
Detector: 0 en CLI; navegador: kickers ×6 (prohibidos), #8a8790 a 3.5:1, texto 11.6px, precio tapado en la pegatina, enlaces de 28px.
