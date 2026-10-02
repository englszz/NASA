# Skyra

Datos que anticipan tu día.

## Desarrollo

- `npm run dev`: servidor local.
- `npm run build`: genera las cuatro entradas HTML en `dist`.
- `npm run lint`: revisión de código.

## Páginas y contenido

- `index.html`: Inicio. Contenido en `src/pages/HomePage.jsx`.
- `nosotros.html`: Sobre Skyra. Contenido en `src/pages/AboutPage.jsx`.
- `informacion.html`: Información. Usa la variante `information` de AboutPage.
- `mapa.html`: visor satelital. Código y panel de provincia en `src/pages/MapPage.jsx`.
- Navegación compartida en `src/App.jsx`; estilos comunes en `src/index.css`.

Las páginas tienen entradas HTML independientes y comparten componentes React. El visor se carga solo al abrir Mapa. Publicar todo `dist` conserva las rutas `.html` sin necesitar reescrituras del servidor.

## Tipografía

Montserrat, League Spartan y DM Sans se cargan desde Google Fonts. El nombre de marca utiliza ahora el diseño original `src/assets/logo(letras).png` en header, portada y footer, por lo que no depende de tener Tropika instalada.

## Identidad y vista previa al compartir

Los originales de la identidad están en `src/assets`. El isotipo aparece en Sobre Skyra, las estrellas en Información y el planeta cierra todas las páginas salvo el mapa.

`public/brand` contiene los iconos de pestaña y Apple, y la imagen social PNG de 1200 x 630 con fondo blanco. Estas variantes conservan el isotipo original, renderizado sobre blanco.

`vite.config.js` incorpora Open Graph y Twitter en el HTML inicial de las cuatro páginas. Al desplegar, usa `VITE_SITE_URL` si se define, o las variables `VERCEL_PROJECT_PRODUCTION_URL` / `VERCEL_URL` de Vercel. En local deja una ruta relativa; la vista previa real de WhatsApp queda pendiente de comprobar tras el despliegue público. Para un dominio personalizado se puede establecer `VITE_SITE_URL` y reconstruir.

## Recursos externos

El token público de Mapbox se configura con `VITE_MAPBOX_TOKEN` en `.env.local` para desarrollo o en las variables del servicio de despliegue antes de compilar. `.env.example` contiene la plantilla; el token no se publica en el repositorio.

El mapa conserva Mapbox GL, su token público y los GeoJSON originales. La cartografía necesita conexión a Mapbox. Hay 32 archivos originales de NASA POWER en `public/data/clima/`, con cobertura 2005–2025. `src/lib/climate-files.json` relaciona los nombres del mapa con cada archivo (incluidas las variantes La Estrelleta/Elías Piña, El Seybo/El Seibo, Hermanas/Hermanas Mirabal y BAROHUCO/Bahoruco). `ProvinceClimate` carga bajo demanda y permite consultar frecuencias históricas por día y mes con umbrales ajustables. No calcula pronósticos ni promedios espaciales provinciales. Los valores faltantes se excluyen de cada denominador. Verificación: `node --test src/lib/climate.test.js`.

La fotografía de Ocoa es de Victor Rosario en Unsplash: https://unsplash.com/photos/BSOeiOblvE8. Se sirve desde Unsplash y tiene atribución en Inicio.
