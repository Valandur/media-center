<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

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

	const AUTO_REFRESH_INTERVAL = 10000;

	export let data: PageServerData;

	let autoRefresh = browser
		? localStorage
			? localStorage.getItem('auto-refresh') === 'true'
			: false
		: true;
	let timer: ReturnType<typeof setInterval> | null = null;
	let count = 0;
	let torrent = '';
	let showAddTorrent = false;
	let addTorrentError = '';

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

	async function onAddTorrent() {
		try {
			addTorrentError = '';
			const res = await fetch('/api/transmission', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ torrent })
			});
			const data = await res.json();
			if (res.status !== 200) {
				if (data && 'message' in data) {
					throw new Error(data.message);
				}
				throw new Error('Could not add torrent: ' + res.statusText);
			}
			torrent = '';
			showAddTorrent = false;
		} catch (err) {
			console.error(err);
			addTorrentError = (err as Error).message;
		}
	}
</script>

<div class="flex flex-row items-center gap-4 mb-2">
	<h3 class="text-lg font-medium">Dashboard</h3>

	<div>
		<button
			type="button"
			class="btn btn-primary btn-small"
			on:click={() => (showAddTorrent = true)}
		>
			<i class="fa-solid fa-plus"></i> Add Torrent
		</button>
	</div>

	<div class="flex-1"></div>

	<label class="inline-flex items-center gap-2">
		<span>Auto Refresh</span>
		<input
			type="checkbox"
			bind:checked={autoRefresh}
			class="appearance-none w-10 h-6 rounded-full bg-no-repeat switch"
		/>
	</label>

	<button class="btn btn-primary btn-small" on:click={refresh}>
		<i
			class="fa-solid fa-arrows-rotate transition-transform duration-500 ease-in-out rotate-180"
			style="transform: rotate({count * 360}deg);"
		></i>
	</button>
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
			<StatCard label="Updates" value={sysInfo.availablePkgUpdates} right />
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

		<JellyfinSessions {jellyfinPromise} />

		<TransmissionTorrents {torrentsPromise} />

		<RcloneTransfers {transfersPromise} />

		<ArmJobs {jobsPromise} />
	</div>

	<div class="flex-grow basis-1/3 flex flex-col gap-4">
		<div class="flex flex-row gap-4">
			<StatCard
				label="CPU"
				value={sysInfo.cpuUtilization.toFixed(1)}
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
				value={(Number(sysInfo.memUtilization) * 100).toFixed(1)}
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

{#if showAddTorrent}
	<button
		class="fixed top-0 left-0 right-0 bottom-0 bg-dark/95 flex flex-col items-center justify-center z-20"
		transition:fade
		on:click={() => (showAddTorrent = false)}
	>
		<div
			class="flex flex-row items-center justify-center text-primary cursor-default"
			role="button"
			on:click|stopPropagation
			on:keydown|stopPropagation
			tabindex={0}
		>
			<div class="border border-primary/75 bg-dark">
				<div class="border-b border-primary/75 p-4 uppercase">Add a torrent</div>
				<div class="p-4">
					{#if addTorrentError}
						<div class="text-error">
							{addTorrentError}
						</div>
					{/if}

					<form class="flex flex-col gap-2" on:submit|preventDefault|stopPropagation={onAddTorrent}>
						<input type="text" placeholder="Torrent" class="input w-96 me-2" bind:value={torrent} />
						<button type="submit" class="btn btn-primary">
							<i class="fa-solid fa-plus"></i> Add Torrent
						</button>
					</form>
				</div>
			</div>
		</div>
	</button>
{/if}
