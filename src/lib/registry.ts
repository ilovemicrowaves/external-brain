import type { App } from './types';

/**
 * App Registry - Auto-discovers all apps in src/apps/
 *
 * Each app should export its manifest as the default export from index.ts
 * Example: src/apps/spoons/index.ts -> export default spoonsApp
 */

// Vite's glob import - automatically finds all app manifests
const appModules = import.meta.glob<{ default: App }>('../apps/*/index.ts', { eager: true });

// Extract and sort apps
export const apps: App[] = Object.values(appModules)
	.map(mod => mod.default)
	.filter(Boolean)
	.sort((a, b) => a.name.localeCompare(b.name));

/**
 * Get app by ID
 */
export function getApp(id: string): App | undefined {
	return apps.find(app => app.id === id);
}

/**
 * Get apps by category
 */
export function getAppsByCategory(category: App['category']): App[] {
	return apps.filter(app => app.category === category);
}

/**
 * Get all app routes (for navigation)
 */
export function getAppRoutes(): string[] {
	return apps.map(app => app.route);
}

/**
 * Check if a route belongs to an app
 */
export function isAppRoute(pathname: string): boolean {
	return apps.some(app => pathname.startsWith(app.route));
}

/**
 * Get app from route
 */
export function getAppFromRoute(pathname: string): App | undefined {
	return apps.find(app => pathname.startsWith(app.route));
}

// Log registered apps in development
if (import.meta.env.DEV) {
	console.log('[Registry] Registered apps:', apps.map(app => app.id));
}
