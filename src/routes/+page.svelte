<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	import ArmJobsCardList from '$lib/components/ArmJobsCardList.svelte';
	import ContainersCard from '$lib/components/ContainersCard.svelte';
	import DevicesCard from '$lib/components/DevicesCard.svelte';
	import FileSystemsCard from '$lib/components/FileSystemsCard.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import TorrentsCard from '$lib/components/TorrentsCard.svelte';
	import TransfersCard from '$lib/components/TransfersCard.svelte';
	import StatCard from '$lib/components/StatCard.svelte';
	import SizeStatCard from '$lib/components/SizeStatCard.svelte';

	import type { PageServerData } from './$types';

	const AUTO_REFRESH_INTERVAL = 5000;

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
	$: transfersPromise = data.rclone.stats.then((s) => s.transferring ?? []);
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
			timer = setInterval(refresh, AUTO_REFRESH_INTERVAL);
		}
	}

	function refresh() {
		count = count + 1;
		invalidate('mc:stats');
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

<div class="flex-1 flex flex-row gap-4 overflow-auto">
	<div
		class="flex-grow basis-2/3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 auto-rows-max gap-4"
	>
		<TorrentsCard {torrentsPromise} class="col-span-4" />

		<StatCard label="Total Checks" value={data.rclone.stats.then((s) => s.totalChecks)} right />
		<StatCard
			label="Total Transfers"
			value={data.rclone.stats.then((s) => s.totalTransfers)}
			right
		/>
		<SizeStatCard
			label="Speed"
			value={data.rclone.stats.then((s) => s.speed)}
			unitSuffix="/s"
			right
		/>
		<StatCard label="Errors" value={data.rclone.stats.then((s) => s.errors)} right />

		<TransfersCard {transfersPromise} class="col-span-4" />

		<ArmJobsCardList {jobsPromise} class="row-span-2" />
	</div>

	<div class="flex-grow basis-1/3 flex flex-col gap-4">
		<ContainersCard {containersPromise} />

		<FileSystemsCard {fileSystemsPromise} />

		<DevicesCard {devicesPromise} {smartDevicesPromise} />
	</div>
</div>
