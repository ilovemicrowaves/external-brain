<script lang="ts">
	import Button from '$components/Button.svelte';

	function retry() {
		window.location.reload();
	}
</script>

<svelte:head>
	<title>Offline - External Brain</title>
</svelte:head>

<div class="offline-page">
	<div class="offline-content">
		<div class="offline-icon">📡</div>
		<h1>You're Offline</h1>
		<p class="offline-message">
			No internet connection detected. Some features may not work until you're back online.
		</p>

		<Button onClick={retry}>Try Again</Button>

		<div class="offline-info">
			<p class="text-secondary">
				Your previously viewed pages may still be available.
			</p>
		</div>
	</div>
</div>

<style>
	.offline-page {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: calc(100vh - var(--bottom-nav-height));
		padding: var(--spacing-lg);
	}

	.offline-content {
		max-width: 400px;
		text-align: center;
	}

	.offline-icon {
		font-size: 5rem;
		line-height: 1;
		margin-bottom: var(--spacing-xl);
		opacity: 0.5;
	}

	h1 {
		font-size: var(--font-size-2xl);
		margin-bottom: var(--spacing-md);
	}

	.offline-message {
		font-size: var(--font-size-lg);
		color: var(--text-secondary);
		margin-bottom: var(--spacing-2xl);
		line-height: 1.5;
	}

	.offline-info {
		margin-top: var(--spacing-2xl);
		padding-top: var(--spacing-lg);
		border-top: 1px solid var(--bg-tertiary);
	}
</style>
