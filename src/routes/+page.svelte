<script lang="ts">
	import { apps } from '$lib/registry';
	import AppIcon from '$components/AppIcon.svelte';
	import Card from '$components/Card.svelte';
	import Button from '$components/Button.svelte';

	// Mock data - will be replaced with real data later
	const currentTime = $state(new Date().toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: '2-digit'
	}));

	const greeting = $derived.by(() => {
		const hour = new Date().getHours();
		if (hour < 12) return 'Good morning';
		if (hour < 18) return 'Good afternoon';
		return 'Good evening';
	});

	// Update time every minute
	$effect(() => {
		const interval = setInterval(() => {
			currentTime = new Date().toLocaleTimeString('en-US', {
				hour: 'numeric',
				minute: '2-digit'
			});
		}, 60000);

		return () => clearInterval(interval);
	});

	// Mock highlight - will be replaced with real achievement data
	const todaysHighlight = {
		title: "7-Day Streak!",
		message: "Keep logging your spoons!",
		emoji: "🔥"
	};

	// Quick actions
	const quickActions = [
		{ label: 'Log Energy', icon: '🥄', href: '/spoons' },
		{ label: 'Check Habits', icon: '✓', href: '/habits' },
		{ label: 'View Stats', icon: '📊', href: '/feed' }
	];
</script>

<svelte:head>
	<title>External Brain</title>
</svelte:head>

<div class="home-page">
	<!-- Header -->
	<header class="header">
		<div class="header-content">
			<div>
				<h1 class="logo">🧠</h1>
				<p class="time">{currentTime}</p>
			</div>
		</div>

		<div class="greeting">
			{greeting}! ✨
		</div>
	</header>

	<!-- Today's Highlight -->
	<section class="section">
		<Card class="highlight-card">
			<div class="highlight-content">
				<div class="highlight-emoji">{todaysHighlight.emoji}</div>
				<div class="highlight-text">
					<h3>{todaysHighlight.title}</h3>
					<p>{todaysHighlight.message}</p>
				</div>
			</div>
			<Button onClick={() => window.location.href = '/feed'}>
				Celebrate 🎉
			</Button>
		</Card>
	</section>

	<!-- Quick Actions -->
	<section class="section">
		<h2 class="section-title">Quick Actions</h2>
		<div class="quick-actions">
			{#each quickActions as action}
				<a href={action.href} class="quick-action">
					<span class="action-icon">{action.icon}</span>
					<span class="action-label">{action.label}</span>
				</a>
			{/each}
		</div>
	</section>

	<!-- Your Apps -->
	<section class="section">
		<h2 class="section-title">Your Apps</h2>
		<div class="apps-grid">
			{#each apps as app}
				<a href={app.route} class="app-link">
					<AppIcon {app} size="lg" />
				</a>
			{/each}

			{#if apps.length === 0}
				<div class="empty-state">
					<p>No apps yet! Start by adding your first app.</p>
				</div>
			{/if}
		</div>
	</section>

	<!-- Feed CTA -->
	<section class="section">
		<Card onClick={() => window.location.href = '/feed'}>
			<div class="feed-cta">
				<div>
					<h3>📊 View Your Feed</h3>
					<p class="text-secondary">See your achievements and insights</p>
				</div>
				<span class="arrow">→</span>
			</div>
		</Card>
	</section>
</div>

<style>
	.home-page {
		min-height: 100%;
		padding: var(--spacing-lg);
		padding-bottom: calc(var(--bottom-nav-height) + var(--spacing-lg));
	}

	.header {
		margin-bottom: var(--spacing-2xl);
	}

	.header-content {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: var(--spacing-md);
	}

	.logo {
		font-size: 3rem;
		line-height: 1;
		margin-bottom: var(--spacing-xs);
	}

	.time {
		font-size: var(--font-size-sm);
		color: var(--text-tertiary);
	}

	.greeting {
		font-size: var(--font-size-xl);
		font-weight: 500;
	}

	.section {
		margin-bottom: var(--spacing-2xl);
	}

	.section-title {
		font-size: var(--font-size-lg);
		margin-bottom: var(--spacing-md);
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-weight: 600;
	}

	.highlight-card {
		background: linear-gradient(135deg, var(--bg-secondary) 0%, #1a2a3a 100%);
	}

	.highlight-content {
		display: flex;
		gap: var(--spacing-md);
		align-items: center;
		margin-bottom: var(--spacing-lg);
	}

	.highlight-emoji {
		font-size: 3rem;
		line-height: 1;
	}

	.highlight-text h3 {
		font-size: var(--font-size-xl);
		margin-bottom: var(--spacing-xs);
	}

	.highlight-text p {
		color: var(--text-secondary);
	}

	.quick-actions {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--spacing-md);
	}

	.quick-action {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-sm);
		padding: var(--spacing-lg);
		background: var(--bg-secondary);
		border-radius: var(--radius-lg);
		text-decoration: none;
		transition: all 0.2s;
	}

	.quick-action:active {
		transform: scale(0.95);
		background: var(--bg-tertiary);
	}

	.action-icon {
		font-size: 2rem;
		line-height: 1;
	}

	.action-label {
		font-size: var(--font-size-sm);
		color: var(--text-secondary);
		text-align: center;
	}

	.apps-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
		gap: var(--spacing-lg);
	}

	.app-link {
		text-decoration: none;
	}

	.empty-state {
		grid-column: 1 / -1;
		text-align: center;
		padding: var(--spacing-2xl);
		color: var(--text-tertiary);
	}

	.feed-cta {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.feed-cta h3 {
		margin-bottom: var(--spacing-xs);
	}

	.arrow {
		font-size: var(--font-size-2xl);
		color: var(--text-tertiary);
		transition: transform 0.2s;
	}

	.feed-cta:hover .arrow {
		transform: translateX(4px);
	}
</style>
