<script lang="ts">
	import { page } from '$app/stores';
	import { apps, getAppFromRoute } from '$lib/registry';
	import '../app.css';

	// Bottom nav items (fixed + apps)
	const navItems = [
		{ icon: '🏠', label: 'Home', href: '/', color: '#4A90E2' },
		{ icon: '📊', label: 'Feed', href: '/feed', color: '#9B59B6' },
		{ icon: '🏆', label: 'Progress', href: '/progress', color: '#F39C12' }
	];

	$: currentPath = $page.url.pathname;
	$: currentApp = getAppFromRoute(currentPath);
	$: isHome = currentPath === '/';
	$: isFeed = currentPath === '/feed';
	$: isProgress = currentPath === '/progress';
</script>

<div class="app-container">
	<!-- Main content area -->
	<main class="main-content">
		<slot />
	</main>

	<!-- Bottom Navigation -->
	<nav class="bottom-nav">
		{#each navItems as item}
			<a
				href={item.href}
				class="nav-item"
				class:active={$page.url.pathname === item.href}
				style="--nav-color: {item.color}"
			>
				<span class="nav-icon">{item.icon}</span>
				<span class="nav-label">{item.label}</span>
			</a>
		{/each}

		<!-- Apps dropdown trigger -->
		<div class="nav-item apps-trigger">
			<span class="nav-icon">📱</span>
			<span class="nav-label">Apps</span>
		</div>
	</nav>
</div>

<style>
	.app-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		height: 100dvh; /* Dynamic viewport height for mobile */
		overflow: hidden;
	}

	.main-content {
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: var(--bottom-nav-height);
		-webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
	}

	.bottom-nav {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: var(--bottom-nav-height);
		background: var(--bg-secondary);
		border-top: 1px solid var(--bg-tertiary);
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding-bottom: env(safe-area-inset-bottom);
		z-index: 100;
		box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
	}

	.nav-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2px;
		flex: 1;
		height: 100%;
		color: var(--text-tertiary);
		text-decoration: none;
		transition: all 0.2s;
		-webkit-tap-highlight-color: transparent;
	}

	.nav-item:active {
		transform: scale(0.95);
	}

	.nav-item.active {
		color: var(--nav-color, var(--accent-primary));
	}

	.nav-icon {
		font-size: 24px;
		line-height: 1;
	}

	.nav-item.active .nav-icon {
		animation: pop 0.3s ease-out;
	}

	.nav-label {
		font-size: var(--font-size-xs);
		font-weight: 500;
	}

	.nav-item.active .nav-label {
		font-weight: 600;
	}

	.apps-trigger {
		cursor: pointer;
	}

	@media (min-width: 768px) {
		.main-content {
			max-width: 600px;
			margin: 0 auto;
		}
	}
</style>
