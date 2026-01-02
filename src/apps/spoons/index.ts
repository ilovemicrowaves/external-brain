import type { App } from '$lib/types';

export default {
	id: 'spoons',
	name: 'Spoon Drawer',
	icon: '🥄',
	route: '/spoons',
	color: '#4A90E2',
	category: 'energy',
	description: 'Track your 5 types of energy throughout the day',

	widget: {
		component: () => import('./components/SpoonWidget.svelte'),
		size: 'large'
	},

	grafana: {
		dashboardId: 'spoons-overview'
	}
} satisfies App;
