<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { cubicInOut } from 'svelte/easing';

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

<div class="grid grid-cols-4 auto-rows-max gap-4" class:mt-4={error || transfers.length > 0}>
	{#if error}
		<div transition:scale>
			<Card class="h-full">
				<svelte:fragment slot="header">Rclone Error</svelte:fragment>
				<div class="text-error text-xl font-bold">{error}</div>
			</Card>
		</div>
	{/if}

	{#each transfers as transfer (transfer.id)}
		{@const lastSeperator = transfer.name.lastIndexOf('/')}
		{@const fileName = transfer.name.substring(lastSeperator + 1)}

		<div
			style="order: {transfer.id};"
			in:scale={{ delay: 250, duration: 200, easing: cubicInOut }}
			out:scale={{ duration: 200, easing: cubicInOut }}
			animate:flip={{ delay: 250, duration: 200, easing: cubicInOut }}
		>
			<Card>
				<svelte:fragment slot="header">
					{fileName}
				</svelte:fragment>

				<div class="flex flex-col">
					<div class="flex flex-row items-center justify-between gap-2 mb-4">
						<div>
							{transfer.srcFs}
						</div>
						<div class="text-secondary">
							<i class="fa-solid fa-right-long"></i>
						</div>
						<div>
							{transfer.dstFs}
						</div>
					</div>

					{#if isInProgress(transfer)}
						{@const eta = formatEta(transfer.eta)}
						{@const speed = formatSpeed(transfer.speedAvg)}

						<div class="flex flex-row items-center justify-between gap-2">
							{#key eta}
								<div in:fade>
									{eta}
								</div>
							{/key}

							{#key speed}
								<div in:fade>
									{speed}
								</div>
							{/key}
						</div>

						<Progress total={transfer.size} progress={transfer.bytes} />

						<div class="flex flex-row items-center justify-between gap-2">
							<div class="text-nowrap">
								{formatSize(transfer.bytes)}
							</div>
							<div class="text-secondary">of</div>
							<div class="text-nowrap">
								{formatSize(transfer.size)}
							</div>
						</div>
					{:else}
						<div class="text-nowrap">
							{formatSize(transfer.size)}
						</div>
					{/if}
				</div>
			</Card>
		</div>
	{/each}
</div>
