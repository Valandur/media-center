<script lang="ts">
	import { slide } from 'svelte/transition';

	import type { Container } from '$lib/models/docker';

	import Card from './Card.svelte';

	export let containersPromise: Promise<Container[]>;

	let loading = true;
	let containers: Container[] = [];
	let error = '';

	$: containersPromise, setup();

	function setup() {
		containersPromise
			.then((newContainers) => {
				containers = newContainers;
				loading = false;
				error = '';
			})
			.catch((err) => {
				console.error(err);
				containers = [];
				loading = false;
				error = err.message;
			});
	}
</script>

<Card class={$$props.class ?? ''}>
	<svelte:fragment slot="header">Docker Containers</svelte:fragment>

	<div class="flex flex-col">
		<div class="grid grid-cols-[auto_auto] items-center gap-x-4">
			{#if loading}
				<div class="spinner"></div>
			{:else if error}
				<div class="text-error text-xl font-bold">{error}</div>
			{/if}
			{#each containers as container (container.name)}
				{@const bg =
					container.status === 'running' || container.status.startsWith('Up')
						? 'bg-success'
						: 'bg-warning'}

				<div class="text-nowrap text-ellipsis overflow-hidden" transition:slide>
					{container.name}
				</div>
				<div class="text-nowrap text-right" transition:slide>
					<span class="badge {bg}">
						{container.status}
					</span>
				</div>
			{/each}
		</div>
	</div>
</Card>
