<script lang="ts">
	import { slide } from 'svelte/transition';

	import type { Torrent } from '$lib/models/transmission';
	import { formatEta, formatSize, formatSpeed } from '$lib/util';

	import Card from './Card.svelte';
	import Progress from './Progress.svelte';
	import { typewriter } from '$lib/transitions/typewriter';

	export let torrentsPromise: Promise<Torrent[]>;

	let loading = true;
	let torrents: Torrent[] = [];

	$: torrentsPromise, setup();

	function setup() {
		torrentsPromise.then((newContainers) => {
			torrents = newContainers;
			loading = false;
		});
	}
</script>

<Card
	class="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-6 row-span-2 {$$props.class}"
>
	<svelte:fragment slot="header">Torrents</svelte:fragment>

	<div class="flex flex-col">
		<div class="grid grid-cols-[4fr_1fr_1fr_3fr_auto] items-center gap-x-4">
			{#if loading}
				<div class="spinner"></div>
			{/if}
			{#each torrents as torrent (torrent.id)}
				<div class="text-nowrap text-ellipsis overflow-hidden" transition:slide>
					{torrent.name}
					{torrent.isStalled}
					{torrent.peersSendingToUs} / {torrent.peersConnected}
				</div>
				<div>
					{#if torrent.isFinished || torrent.isStalled}
						---
					{:else}
						{@const eta = formatEta(torrent.eta)}
						{#key eta}
							<span in:typewriter>
								{eta}
							</span>
						{/key}
					{/if}
				</div>
				<div>
					{#if torrent.isFinished || torrent.isStalled}
						---
					{:else}
						{@const speed = formatSpeed(torrent.rateDownload)}
						{#key speed}
							<span in:typewriter>
								{speed}
							</span>
						{/key}
					{/if}
				</div>
				<div class="text-nowrap text-right" transition:slide>
					<Progress total={1} progress={torrent.percentDone} class="w-full" />
				</div>
				<div>
					{formatSize(torrent.sizeWhenDone)}
				</div>
			{/each}
		</div>
	</div>
</Card>
