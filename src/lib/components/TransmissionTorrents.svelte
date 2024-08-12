<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import { flip } from 'svelte/animate';

	import { Status, type Torrent } from '$lib/models/torrent';
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
		<div transition:scale>
			<Card class="h-full">
				<svelte:fragment slot="header">Transmission Error</svelte:fragment>
				<div class="text-error text-xl font-bold">{error}</div>
			</Card>
		</div>
	{/if}

	{#each torrents as torrent (torrent.id)}
		<div
			style="order: {torrent.id};"
			in:scale={{ delay: 250, duration: 200, easing: cubicInOut }}
			out:scale={{ duration: 200, easing: cubicInOut }}
			animate:flip={{ delay: 250, duration: 200, easing: cubicInOut }}
		>
			<Card>
				<svelte:fragment slot="header">
					{torrent.name}
				</svelte:fragment>

				<div class="flex flex-col">
					{#if !torrent.isFinished}
						{@const eta = torrent.eta < 0 ? null : formatEta(torrent.eta)}
						{@const etaIdle = torrent.etaIdle < 0 ? null : formatEta(torrent.etaIdle)}
						{@const speed = formatSpeed(torrent.rateDownload)}
						{@const status = Status[torrent.status]}
						{@const dlPeers = `${torrent.peersSendingToUs} / ${torrent.peersConnected}`}
						{@const ulPeers = `${torrent.peersGettingFromUs}`}

						<div class="flex flex-row items-center justify-between gap-2">
							<div>Status</div>
							{#key status}
								<div in:fade>
									{status}
								</div>
							{/key}
						</div>

						{#if torrent.status === Status.Downloading}
							<div class="flex flex-row items-center justify-between gap-2">
								<div>Downloading from peers</div>
								{#key dlPeers}
									<div in:fade>
										{dlPeers}
									</div>
								{/key}
							</div>
						{:else if torrent.status === Status.Seeding}
							<div class="flex flex-row items-center justify-between gap-2">
								<div>Uploading to peers</div>
								{#key ulPeers}
									<div in:fade>
										{ulPeers}
									</div>
								{/key}
							</div>
						{/if}

						<div class="flex flex-row items-center justify-between gap-2 mt-4">
							{#key eta}
								<div in:fade>
									{eta ?? etaIdle ?? '---'}
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
