<script lang="ts">
	import type { FeedCard } from '$lib/types';
	import Card from '$components/Card.svelte';
	import Button from '$components/Button.svelte';

	// Mock feed data - will be replaced with generated feed from DB
	const mockFeed: FeedCard[] = [
		{
			id: '1',
			type: 'achievement',
			title: '🔥 STREAK ALERT 🔥',
			content: '7 DAYS OF SUPPLEMENTS WITHOUT MISSING ONE!',
			timestamp: new Date(),
			data: { currentStreak: 7, bestStreak: 12 }
		},
		{
			id: '2',
			type: 'insight',
			title: '💡 PATTERN DETECTED',
			content: 'On days you take L-Theanine with Caffeine, your Focus spoons are 42% higher',
			timestamp: new Date(),
			data: { increase: 42 }
		},
		{
			id: '3',
			type: 'throwback',
			title: '📅 3 MONTHS AGO TODAY',
			content: 'Then: You rated your Physical spoons at 2/5 most days\nNow: Average of 4/5!',
			timestamp: new Date(),
			data: { before: 2, after: 4 }
		},
		{
			id: '4',
			type: 'milestone',
			title: '🎉 MILESTONE! 🎉',
			content: '100 SPOON LOGS TRACKED',
			timestamp: new Date(),
			data: { count: 100, nextMilestone: 250 }
		}
	];

	let feedCards = $state(mockFeed);
	let currentIndex = $state(0);

	let scrollContainer: HTMLElement;

	// Swipe handling
	let startY = 0;
	let isDragging = false;

	function handleTouchStart(e: TouchEvent) {
		startY = e.touches[0].clientY;
		isDragging = true;
	}

	function handleTouchMove(e: TouchEvent) {
		if (!isDragging) return;

		const currentY = e.touches[0].clientY;
		const diff = startY - currentY;

		// Prevent default scrolling
		if (Math.abs(diff) > 10) {
			e.preventDefault();
		}
	}

	function handleTouchEnd(e: TouchEvent) {
		if (!isDragging) return;
		isDragging = false;

		const endY = e.changedTouches[0].clientY;
		const diff = startY - endY;

		// Swipe up (next card)
		if (diff > 50 && currentIndex < feedCards.length - 1) {
			currentIndex++;
			scrollToCard(currentIndex);
		}

		// Swipe down (previous card)
		if (diff < -50 && currentIndex > 0) {
			currentIndex--;
			scrollToCard(currentIndex);
		}
	}

	function scrollToCard(index: number) {
		const card = scrollContainer?.children[index] as HTMLElement;
		if (card) {
			card.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	// Scroll snap observer
	$effect(() => {
		if (!scrollContainer) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const index = Array.from(scrollContainer.children).indexOf(entry.target);
						if (index !== -1) {
							currentIndex = index;
						}
					}
				});
			},
			{ threshold: 0.5 }
		);

		Array.from(scrollContainer.children).forEach((child) => {
			observer.observe(child);
		});

		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<title>Feed - External Brain</title>
</svelte:head>

