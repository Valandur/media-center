<script lang="ts">
	import { isInProgress, type Transfer } from '$lib/models/transfer';
	import { formatEta, formatSize, formatSpeed } from '$lib/util';

	export let transfer: Transfer;

	$: lastSeperator = transfer.name.lastIndexOf('/');
	$: fileName = transfer.name.substring(lastSeperator + 1);
	$: pathParts = transfer.name.substring(0, lastSeperator).split('/');
</script>

<div class="card shadow-none h-64">
	<div class="flex flex-1 flex-col justify-between rounded-lg p-4 sm:p-5">
		<div>
			<h3 class="font-medium text-white line-clamp-2">
				{fileName}
			</h3>
		</div>
		<div class="mt-4">
			<i class="fa-solid fa-hard-drive me-2"></i>
			{transfer.srcFs}
		</div>
		<div class="">
			<i class="fa-solid fa-cloud me-2"></i>
			{transfer.dstFs}
		</div>
		<div class="flex-1"></div>
		{#if isInProgress(transfer)}
			<div class="mt-4">
				<div class="mt-4">
					<div class="flex flex-row justify-between">
						<p class="text-xs+ text-white">{formatEta(transfer.eta)}</p>
						<p class="text-xs+ text-white">{formatSpeed(transfer.speedAvg)}</p>
					</div>
					<div class="progress my-2 h-1.5 bg-white/30">
						<span
							class="rounded-full bg-white transition-[width] duration-500 ease-in-out"
							style:width="{transfer.percentage}%"
						></span>
					</div>
					<p class="text-right text-xs+ font-medium text-white">{transfer.percentage}%</p>
				</div>

				<div class="mt-4 flex items-center justify-between space-x-2">
					<div class="badge h-5.5 rounded-full bg-black/20 px-2 text-xs+ text-white">
						{formatSize(transfer.size)}
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
