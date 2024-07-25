<script lang="ts">
	import { flip } from 'svelte/animate';
	import { cubicInOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	import { isInProgress, type Transfer } from '$lib/models/transfer';
	import { formatEta, formatSize, formatSpeed } from '$lib/util';
	import type { Stats } from '$lib/models/stats';

	import Card from './Card.svelte';
	import Progress from './Progress.svelte';
	import { typewriter } from '$lib/transitions/typewriter';

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

{#each txs as transfer (transfer.name)}
	{@const lastSeperator = transfer.name.lastIndexOf('/')}
	{@const fileName = transfer.name.substring(lastSeperator + 1)}

	<div
		class={$$props.class ?? ''}
		style="order: {1000000 + transfer.id};"
		in:scale={{ delay: 250, duration: 200, easing: cubicInOut }}
		out:scale={{ duration: 200, easing: cubicInOut }}
		animate:flip={{ delay: 250, duration: 200, easing: cubicInOut }}
	>
		<Card class="w-full h-full">
			<svelte:fragment slot="header">
				{fileName}
			</svelte:fragment>

			<div class="flex flex-col justify-between w-full h-full">
				<div class="mb-2 text-secondary">
					<i class="fa-solid fa-file me-2"></i>
					{formatSize(transfer.size)}
				</div>

				<div class="mb-2 text-secondary">
					<i class="fa-solid fa-hard-drive me-2"></i>
					{transfer.srcFs}
				</div>

				<div class="mb-2 text-secondary">
					<i class="fa-solid fa-cloud me-2"></i>
					{transfer.dstFs}
				</div>

				<div class="flex-1"></div>

				{#if isInProgress(transfer)}
					{@const speed = formatSpeed(transfer.speedAvg)}
					{@const eta = formatEta(transfer.eta)}

					<div class="mt-4">
						<div class="flex flex-row justify-between mb-1">
							{#key eta}
								<div class="text-nowrap text-ellipsis overflow-hidden text-primary" in:typewriter>
									{eta}
								</div>
							{/key}
							{#key speed}
								<div class="text-nowrap text-right" in:typewriter>{speed}</div>
							{/key}
						</div>
						<Progress total={transfer.size} progress={transfer.bytes} class="w-full" />
					</div>
				{/if}
			</div>
		</Card>
	</div>
{/each}
