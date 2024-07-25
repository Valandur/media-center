<script lang="ts">
	import { flip } from 'svelte/animate';
	import { cubicInOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	import { isInProgress, type Transfer } from '$lib/models/transfer';
	import { formatEta, formatSize, formatSpeed } from '$lib/util';
	import type { Stats } from '$lib/models/stats';

	import Card from './Card.svelte';
	import Progress from './Progress.svelte';

	export let stats: Promise<Stats>;

	let loading = true;
	let txs: Transfer[] = [];

	$: stats, setup();

	function setup() {
		stats.then((stats) => {
			loading = false;
			txs = stats.transferring ?? [];
		});
	}
</script>

<div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
	{#if loading}
		<div
			style="order: 0;"
			in:scale={{ delay: 250, duration: 200, easing: cubicInOut }}
			out:scale={{ duration: 200, easing: cubicInOut }}
		>
			<Card>
				<div class="spinner"></div>
			</Card>
		</div>
	{/if}
	{#each txs as transfer (transfer.name)}
		{@const lastSeperator = transfer.name.lastIndexOf('/')}
		{@const fileName = transfer.name.substring(lastSeperator + 1)}

		<div
			style="order: {transfer.id};"
			in:scale={{ delay: 250, duration: 200, easing: cubicInOut }}
			out:scale={{ duration: 200, easing: cubicInOut }}
			animate:flip={{ delay: 250, duration: 200, easing: cubicInOut }}
		>
			<Card class="w-full h-full flex flex-col justify-between">
				<div class="flex flex-row items-center justify-between gap-x-2">
					<h3 class="flex-1 text-primary text-xl overflow-hidden text-nowrap text-ellipsis">
						{fileName}
					</h3>
					<div class="flex-shrink-0">
						{formatSize(transfer.size)}
					</div>
				</div>

				<div class="mt-4 text-secondary">
					<i class="fa-solid fa-hard-drive me-2"></i>
					{transfer.srcFs}
				</div>

				<div class="text-secondary">
					<i class="fa-solid fa-cloud me-2"></i>
					{transfer.dstFs}
				</div>

				<div class="flex-1"></div>

				{#if isInProgress(transfer)}
					<div class="mt-8">
						<div class="">
							<div class="flex flex-row justify-between mb-1">
								<div class="text-primary">{formatEta(transfer.eta)}</div>
								<div>{formatSpeed(transfer.speedAvg)}</div>
							</div>
							<Progress total={transfer.size} progress={transfer.bytes} class="w-full" />
						</div>
					</div>
				{/if}
			</Card>
		</div>
	{/each}
</div>
