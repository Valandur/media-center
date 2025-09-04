<script lang="ts">
	export let total: number;
	export let progress: { progress: number; color: string; label?: string }[];

	$: ps = progress
		.sort((a, b) => a.progress - b.progress)
		.map((p, i, arr) => {
			const ratio = Math.min(Math.max(p.progress / total, 0), 1);
			const diff = p.progress - (i > 0 ? arr[i - 1].progress : 0);
			const diffRatio = Math.min(Math.max(diff / total, 0), 1);
			return {
				...p,
				ratio,
				pct: Math.floor(ratio * 100).toFixed(0),
				diff,
				diffRatio,
				diffPct: Math.floor(diffRatio * 100).toFixed(0)
			};
		});
</script>

<div
	class="relative h-4 rounded-md bg-primary/15 flex flex-row items-stretch {$$props.class ?? ''}"
>
	{#each ps as p, i}
		<span
			class="rounded-md {p.color} transition-[width] duration-500 ease-in-out text-primary text-xs text-right pe-1"
			style:width="{p.diffRatio * 100}%"
		>
			{#if p.label}
				{p.label}
			{:else}
				{p.diffPct}%
			{/if}
		</span>
	{/each}
</div>
