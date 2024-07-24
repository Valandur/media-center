<script lang="ts">
	import { scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { cubicInOut } from 'svelte/easing';

	import type { FileSystem } from '$lib/models/file-system';

	import Card from './Card.svelte';
	import FileSystemCard from './FileSystemCard.svelte';

	export let fileSystems: Promise<FileSystem[]>;

	let loading = true;
	let fses: (FileSystem | null)[] = [null];

	$: fileSystems, setup();

	function setup() {
		fileSystems.then((newFileSystems) => {
			loading = false;

			fses = newFileSystems.sort((a, b) => a.devicename.localeCompare(b.devicename));
		});
	}
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
	{#each fses as fs (fs?.devicename)}
		<div
			in:scale={{ delay: 250, duration: 200, easing: cubicInOut }}
			out:scale={{ duration: 200, easing: cubicInOut }}
			animate:flip={{ delay: 250, duration: 200, easing: cubicInOut }}
		>
			{#if !fs}
				<Card class="w-full h-full flex flex-col justify-between transition-colors">
					<div class="flex flex-row items-center justify-between">
						<h3 class="flex-1 text-primary text-xl overflow-hidden text-nowrap text-ellipsis">
							...
						</h3>
						<div class="flex-shrink-0 spinner"></div>
					</div>

					<div class="flex flex-row items-center justify-between">
						<div class="text-secondary">&nbsp;</div>
						<div class="text-secondary">&nbsp;</div>
					</div>

					<h3 class="text-primary text-sm mb-1">&nbsp;</h3>
				</Card>
			{:else}
				<FileSystemCard {fs} />
			{/if}
		</div>
	{/each}
</div>
