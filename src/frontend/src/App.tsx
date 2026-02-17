import { createRouter, createRoute, createRootRoute, RouterProvider } from '@tanstack/react-router';
import LandingPage from './pages/LandingPage';
import BroadcasterPage from './pages/BroadcasterPage';
import ViewerJoinPage from './pages/ViewerJoinPage';
import ViewerWatchPage from './pages/ViewerWatchPage';
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

const viewerJoinRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/watch',
  component: ViewerJoinPage,
});

const viewerWatchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/watch/$sessionCode',
  component: ViewerWatchPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  broadcasterRoute,
  viewerJoinRoute,
  viewerWatchRoute,
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
