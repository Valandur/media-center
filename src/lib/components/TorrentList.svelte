<script lang="ts">
	import type { QueueItem as RadarrQueueItem } from '$lib/models/radarr';
	import type { QueueItem as SonarrQueueItem } from '$lib/models/sonarr';
	import { Status, type Torrent } from '$lib/models/transmission';
	import { beautifyName, formatEta, formatSize, formatSpeed } from '$lib/util';
	import { fade, slide } from 'svelte/transition';
	import { browser } from '$app/environment';

	import Card from './Card.svelte';
	import Progress from './Progress.svelte';
	import TextWithTooltip from './TextWithTooltip.svelte';

	interface Item {
		id: string;
		torrent?: Torrent;
		radarr?: RadarrQueueItem;
		sonarrs?: SonarrQueueItem[];
	}

	export let torrentsPromise: Promise<Torrent[]>;
	export let radarrQueuePromise: Promise<RadarrQueueItem[]>;
	export let sonarrQueuePromise: Promise<SonarrQueueItem[]>;

	let loading = true;
	let items: Item[] = [];
	let error = '';
	let showSeeding = browser
		? localStorage
			? localStorage.getItem('seeding') === 'true'
			: false
		: true;

	$: torrentsPromise, setupTorrents();
	$: radarrQueuePromise, setupRadarr();
	$: sonarrQueuePromise, setupSonarr();
	$: pending = items.reduce(
		(t, i) => t + (i.torrent ? (1 - i.torrent.percentDone) * i.torrent.sizeWhenDone : 0),
		0
	);
	$: browser ? localStorage?.setItem('seeding', showSeeding ? 'true' : 'false') : null;

	function sort(a: Item, b: Item) {
		if (a.torrent && b.torrent && a.torrent.status !== b.torrent.status) {
			return Status[a.torrent.status].localeCompare(Status[b.torrent.status]);
		}

		const aName =
			a.radarr?.movie.title ?? a.sonarrs?.[0].series.title ?? beautifyName(a.torrent?.name ?? '');
		const bName =
			b.radarr?.movie.title ?? b.sonarrs?.[0].series.title ?? beautifyName(b.torrent?.name ?? '');
		return aName.localeCompare(bName);
	}

	function setupTorrents() {
		torrentsPromise
			.then((newTorrents) => {
				const newItems: Item[] = [...items.map(({ torrent, ...item }) => item)];
				for (const torrent of newTorrents) {
					const name = torrent.name.replace('.mkv', '');
					const index = newItems.findIndex((item) => item.id === name);
					if (index >= 0) {
						newItems[index].torrent = torrent;
					} else {
						newItems.push({ id: name, torrent });
					}
				}
				items = newItems
					.filter((i) => i.radarr || (i.sonarrs?.length ?? 0) > 0 || i.torrent)
					.sort(sort);
				loading = false;
				error = '';
			})
			.catch((err) => {
				console.error(err);
				loading = false;
				error = err.message;
			});
	}

	function setupRadarr() {
		radarrQueuePromise
			.then((newRadarrItems) => {
				const newItems: Item[] = [...items.map(({ radarr, ...item }) => item)];
				for (const radarrItem of newRadarrItems) {
					const name = radarrItem.title.replace('.mkv', '');
					const index = newItems.findIndex((item) => item.id === name);
					if (index >= 0) {
						newItems[index].radarr = radarrItem;
					} else {
						newItems.push({ id: name, radarr: radarrItem });
					}
				}
				items = newItems
					.filter((i) => i.radarr || (i.sonarrs?.length ?? 0) > 0 || i.torrent)
					.sort(sort);
				loading = false;
				error = '';
			})
			.catch((err) => {
				console.error(err);
				loading = false;
				error = err.message;
			});
	}

	function setupSonarr() {
		sonarrQueuePromise
			.then((newSonarrItems) => {
				const newItems: Item[] = [...items.map(({ sonarrs, ...item }) => item)];
				for (const sonarrItem of newSonarrItems) {
					const name = sonarrItem.title.replace('.mkv', '');
					const index = newItems.findIndex((item) => item.id === name);
					if (index >= 0) {
						newItems[index].sonarrs = (newItems[index].sonarrs ?? []).concat(sonarrItem);
					} else {
						newItems.push({ id: name, sonarrs: [sonarrItem] });
					}
				}
				items = newItems
					.filter((i) => i.radarr || (i.sonarrs?.length ?? 0) > 0 || i.torrent)
					.sort(sort);
				loading = false;
				error = '';
			})
			.catch((err) => {
				console.error(err);
				loading = false;
				error = err.message;
			});
	}
</script>

