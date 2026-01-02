<script lang="ts">
	interface Props {
		class?: string;
		padding?: 'none' | 'sm' | 'md' | 'lg';
		onClick?: () => void;
	}

	let { class: className = '', padding = 'lg', onClick }: Props = $props();

	const paddingClass = {
		none: '',
		sm: 'p-sm',
		md: 'p-md',
		lg: 'p-lg'
	}[padding];
</script>

<div
	class="card {paddingClass} {className}"
	role={onClick ? 'button' : undefined}
	tabindex={onClick ? 0 : undefined}
	onclick={onClick}
	onkeydown={(e) => e.key === 'Enter' && onClick?.()}
>
	{@render children?.()}
</div>

<style>
	.card {
		background: var(--bg-secondary);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-md);
		transition: all 0.2s;
	}

	.card[role='button'] {
		cursor: pointer;
	}

	.card[role='button']:active {
		transform: scale(0.98);
		box-shadow: var(--shadow-sm);
	}

	.p-sm {
		padding: var(--spacing-sm);
	}

	.p-md {
		padding: var(--spacing-md);
	}

	.p-lg {
		padding: var(--spacing-lg);
	}
</style>
