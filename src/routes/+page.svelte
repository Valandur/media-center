<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	import ArmJobs from '$lib/components/ArmJobs.svelte';
	import JellyfinSessions from '$lib/components/JellyfinSessions.svelte';
	import OMVDevicesCard from '$lib/components/OMVDevicesCard.svelte';
	import OMVDockerServicesCard from '$lib/components/OMVDockerServicesCard.svelte';
	import OMVFileSystemsCard from '$lib/components/OMVFileSystemsCard.svelte';
	import RcloneTransfers from '$lib/components/RcloneTransfers.svelte';
	import SizeStatCard from '$lib/components/SizeStatCard.svelte';
	import StatCard from '$lib/components/StatCard.svelte';
	import TransmissionTorrents from '$lib/components/TransmissionTorrents.svelte';

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

	$: sysInfo = data.omv.sysInfo;
	$: cpuTempPrommise = data.omv.cpuTemp;
	$: devicesPromise = data.omv.devices;
	$: smartDevicesPromise = data.omv.smartDevices;
	$: fileSystemsPromise = data.omv.fileSystems;
	$: servicesPromise = data.omv.services;
	$: zfsStats = data.omv.zfsStats;
	$: statsPromise = data.rclone.stats;
	$: transfersPromise = statsPromise.then((s) => s.transferring ?? []);
	$: jobsPromise = data.arm.jobs;
	$: torrentsPromise = data.transmission.torrents;
	$: nextcloudPromise = data.nextcloud.info;
	$: jellyfinPromise = data.jellyfin.info;

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

<div class="flex items-center justify-between mb-2">
	<h3 class="text-lg font-medium">Dashboard</h3>

	<div class="flex">
		<label class="inline-flex items-center space-x-2">
			<span>Auto Refresh</span>
			<input
				type="checkbox"
				bind:checked={autoRefresh}
				class="appearance-none w-10 h-6 rounded-full bg-no-repeat switch"
			/>
		</label>

		<button class="btn btn-primary btn-small ms-4" on:click={refresh}>
			<i
				class="fa-solid fa-arrows-rotate transition-transform duration-500 ease-in-out rotate-180"
				style="transform: rotate({count * 360}deg);"
			></i>
		</button>
	</div>
</div>

<div class="flex-1 flex flex-row gap-4 overflow-auto">
	<div class="flex flex-col flex-grow basis-2/3">
		<div class="grid grid-cols-6 auto-rows-max gap-4">
			<StatCard label="Rclone Checks" value={statsPromise.then((s) => s.totalChecks)} right />
			<StatCard label="Rclone Transfers" value={statsPromise.then((s) => s.totalTransfers)} right />
			<SizeStatCard
				label="Rclone Speed"
				value={statsPromise.then((s) => s.speed)}
				unitSuffix="/s"
				right
			/>
			<StatCard label="Rclone Errors" value={statsPromise.then((s) => s.errors)} right />
			<StatCard label="Updates" value={sysInfo.then((s) => s.availablePkgUpdates)} right />
			<StatCard
				label="ZFS cache hits"
				value={zfsStats.then((zfs) => zfs.ratio.toFixed(1))}
				suffix="%"
				right
			/>

			<SizeStatCard
				label="Nextcloud DB"
				value={nextcloudPromise.then((i) => Number(i.server.database.size))}
				right
			/>
			<StatCard
				label="Nextcloud Files"
				value={nextcloudPromise.then((i) => i.nextcloud.storage.num_files)}
				right
			/>
			<StatCard
				label="Nextcloud Shares"
				value={nextcloudPromise.then((i) => i.nextcloud.shares.num_shares)}
				right
			/>
		</div>

		<JellyfinSessions {jellyfinPromise} class="mt-4" />

		<TransmissionTorrents {torrentsPromise} class="mt-4" />

		<RcloneTransfers {transfersPromise} class="mt-4" />

		<ArmJobs {jobsPromise} class="mt-4" />
	</div>

	<div class="flex-grow basis-1/3 flex flex-col gap-4">
		<div class="flex flex-row gap-4">
			<StatCard
				label="CPU"
				value={sysInfo.then((s) => s.cpuUtilization.toFixed(1))}
				suffix="%"
				right
				class="flex-1"
			/>
			<StatCard
				label="Temperature"
				value={cpuTempPrommise.then((temp) => temp.toFixed(1))}
				suffix="°C"
				right
				class="flex-1"
			/>
			<StatCard
				label="Memory"
				value={sysInfo.then((s) => (Number(s.memUtilization) * 100).toFixed(1))}
				suffix="%"
				right
				class="flex-1"
			/>
		</div>

		<OMVDockerServicesCard {servicesPromise} />

		<OMVFileSystemsCard {fileSystemsPromise} />

		<OMVDevicesCard {devicesPromise} {smartDevicesPromise} />
	</div>
</div>
