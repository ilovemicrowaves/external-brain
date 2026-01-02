<script lang="ts">
	import type { SpoonType, SpoonLevel, BaselineType, SpoonLevelInfo } from '$lib/types';
	import Button from '$components/Button.svelte';
	import Card from '$components/Card.svelte';

	const SPOON_LEVELS: Record<SpoonLevel, SpoonLevelInfo> = {
		0: { emoji: '🔴', label: 'Crashed', color: '#F44336' },
		1: { emoji: '🟠', label: 'Low', color: '#FF9800' },
		2: { emoji: '🟡', label: 'Okay', color: '#FFC107' },
		3: { emoji: '🟢', label: 'Full', color: '#4CAF50' },
		4: { emoji: '⚡', label: 'Overdrive', color: '#2196F3' }
	};

	const SPOON_TYPES: { type: SpoonType; label: string; description: string }[] = [
		{
			type: 'physical',
			label: 'Physical',
			description: 'Body energy, pain, fatigue'
		},
		{
			type: 'focus',
			label: 'Focus',
			description: 'Concentration, mental clarity'
		},
		{
			type: 'initiation',
			label: 'Initiation',
			description: 'Starting tasks, decision-making'
		},
		{
			type: 'sensory',
			label: 'Sensory',
			description: 'Tolerance for stimuli'
		},
		{
			type: 'masking',
			label: 'Masking',
			description: 'Social camouflaging energy'
		}
	];

	const BASELINES: { value: BaselineType; label: string; emoji: string }[] = [
		{ value: 'normal', label: 'Normal', emoji: '😐' },
		{ value: 'good', label: 'Good', emoji: '😊' },
		{ value: 'rough', label: 'Rough', emoji: '😣' },
		{ value: 'terrible', label: 'Terrible', emoji: '😵' }
	];

	// State
	let spoons = $state<Record<SpoonType, SpoonLevel>>({
		physical: 2,
		focus: 2,
		initiation: 2,
		sensory: 2,
		masking: 2
	});

	let baseline = $state<BaselineType>('normal');
	let note = $state('');
	let isSaving = $state(false);
	let lastSaved = $state<Date | null>(null);
	let showFeedback = $state(false);
	let feedbackMessage = $state('');

	// Log spoons
	async function logSpoons() {
		isSaving = true;

		try {
			const response = await fetch('/api/spoons/log', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...spoons,
					baseline,
					note: note.trim() || null
				})
			});

			if (response.ok) {
				const result = await response.json();
				lastSaved = new Date(result.timestamp);
				note = '';
				showFeedbackMessage('✓ Logged successfully!', 'success');

				// Award XP (will implement gamification later)
				console.log('+10 XP');
			} else {
				showFeedbackMessage('Failed to log entry', 'error');
			}
		} catch (error) {
			console.error('Error logging spoons:', error);
			showFeedbackMessage('Network error', 'error');
		} finally {
			isSaving = false;
		}
	}

	function showFeedbackMessage(message: string, type: 'success' | 'error') {
		feedbackMessage = message;
		showFeedback = true;
		setTimeout(() => {
			showFeedback = false;
		}, 3000);
	}

	// Load latest entry
	async function loadLatestEntry() {
		try {
			const response = await fetch('/api/spoons/latest');
			if (response.ok) {
				const data = await response.json();
				if (data.timestamp) {
					lastSaved = new Date(data.timestamp);
				}
			}
		} catch (error) {
			console.error('Error loading latest entry:', error);
		}
	}

	// Load on mount
	$effect(() => {
		loadLatestEntry();
	});

	// Check for low spoons
	$derived.by(() => {
		const lowSpoons = SPOON_TYPES.filter((s) => spoons[s.type] <= 1);
		return lowSpoons;
	});
</script>

<svelte:head>
	<title>Spoon Drawer - External Brain</title>
</svelte:head>

