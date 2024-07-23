<script lang="ts">
	export let total: number;
	export let progress: number | null = null;
	export let remaining: number | null = null;

	$: ratio = progress ? progress / total : remaining ? 1 - remaining / total : 0;
	$: pct = (ratio * 100).toFixed(0);
</script>

<div class="relative h-4 rounded-md bg-primary/15 {$$props.class}">
	<span
		class="absolute top-0 bottom-0 left-0 rounded-md bg-accent transition-[width] duration-500 ease-in-out text-xs text-right pe-1"
		style:width="{ratio * 100}%"
	>
		{pct}%
	</span>
</div>
