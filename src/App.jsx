import { lazy, Suspense, useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import logo from './assets/logo(letras).png';
import planet from './assets/planeta.png';

const MapPage = lazy(() => import('./pages/MapPage'));
const links = [['/', 'Inicio'], ['/nosotros.html', 'Sobre Skyra'], ['/informacion.html', 'Información']];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const mapPage = ['/mapa', '/mapa.html'].includes(path);
  const aboutPage = ['/nosotros', '/nosotros.html', '/about'].includes(path);
  const infoPage = ['/informacion', '/informacion.html'].includes(path);
  const homePage = ['/', '/index.html'].includes(path);
  return <>
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <header className="site-header">
      <a className="brand" href="/" aria-label="Skyra, inicio"><img src={logo} alt="Skyra" width="2036" height="772" /></a>
      <button className="menu-toggle icon-btn" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} aria-controls="navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      <nav id="navigation" className={menuOpen ? 'open' : ''} aria-label="Navegación principal">
        {links.map(([href, text]) => <a key={href} href={href} aria-current={(href === '/' ? homePage : href.includes('nosotros') ? aboutPage : infoPage) ? 'page' : undefined}>{text}</a>)}
        <a className="button primary" href="/mapa.html" aria-current={mapPage ? 'page' : undefined}>Ver mapa <ArrowRight /></a>
      </nav>
    </header>
    {mapPage ? <main id="contenido"><Suspense fallback={<p className="container">Cargando mapa...</p>}><MapPage /></Suspense></main> : homePage ? <HomePage /> : aboutPage || infoPage ? <AboutPage information={infoPage} /> : <main id="contenido" className="editorial container"><h1>Página no encontrada</h1><a href="/">Volver al inicio</a></main>}
    {!mapPage && <footer className="site-footer">
      <div className="footer-content container">
        <a className="brand" href="/" aria-label="Skyra, inicio"><img src={logo} alt="Skyra" width="2036" height="772" loading="lazy" /></a>
        <p>Datos que anticipan tu día.</p>
        <span>República Dominicana</span>
      </div>
      <div className="footer-horizon" aria-hidden="true"><img src={planet} alt="" loading="lazy" /></div>
    </footer>}
  </>;
}
