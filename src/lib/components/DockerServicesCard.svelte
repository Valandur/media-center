<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { invalidate } from '$app/navigation';

	import type { Service } from '$lib/models/docker';

	import Card from './Card.svelte';

	export let servicesPromise: Promise<Service[]>;

	let loading = true;
	let services: Service[] = [];
	let error = '';
	let selectedService: Service | null = null;

	$: servicesPromise, setup();

	function setup() {
		servicesPromise
			.then((newContainers) => {
				services = newContainers.sort((a, b) => a.name.localeCompare(b.name));
				loading = false;
				error = '';
			})
			.catch((err) => {
				console.error(err);
				services = [];
				loading = false;
				error = err.message;
			});
	}

	async function onUpdate(service: Service) {
		try {
			await fetch('/api/docker', {
				method: 'POST',
				body: JSON.stringify({
					action: 'pull',
					service: service.name,
					filepath: service.filepath,
					envpath: service.envpath
				})
			});
			invalidate('mc:stats');
		} catch (err) {
			console.error(err);
		}
	}

	async function onRestart(service: Service) {
		if (!selectedService || service.name !== selectedService?.name) {
			selectedService = service;
			return;
		}

		try {
			await fetch('/api/docker', {
				method: 'POST',
				body: JSON.stringify({
					action: 'restart',
					service: service.name,
					filepath: service.filepath,
					envpath: service.envpath
				})
			});
			selectedService = null;
			invalidate('mc:stats');
		} catch (err) {
			console.error(err);
		}
	}
</script>

<Card class={$$props.class ?? ''}>
	<svelte:fragment slot="header">Docker Services</svelte:fragment>

	<div class="flex flex-col">
		<div class="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-x-4">
			{#if loading}
				<div class="spinner"></div>
			{:else if error}
				<div class="text-error text-xl font-bold">{error}</div>
			{/if}
			{#each services as service (service.name)}
				<div class="text-nowrap text-ellipsis overflow-hidden" transition:slide>
					{service.name}
				</div>
				<div transition:slide>
					<span
						class="badge"
						class:bg-success={service.state === 'running'}
						class:bg-warning={service.state !== 'running'}
					>
						{service.state}
					</span>
				</div>
				<div class="text-nowrap text-right" transition:slide>
					{service.status}
				</div>
				<div class="text-nowrap text-right" transition:slide>
					<button class="btn btn-primary btn-small" on:click={() => onUpdate(service)}>
						<i class="fa-solid fa-download"></i>
					</button>
					<button class="btn btn-primary btn-small" on:click={() => onRestart(service)}>
						<i class="fa-solid fa-arrows-rotate"></i>
					</button>
				</div>
			{/each}
		</div>
	</div>
</Card>

{#if selectedService}
	{@const srv = selectedService}
	<button
		class="fixed top-0 left-0 right-0 bottom-0 bg-dark/95 flex flex-col items-center justify-center z-20"
		transition:fade
		on:click={() => (selectedService = null)}
	>
		<div
			class="flex flex-row items-center justify-center text-primary cursor-default"
			role="button"
			on:click|stopPropagation
			on:keydown|stopPropagation
			tabindex={0}
		>
			<div class="border border-primary/75 bg-dark">
				<div class="border-b border-primary/75 p-4 uppercase">
					Are you sure you want to restart this service?
				</div>
				<div class="p-4 text-start">
					<div class="text-lg">Name: {selectedService.name}</div>
					<div class="text-lg">Image: {selectedService.image}</div>
					<div class="text-lg">Filepath: {selectedService.filepath}</div>
					<div class="text-lg">Envpath: {selectedService.envpath}</div>
				</div>
				<div class="p-4 flex flex-row gap-4 justify-center">
					<button type="button" class="btn btn-danger" on:click={() => onRestart(srv)}>
						Yes
					</button>
					<button type="button" class="btn btn-secondary" on:click={() => (selectedService = null)}>
						No
					</button>
				</div>
			</div>
		</div>
	</button>
{/if}
