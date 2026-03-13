import { Toaster } from "@/components/ui/sonner";
import { FeedPage } from "@/pages/FeedPage";
import { PostDetailPage } from "@/pages/PostDetailPage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: FeedPage,
});

const postRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/post/$postId",
  component: PostDetailPage,
});

const routeTree = rootRoute.addChildren([indexRoute, postRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
