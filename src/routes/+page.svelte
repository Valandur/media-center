<script lang="ts">
	import { cubicInOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { formatDistanceToNowStrict } from 'date-fns/formatDistanceToNowStrict';
	import { sub } from 'date-fns/sub';
	import { invalidate } from '$app/navigation';
	import { browser } from '$app/environment';

	import { formatEta } from '$lib/util';
	import SizeStatCard from '$lib/components/SizeStatCard.svelte';
	import StatCard from '$lib/components/StatCard.svelte';
	import TransferCard from '$lib/components/TransferCard.svelte';

	import type { PageServerData } from './$types';

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

	function setupAutoRefresh() {
		if (!browser) {
			return;
		}

		if (timer !== null) {
			clearInterval(timer);
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

<main class="main-content w-full px-[var(--margin-x)] pb-4 flex flex-col overflow-y-auto">
	<div class="mt-5 flex items-center justify-between">
		<h3 class="text-lg font-medium text-slate-700 line-clamp-1 dark:text-navy-50">Dashboard</h3>
		<div class="flex">
			<label class="inline-flex items-center space-x-2">
				<span>Auto Refresh</span>
				<input
					class="form-switch is-outline h-5 w-10 rounded-full border border-slate-400/70 bg-transparent before:rounded-full before:bg-slate-300 checked:border-primary checked:before:bg-primary dark:border-navy-400 dark:before:bg-navy-300 dark:checked:border-accent dark:checked:before:bg-accent"
					type="checkbox"
					bind:checked={autoRefresh}
				/>
			</label>

			<button class="btn p-2 ms-4" onclick={refresh}>
				<i
					class="fa-solid fa-arrows-rotate transition-transform duration-500 ease-in-out rotate-180"
					style="transform: rotate({count * 360}deg);"
				></i>
			</button>
		</div>
	</div>

	<div class="mt-4 grid grid-cols-12 gap-4 sm:mt-5 sm:gap-5 lg:mt-6 lg:gap-6">
		<StatCard label="Version" value={version.version} type="info" />

		<StatCard label="Uptime" value={uptime} type="success" />

		<SizeStatCard label="Discovered Size" bytes={stats.totalBytes} />

		<SizeStatCard label="Transferred Size" bytes={stats.bytes} />

		<SizeStatCard label="Speed" bytes={stats.speed} unitSuffix="/s" />

		<StatCard label="Errors" value={stats.errors} type="error" />

		<StatCard label="Checks" value={stats.checks} />

		<StatCard label="Transfers" value={stats.transfers} />

		<StatCard label="Deletes" value={stats.deletes} />

		<StatCard label="Renames" value={stats.renames} />

		{#if eta}
			<StatCard label="ETA" value={eta} type="secondary" wide />
		{/if}

		<div class="col-span-12"></div>

		{#if transferring}
			{#each transferring as transfer (transfer.name)}
				<div
					class="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
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
</main>
