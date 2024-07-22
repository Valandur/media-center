<script lang="ts">
	import { isInProgress, type Transfer } from '$lib/models/transfer';
	import { formatEta, formatSize, formatSpeed } from '$lib/util';

	import Card from './Card.svelte';

	export let transfer: Transfer;

	$: lastSeperator = transfer.name.lastIndexOf('/');
	$: fileName = transfer.name.substring(lastSeperator + 1);
</script>

<Card class="w-full h-full">
	<div class="flex flex-1 flex-col justify-between">
		<div class="flex flex-row items-center justify-between gap-x-2">
			<h3 class="flex-1 text-primary text-xl overflow-hidden text-nowrap text-ellipsis">
				{fileName}
			</h3>
			<p class="flex-shrink-0">
				{formatSize(transfer.size)}
			</p>
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
						<p class="text-primary">{formatEta(transfer.eta)}</p>
						<p>{formatSpeed(transfer.speedAvg)}</p>
					</div>
					<div class="w-full relative h-4 rounded-md bg-primary/15">
						<span
							class="absolute top-0 bottom-0 left-0 rounded-md bg-accent transition-[width] duration-500 ease-in-out"
							style:width="{transfer.percentage}%"
						></span>
					</div>
					<p class="text-right mt-1">{transfer.percentage}%</p>
				</div>
			</div>
		{/if}
	</div>
</Card>