<Card class="mt-4">
	<div class="flex flex-row justify-between" slot="header">
		<div>Torrents</div>

		<div class="font-normal normal-case me-2">
			{#key pending}
				<span in:fade>
					{formatSize(pending)}
				</span>
			{/key}
			<span class="text-secondary">pend.</span>
		</div>

		<label class="inline-flex items-center gap-2 font-normal normal-case">
			<span>Seeds</span>
			<input
				type="checkbox"
				class="appearance-none w-10 h-6 rounded-full bg-no-repeat switch"
				bind:checked={showSeeding}
			/>
		</label>
	</div>

	<div
		class="grid grid-cols-[auto_1fr] sm:grid-cols-[3fr_auto_auto_2fr_1fr_1fr_auto_auto] items-center gap-x-2"
	>
		{#each items.filter((i) => showSeeding || i.torrent?.status !== Status.Seeding) as item (item.id)}
			{@const torrent = item.torrent}
			{@const radarr = item.radarr}
			{@const sonarrs = item.sonarrs}

			<div class="sm:hidden">Name</div>
			<div class="truncate text-right sm:text-left" transition:slide>
				{#if radarr}
					<TextWithTooltip text={radarr.movie.title} />
				{:else if sonarrs && sonarrs.length > 0}
					{@const seasonMin = Math.min(...sonarrs.map((s) => s.seasonNumber))}
					{@const seasonMax = Math.max(...sonarrs.map((s) => s.seasonNumber))}
					{@const episodeMin = Math.min(...sonarrs.map((s) => s.episodeNumber))}
					{@const episodeMax = Math.max(...sonarrs.map((s) => s.episodeNumber))}

					{#if seasonMin !== seasonMax}
						<TextWithTooltip text="{sonarrs[0].series.title} | S{seasonMin} - S{seasonMax}" />
					{:else if episodeMin !== episodeMax}
						<TextWithTooltip
							text="{sonarrs[0].series.title} | S{seasonMin} | E{episodeMin} - E{episodeMax}"
						/>
					{:else}
						<TextWithTooltip text="{sonarrs[0].series.title} | S{seasonMin} | E{episodeMin}" />
					{/if}
				{:else if torrent}
					<TextWithTooltip text={beautifyName(torrent.name)} />
				{:else}
					-- Unknown --
				{/if}
			</div>

			<div class="sm:hidden">Status</div>
			<div class="text-right sm:text-left" transition:slide>
				{#if torrent}
					{@const status = Status[torrent.status]}
					{@const isOk = status === 'Downloading' || status === 'Seeding'}
					<span class="badge" class:bg-success={isOk} class:bg-warning={!isOk}>
						{status}
					</span>
				{/if}
			</div>

			<div class="sm:hidden">Peers</div>
			<div class="text-right sm:text-left" transition:slide>
				{#if torrent}
					{#if torrent.status === Status.Downloading}
						{torrent.peersSendingToUs}/{torrent.peersConnected}
					{:else if torrent.status === Status.Seeding}
						{torrent.peersGettingFromUs}/{torrent.peersConnected}
					{:else}
						{torrent.peersConnected}
					{/if}
				{/if}
			</div>

			<div class="col-span-2 sm:col-span-1" transition:slide>
				{#if torrent}
					<Progress total={1} progress={torrent.percentDone} />
				{:else if radarr}
					<Progress total={radarr.size} remaining={radarr.sizeleft} />
				{:else if sonarrs && sonarrs.length > 0}
					<Progress total={sonarrs[0].size} remaining={sonarrs[0].sizeleft} />
				{/if}
			</div>

			<div class="sm:hidden">Speed</div>
			<div class="truncate text-right sm:text-left" transition:slide>
				{#if torrent}
					{#if torrent.status === Status.Downloading}
						{@const speed = formatSpeed(torrent.rateDownload)}
						{#key speed}
							<div class="truncate" in:fade>
								<TextWithTooltip text={speed} />
							</div>
						{/key}
					{:else if torrent.status === Status.Seeding}
						{@const speed = formatSpeed(torrent.rateUpload)}
						{#key speed}
							<div class="truncate" in:fade>
								<TextWithTooltip text={speed} />
							</div>
						{/key}
					{/if}
				{/if}
			</div>

			<div class="sm:hidden">ETA</div>
			<div class="truncate text-right sm:text-left" transition:slide>
				{#if torrent}
					{@const eta = torrent.eta < 0 ? null : formatEta(torrent.eta)}
					{@const etaIdle = torrent.etaIdle < 0 ? null : formatEta(torrent.etaIdle)}
					{@const val = eta ?? etaIdle ?? '---'}

					{#key val}
						<div class="truncate" in:fade>
							<TextWithTooltip text={val} />
						</div>
					{/key}
				{/if}
			</div>

			<div class="sm:hidden">Type</div>
			<div class="text-right sm:text-left" transition:slide>
				{#if radarr}
					<span class="badge bg-info">Movie</span>
					<span class="badge bg-secondary">
						{radarr.quality.quality.name}
					</span>
				{:else if sonarrs && sonarrs.length > 0}
					<span class="badge bg-success">Series</span>
					<span class="badge bg-secondary">
						{sonarrs[0].quality.quality.name}
					</span>
				{:else}
					<span class="badge bg-warning">Custom</span>
				{/if}
			</div>

			<div class="sm:hidden">Size</div>
			<div class="truncate text-right" transition:slide>
				{#if torrent}
					<TextWithTooltip text={formatSize(torrent.sizeWhenDone)} />
				{:else if radarr}
					<TextWithTooltip text={formatSize(radarr.size)} />
				{:else if sonarrs && sonarrs.length > 0}
					<TextWithTooltip text={formatSize(sonarrs[0].size)} />
				{/if}
			</div>

			<div class="sm:hidden last:hidden border-b border-primary/30 col-span-2 -mx-4 my-2"></div>
		{/each}
	</div>
</Card>
