<script lang="ts">
	import type { About } from '$lib/models/about';
	import { formatSize } from '$lib/util';

	export let about: About | null;
</script>

{#if about}
	<div class="flex flex-col p-4 border border-t-0 border-primary/30">
		<div class="flex items-center justify-between mb-2">
			<p>
				<span class="text-primary">{formatSize(about.used)} </span>
				<span class="text-secondary">used of</span>
				<span class="text-primary">{formatSize(about.total)}</span>
			</p>
		</div>
		<div class="w-full relative h-4 rounded-md bg-primary/15">
			<span
				class="absolute top-0 bottom-0 left-0 rounded-md bg-accent transition-[width] duration-500 ease-in-out"
				style:width="{(about.used / about.total) * 100}%"
			></span>
		</div>
	</div>
{/if}
