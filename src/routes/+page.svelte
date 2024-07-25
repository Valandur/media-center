<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	import { formatEta } from '$lib/util';
	import ArmJobsCardList from '$lib/components/ArmJobsCardList.svelte';
	import ContainersCard from '$lib/components/ContainersCard.svelte';
	import DevicesCard from '$lib/components/DevicesCard.svelte';
	import FileSystemsCard from '$lib/components/FileSystemsCard.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import SizeStatCard from '$lib/components/SizeStatCard.svelte';
	import StatCard from '$lib/components/StatCard.svelte';
	import TorrentsCard from '$lib/components/TorrentsCard.svelte';
	import TransfersCardList from '$lib/components/TransfersCardList.svelte';

	import type { PageServerData } from './$types';

	export let data: PageServerData;

	let autoRefresh = browser
		? localStorage
			? localStorage.getItem('auto-refresh') === 'true'
			: false
		: true;
	let timer: ReturnType<typeof setInterval> | null = null;
	let count = 0;

	$: devicesPromise = data.omv.devices;
	$: smartDevicesPromise = data.omv.smartDevices;
	$: fileSystemsPromise = data.omv.fileSystems;
	$: containersPromise = data.omv.containers;
	$: statsProm = data.rclone.stats;
	$: jobsPromise = data.arm.jobs;
	$: torrentsPromise = data.transmission.torrents;

	$: autoRefresh, setupAutoRefresh();

	onMount(() => {
		return () => {
			if (timer !== null) {
				clearInterval(timer);
				timer = null;
			}
		};
	});

	function setupAutoRefresh() {
		if (!browser) {
			return;
		}

		if (localStorage) {
			localStorage.setItem('auto-refresh', autoRefresh ? 'true' : 'false');
		}

		if (timer !== null) {
			clearInterval(timer);
			timer = null;
		}
		if (autoRefresh) {
			timer = setInterval(refresh, 2000);
		}
	}

	function refresh() {
		count = count + 1;
		invalidate('stats');
	}
</script>

<PageTitle title="Dashboard" class="mb-2">
	<label class="inline-flex items-center space-x-2">
		<span>Auto Refresh</span>
		<input
			type="checkbox"
			bind:checked={autoRefresh}
			class="appearance-none w-10 h-6 rounded-full bg-no-repeat switch"
		/>
	</label>

	<button class="ms-4" on:click={refresh}>
		<i
			class="fa-solid fa-arrows-rotate transition-transform duration-500 ease-in-out rotate-180"
			style="transform: rotate({count * 360}deg);"
		></i>
	</button>
</PageTitle>

<div class="flex-1 overflow-auto">
	<div class="grid-data mb-4">
		<DevicesCard {devicesPromise} {smartDevicesPromise} />
		<FileSystemsCard {fileSystemsPromise} />
		<ContainersCard {containersPromise} />

		<SizeStatCard label="Discovered Size" bytes={statsProm.then((s) => s.totalBytes)} />
		<SizeStatCard label="Transferred Size" bytes={statsProm.then((s) => s.bytes)} />
		<SizeStatCard label="Speed" bytes={statsProm.then((s) => s.speed)} unitSuffix="/s" />
		<StatCard label="Errors" value={statsProm.then((s) => s.errors)} />
		<StatCard label="Checks" value={statsProm.then((s) => s.checks)} />
		<StatCard label="Transfers" value={statsProm.then((s) => s.transfers)} />
		<StatCard label="Deletes" value={statsProm.then((s) => s.deletes)} />
		<StatCard label="Renames" value={statsProm.then((s) => s.renames)} />
		<StatCard
			label="ETA"
			value={statsProm.then((s) => (s.transferring ? formatEta(s.eta) : '- No transfers -'))}
			class="sm:col-span-2"
		/>

		<TorrentsCard {torrentsPromise} />
	</div>

	<TransfersCardList stats={statsProm} />

	<ArmJobsCardList {jobsPromise} />
</div>
