<script lang="ts">
	import { cubicInOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { formatDistanceToNowStrict } from 'date-fns/formatDistanceToNowStrict';
	import { sub } from 'date-fns/sub';
	import { invalidate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	import { formatEta } from '$lib/util';
	import SizeStatCard from '$lib/components/SizeStatCard.svelte';
	import StatCard from '$lib/components/StatCard.svelte';
	import TransferCard from '$lib/components/TransferCard.svelte';

	import type { PageServerData } from './$types';
	import PageTitle from '$lib/components/PageTitle.svelte';

	export let data: PageServerData;

	let autoRefresh = true;
	let timer: ReturnType<typeof setInterval> | null = null;
	let count = 0;

	$: version = data.version;
	$: stats = data.stats;
	$: uptime = formatDistanceToNowStrict(sub(new Date(), { seconds: stats.elapsedTime }));
	$: eta = formatEta(stats.eta);
	$: transferring = stats.transferring;

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
</script>

<PageTitle title="Dashboard">
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
	<div
		class="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
	>
		<StatCard label="Version" value={version.version} />
		<StatCard label="Uptime" value={uptime} />
		<SizeStatCard label="Discovered Size" bytes={stats.totalBytes} />
		<SizeStatCard label="Transferred Size" bytes={stats.bytes} />
		<SizeStatCard label="Speed" bytes={stats.speed} unitSuffix="/s" />
		<StatCard label="Errors" value={stats.errors} />
		<StatCard label="Checks" value={stats.checks} />
		<StatCard label="Transfers" value={stats.transfers} />
		<StatCard label="Deletes" value={stats.deletes} />
		<StatCard label="Renames" value={stats.renames} />
		{#if stats.transferring && eta}
			<StatCard label="ETA" value={eta} class="sm:col-span-2" />
		{/if}
	</div>

	<div
		class="mt-16 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4"
	>
		{#if transferring}
			{#each transferring as transfer (transfer.name)}
				<div
					style="order: {transfer.id};"
					in:scale={{ delay: 250, duration: 200, easing: cubicInOut }}
					out:scale={{ duration: 200, easing: cubicInOut }}
					animate:flip={{ delay: 250, duration: 200, easing: cubicInOut }}
				>
					<TransferCard {transfer} />
				</div>
			{/each}
		{/if}
	</div>
</div>
