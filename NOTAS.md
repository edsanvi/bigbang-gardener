# Big Bang Gardener — notas y mejoras pendientes

Producción: https://bigbang-gardener.vercel.app · Repo: https://github.com/edsanvi/bigbang-gardener

## Flujo de trabajo
- La fuente maestra es `game.html` (sin `<html>/<head>/<body>` porque también se publica como Artifact de claude.ai).
- `bash build.sh` genera `index.html` (envuelve game.html + head-extra.html + body-extra.html) y versiona `sw.js`.
- `node gen-icons.js` regenera los íconos PNG si cambia el diseño.
- Desplegar: `npx vercel deploy --prod --yes` (o push a main cuando se conecte el repo, ver pendientes).

## Hecho
- v1 (2026-07-02): juego base (4 fractales, música generativa, guardado local).
- v2 (2026-07-03): tutorial, hitos, cuásar/agujero negro/singularidad (prestigio), zoom/paneo, exportar PNG, 5 humores musicales, cometas, botón reiniciar.
- v2.2 (2026-07-03): exportar/importar código de partida, podar estructuras (sostener, reembolso 40%).
- v2.3 (2026-07-03):
  - **Tienda de esencia** (chip ⊙ del HUD): corazón radiante, vientos cometarios, cosecha estelar, memoria del big bang. La esencia gastable se separó de la vitalicia (el +5%/u usa la vitalicia, gastar no reduce producción).
  - **Estadísticas** (menú ♪): polvo histórico, siembras, podas, cometas, colapsos, tiempo, fecha de nacimiento.
  - **Nombrar universo** (menú ♪): firma la imagen exportada y titula las estadísticas.
  - **PWA**: manifest + service worker (stale-while-revalidate) + íconos generados → instalable, offline.
  - **Open Graph/Twitter card** con og.jpg generado desde el juego real + favicon.svg.
  - **Git + GitHub**: repo público edsanvi/bigbang-gardener.
  - Script de Vercel Analytics incluido en index.html.

## Pendiente — pasos manuales de Erik (5 min)
- [ ] **Conectar GitHub↔Vercel**: instala la app de Vercel en tu GitHub desde
      https://vercel.com/edsanvis-projects/bigbang-gardener/settings/git → "Connect Git Repository".
      Con eso cada `git push` despliega solo. (El CLI no puede: requiere autorizar la app en el navegador.)
- [ ] **Activar Web Analytics**: https://vercel.com/edsanvis-projects/bigbang-gardener/settings/analytics → Enable.
      El script ya está en la página; solo falta el switch.
- [ ] **Probar en iPhone/Android real**: instalar desde Safari/Chrome ("Agregar a pantalla de inicio"),
      verificar audio tras bloquear pantalla y el gesto de pellizco.

## Pendiente — ideas de juego futuras
- [ ] Constelaciones: conectar estructuras con líneas y nombrarlas.
- [ ] Supernovas: una estructura vieja explota y siembra polvo.
- [ ] Épocas del universo: la paleta evoluciona con el tiempo de juego.
- [ ] Lluvias de meteoros con multiplicador temporal.

## Arquitectura (recordatorio)
- Guardado `localStorage['bbg1']` v2 (migra desde v1); código portátil `BBG1.`+base64.
- Mundo = 2.4× pantalla; canvas "bake" persistente + cámara (drawImage con recorte).
- Música 100% Web Audio generativa; capas ligadas al progreso (guiño al Bolero).
