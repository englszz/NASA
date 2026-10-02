import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { RotateCcw, X } from 'lucide-react';
import './MapPage.css';
import ProvinceClimate from '../components/ProvinceClimate';

// Token público de Mapbox
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

const INITIAL_VIEW = {
  center: [-70.3, 18.8],
  zoom: 7.3,
  pitch: 42,
  bearing: 0
};

// Función para calcular los límites (bounding box) de cualquier geometría (Polygon o MultiPolygon)
function getFeatureBounds(feature) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  function traverse(coords) {
    if (typeof coords[0] === 'number') {
      minX = Math.min(minX, coords[0]);
      minY = Math.min(minY, coords[1]);
      maxX = Math.max(maxX, coords[0]);
      maxY = Math.max(maxY, coords[1]);
    } else {
      for (const c of coords) {
        traverse(c);
      }
    }
  }
  traverse(feature.geometry.coordinates);
  return [[minX, minY], [maxX, maxY]];
}

export default function MapPage() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const provincesGeoJSONRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [provincesList, setProvincesList] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [terrainEnabled, setTerrainEnabled] = useState(true);
  const [labelsEnabled, setLabelsEnabled] = useState(true);

  // Función para enfocar la provincia y hacer zoom automático
  const focusProvince = useCallback((feature) => {
    const map = mapRef.current;
    if (!map || !feature) return;

    const provName = feature.properties.name || feature.properties.shapeName;
    setSelectedProvince(provName);

    // Resaltar en las capas
    map.setFilter('provincias-selected', ['==', 'name', provName]);
    map.setFilter('provincias-selected-border', ['==', 'name', provName]);

    // Calcular límites geométricos y volar a la provincia
    const bounds = getFeatureBounds(feature);
    map.fitBounds(bounds, {
      padding: window.innerWidth > 700
        ? { top: 80, bottom: 80, left: 60, right: 360 }
        : { top: 60, bottom: 240, left: 30, right: 30 },
      duration: 1600,
      pitch: 48,
      maxZoom: 11.2
    });
  }, []);

  // Restablecer la vista a todo el país
  const resetView = useCallback(() => {
    const map = mapRef.current;
    if (!map || !map.getLayer('provincias-selected')) return;

    setSelectedProvince(null);
    map.setFilter('provincias-selected', ['==', 'name', '']);
    map.setFilter('provincias-selected-border', ['==', 'name', '']);

    map.flyTo({
      center: INITIAL_VIEW.center,
      zoom: INITIAL_VIEW.zoom,
      pitch: INITIAL_VIEW.pitch,
      bearing: INITIAL_VIEW.bearing,
      duration: 1500,
      essential: false
    });
  }, []);

  const focusProvinceRef = useRef(focusProvince);
  useEffect(() => {
    focusProvinceRef.current = focusProvince;
  }, [focusProvince]);

  useEffect(() => {
    if (!mapboxgl.supported() || !mapboxgl.accessToken) {
      return;
    }
    let disposed = false;
    const controller = new AbortController();
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: INITIAL_VIEW.center,
      zoom: INITIAL_VIEW.zoom,
      minZoom: 6.2,
      maxZoom: 13.5,
      pitch: INITIAL_VIEW.pitch,
      bearing: INITIAL_VIEW.bearing,
      // Límites máximos: restringe la cámara a República Dominicana
      maxBounds: [
        [-74.2, 16.0], // Suroeste
        [-66.4, 21.6]  // Noreste
      ]
    });

    mapRef.current = map;
    const timeout = setTimeout(() => {
      if (!disposed) {
        setLoading(false);
        setError('El mapa está tardando en responder. Comprueba tu conexión y vuelve a intentarlo.');
      }
    }, 25000);
    map.on('error', () => {
      if (!disposed) {
        setError('No se pudieron cargar algunos recursos del mapa. Comprueba tu conexión.');
        setLoading(false);
      }
    });

    // Agregar controles de navegación (zoom +/- y brújula)
    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'bottom-right');

    map.on('load', async () => {
      // Configurar atmósfera y niebla para estilo oscuro / espacio
      map.setFog({
        range: [0.5, 10],
        color: '#070b14',
        'high-color': '#0d1527',
        'space-color': '#020408',
        'horizon-blend': 0.15
      });

      // 1. Relieve 3D (DEM)
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14
      });
      map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.3 });

      // 2. Máscara del Mundo Invertida: Cubre Haití y todo el resto del planeta
      map.addSource('world-mask', {
        type: 'geojson',
        data: '/data/mask.geojson'
      });

      // Capa de máscara que oculta todo fuera de República Dominicana
      map.addLayer({
        id: 'mask-fill',
        type: 'fill',
        source: 'world-mask',
        paint: {
          'fill-color': '#070b14',
          'fill-opacity': 1.0
        }
      });

      // 3. Contorno oficial del país (República Dominicana)
      map.addSource('pais-rd', {
        type: 'geojson',
        data: '/data/pais.geojson'
      });

      // Resplandor del contorno del país
      map.addLayer({
        id: 'pais-glow',
        type: 'line',
        source: 'pais-rd',
        paint: {
          'line-color': '#84B6F4',
          'line-width': 4.5,
          'line-blur': 4,
          'line-opacity': 0.6
        }
      });

      // Borde definido del país
      map.addLayer({
        id: 'pais-border',
        type: 'line',
        source: 'pais-rd',
        paint: {
          'line-color': '#84B6F4',
          'line-width': 2,
          'line-opacity': 0.95
        }
      });

      // 4. Provincias de la República Dominicana
      try {
        const response = await fetch('/data/provincias.geojson', { signal: controller.signal });
        if (!response.ok) throw new Error('No se pudieron cargar las provincias');
        const data = await response.json();
        if (disposed) return;
        provincesGeoJSONRef.current = data;

        const names = data.features
          .map(f => f.properties.name || f.properties.shapeName)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b, 'es'));
        setProvincesList(names);

        map.addSource('provincias-rd', {
          type: 'geojson',
          data: data
        });

        // Capa interactiva transparente para clics y hover
        map.addLayer({
          id: 'provincias-fill',
          type: 'fill',
          source: 'provincias-rd',
          paint: {
            'fill-color': '#ffffff',
            'fill-opacity': 0.05
          }
        });

        // Capa de Hover
        map.addLayer({
          id: 'provincias-hover',
          type: 'fill',
          source: 'provincias-rd',
          paint: {
            'fill-color': '#4D82BE',
            'fill-opacity': 0.3
          },
          filter: ['==', 'name', '']
        });

        // Capa de Selección (Provincia Activa con Zoom)
        map.addLayer({
          id: 'provincias-selected',
          type: 'fill',
          source: 'provincias-rd',
          paint: {
            'fill-color': '#005187',
            'fill-opacity': 0.45
          },
          filter: ['==', 'name', '']
        });

        // Borde de la provincia seleccionada
        map.addLayer({
          id: 'provincias-selected-border',
          type: 'line',
          source: 'provincias-rd',
          paint: {
            'line-color': '#F5DF4D',
            'line-width': 2.5
          },
          filter: ['==', 'name', '']
        });

        // Bordes interiores de provincias
        map.addLayer({
          id: 'provincias-borders',
          type: 'line',
          source: 'provincias-rd',
          paint: {
            'line-color': 'rgba(255, 255, 255, 0.45)',
            'line-width': 1.2
          }
        });

        // Nombres/Etiquetas de las provincias
        map.addLayer({
          id: 'provincias-labels',
          type: 'symbol',
          source: 'provincias-rd',
          layout: {
            'text-field': ['get', 'name'],
            'text-size': [
              'interpolate', ['linear'], ['zoom'],
              7, 10,
              10, 14
            ],
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            'text-allow-overlap': false
          },
          paint: {
            'text-color': '#ffffff',
            'text-halo-color': 'rgba(7, 11, 20, 0.95)',
            'text-halo-width': 1.8
          }
        });

        // Hover events
        map.on('mousemove', 'provincias-fill', (e) => {
          map.getCanvas().style.cursor = 'pointer';
          if (e.features.length > 0) {
            const provName = e.features[0].properties.name;
            map.setFilter('provincias-hover', ['==', 'name', provName]);
          }
        });

        map.on('mouseleave', 'provincias-fill', () => {
          map.getCanvas().style.cursor = '';
          map.setFilter('provincias-hover', ['==', 'name', '']);
        });

        // ZOOM AUTOMÁTICO AL TOCAR / HACER CLIC EN UNA REGIÓN
        map.on('click', 'provincias-fill', (e) => {
          if (!e.features || e.features.length === 0) return;
          const clickedName = e.features[0].properties.name;
          const feature = provincesGeoJSONRef.current.features.find(f => f.properties.name === clickedName);
          focusProvinceRef.current(feature);
        });

      } catch (err) {
        if (disposed) return;
        setError('No se pudieron cargar las provincias. Vuelve a intentarlo.');
        console.error('Error cargando GeoJSON de provincias:', err);
      } finally {
        clearTimeout(timeout);
        if (!disposed) setLoading(false);
      }
    });

    return () => {
      disposed = true;
      controller.abort();
      clearTimeout(timeout);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Manejador del selector desplegable de provincias
  const handleSelectProvince = (provName) => {
    if (!provName) {
      resetView();
      return;
    }
    const data = provincesGeoJSONRef.current;
    if (!data) return;

    const feature = data.features.find(
      f => (f.properties.name === provName || f.properties.shapeName === provName)
    );
    if (feature) {
      focusProvince(feature);
    }
  };

  // Alternar Relieve 3D
  const toggleTerrain = () => {
    const map = mapRef.current;
    if (!map || !map.getSource('mapbox-dem')) return;

    const nextState = !terrainEnabled;
    setTerrainEnabled(nextState);
    if (nextState) {
      map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.3 });
    } else {
      map.setTerrain(null);
    }
  };

  // Alternar Etiquetas de Provincias
  const toggleLabels = () => {
    const map = mapRef.current;
    if (!map || !map.getLayer('provincias-labels')) return;

    const nextState = !labelsEnabled;
    setLabelsEnabled(nextState);
    map.setLayoutProperty('provincias-labels', 'visibility', nextState ? 'visible' : 'none');
  };

  return (
    <div className="map-wrapper">
      {/* Indicador de carga */}
      {loading && mapboxgl.supported() && mapboxgl.accessToken && (
        <div className="loading-overlay">
          <div className="spinner" />
          <p style={{ color: '#84B6F4', fontSize: '0.9rem', fontWeight: 500 }}>
            Cargando República Dominicana en 3D...
          </p>
        </div>
      )}

      {/* Contenedor del mapa */}
      <div ref={mapContainer} className="map-container" />
      {(!mapboxgl.supported() || !mapboxgl.accessToken || error) && <div className="map-error" role="alert"><p>{!mapboxgl.supported() ? 'Tu navegador no tiene WebGL disponible para mostrar el mapa.' : !mapboxgl.accessToken ? 'El visor del mapa no está configurado todavía.' : error}</p><button onClick={() => window.location.reload()}>Reintentar</button></div>}

      {/* Panel Superior Interactivo */}
      <div className="top-hud">
        <div className="hud-card">
          <div className="hud-header">
            <div className="hud-title-container">
              <h1 className="hud-title">República Dominicana</h1>
            </div>
            <span className="hud-badge">Satélite 3D</span>
          </div>


          {/* Tarjeta de provincia activa */}
          {selectedProvince && (
            <div className="province-info-box">
              <div className="province-info-header">
                <span className="province-label">Provincia Seleccionada</span>
                <button className="icon-btn" onClick={resetView} aria-label="Cerrar información"><X size={18} /></button>
              </div>
              <span className="province-active-name">{selectedProvince}</span>
              <ProvinceClimate key={selectedProvince} province={selectedProvince} />
            </div>
          )}

          {/* Acciones y selector rápido */}
          <div className="hud-actions">
            <select
              className="province-select"
              aria-label="Elegir provincia"
              disabled={loading || !provincesList.length}
              value={selectedProvince || ''}
              onChange={(e) => handleSelectProvince(e.target.value)}
            >
              <option value="">Elegir provincia</option>
              {provincesList.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            {selectedProvince && (
              <button className="btn btn-primary" onClick={resetView} title="Volver a la vista nacional">
                <RotateCcw size={16} /> Vista nacional
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Botones de acción flotantes (Controles Rápidos) */}
      <div className="controls-dock">
        <label><input type="checkbox" checked={terrainEnabled} onChange={toggleTerrain} disabled={loading || !provincesList.length} /> Relieve 3D</label>
        <label><input type="checkbox" checked={labelsEnabled} onChange={toggleLabels} disabled={loading || !provincesList.length} /> Nombres</label>
        <button
          className="icon-btn"
          onClick={resetView}
          title="Restablecer vista general"
          aria-label="Restablecer vista general"
          disabled={loading || !provincesList.length}
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  );
}