<div class="feed-page">
	<div
		class="feed-container"
		bind:this={scrollContainer}
		ontouchstart={handleTouchStart}
		ontouchmove={handleTouchMove}
		ontouchend={handleTouchEnd}
	>
		{#each feedCards as card, index (card.id)}
			<div class="feed-card-wrapper" class:active={index === currentIndex}>
				{#if card.type === 'achievement'}
					<div class="feed-card achievement">
						<button class="close-btn" aria-label="Close">×</button>
						<div class="card-content">
							<h2 class="card-title">{card.title}</h2>
							<p class="card-message">{card.content}</p>

							{#if card.data}
								<div class="card-data">
									<div class="progress-bar">
										<div
											class="progress-fill"
											style="width: {(card.data.currentStreak / card.data.bestStreak) * 100}%"
										></div>
									</div>
									<p class="text-secondary">
										Your best streak ever: {card.data.bestStreak} days<br />
										You're {card.data.bestStreak - card.data.currentStreak} days away from beating it!
									</p>
								</div>
							{/if}

							<Button variant="secondary">Share Achievement 📤</Button>
						</div>

						<div class="swipe-hint">╲ ╱<br />Swipe up</div>
					</div>
				{:else if card.type === 'insight'}
					<div class="feed-card insight">
						<button class="close-btn" aria-label="Close">×</button>
						<div class="card-content">
							<h2 class="card-title">{card.title}</h2>
							<p class="card-message">{card.content}</p>

							{#if card.data}
								<div class="card-data">
									<div class="stat-highlight">
										<div class="stat-number">+{card.data.increase}%</div>
										<div class="stat-label">HIGHER</div>
									</div>
									<p class="text-secondary">The data suggests: Keep stacking! ✓</p>
								</div>
							{/if}
						</div>

						<div class="swipe-hint">╲ ╱<br />Swipe up</div>
					</div>
				{:else if card.type === 'throwback'}
					<div class="feed-card throwback">
						<button class="close-btn" aria-label="Close">×</button>
						<div class="card-content">
							<h2 class="card-title">{card.title}</h2>

							{#if card.data}
								<div class="card-data">
									<div class="comparison">
										<div class="comparison-item">
											<div class="comparison-label">THEN</div>
											<div class="comparison-bar">
												<div
													class="bar-fill"
													style="width: {(card.data.before / 5) * 100}%"
												></div>
											</div>
											<div class="comparison-value">{(card.data.before / 5) * 100}%</div>
										</div>

										<div class="comparison-arrow">→</div>

										<div class="comparison-item">
											<div class="comparison-label">NOW</div>
											<div class="comparison-bar">
												<div
													class="bar-fill success"
													style="width: {(card.data.after / 5) * 100}%"
												></div>
											</div>
											<div class="comparison-value">{(card.data.after / 5) * 100}%</div>
										</div>
									</div>

									<p class="card-message">💪 You've come so far!</p>
								</div>
							{/if}
						</div>

						<div class="swipe-hint">╲ ╱<br />Swipe up</div>
					</div>
				{:else if card.type === 'milestone'}
					<div class="feed-card milestone">
						<button class="close-btn" aria-label="Close">×</button>
						<div class="card-content">
							<h2 class="card-title">{card.title}</h2>

							<div class="milestone-icon">💯</div>

							<p class="card-message">{card.content}</p>

							{#if card.data}
								<div class="card-data">
									<p class="text-secondary">You've been tracking for 47 days</p>
									<p class="text-secondary">Your future self thanks you 🙏</p>

									<div class="achievement-unlocked">
										<p>🏆 Achievement unlocked:</p>
										<p class="achievement-name">"Data Collector" badge</p>
									</div>

									<div class="next-milestone">
										<p class="text-secondary">Next milestone: {card.data.nextMilestone} logs</p>
										<div class="progress-bar">
											<div
												class="progress-fill"
												style="width: {(card.data.count / card.data.nextMilestone) * 100}%"
											></div>
										</div>
									</div>
								</div>
							{/if}
						</div>

						<div class="swipe-hint">╲ ╱<br />Swipe up</div>
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Progress indicator -->
	<div class="progress-indicator">
		{#each feedCards as _, index}
			<div class="dot" class:active={index === currentIndex}></div>
		{/each}
	</div>
</div>

<style>
	.feed-page {
		position: relative;
		height: calc(100vh - var(--bottom-nav-height));
		height: calc(100dvh - var(--bottom-nav-height));
		overflow: hidden;
	}

	.feed-container {
		height: 100%;
		overflow-y: scroll;
		scroll-snap-type: y mandatory;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
	}

	.feed-container::-webkit-scrollbar {
		display: none;
	}

	.feed-card-wrapper {
		height: 100%;
		scroll-snap-align: start;
		scroll-snap-stop: always;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--spacing-lg);
	}

	.feed-card {
		position: relative;
		width: 100%;
		max-width: 500px;
		min-height: 80%;
		background: var(--bg-secondary);
		border-radius: var(--radius-xl);
		padding: var(--spacing-2xl);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		animation: fadeIn 0.3s ease-out;
	}

	.close-btn {
		position: absolute;
		top: var(--spacing-md);
		right: var(--spacing-md);
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--bg-tertiary);
		color: var(--text-secondary);
		font-size: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
	}

	.close-btn:active {
		transform: scale(0.9);
	}

	.card-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
	}

	.card-title {
		font-size: var(--font-size-2xl);
		text-align: center;
		line-height: 1.2;
	}

	.card-message {
		font-size: var(--font-size-lg);
		text-align: center;
		line-height: 1.4;
	}

	.card-data {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
		justify-content: center;
	}

	.progress-bar {
		width: 100%;
		height: 8px;
		background: var(--bg-tertiary);
		border-radius: 4px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: var(--accent-primary);
		transition: width 0.3s ease-out;
	}

	.progress-fill.success {
		background: var(--success);
	}

	.stat-highlight {
		text-align: center;
		padding: var(--spacing-xl);
		background: var(--bg-tertiary);
		border-radius: var(--radius-lg);
	}

	.stat-number {
		font-size: var(--font-size-3xl);
		font-weight: 700;
		color: var(--success);
	}

	.stat-label {
		font-size: var(--font-size-lg);
		color: var(--text-secondary);
		font-weight: 600;
	}

	.comparison {
		display: flex;
		align-items: center;
		gap: var(--spacing-lg);
	}

	.comparison-item {
		flex: 1;
	}

	.comparison-label {
		font-size: var(--font-size-sm);
		font-weight: 600;
		color: var(--text-tertiary);
		margin-bottom: var(--spacing-sm);
	}

	.comparison-bar {
		width: 100%;
		height: 40px;
		background: var(--bg-tertiary);
		border-radius: var(--radius-md);
		overflow: hidden;
		margin-bottom: var(--spacing-xs);
	}

	.bar-fill {
		height: 100%;
		background: var(--accent-primary);
		transition: width 0.3s ease-out;
	}

	.comparison-value {
		font-size: var(--font-size-lg);
		font-weight: 600;
	}

	.comparison-arrow {
		font-size: var(--font-size-2xl);
		color: var(--text-tertiary);
	}

	.milestone-icon {
		font-size: 5rem;
		text-align: center;
		line-height: 1;
	}

	.achievement-unlocked {
		text-align: center;
		padding: var(--spacing-lg);
		background: linear-gradient(135deg, var(--bg-tertiary) 0%, #2a3a1a 100%);
		border-radius: var(--radius-lg);
	}

	.achievement-name {
		font-size: var(--font-size-lg);
		font-weight: 600;
		color: var(--success);
		margin-top: var(--spacing-xs);
	}

	.next-milestone {
		padding: var(--spacing-md);
		background: var(--bg-tertiary);
		border-radius: var(--radius-md);
	}

	.swipe-hint {
		text-align: center;
		color: var(--text-tertiary);
		font-size: var(--font-size-sm);
		line-height: 1.2;
		margin-top: var(--spacing-md);
	}

	.progress-indicator {
		position: fixed;
		right: var(--spacing-md);
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		z-index: 10;
	}

	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--bg-tertiary);
		transition: all 0.2s;
	}

	.dot.active {
		background: var(--accent-primary);
		height: 16px;
		border-radius: 4px;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>
