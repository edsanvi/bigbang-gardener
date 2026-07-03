# Big Bang Gardener — notas y mejoras pendientes

Producción: https://bigbang-gardener.vercel.app · Redesplegar: `npx vercel deploy --prod --yes` en esta carpeta.

## Hecho
- v1 (2026-07-02): juego base (4 fractales, música generativa, guardado local).
- v2 (2026-07-03): tutorial, hitos, cuásar/agujero negro/singularidad (prestigio), zoom/paneo, exportar PNG, 5 humores musicales, cometas, botón reiniciar.
- v2.2 (2026-07-03): exportar/importar código de partida, podar estructuras (sostener el dedo, reembolso 40%).

## Pendiente — distribución (mayor impacto/esfuerzo)
- [ ] **PWA**: `manifest.json` + service worker → instalable en pantalla de inicio, pantalla completa, offline. Ideal para un incremental móvil.
- [ ] **Open Graph + favicon**: tarjeta bonita al compartir el link en WhatsApp/Teams (og:title, og:description, og:image con captura del cielo).

## Pendiente — jugabilidad
- [ ] **Tienda de esencia**: gastar esencia en mejoras activas (cometas más frecuentes, corazón +5/toque, matices exclusivos). Hoy la esencia solo da +5% pasivo por unidad.
- [ ] **Estadísticas**: polvo histórico, cometas atrapados, tiempo jugado, colapsos.
- [ ] **Nombrar el universo**: el nombre aparece en la imagen exportada (más compartible).
- [ ] Ideas visuales: constelaciones (conectar estructuras con líneas), supernovas, épocas que cambian la paleta con el tiempo, lluvias de meteoros con multiplicador temporal.

## Pendiente — mantenimiento
- [ ] **Git + GitHub conectado a Vercel**: historial, rollback y deploy automático por commit (gh CLI ya configurado).
- [ ] **Vercel Analytics** (gratis): saber cuánta gente entra y en qué hito abandona.
- [ ] **Prueba en iPhone/Android real**: Web Audio en Safari iOS tiene mañas (audio tras bloquear pantalla); todo lo demás se verificó en preview de escritorio emulando móvil.

## Arquitectura (recordatorio)
- Un solo archivo. La fuente maestra (sin `<html>/<head>/<body>`) vive en el scratchpad de Claude y como Artifact; `index.html` se genera envolviéndola (split en `</style>`).
- Guardado `localStorage['bbg1']` v2, con migración automática desde v1.
- Mundo = 2.4× pantalla; estructuras en coordenadas relativas al mundo; canvas "bake" persistente + cámara (drawImage con recorte).