<div class="spoons-page">
	<header class="page-header">
		<div class="header-content">
			<h1>🥄 Spoon Drawer</h1>
			<p class="subtitle">How's your energy?</p>
		</div>

		{#if lastSaved}
			<div class="last-saved">
				Last logged: {lastSaved.toLocaleString()}
			</div>
		{/if}
	</header>

	<div class="container">
		<!-- Baseline Selection -->
		<section class="section">
			<h2 class="section-title">Today's Baseline</h2>
			<div class="baseline-buttons">
				{#each BASELINES as b}
					<button
						class="baseline-btn"
						class:active={baseline === b.value}
						onclick={() => (baseline = b.value)}
					>
						<span class="baseline-emoji">{b.emoji}</span>
						<span class="baseline-label">{b.label}</span>
					</button>
				{/each}
			</div>
		</section>

		<!-- Spoon Sliders -->
		<section class="section">
			<h2 class="section-title">Current Energy Levels</h2>

			<div class="spoons-grid">
				{#each SPOON_TYPES as spoonType}
					{@const level = spoons[spoonType.type]}
					{@const levelInfo = SPOON_LEVELS[level]}

					<Card class="spoon-card">
						<div class="spoon-header">
							<div class="spoon-info">
								<h3 class="spoon-name">{spoonType.label}</h3>
								<p class="spoon-desc">{spoonType.description}</p>
							</div>
							<div class="spoon-indicator" style="color: {levelInfo.color}">
								<div class="spoon-emoji">{levelInfo.emoji}</div>
								<div class="spoon-label">{levelInfo.label}</div>
							</div>
						</div>

						<input
							type="range"
							min="0"
							max="4"
							step="1"
							bind:value={spoons[spoonType.type]}
							class="spoon-slider"
							style="--slider-color: {levelInfo.color}"
						/>

						<div class="slider-labels">
							{#each Object.values(SPOON_LEVELS) as lvl}
								<span class="slider-label">{lvl.emoji}</span>
							{/each}
						</div>
					</Card>
				{/each}
			</div>
		</section>

		<!-- Notes -->
		<section class="section">
			<h2 class="section-title">Notes (optional)</h2>
			<textarea
				bind:value={note}
				placeholder="How are you feeling? Any context..."
				class="note-textarea"
				rows="3"
			></textarea>
		</section>

		<!-- Submit -->
		<section class="section">
			<Button size="lg" onClick={logSpoons} disabled={isSaving} class="submit-btn">
				{#if isSaving}
					<span class="spinner"></span> Logging...
				{:else}
					Log Spoons
				{/if}
			</Button>
		</section>

		<!-- Quick Actions -->
		<section class="section">
			<h2 class="section-title">Quick Actions</h2>
			<div class="quick-actions">
				<Button variant="secondary" onClick={() => window.location.href = '/spoons/history'}>
					📊 View History
				</Button>
				<Button variant="secondary" onClick={() => window.location.href = '/feed'}>
					🎯 See Insights
				</Button>
			</div>
		</section>
	</div>

	<!-- Feedback Toast -->
	{#if showFeedback}
		<div class="feedback-toast slide-up">
			{feedbackMessage}
		</div>
	{/if}
</div>

<style>
	.spoons-page {
		min-height: 100%;
		padding-bottom: calc(var(--bottom-nav-height) + var(--spacing-lg));
	}

	.page-header {
		background: linear-gradient(135deg, var(--bg-secondary) 0%, #1a2a3a 100%);
		padding: var(--spacing-2xl) var(--spacing-lg);
		margin-bottom: var(--spacing-xl);
	}

	.header-content h1 {
		font-size: var(--font-size-2xl);
		margin-bottom: var(--spacing-xs);
	}

	.subtitle {
		color: var(--text-secondary);
		font-size: var(--font-size-lg);
	}

	.last-saved {
		margin-top: var(--spacing-md);
		font-size: var(--font-size-sm);
		color: var(--text-tertiary);
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

	.baseline-buttons {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--spacing-md);
	}

	.baseline-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-sm);
		padding: var(--spacing-lg);
		background: var(--bg-secondary);
		border: 2px solid transparent;
		border-radius: var(--radius-lg);
		transition: all 0.2s;
	}

	.baseline-btn.active {
		border-color: var(--accent-primary);
		background: var(--bg-tertiary);
	}

	.baseline-btn:active {
		transform: scale(0.95);
	}

	.baseline-emoji {
		font-size: 2rem;
		line-height: 1;
	}

	.baseline-label {
		font-size: var(--font-size-md);
		font-weight: 500;
	}

	.spoons-grid {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
	}

	.spoon-card {
		background: var(--bg-secondary);
	}

	.spoon-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: var(--spacing-md);
	}

	.spoon-name {
		font-size: var(--font-size-lg);
		margin-bottom: var(--spacing-xs);
	}

	.spoon-desc {
		font-size: var(--font-size-sm);
		color: var(--text-tertiary);
	}

	.spoon-indicator {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-xs);
		min-width: 80px;
	}

	.spoon-emoji {
		font-size: 2rem;
		line-height: 1;
	}

	.spoon-label {
		font-size: var(--font-size-sm);
		font-weight: 600;
	}

	.spoon-slider {
		width: 100%;
		height: 8px;
		-webkit-appearance: none;
		appearance: none;
		background: var(--bg-tertiary);
		border-radius: 4px;
		outline: none;
		margin: var(--spacing-md) 0;
	}

	.spoon-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 24px;
		height: 24px;
		background: var(--slider-color, var(--accent-primary));
		border-radius: 50%;
		cursor: pointer;
		box-shadow: var(--shadow-md);
		transition: transform 0.1s;
	}

	.spoon-slider::-webkit-slider-thumb:active {
		transform: scale(1.2);
	}

	.spoon-slider::-moz-range-thumb {
		width: 24px;
		height: 24px;
		background: var(--slider-color, var(--accent-primary));
		border-radius: 50%;
		cursor: pointer;
		border: none;
		box-shadow: var(--shadow-md);
	}

	.slider-labels {
		display: flex;
		justify-content: space-between;
		font-size: var(--font-size-lg);
	}

	.note-textarea {
		width: 100%;
		min-height: 80px;
		resize: vertical;
		font-family: inherit;
	}

	.submit-btn {
		width: 100%;
	}

	.quick-actions {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--spacing-md);
	}

	.feedback-toast {
		position: fixed;
		bottom: calc(var(--bottom-nav-height) + var(--spacing-lg));
		left: 50%;
		transform: translateX(-50%);
		background: var(--success);
		color: white;
		padding: var(--spacing-md) var(--spacing-xl);
		border-radius: var(--radius-lg);
		font-weight: 500;
		box-shadow: var(--shadow-lg);
		z-index: 1000;
	}
</style>
