import { useEffect, useState } from 'react';
import files from '../lib/climate-files.json';
import { summarizeClimate } from '../lib/climate';

const cache = new Map();
const displayDate = value => `${value.slice(6, 8)}/${value.slice(4, 6)}/${value.slice(0, 4)}`;

export default function ProvinceClimate({ province }) {
  const [data, setData] = useState(() => cache.get(province) || null);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [date, setDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });
  const [thresholds, setThresholds] = useState({ rain: 20, heat: 35, wind: 10 });

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        if (!files[province]) throw new Error('No hay un archivo asociado a esta provincia.');
        if (cache.has(province)) return;
        const response = await fetch(`/data/clima/${files[province]}`, { signal: controller.signal });
        if (!response.ok) throw new Error('No se pudo cargar el histórico.');
        const result = await response.json();
        if (!result.properties?.parameter || !result.header) throw new Error('El archivo no tiene el formato esperado.');
        if (controller.signal.aborted) return;
        cache.set(province, result);
        setData(result);
        setError('');
      } catch (err) {
        if (!controller.signal.aborted) setError(err.message);
      }
    }
    load();
    return () => controller.abort();
  }, [province, retry]);

  if (error) return <div role="alert"><p>{error}</p><button className="btn" onClick={() => { setError(''); setRetry(value => value + 1); }}>Reintentar</button></div>;
  if (!data) return <p role="status">Cargando histórico de NASA POWER…</p>;
  const metrics = summarizeClimate(data, date, thresholds);
  return <div className="province-climate">
    <p className="climate-period">NASA POWER · {displayDate(data.header.start)} – {displayDate(data.header.end)}</p>
    <label className="climate-date">Fecha de tu actividad
      <input type="date" value={date} onChange={event => setDate(event.target.value)} />
    </label>
    <p className="climate-explanation">Comparamos el mismo día y mes de cada año del histórico.</p>
    <details className="climate-thresholds">
      <summary>Elegir límites para tu actividad</summary>
      <p>Decide a partir de qué cantidad de lluvia, temperatura o velocidad del viento tu actividad se vería afectada. El porcentaje cuenta los años en que se alcanzó o superó ese límite.</p>
      {[['rain', 'Lluvia (mm/día)', 0, 'Cantidad total de lluvia durante el día. No indica cuántas horas llovió.'], ['heat', 'Calor (°C)', -50, 'Temperatura máxima del día. No es la sensación térmica.'], ['wind', 'Viento (m/s)', 0, 'Velocidad máxima del viento registrada en el día a 10 metros de altura. 10 m/s equivalen a 36 km/h.']].map(([key, label, min, explanation]) => <label key={key}>{label}<input type="number" aria-describedby={`limit-${key}-help`} min={min} max={key === 'heat' ? 60 : 1000} step="0.1" value={thresholds[key]} onChange={event => {
        const value = event.target.valueAsNumber;
        if (Number.isFinite(value) && value >= min && value <= (key === 'heat' ? 60 : 1000)) setThresholds(current => ({ ...current, [key]: value }));
      }} /><span id={`limit-${key}-help`} className="climate-limit-help">{explanation}</span></label>)}
      <p>Los valores iniciales son orientativos del proyecto; no son límites oficiales de alerta.</p>
    </details>
    {!date ? <p>Elige una fecha para consultar el histórico.</p> : <dl className="climate-metrics">{metrics.map(metric => <div key={metric.key}>
      <dt>{metric.label}</dt>
      <dd>{metric.count ? <>
        <strong>{metric.probability === null ? `${metric.average.toFixed(1)} ${metric.unit}` : `${metric.probability.toFixed(1)} %`}</strong>
        <span>{metric.threshold === null ? `Promedio de ${metric.count} observaciones` : `${metric.exceeded} de ${metric.count} años con ≥ ${metric.threshold} ${metric.unit}`}</span>
        {metric.threshold !== null && <span>Promedio: {metric.average.toFixed(1)} {metric.unit}</span>}
      </> : <span>Sin observaciones válidas para esta fecha.</span>}</dd>
    </div>)}</dl>}
    <p className="climate-disclaimer">Frecuencia histórica, no un pronóstico. Estimaciones del punto de referencia ({data.geometry.coordinates[1].toFixed(3)}°, {data.geometry.coordinates[0].toFixed(3)}°); no representan todas las condiciones de la provincia.</p>
    <a className="source-link" href={`/data/clima/${files[province]}`} download>Descargar JSON original</a>
  </div>;
}
