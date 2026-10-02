import emblem from '../assets/Emblema espacial circular SKYRAT(logotipo).png';
import aurora from '../assets/aurora.png';
import constellation from '../assets/Constelación.png';
import { ArrowRight } from 'lucide-react';

export default function AboutPage({ information = false }) {
  return <main id="contenido" className={`editorial container ${information ? 'information-page' : 'about-page'}`}>
    <div className="editorial-heading">
      <div>
    <p className="eyebrow">{information ? 'Conocimiento del territorio' : 'Datos que anticipan tu día'}</p>
    <h1>{information ? 'Información' : 'Sobre Skyra'}</h1>
    <p className="editorial-lead">{information ? 'Conoce la lógica del proyecto, las fuentes de la NASA y el estado de nuestros datos.' : 'Ciencia espacial y datos históricos para planificar actividades al aire libre en República Dominicana.'}</p>
      </div>
      {information ? <img className="editorial-art editorial-constellation" src={constellation} alt="Constelación de estrellas" /> : <div className="about-emblem-art">
        <img className="about-aurora" src={aurora} alt="" aria-hidden="true" />
        <img className="editorial-art editorial-emblem" src={emblem} alt="Emblema espacial de Skyra" />
      </div>}
    </div>
    {information ? <>
      <section className="information-row about-content" aria-labelledby="overview-title">
        <h2 id="overview-title">Panorama general</h2>
        <p>Organizar actividades al aire libre requiere semanas o meses de anticipación, pero los pronósticos meteorológicos tradicionales ofrecen mayor certeza a pocos días de distancia. En República Dominicana, las lluvias intensas y el calor extremo pueden afectar eventos, viajes y actividades comunitarias.</p>
        <p>Will It Rain On My Parade? propone analizar décadas de registros históricos de la NASA para estimar la probabilidad de lluvia intensa, calor sofocante o vientos fuertes en una fecha y provincia del país.</p>
        <div className="editorial-block">
  <h3>¿Cómo se interpreta la probabilidad?</h3>
          <p>La idea es comparar fechas equivalentes de distintos años y contar cuántas veces se superó un umbral de riesgo. Por ejemplo, si hubo lluvia intensa en 5 de 20 observaciones comparables, la frecuencia histórica sería del 25 %. Es una referencia para planificar; no garantiza qué ocurrirá en una fecha futura.</p>
        </div>
      </section>
      <section className="information-row about-content" aria-labelledby="sources-title">
        <h2 id="sources-title">Datos y fuentes</h2>
        <p>El mapa utiliza 32 archivos de NASA POWER con registros diarios de enero de 2005 a diciembre de 2025. Cada provincia está asociada a un punto de referencia. Las fuentes complementarias se detallan a continuación.</p>
        <div className="editorial-block">
  <h3>NASA POWER y MERRA-2</h3>
          <p>NASA POWER ofrece series meteorológicas diarias desde enero de 1981. Las variables cargadas incluyen temperatura máxima (<code>T2M_MAX</code>), temperatura mínima (<code>T2M_MIN</code>), humedad relativa a 2 metros (<code>RH2M</code>) y velocidad máxima del viento a 10 metros (<code>WS10M_MAX</code>). POWER utiliza MERRA-2 y complementa los registros recientes con GEOS-IT.</p>
          <p><a className="source-link" href="https://power.larc.nasa.gov/docs/services/api/temporal/daily/" target="_blank" rel="noreferrer">Documentación oficial de NASA POWER: API diaria</a> · <a className="source-link" href="https://power.larc.nasa.gov/docs/methodology/data/sources/" target="_blank" rel="noreferrer">Fuentes y disponibilidad de los datos</a></p>
        </div>
        <div className="editorial-block">
  <h3>GPM IMERG — Versión 07</h3>
          <p>Como fuente complementaria aún no integrada, IMERG combina observaciones de una red de satélites para estimar la precipitación dentro de la misión GPM, una colaboración de la NASA y JAXA. Sus productos utilizan una cuadrícula de 0,1° × 0,1°, aproximadamente 10 km. La variable <code>precipitation</code> pertenece a IMERG; <code>PRECTOTCORR</code> corresponde a la precipitación corregida de NASA POWER y se trata como una fuente distinta.</p>
          <p><a className="source-link" href="https://gpm.nasa.gov/resources/documents/imerg-v07-technical-documentation" target="_blank" rel="noreferrer">Documentación técnica oficial de IMERG V07</a></p>
        </div>
        <div className="editorial-block">
  <h3>Transparencia y alcance</h3>
          <p>Las mediciones corresponden a estimaciones por cuadrícula y pueden diferir de las condiciones de un lugar concreto. La guía probabilística prevista no sustituye los avisos en tiempo real de las autoridades y estaciones locales, como el Indomet.</p>
        </div>
      </section>
      <section className="information-row about-content" aria-labelledby="updates-title">
        <h2 id="updates-title">Actualizaciones</h2>
        <div className="editorial-block">
  <h3>Frecuencia de actualización de las fuentes</h3>
          <p>La disponibilidad depende del producto: MERRA-2 presenta aproximadamente un mes de retraso, mientras que NASA POWER incorpora datos recientes de GEOS-IT, generalmente disponibles unos dos días después de la observación. Skyra utiliza una copia local del histórico 2005–2025; la sincronización automática está pendiente de implementación.</p>
        </div>
        <div className="editorial-block">
  <h3>Versión del algoritmo</h3>
          <p>v1.0 — calcula la frecuencia observada para el mismo día y mes entre 2005 y 2025. Divide los años que alcanzan el umbral elegido entre los años con datos válidos; excluye valores faltantes. Los umbrales iniciales son 20 mm/día de precipitación, 35 °C de temperatura máxima y 10 m/s de viento máximo, ajustables por el usuario y sin carácter de alerta oficial.</p>
        </div>
        <div className="editorial-block">
  <h3>Última sincronización de datasets</h3>
          <p>Carga local incorporada el 2 de octubre de 2026. Los archivos suministrados cubren hasta el 31 de diciembre de 2025; esta carga no añade observaciones de 2026.</p>
        </div>
      </section>
    </> : <>
      <section className="information-row about-content" aria-labelledby="project-title">
        <p className="eyebrow">El proyecto</p>
        <h2 id="project-title">Will It Rain On My Parade? – Planificador Climático Histórico</h2>
        <div className="editorial-block">
  <h3>El problema</h3>
          <p>Organizar bodas, conciertos, festivales o partidos de fútbol al aire libre requiere meses de planificación, pero los pronósticos del clima tradicionales solo son confiables a 5 o 7 días de anticipación.</p>
        </div>
        <div className="editorial-block">
  <h3>La solución</h3>
          <p>En lugar de adivinar el futuro, analizamos el pasado. Nuestra propuesta utiliza décadas de datos satelitales de observación terrestre de la NASA para calcular la probabilidad estadística de eventos climáticos adversos —lluvia extrema, calor excesivo, ráfagas de viento o incomodidad general— para cualquier punto de la República Dominicana en una fecha determinada.</p>
        </div>
        <div className="editorial-block">
  <h3>Nivel de ingeniería didáctico</h3>
          <p>El enfoque transforma la gran masa de datos del registro histórico de satélites, como las misiones Terra y Aqua y los datos meteorológicos de NASA POWER, en un algoritmo simple de porcentaje de riesgo. Así, cualquier persona puede tomar decisiones informadas sin necesidad de ser meteoróloga.</p>
        </div>
      </section>
      <section className="information-row about-content" aria-labelledby="vision-title">
        <p className="eyebrow">Visión e impacto</p>
        <h2 id="vision-title">Nuestra Visión e Impacto Local y Global</h2>
        <div className="editorial-block">
  <h3>Visión</h3>
          <p>Democratizar el acceso a la ciencia espacial y a los datos abiertos de la NASA, convirtiendo información satelital compleja en herramientas accesibles y útiles para la toma de decisiones cotidianas de las personas y pequeñas empresas.</p>
        </div>
        <div className="editorial-block">
  <h3>Impacto local: República Dominicana</h3>
          <p><strong>Sector eventos y turismo:</strong> buscamos ayudar a organizadores de eventos, hoteles y planificadores a reducir pérdidas económicas por cancelaciones debido a lluvias imprevistas en zonas como Punta Cana, Santo Domingo o Puerto Plata.</p>
          <p><strong>Comunidad y logística:</strong> facilitar la planificación de actividades comunitarias u obras al aire libre para ciudadanos y municipios, minimizando riesgos climáticos.</p>
        </div>
        <div className="editorial-block">
  <h3>Impacto global</h3>
          <p>Mostrar cómo una metodología basada en datos históricos abiertos puede replicarse en cualquier país o región del mundo afectada por la variabilidad climática.</p>
        </div>
      </section>
      <section className="information-row about-content" aria-labelledby="team-title">
        <p className="eyebrow">El equipo e identidad</p>
        <h2 id="team-title">Sobre Nosotros &amp; Nuestra Identidad</h2>
        <div className="editorial-block">
  <h3>Nuestra identidad visual</h3>
          <p>El azul espacial representa nuestra conexión con la NASA y la ciencia. Los tonos azules claros reflejan la tecnología y la claridad de la información, mientras que el amarillo cálido evoca la luz y el clima del Caribe.</p>
          <ul className="about-palette" aria-label="Paleta de colores de Skyra">
            <li><span className="about-swatch about-swatch-blue" aria-hidden="true" />Azul espacial <span>#005187</span></li>
            <li><span className="about-swatch about-swatch-light" aria-hidden="true" />Azul claro <span>#84B6F4</span></li>
            <li><span className="about-swatch about-swatch-yellow" aria-hidden="true" />Amarillo cálido <span>#F5DF4D</span></li>
          </ul>
        </div>
        <div className="editorial-block">
  <h3>Integrantes y roles</h3>
          <dl className="about-roles">
            <div><dt>Project Manager</dt><dd>Lidera la organización, el calendario de trabajo y la toma de decisiones.</dd></div>
            <div><dt>Datos / Ciencia</dt><dd>Responsable de la extracción, limpieza, análisis y verificación de los datasets históricos de la NASA.</dd></div>
            <div><dt>Desarrollo</dt><dd>Arquitectura técnica, maquetado web, motor 3D interactivo y despliegue del sistema.</dd></div>
            <div><dt>Diseño / UX</dt><dd>Creación de la identidad visual, contraste de color y diseño de la interfaz de usuario.</dd></div>
            <div><dt>Pitch / Storytelling</dt><dd>Estructuración de la narrativa, diseño de las diapositivas y preparación de la exposición.</dd></div>
            <div><dt>Investigación</dt><dd>Recopilación de contexto, validación bibliográfica y citación estricta de fuentes oficiales de la NASA.</dd></div>
          </dl>
        </div>
      </section>
    </>}
    <a className="button primary" href="/mapa.html">Explorar el mapa <ArrowRight /></a>
  </main>;
}
