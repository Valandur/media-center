<script lang="ts">
	import { fade, slide } from 'svelte/transition';

	import type { FileSystem } from '$lib/models/file-system';
	import { formatSize } from '$lib/util';

	import Card from './Card.svelte';
	import Progress from './Progress.svelte';

	export let fileSystemsPromise: Promise<FileSystem[]>;

	let loading = true;
	let fileSystems: FileSystem[] = [];
	let error = '';

	$: fileSystemsPromise, setup();

	function setup() {
		fileSystemsPromise
			.then((newFileSystems) => {
				fileSystems = newFileSystems;
				loading = false;
			})
			.catch((err) => {
				console.error(err);
				error = err.message;
			});
	}
</script>

{#if error}
	<Card>
		<svelte:fragment slot="header">Error</svelte:fragment>
		{error}
	</Card>
{/if}

<Card class={$$props.class ?? ''}>
	<svelte:fragment slot="header">File Systems</svelte:fragment>

	<div class="flex flex-col">
		<div class="grid grid-cols-[auto_auto_auto_1fr_auto] items-center gap-x-4">
			{#if loading}
				<div class="spinner"></div>
			{/if}
			{#each fileSystems as fs (fs.devicename)}
				{@const used = formatSize(Number(fs.size) - Number(fs.available))}
				<div class="text-nowrap text-ellipsis overflow-hidden" transition:slide>
					{fs.devicename}
				</div>
				<div class="text-nowrap text-ellipsis overflow-hidden" transition:slide>
					{fs.type}
				</div>
				<div class="text-nowrap text-right" transition:slide>
					{#key used}
						<div in:fade>
							{used}
						</div>
					{/key}
				</div>
				<div class="text-nowrap text-ellipsis overflow-hidden" transition:slide>
					<Progress total={Number(fs.size)} remaining={Number(fs.available)} colorProgress />
				</div>
				<div class="text-nowrap text-ellipsis overflow-hidden text-right" transition:slide>
					{formatSize(Number(fs.size))}
				</div>
			{/each}
		</div>
	</div>
</Card>
