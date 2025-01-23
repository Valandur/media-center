<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { differenceInMinutes } from 'date-fns/differenceInMinutes';
	import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';

	import type { FileSystem } from '$lib/models/omv';
	import { formatSize } from '$lib/util';

	import Card from './Card.svelte';
	import Progress from './Progress.svelte';
	import TextWithTooltip from './TextWithTooltip.svelte';

	export let fileSystemsPromise: Promise<FileSystem[]>;

	let loading = true;
	let fileSystems: FileSystem[] = [];
	let error = '';
	let lastUpdate = new Date(0);

	$: fileSystemsPromise, setup();
	$: diffInMinutes = differenceInMinutes(new Date(), lastUpdate);

	function setup() {
		fileSystemsPromise
			.then((newFileSystems) => {
				fileSystems = newFileSystems;
				loading = false;
				lastUpdate = new Date();
				error = '';
			})
			.catch((err) => {
				console.error(err);
				loading = false;
				error = err.message;
			});
	}
</script>

<Card class={$$props.class ?? ''}>
	<svelte:fragment slot="header">
		<div class="flex flex-row items-center justify-between">
			<div>File Systems</div>
			{#if !loading && diffInMinutes > 1}
				<div class="badge bg-warning">{formatDistanceToNow(lastUpdate, { addSuffix: true })}</div>
			{/if}
		</div>
	</svelte:fragment>

	<div class="flex flex-col">
		<div
			class="grid grid-cols-[auto_1fr] sm:grid-cols-[auto_auto_auto_1fr_auto] items-center gap-x-4"
		>
			{#if loading}
				<div class="spinner"></div>
			{:else if error && diffInMinutes > 2}
				<div class="text-error text-xl font-bold">{error}</div>
			{/if}

			{#each fileSystems as fs (fs.devicename)}
				{@const used = formatSize(Number(fs.size) - Number(fs.available))}
				<div class="sm:hidden">Name</div>
				<div class="truncate text-right sm:text-left" transition:slide>
					<TextWithTooltip text={fs.devicename} />
				</div>

				<div class="sm:hidden">Type</div>
				<div class="truncate text-right sm:text-left" transition:slide>
					<TextWithTooltip text={fs.type} />
				</div>

				<div class="sm:hidden">Used</div>
				<div class="text-nowrap text-right" transition:slide>
					{#key used}
						<div in:fade>
							{used}
						</div>
					{/key}
				</div>

				<div class="col-span-2 sm:col-span-1" transition:slide>
					<Progress total={Number(fs.size)} remaining={Number(fs.available)} colorProgress />
				</div>

				<div class="sm:hidden">Total</div>
				<div class="text-nowrap text-right sm:text-left" transition:slide>
					{formatSize(Number(fs.size))}
				</div>

				<div class="sm:hidden last:hidden border-b border-primary/30 col-span-2 -mx-4 my-2"></div>
			{/each}
		</div>
	</div>
</Card>
