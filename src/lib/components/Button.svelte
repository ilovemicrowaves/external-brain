<script lang="ts">
	interface Props {
		variant?: 'primary' | 'secondary' | 'ghost';
		size?: 'md' | 'lg';
		class?: string;
		disabled?: boolean;
		onClick?: () => void;
		type?: 'button' | 'submit';
	}

	let {
		variant = 'primary',
		size = 'md',
		class: className = '',
		disabled = false,
		onClick,
		type = 'button'
	}: Props = $props();
</script>

<button
	{type}
	class="btn btn-{variant} btn-{size} {className}"
	{disabled}
	onclick={onClick}
>
	{@render children?.()}
</button>

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-sm);
		font-weight: 500;
		border-radius: var(--radius-md);
		transition: all 0.2s;
		border: none;
		cursor: pointer;
	}

	.btn:active:not(:disabled) {
		transform: scale(0.97);
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-md {
		min-height: var(--touch-target);
		padding: var(--spacing-md) var(--spacing-lg);
		font-size: var(--font-size-md);
	}

	.btn-lg {
		min-height: var(--touch-target-lg);
		padding: var(--spacing-lg) var(--spacing-xl);
		font-size: var(--font-size-lg);
	}

	.btn-primary {
		background: var(--accent-primary);
		color: white;
	}

	.btn-primary:active:not(:disabled) {
		background: var(--accent-secondary);
	}

	.btn-secondary {
		background: var(--bg-tertiary);
		color: var(--text-primary);
	}

	.btn-secondary:active:not(:disabled) {
		background: #3a3a3a;
	}

	.btn-ghost {
		background: transparent;
		color: var(--text-secondary);
	}

	.btn-ghost:active:not(:disabled) {
		background: var(--bg-tertiary);
	}
</style>
