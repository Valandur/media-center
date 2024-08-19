<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import ArmJobs from '$lib/components/ArmJobs.svelte';
	import JellyfinSessions from '$lib/components/JellyfinSessions.svelte';
	import OmvDevicesCard from '$lib/components/OmvDevicesCard.svelte';
	import OmvComposeCard from '$lib/components/OmvComposeCard.svelte';
	import OmvFileSystemsCard from '$lib/components/OmvFileSystemsCard.svelte';
	import RcloneTransfers from '$lib/components/RcloneTransfers.svelte';
	import SizeStatCard from '$lib/components/SizeStatCard.svelte';
	import StatCard from '$lib/components/StatCard.svelte';
	import TorrentList from '$lib/components/TorrentList.svelte';

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
	let torrentInput: HTMLInputElement;

	$: sysInfo = data.omv.sysInfo;
	$: cpuTempPrommise = data.omv.cpuTemp;
	$: devicesPromise = data.omv.devices;
	$: smartDevicesPromise = data.omv.smartDevices;
	$: fileSystemsPromise = data.omv.fileSystems;
	$: zfsStats = data.omv.zfsStats;
	$: composePromise = data.omv.compose;
	$: statsPromise = data.rclone.stats;
	$: transfersPromise = statsPromise.then((s) => s.transferring ?? []);
	$: jobsPromise = data.arm.jobs;
	$: torrentsPromise = data.transmission.torrents;
	$: nextcloudPromise = data.nextcloud.info;
	$: jellyfinPromise = data.jellyfin.info;
	$: radarrQueuePromise = data.radarr.queue;
	$: sonarrQueuePromise = data.sonarr.queue;
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
			on:click={() => {
				showAddTorrent = true;
				requestAnimationFrame(() => torrentInput?.focus());
			}}
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

<div class="flex-1 flex flex-row-reverse flex-wrap lg:flex-nowrap gap-4 overflow-auto">
	<div class="flex-grow basis-1/3 flex flex-col gap-4">
		<OmvComposeCard {composePromise} />

		<OmvFileSystemsCard {fileSystemsPromise} />

		<OmvDevicesCard {devicesPromise} {smartDevicesPromise} />
	</div>

	<div class="flex flex-col flex-grow basis-2/3">
		<div class="grid grid-cols-3 xl:grid-cols-6 auto-rows-max gap-4">
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

			<StatCard label="Updates" value={sysInfo.then((s) => s.availablePkgUpdates)} right />

			<StatCard
				label="ZFS cache hits"
				value={zfsStats.then((zfs) => zfs.ratio.toFixed(1))}
				suffix="%"
				right
			/>

			<StatCard
				label="Nextcloud Shares"
				value={nextcloudPromise.then((i) => i.nextcloud.shares.num_shares)}
				right
			/>

			<StatCard label="Rclone Checks" value={statsPromise.then((s) => s.totalChecks)} right />

			<StatCard label="Rclone Transfers" value={statsPromise.then((s) => s.totalTransfers)} right />

			<SizeStatCard
				label="Rclone Speed"
				value={statsPromise.then((s) => s.speed)}
				unitSuffix="/s"
				right
			/>

			<SizeStatCard
				label="Torrent Download"
				value={torrentsPromise.then((t) => t.reduce((acc, t) => acc + t.rateDownload, 0))}
				unitSuffix="/s"
				right
			/>

			<SizeStatCard
				label="Torrent Upload"
				value={torrentsPromise.then((t) => t.reduce((acc, t) => acc + t.rateUpload, 0))}
				unitSuffix="/s"
				right
			/>

			<StatCard
				label="Nextcloud Files"
				value={nextcloudPromise.then((i) => i.nextcloud.storage.num_files)}
				right
			/>
		</div>

		<JellyfinSessions {jellyfinPromise} />

		<TorrentList {torrentsPromise} {radarrQueuePromise} {sonarrQueuePromise} />

		<RcloneTransfers {transfersPromise} />

		<ArmJobs {jobsPromise} />
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
						<input
							type="text"
							placeholder="Torrent"
							class="input w-96 me-2"
							bind:this={torrentInput}
							bind:value={torrent}
						/>
						<button type="submit" class="btn btn-primary">
							<i class="fa-solid fa-plus"></i> Add Torrent
						</button>
					</form>
				</div>
			</div>
		</div>
	</button>
{/if}
