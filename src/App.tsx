import { useNavigate } from 'react-router-dom';
import { useLangRedirect } from './utils/routeLocalize';
import { currentLang } from './utils/routeLocalize';
import Header from "./partials/Header";
import Main from './partials/Main';
import Footer from './partials/Footer';
import BootstrapBreakpoints from './parts/BootstrapBreakpoints';

// turn off when not needed for debugging
const showBootstrapBreakpoints = true;

export default function App() {

  // redirect to the correct language
  useLangRedirect();

  // scroll to top of the page (app is run on ever)
  useNavigate();
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

  // set the html lang attribute correctly (for SEO)
  document.querySelector('html')?.setAttribute('lang', currentLang());

  return <>
    <Header />
    <Main />
    <Footer />
    {showBootstrapBreakpoints ? <BootstrapBreakpoints /> : null}
  </>;
};