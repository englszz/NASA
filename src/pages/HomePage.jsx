import { ArrowUpRight, ArrowRight } from 'lucide-react';
import satellite from '../assets/satelite.png';
import isotipo from '../assets/isotipo.png';

export default function HomePage() {
  return <main id="contenido">
    <section className="hero">
      <img className="hero-image" src="https://images.unsplash.com/photo-1693262043392-c4a2486360b0?auto=format&fit=crop&w=2400&q=85" alt="Montañas de Ocoa, República Dominicana" fetchPriority="high" />
      <div className="hero-content container">
        <p className="eyebrow">Una nueva mirada a nuestro territorio</p>
        <h1 className="hero-symbol"><img src={isotipo} alt="Skyra" width="1024" height="1024" fetchPriority="high" /></h1>
        <p className="slogan">Datos que anticipan tu día.</p>
        <p className="hero-description">Conecta con tu territorio. Explora República Dominicana desde otra perspectiva.</p>
        <a className="button primary" href="/mapa.html">Explorar el mapa <ArrowRight /></a>
      </div>
      <div className="hero-caption"><span>18.54° N / 70.51° O · República Dominicana</span><a href="https://unsplash.com/photos/BSOeiOblvE8" target="_blank" rel="noreferrer">Fotografía: Victor Rosario</a></div>
    </section>
    <section className="intro container">
      <div className="intro-orbit">
        <div className="intro-copy">
          <p className="eyebrow">El territorio, más cerca</p>
          <h2>Una perspectiva local.<br /><span>Un mundo por entender.</span></h2>
          <p className="intro-description">Desde el espacio hasta tu provincia. Conoce el territorio dominicano y descubre cómo los datos históricos de la NASA pueden ayudarnos a planificar mejor.</p>
          <a className="button secondary intro-action" href="/informacion.html">Saber más <ArrowRight /></a>
        </div>
        <figure className="intro-satellite">
          <div className="satellite-orbit" aria-hidden="true" />
          <img src={satellite} alt="Satélite con paneles solares y antena de observación" loading="lazy" width="1803" height="885" />
        </figure>
      </div>
      <div className="topic-grid">
        <a href="/mapa.html"><span className="topic-number">01 / EXPLORA</span><h3>Nuestro territorio <ArrowUpRight /></h3><p>Una mirada satelital a las provincias de República Dominicana.</p></a>
        <a href="/informacion.html"><span className="topic-number">02 / DESCUBRE</span><h3>Información <ArrowUpRight /></h3><p>Las fuentes de la NASA y la lógica de la probabilidad histórica.</p></a>
        <a href="/nosotros.html"><span className="topic-number">03 / CONOCE</span><h3>El proyecto <ArrowUpRight /></h3><p>Conoce la visión detrás de Skyra.</p></a>
      </div>
    </section>
    <section className="closing"><div className="container"><h2>Tu próxima perspectiva empieza aquí.</h2><a className="button outline" href="/mapa.html">Ver el mapa <ArrowRight /></a></div></section>
  </main>;
}
