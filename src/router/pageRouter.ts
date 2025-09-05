import { writable, type Writable } from 'svelte/store';
import { ROUTES, type RouteConfig, type RouteMatch } from './routeConfig';

export class PageRouter {
  private currentRoute: Writable<RouteMatch | null> = writable(null);
  private currentComponent: Writable<any> = writable(null);
  private unsubscribe: (() => void) | null = null;

  constructor(private pathStore: Writable<string>) {
    this.setupRouteSubscription();
  }

  private setupRouteSubscription() {
    this.unsubscribe = this.pathStore.subscribe((path) => {
      const route = this.findRoute(path);
      this.currentRoute.set(route);

      if (route) {
        this.loadComponent(route.route);
        this.updateTitle(route.route.title);
      }
    });
  }

  private findRoute(path: string): RouteMatch | null {
    // Exact match first
    for (const route of ROUTES) {
      if (route.path === path && route.path !== '*') {
        return {
          route,
          params: {},
          query: {}
        };
      }
    }

    // Prefix match for dynamic routes
    for (const route of ROUTES) {
      if (route.path !== '*' && path.startsWith(route.path)) {
        return {
          route,
          params: {},
          query: {}
        };
      }
    }

    // Fallback to 404
    const notFoundRoute = ROUTES.find(r => r.path === '*');
    if (notFoundRoute) {
      return {
        route: notFoundRoute,
        params: {},
        query: {}
      };
    }

    return null;
  }

  private async loadComponent(route: RouteConfig) {
    try {
      const module = await route.component();
      this.currentComponent.set(module.default);
    } catch (error) {
      console.error('[PageRouter] Failed to load component:', error);
      this.currentComponent.set(null);
    }
  }

  private updateTitle(title?: string) {
    if (title && typeof document !== 'undefined') {
      document.title = title;
    }
  }

  public getCurrentRoute() {
    return this.currentRoute;
  }

  public getCurrentComponent() {
    return this.currentComponent;
  }

  public navigate(path: string) {
    this.pathStore.set(path);
  }

  public destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }
}

// Factory function for easy usage
export function createPageRouter(pathStore: Writable<string>): PageRouter {
  return new PageRouter(pathStore);
}
