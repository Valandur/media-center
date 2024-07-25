<script lang="ts">
	export let total: number;
	export let label: string | null = null;
	export let progress: number | null = null;
	export let remaining: number | null = null;
	export let colorProgress: boolean = false;

	$: ratio = progress ? progress / total : remaining ? 1 - remaining / total : 0;
	$: pct = (ratio * 100).toFixed(0);
	$: bg = colorProgress
		? ratio < 0.5
			? 'bg-success'
			: ratio < 0.75
				? 'bg-warning'
				: 'bg-error'
		: 'bg-accent';
</script>

<div class="relative h-4 rounded-md bg-primary/15 {$$props.class ?? ''}">
	<span
		class="absolute top-0 bottom-0 left-0 rounded-md {bg} transition-[width] duration-500 ease-in-out text-primary text-xs text-right pe-1"
		style:width="{ratio * 100}%"
	>
		{#if label}
			{label}
		{:else}
			{pct}%
		{/if}
	</span>
</div>
