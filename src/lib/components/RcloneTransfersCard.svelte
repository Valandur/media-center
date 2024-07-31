<script lang="ts">
	import { fade, slide } from 'svelte/transition';

	import { isInProgress, type Transfer } from '$lib/models/transfer';
	import { formatEta, formatSize, formatSpeed } from '$lib/util';

	import Card from './Card.svelte';
	import Progress from './Progress.svelte';

	export let transfersPromise: Promise<Transfer[]>;

	let loading = true;
	let transfers: Transfer[] = [];
	let error = '';

	$: transfersPromise, setup();

	function setup() {
		transfersPromise
			.then((newTransfers) => {
				transfers = newTransfers;
				loading = false;
				error = '';
			})
			.catch((err) => {
				console.error(err);
				transfers = [];
				loading = false;
				error = err.message;
			});
	}
</script>

<Card class={$$props.class ?? ''}>
	<svelte:fragment slot="header">Rclone Transfers</svelte:fragment>

	<div class="flex flex-col">
		<div class="grid grid-cols-[2fr_2fr_1fr_2fr_auto] items-center gap-x-4">
			{#if loading}
				<div class="spinner"></div>
			{:else if error}
				<div class="text-error text-xl font-bold">{error}</div>
			{/if}

			{#each transfers as transfer (transfer.id)}
				{@const lastSeperator = transfer.name.lastIndexOf('/')}
				{@const fileName = transfer.name.substring(lastSeperator + 1)}

				<div class="text-nowrap text-ellipsis overflow-hidden" transition:slide>
					{fileName}
				</div>
				<div class="text-nowrap text-ellipsis overflow-hidden" transition:slide>
					{#if isInProgress(transfer)}
						{@const eta = formatEta(transfer.eta)}
						<div class="text-nowrap text-ellipsis overflow-hidden" in:fade>
							{eta}
						</div>
					{/if}
				</div>
				<div class="text-nowrap text-right" transition:slide>
					{#if isInProgress(transfer)}
						{@const speed = formatSpeed(transfer.speedAvg)}
						{#key speed}
							<div class="text-nowrap text-right" in:fade>{speed}</div>
						{/key}
					{/if}
				</div>
				<div class="text-nowrap text-right" transition:slide>
					{#if isInProgress(transfer)}
						<Progress total={transfer.size} progress={transfer.bytes} class="w-full" />
					{/if}
				</div>
				<div class="text-nowrap">
					{formatSize(transfer.size)}
				</div>
			{/each}
		</div>
	</div>
</Card>
