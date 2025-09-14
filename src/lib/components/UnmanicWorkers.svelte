<script lang="ts">
	import { scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { cubicInOut } from 'svelte/easing';
	import { add } from 'date-fns/add';
	import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';

	import type { WorkerInfo } from '$lib/models/unmanic';

	import Card from './Card.svelte';
	import Progress from './Progress.svelte';

	export let workersPromise: Promise<WorkerInfo[]>;

	let loading = true;
	let workers: WorkerInfo[] = [];
	let error = '';

	$: workersPromise, setup();

	function setup() {
		workersPromise
			.then((newWorkers) => {
				workers = newWorkers;
				loading = false;
				error = '';
			})
			.catch((err) => {
				console.error(err);
				workers = [];
				loading = false;
				error = err.message;
			});
	}
</script>

<div
	class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 auto-rows-max gap-4"
	class:mt-4={error || workers.length > 0}
>
	{#if error}
		<div transition:scale>
			<Card class="h-full">
				<svelte:fragment slot="header">Jellyfin Error</svelte:fragment>
				<div class="text-error text-xl font-bold">{error}</div>
			</Card>
		</div>
	{/if}

	{#each workers.filter((w) => !w.idle) as worker (worker.id)}
		{@const pct = Number(worker.subprocess.percent)}
		{@const eta = add(new Date(), { seconds: (worker.subprocess.elapsed / pct) * (100 - pct) })}

		<div
			style="order: {worker.id};"
			in:scale={{ delay: 250, duration: 200, easing: cubicInOut }}
			out:scale={{ duration: 200, easing: cubicInOut }}
			animate:flip={{ delay: 250, duration: 200, easing: cubicInOut }}
		>
			<Card>
				<svelte:fragment slot="header">
					<div class="flex flex-row items-center justify-between">
						<div>{worker.name}</div>
						{#if worker.paused}
							<div class="badge bg-accent">Paused</div>
						{:else if worker.idle}
							<div class="badge bg-warning">Idle</div>
						{:else}
							<div class="badge bg-info">Processing</div>
						{/if}
					</div>
				</svelte:fragment>

				<div class="flex flex-col">
					<div class="flex-1 font-bold mb-5">
						{worker.current_file}
					</div>

					{#if !worker.idle && !worker.paused}
						<Progress total={100} progress={pct} />

						<div class="flex flex-row items-center gap-2">
							<div class="flex-1">ETA</div>
							<div>
								{formatDistanceToNow(eta, { addSuffix: true })}
							</div>
						</div>
					{/if}
				</div>
			</Card>
		</div>
	{/each}
</div>
