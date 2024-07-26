<script lang="ts">
	import { fade, scale, slide } from 'svelte/transition';

	import type { Torrent } from '$lib/models/torrent';
	import { formatEta, formatSize, formatSpeed } from '$lib/util';

	import Card from './Card.svelte';
	import Progress from './Progress.svelte';

	export let torrentsPromise: Promise<Torrent[]>;

	let loading = true;
	let torrents: Torrent[] = [];
	let error = '';

	$: torrentsPromise, setup();

	function setup() {
		torrentsPromise
			.then((newTorrents) => {
				torrents = newTorrents;
				loading = false;
				error = '';
			})
			.catch((err) => {
				console.error(err);
				error = err.message;
			});
	}
</script>

{#if error}
	<div transition:scale>
		<Card>
			<svelte:fragment slot="header">Torrents Error</svelte:fragment>
			{error}
		</Card>
	</div>
{/if}

<Card class={$$props.class ?? ''}>
	<svelte:fragment slot="header">Torrents</svelte:fragment>

	<div class="flex flex-col">
		<div class="grid grid-cols-[4fr_1fr_2fr_2fr_3fr_auto] items-center gap-x-4">
			{#if loading}
				<div class="spinner"></div>
			{/if}
			{#each torrents as torrent (torrent.id)}
				<div class="text-nowrap text-ellipsis overflow-hidden" transition:slide>
					{torrent.name}
				</div>
				<div class="text-nowrap text-ellipsis overflow-hidden" transition:slide>
					{#if torrent.isFinished || torrent.isStalled}
						---
					{:else}
						{@const conns = `${torrent.peersSendingToUs} / ${torrent.peersConnected}`}
						{#key conns}
							<span in:fade>
								{conns}
							</span>
						{/key}
					{/if}
				</div>
				<div class="text-nowrap text-ellipsis overflow-hidden" transition:slide>
					{#if torrent.isFinished || torrent.isStalled}
						---
					{:else}
						{@const eta = formatEta(torrent.eta)}
						{#key eta}
							<span in:fade>
								{eta}
							</span>
						{/key}
					{/if}
				</div>
				<div class="text-right text-nowrap text-ellipsis overflow-hidden" transition:slide>
					{#if torrent.isFinished || torrent.isStalled}
						---
					{:else}
						{@const speed = formatSpeed(torrent.rateDownload)}
						{#key speed}
							<span in:fade>
								{speed}
							</span>
						{/key}
					{/if}
				</div>
				<div class="text-nowrap text-right" transition:slide>
					<Progress total={1} progress={torrent.percentDone} class="w-full" />
				</div>
				<div class="text-nowrap">
					{formatSize(torrent.sizeWhenDone)}
				</div>
			{/each}
		</div>
	</div>
</Card>
