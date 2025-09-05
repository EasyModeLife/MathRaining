export interface RouteConfig {
  path: string;
  component: () => Promise<any>;
  title?: string;
  meta?: Record<string, any>;
}

export interface RouteMatch {
  route: RouteConfig;
  params: Record<string, string>;
  query: Record<string, string>;
}

export const ROUTES: RouteConfig[] = [
  {
    path: '/',
    component: () => import('../pages/HomePage.svelte'),
    title: 'MathRaining - Home'
  },
  {
    path: '/arithmetic',
    component: () => import('../pages/GamePage.svelte'),
    title: 'MathRaining - Arithmetic',
    meta: { gameType: 'arithmetic' }
  },
  {
    path: '/arithmetic/game',
    component: () => import('../pages/GamePage.svelte'),
    title: 'MathRaining - Arithmetic Game',
    meta: { gameType: 'arithmetic' }
  },
  {
    path: '/arithmetic/practice',
    component: () => import('../pages/GamePage.svelte'),
    title: 'MathRaining - Arithmetic Practice',
    meta: { gameType: 'arithmetic', mode: 'practice' }
  },
  {
    path: '/arithmetic/instructions',
    component: () => import('../pages/LearningPage.svelte'),
    title: 'MathRaining - Arithmetic Instructions',
    meta: { gameType: 'arithmetic', mode: 'instructions' }
  },
  {
    path: '/arithmetic/learning',
    component: () => import('../pages/LearningPage.svelte'),
    title: 'MathRaining - Arithmetic Learning',
    meta: { gameType: 'arithmetic' }
  },
  {
    path: '/calculus',
    component: () => import('../pages/GamePage.svelte'),
    title: 'MathRaining - Calculus',
    meta: { gameType: 'calculus' }
  },
  {
    path: '/calculus/game',
    component: () => import('../pages/GamePage.svelte'),
    title: 'MathRaining - Calculus Game',
    meta: { gameType: 'calculus' }
  },
  {
    path: '/calculus/practice',
    component: () => import('../pages/GamePage.svelte'),
    title: 'MathRaining - Calculus Practice',
    meta: { gameType: 'calculus', mode: 'practice' }
  },
  {
    path: '/calculus/instructions',
    component: () => import('../pages/LearningPage.svelte'),
    title: 'MathRaining - Calculus Instructions',
    meta: { gameType: 'calculus', mode: 'instructions' }
  },
  {
    path: '/calculus/learning',
    component: () => import('../pages/LearningPage.svelte'),
    title: 'MathRaining - Calculus Learning',
    meta: { gameType: 'calculus' }
  },
  {
    path: '/about',
    component: () => import('../pages/AboutPage.svelte'),
    title: 'MathRaining - About'
  },
  {
    path: '*',
    component: () => import('../pages/NotFoundPage.svelte'),
    title: 'MathRaining - Not Found'
  }
];
