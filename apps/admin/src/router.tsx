import { CATEGORY_LINK_KINDS } from "@matiq/contracts";
import { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { z } from "zod";
import { ErrorState } from "@/components/error-state";
import { Layout } from "@/components/layout";
import { de } from "@/i18n/de";
import { categoriesQuery } from "@/lib/api";
import { CategoriesPage } from "@/pages/categories-page";
import { LinksPage } from "@/pages/links-page";

export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

const rootRoute = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: Layout,
  notFoundComponent: () => <p>{de.errors.notFoundPage}</p>,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    // eslint-disable-next-line @typescript-eslint/only-throw-error -- TanStack Router redirect API
    throw redirect({ to: "/kategorien" });
  },
});

const categoriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/kategorien",
  loader: ({ context }) => context.queryClient.ensureQueryData(categoriesQuery),
  component: CategoriesPage,
  pendingComponent: () => <p>{de.common.loading}</p>,
  errorComponent: ({ error }) => <ErrorState error={error} />,
});

const LinksSearchSchema = z.object({
  art: z
    .enum(["all", ...CATEGORY_LINK_KINDS])
    .default("all")
    .catch("all"),
});

const linksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/verknuepfungen",
  validateSearch: LinksSearchSchema,
  loader: ({ context }) => context.queryClient.ensureQueryData(categoriesQuery),
  component: LinksPage,
  pendingComponent: () => <p>{de.common.loading}</p>,
  errorComponent: ({ error }) => <ErrorState error={error} />,
});

const routeTree = rootRoute.addChildren([indexRoute, categoriesRoute, linksRoute]);

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
