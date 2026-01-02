<script lang="ts">
	import Card from '$components/Card.svelte';

	// Mock data - will be replaced with real gamification system
	const userProgress = {
		level: 8,
		currentXP: 2847,
		nextLevelXP: 3000,
		totalXP: 15000
	};

	const streaks = [
		{ name: 'Spoon Logging', icon: '🥄', days: 6, best: 12 },
		{ name: 'Supplements', icon: '💊', days: 7, best: 7 }
	];

	const achievements = [
		{ name: 'First Steps', icon: '👣', unlocked: true },
		{ name: 'Data Collector', icon: '💯', unlocked: true },
		{ name: 'Week Warrior', icon: '🔥', unlocked: false },
		{ name: 'Pattern Finder', icon: '💡', unlocked: false }
	];

	const quests = [
		{ title: 'Log morning spoons', xp: 10, completed: true },
		{ title: 'Take supplements', xp: 10, completed: true },
		{ title: 'Check in tonight', xp: 10, completed: false },
		{ title: 'Add 1 habit', xp: 15, completed: false }
	];

	$: xpProgress = (userProgress.currentXP / userProgress.nextLevelXP) * 100;
</script>

<svelte:head>
	<title>Progress - External Brain</title>
</svelte:head>

<div class="progress-page">
	<header class="page-header">
		<h1>🏆 Your Progress</h1>
	</header>

	<div class="container">
		<!-- Level -->
		<section class="section">
			<Card>
				<div class="level-display">
					<div class="level-info">
						<span class="level-label">LEVEL</span>
						<span class="level-number">{userProgress.level}</span>
						<span class="level-title">Data Enthusiast</span>
					</div>
					<div class="xp-bar">
						<div class="xp-fill" style="width: {xpProgress}%"></div>
					</div>
					<div class="xp-text">
						{userProgress.currentXP.toLocaleString()} / {userProgress.nextLevelXP.toLocaleString()} XP
					</div>
				</div>
			</Card>
		</section>

		<!-- Streaks -->
		<section class="section">
			<h2 class="section-title">Active Streaks 🔥</h2>
			{#each streaks as streak}
				<Card class="streak-card">
					<div class="streak-content">
						<span class="streak-icon">{streak.icon}</span>
						<div class="streak-info">
							<h3>{streak.name}</h3>
							<p class="text-secondary">Best: {streak.best} days</p>
						</div>
						<div class="streak-days">
							<span class="streak-number">{streak.days}</span>
							<span class="streak-label">days</span>
						</div>
					</div>
				</Card>
			{/each}
		</section>

		<!-- Daily Quests -->
		<section class="section">
			<h2 class="section-title">Today's Quests</h2>
			{#each quests as quest}
				<Card class="quest-card" padding="md">
					<div class="quest-content">
						<div class="quest-checkbox" class:completed={quest.completed}>
							{#if quest.completed}✓{/if}
						</div>
						<div class="quest-info">
							<span class="quest-title">{quest.title}</span>
							<span class="quest-xp">+{quest.xp} XP</span>
						</div>
					</div>
				</Card>
			{/each}
		</section>

		<!-- Achievements -->
		<section class="section">
			<h2 class="section-title">Achievements ({achievements.filter(a => a.unlocked).length} / {achievements.length})</h2>
			<div class="achievements-grid">
				{#each achievements as achievement}
					<div class="achievement-item" class:unlocked={achievement.unlocked}>
						<div class="achievement-icon">{achievement.icon}</div>
						<div class="achievement-name">{achievement.name}</div>
					</div>
				{/each}
			</div>
		</section>

		<!-- Stats -->
		<section class="section">
			<h2 class="section-title">Lifetime Stats</h2>
			<Card>
				<div class="stats-grid">
					<div class="stat-item">
						<div class="stat-number">{userProgress.totalXP.toLocaleString()}</div>
						<div class="stat-label">Total XP</div>
					</div>
					<div class="stat-item">
						<div class="stat-number">47</div>
						<div class="stat-label">Days Tracked</div>
					</div>
					<div class="stat-item">
						<div class="stat-number">156</div>
						<div class="stat-label">Total Logs</div>
					</div>
					<div class="stat-item">
						<div class="stat-number">3</div>
						<div class="stat-label">Insights Found</div>
					</div>
				</div>
			</Card>
		</section>
	</div>
</div>

<style>
	.progress-page {
		min-height: 100%;
		padding-bottom: calc(var(--bottom-nav-height) + var(--spacing-lg));
	}

	.page-header {
		background: linear-gradient(135deg, var(--bg-secondary) 0%, #2a1a3a 100%);
		padding: var(--spacing-2xl) var(--spacing-lg);
		margin-bottom: var(--spacing-xl);
	}

	.page-header h1 {
		font-size: var(--font-size-2xl);
	}

	.container {
		padding: 0 var(--spacing-lg);
	}

	.section {
		margin-bottom: var(--spacing-2xl);
	}

	.section-title {
		font-size: var(--font-size-md);
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		margin-bottom: var(--spacing-md);
		font-weight: 600;
	}

	.level-display {
		text-align: center;
	}

	.level-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-xs);
		margin-bottom: var(--spacing-lg);
	}

	.level-label {
		font-size: var(--font-size-sm);
		color: var(--text-tertiary);
		font-weight: 600;
	}

	.level-number {
		font-size: 4rem;
		font-weight: 700;
		line-height: 1;
		background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.level-title {
		font-size: var(--font-size-lg);
		color: var(--text-secondary);
	}

	.xp-bar {
		width: 100%;
		height: 12px;
		background: var(--bg-tertiary);
		border-radius: 6px;
		overflow: hidden;
		margin-bottom: var(--spacing-sm);
	}

	.xp-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
		transition: width 0.5s ease-out;
	}

	.xp-text {
		font-size: var(--font-size-sm);
		color: var(--text-tertiary);
	}

	.streak-card {
		margin-bottom: var(--spacing-md);
	}

	.streak-content {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
	}

	.streak-icon {
		font-size: 2rem;
		line-height: 1;
	}

	.streak-info {
		flex: 1;
	}

	.streak-info h3 {
		font-size: var(--font-size-lg);
		margin-bottom: var(--spacing-xs);
	}

	.streak-days {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.streak-number {
		font-size: var(--font-size-2xl);
		font-weight: 700;
		color: var(--accent-primary);
		line-height: 1;
	}

	.streak-label {
		font-size: var(--font-size-xs);
		color: var(--text-tertiary);
	}

	.quest-card {
		margin-bottom: var(--spacing-sm);
	}

	.quest-content {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
	}

	.quest-checkbox {
		width: 24px;
		height: 24px;
		border: 2px solid var(--bg-tertiary);
		border-radius: var(--radius-sm);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--font-size-lg);
		font-weight: 700;
	}

	.quest-checkbox.completed {
		background: var(--success);
		border-color: var(--success);
		color: white;
	}

	.quest-info {
		flex: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.quest-title {
		font-size: var(--font-size-md);
	}

	.quest-xp {
		font-size: var(--font-size-sm);
		color: var(--accent-primary);
		font-weight: 600;
	}

	.achievements-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--spacing-md);
	}

	.achievement-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-xs);
		padding: var(--spacing-md);
		background: var(--bg-secondary);
		border-radius: var(--radius-lg);
		opacity: 0.3;
		transition: all 0.2s;
	}

	.achievement-item.unlocked {
		opacity: 1;
		animation: pop 0.3s ease-out;
	}

	.achievement-icon {
		font-size: 2rem;
		line-height: 1;
	}

	.achievement-name {
		font-size: var(--font-size-xs);
		text-align: center;
		color: var(--text-secondary);
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--spacing-lg);
	}

	.stat-item {
		text-align: center;
		padding: var(--spacing-md);
	}

	.stat-number {
		font-size: var(--font-size-2xl);
		font-weight: 700;
		color: var(--accent-primary);
		margin-bottom: var(--spacing-xs);
	}

	.stat-label {
		font-size: var(--font-size-sm);
		color: var(--text-secondary);
	}
</style>
