<script lang="ts">
	import { isInProgress, type Transfer } from '$lib/models/transfer';
	import { formatEta, formatSize, formatSpeed } from '$lib/util';

	import Card from './Card.svelte';
	import Progress from './Progress.svelte';

	export let transfer: Transfer;

	$: lastSeperator = transfer.name.lastIndexOf('/');
	$: fileName = transfer.name.substring(lastSeperator + 1);
</script>

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
