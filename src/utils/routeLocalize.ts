import type { LangRoute } from '../interfaces/Route';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import rawRoutes from '../routes';

export const supportedLangs = ['en', 'sv', 'no'];

export function currentLang(raw = false) {
  let lang = location.pathname.slice(1, 3);
  if (!supportedLangs.includes(lang)) { lang = raw ? 'missing' : 'en'; }
  return lang;
}

// expand routes so that the have a path with :lang param
// and a property langPath -> the route with current lang
export const routes: LangRoute[] = rawRoutes.map(route => {
  let path = route.path;
  path === '*' && (path = '/*');
  path = '/:lang' + path;
  return {
    ...route,
    path,
    // a getter for the correct path including language
    get langPath() {
      return path.replace(':lang/', currentLang() + '/');
    }
  };
});

// Redirect routes so that they always have a language part
export function useLangRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    let lang = currentLang(true);
    if (lang === 'missing') {
      const route = routeWithoutLang();
      navigate('/en' + route, { replace: true });
    }
  }, []);
}

export function routeWithoutLang() {
  const afterProtocol = location.href.split('://')[1];
  let route = afterProtocol.substring(afterProtocol.indexOf('/'));
  route = route
    .replace(/^(\/)[a-z]{2}\//, '/')
    .replace(/^(\/)[a-z]{2}$/, '/');
  route === '/' && (route = '');
  return route;
}