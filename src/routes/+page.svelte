<script lang="ts">
	import { formatDistanceToNowStrict } from 'date-fns/formatDistanceToNowStrict';
	import { sub } from 'date-fns/sub';
	import { invalidate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	import { formatEta } from '$lib/util';
	import TransferCardList from '$lib/components/TransferCardList.svelte';
	import DeviceCardList from '$lib/components/DeviceCardList.svelte';
	import SizeStatCard from '$lib/components/SizeStatCard.svelte';
	import StatCard from '$lib/components/StatCard.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';

	import type { PageServerData } from './$types';

	export let data: PageServerData;

	let autoRefresh = false;
	let timer: ReturnType<typeof setInterval> | null = null;
	let count = 0;

	$: devicesProm = data.omv.devices;
	$: smartDevicesProm = data.omv.smartDevices;
	$: fileSystemsProm = data.omv.fileSystems;
	$: containersProm = data.omv.containers;
	$: versionProm = data.rclone.version;
	$: statsProm = data.rclone.stats;

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

	function formatUptime(elapsedSeconds: number) {
		return formatDistanceToNowStrict(sub(new Date(), { seconds: elapsedSeconds }));
	}
</script>

<PageTitle title="Dashboard" class="mb-4">
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
	<PageTitle title="OMV" class="mb-4" />
	<DeviceCardList
		devices={devicesProm}
		smartDevices={smartDevicesProm}
		fileSystems={fileSystemsProm}
	/>

	<PageTitle title="rclone" class="mt-8 mb-4" />
	<div
		class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-4"
	>
		<StatCard label="Version" value={versionProm.then((v) => v.version)} />
		<StatCard label="Uptime" value={statsProm.then((s) => formatUptime(s.elapsedTime))} />
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
	</div>

	<TransferCardList stats={statsProm} />
</div>
