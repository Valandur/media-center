<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';

	import type { Source } from '$lib/models/kopia';
	import { formatSize } from '$lib/util';

	import Card from './Card.svelte';
	import Progress from './Progress.svelte';
	import TextWithTooltip from './TextWithTooltip.svelte';
	import MultiProgress from './MultiProgress.svelte';

	export let sourcesPromise: Promise<Source[]>;

	let loading = true;
	let sources: Source[] = [];
	let error = '';

	$: sourcesPromise, setup();

	function setup() {
		sourcesPromise
			.then((newSources) => {
				sources = newSources;
				loading = false;
				error = '';
			})
			.catch((err) => {
				console.error(err);
				sources = [];
				loading = false;
				error = err.message;
			});
	}
</script>

<Card class="mt-4">
	<div class="flex flex-row justify-between" slot="header">
		<div>Backups</div>
	</div>

	<div
		class="grid grid-cols-[auto_1fr] sm:grid-cols-[1fr_1fr_auto_auto_2fr_auto] items-center gap-x-2"
	>
		{#each sources as item (item.source.path)}
			{@const isOk = item.status === 'UPLOADING'}

			<div class="sm:hidden">Path</div>
			<div class="truncate text-right sm:text-left" transition:slide>
				<TextWithTooltip text={item.source.path} />
			</div>

			<div class="sm:hidden">Last Snapshot</div>
			<div class="truncate text-right sm:text-left" transition:slide>
				{#if item.lastSnapshot}
					{#key item.lastSnapshot.startTime}
						<div class="truncate" in:fade>
							<TextWithTooltip
								text={formatDistanceToNow(item.lastSnapshot.startTime, { addSuffix: true })}
							/>
						</div>
					{/key}
				{/if}
			</div>

			<div class="sm:hidden">Status</div>
			<div class="text-right sm:text-left" transition:slide>
				<span class="badge" class:bg-success={isOk} class:bg-warning={!isOk}>
					{item.status}
				</span>
			</div>

			{#if item.upload}
				<div class="sm:hidden">Uploaded</div>
				<div class="truncate text-right" transition:slide>
					{#key item.upload.uploadedBytes}
						<div class="truncate" in:fade>
							<TextWithTooltip text={formatSize(item.upload.uploadedBytes)} />
						</div>
					{/key}
				</div>

				<div class="col-span-2 sm:col-span-1" transition:slide>
					<MultiProgress
						total={item.upload.estimatedBytes}
						progress={[
							{ color: 'bg-accent', progress: item.upload.uploadedBytes },
							{ color: 'bg-info', progress: item.upload.hashedBytes }
						]}
					/>
				</div>
			{:else}
				<div class="sm:hidden">Next Snapshot</div>
				<div class="truncate text-right" in:fade>
					{#if item.nextSnapshotTime}
						{#key item.nextSnapshotTime}
							<TextWithTooltip
								text={formatDistanceToNow(item.nextSnapshotTime, { addSuffix: true })}
							/>
						{/key}
					{/if}
				</div>

				<div class="sm:hidden">Files</div>
				<div class="truncate text-right" in:fade>
					{#if item.lastSnapshot}
						{#key item.lastSnapshot.rootEntry.summ.files}
							<TextWithTooltip text={`${item.lastSnapshot.rootEntry.summ.files}`} />
						{/key}
						<span class="hidden sm:inline-block">files</span>
					{/if}
				</div>
			{/if}

			<div class="sm:hidden">Size</div>
			<div class="truncate text-right" transition:slide>
				{#if item.upload}
					{#key item.upload.estimatedBytes}
						<div class="truncate" in:fade>
							<TextWithTooltip text={formatSize(item.upload.estimatedBytes)} />
						</div>
					{/key}
				{:else if item.lastSnapshot}
					{#key item.lastSnapshot.rootEntry.summ.size}
						<div class="truncate" in:fade>
							<TextWithTooltip text={formatSize(item.lastSnapshot.rootEntry.summ.size)} />
						</div>
					{/key}
				{/if}
			</div>

			<div class="sm:hidden last:hidden border-b border-primary/30 col-span-2 -mx-4 my-2"></div>
		{/each}
	</div>
</Card>
