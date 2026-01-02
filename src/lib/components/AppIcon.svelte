<script lang="ts">
	import type { App } from '$lib/types';

	interface Props {
		app: App;
		size?: 'sm' | 'md' | 'lg';
		active?: boolean;
		badge?: number | string;
	}

	let { app, size = 'md', active = false, badge }: Props = $props();

	const sizeMap = {
		sm: '40px',
		md: '56px',
		lg: '72px'
	};
</script>

<div class="app-icon" class:active style="--app-color: {app.color}; --size: {sizeMap[size]}">
	<div class="icon-wrapper">
		<span class="icon">{app.icon}</span>
		{#if badge !== undefined}
			<span class="badge">{badge}</span>
		{/if}
	</div>
	<span class="name">{app.name}</span>
</div>

<style>
	.app-icon {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-xs);
		-webkit-user-select: none;
		user-select: none;
	}

	.icon-wrapper {
		position: relative;
		width: var(--size);
		height: var(--size);
		background: var(--app-color);
		border-radius: var(--radius-lg);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
		box-shadow: var(--shadow-md);
	}

	.app-icon:active .icon-wrapper {
		transform: scale(0.95);
	}

	.app-icon.active .icon-wrapper {
		box-shadow: 0 0 0 3px var(--app-color);
		opacity: 1;
	}

	.icon {
		font-size: calc(var(--size) * 0.5);
		line-height: 1;
	}

	.badge {
		position: absolute;
		top: -4px;
		right: -4px;
		min-width: 20px;
		height: 20px;
		background: var(--error);
		color: white;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--font-size-xs);
		font-weight: 600;
		padding: 0 var(--spacing-xs);
		box-shadow: var(--shadow-md);
	}

	.name {
		font-size: var(--font-size-sm);
		color: var(--text-secondary);
		text-align: center;
		max-width: calc(var(--size) + 20px);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.app-icon.active .name {
		color: var(--text-primary);
		font-weight: 500;
	}
</style>
