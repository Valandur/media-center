<script lang="ts">
	import { flip } from 'svelte/animate';
	import { cubicInOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	import type { Transfer } from '$lib/models/transfer';
	import type { Stats } from '$lib/models/stats';

	import TransferCard from './TransferCard.svelte';
	import Card from './Card.svelte';

	export let stats: Promise<Stats>;

	let loading = true;
	let txs: (Transfer | null)[] = [null];

	$: stats, setup();

	function setup() {
		stats.then((stats) => {
			loading = false;
			txs = stats.transferring ?? [];
		});
	}
</script>

<div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
	{#each txs as transfer (transfer?.name)}
		<div
			style="order: {transfer?.id};"
			in:scale={{ delay: 250, duration: 200, easing: cubicInOut }}
			out:scale={{ duration: 200, easing: cubicInOut }}
			animate:flip={{ delay: 250, duration: 200, easing: cubicInOut }}
		>
			{#if transfer}
				<TransferCard {transfer} />
			{:else}
				<Card>
					<div class="spinner"></div>
				</Card>
			{/if}
		</div>
	{/each}
</div>
