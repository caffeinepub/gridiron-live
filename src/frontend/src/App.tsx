import { createRouter, createRoute, createRootRoute, RouterProvider } from '@tanstack/react-router';
import LandingPage from './pages/LandingPage';
import BroadcasterPage from './pages/BroadcasterPage';
import FootballLayout from './components/layout/FootballLayout';
import { Outlet } from '@tanstack/react-router';

const rootRoute = createRootRoute({
  component: () => (
    <FootballLayout>
      <Outlet />
    </FootballLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const broadcasterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/broadcast',
  component: BroadcasterPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  broadcasterRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
