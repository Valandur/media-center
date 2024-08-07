<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import { flip } from 'svelte/animate';

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
				torrents = [];
				loading = false;
				error = err.message;
			});
	}
</script>

<div class="grid grid-cols-3 auto-rows-max gap-4" class:mt-4={error || torrents.length > 0}>
	{#if error}
		<div class="col-span-4" transition:scale>
			<Card>
				<svelte:fragment slot="header">Transmission Error</svelte:fragment>
				<div class="text-error text-xl font-bold">{error}</div>
			</Card>
		</div>
	{/if}

	{#each torrents as torrent (torrent.id)}
		{@const lastSeperator = torrent.name.lastIndexOf('/')}
		{@const fileName = torrent.name.substring(lastSeperator + 1)}

		<div
			style="order: {torrent.id};"
			in:scale={{ delay: 250, duration: 200, easing: cubicInOut }}
			out:scale={{ duration: 200, easing: cubicInOut }}
			animate:flip={{ delay: 250, duration: 200, easing: cubicInOut }}
		>
			<Card>
				<svelte:fragment slot="header">
					{fileName}
				</svelte:fragment>

				<div class="flex flex-col">
					{#if !torrent.isFinished}
						{@const eta = formatEta(torrent.eta)}
						{@const speed = formatSpeed(torrent.rateDownload)}
						{@const conns = `${torrent.peersSendingToUs} / ${torrent.peersConnected}`}

						<div class="flex flex-row items-center justify-between gap-2 mb-4">
							<div>Downloading from peers</div>
							{#key conns}
								<div in:fade>
									{conns}
								</div>
							{/key}
						</div>

						<div class="flex flex-row items-center justify-between gap-2">
							{#key eta}
								<div in:fade>
									{eta}
								</div>
							{/key}

							{#key speed}
								<div in:fade>
									{speed}
								</div>
							{/key}
						</div>

						<Progress total={1} progress={torrent.percentDone} />

						<div class="flex flex-row items-center justify-between gap-2">
							<div>
								{formatSize(torrent.sizeWhenDone * torrent.percentDone)}
							</div>
							<div class="text-secondary">of</div>
							<div>
								{formatSize(torrent.sizeWhenDone)}
							</div>
						</div>
					{:else}
						<div class="font-bold">Complete</div>
					{/if}
				</div>
			</Card>
		</div>
	{/each}
</div>
