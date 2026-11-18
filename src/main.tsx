import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  isRouteErrorResponse,
  Link,
  Outlet,
  RouterProvider,
  ScrollRestoration,
  useLocation,
  useRouteError,
} from 'react-router-dom';
import { TICKETS_PATH } from './event';
import './styles/global.css';

function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    const isTicketsPage = pathname.replace(/\/$/, '') === TICKETS_PATH;
    document.title = isTicketsPage
      ? "FlowFest '25"
      : 'FlowFest 2025 - Friday 8th August, Manchester, UK';
  }, [pathname]);

  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  );
}

function RouteError() {
  const error = useRouteError();
  const missing = isRouteErrorResponse(error) && error.status === 404;

  return (
    <main className="route-message">
      <h1>{missing ? 'Page not found' : 'The page could not load'}</h1>
      <Link to="/">Back to FlowFest</Link>
    </main>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <RouteError />,
    hydrateFallbackElement: <div aria-busy="true" />,
    children: [
      {
        index: true,
        lazy: async () => ({ Component: (await import('./pages/FlowFestPage')).default }),
      },
      {
        path: TICKETS_PATH,
        lazy: async () => ({ Component: (await import('./pages/TicketsPage')).default }),
      },
    ],
  },
]);

const root = document.getElementById('root');

if (!root) throw new Error('The application root is missing.');

createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
