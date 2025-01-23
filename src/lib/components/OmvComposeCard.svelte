<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { invalidate } from '$app/navigation';
	import { differenceInMinutes } from 'date-fns/differenceInMinutes';
	import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';

	import type { DockerService, DockerStats } from '$lib/models/omv';
	import { formatSize } from '$lib/util';

	import Card from './Card.svelte';
	import TextWithTooltip from './TextWithTooltip.svelte';

	export let composePromise: Promise<(DockerService & DockerStats)[]>;

	let loading = true;
	let services: (DockerService & DockerStats)[] = [];
	let error = '';
	let lastUpdate = new Date(0);
	let selectedService: DockerService | null = null;
	let pullingServices: string[] = [];
	let restartingServices: string[] = [];

	$: composePromise, setup();
	$: diffInMinutes = differenceInMinutes(new Date(), lastUpdate);
	$: totalCpu = services.reduce((total, srv) => total + srv.cpu, 0);
	$: totalRam = services.reduce((total, srv) => total + srv.memuse, 0);

	function setup() {
		composePromise
			.then((newContainers) => {
				services = newContainers.sort((a, b) => a.name.localeCompare(b.name));
				loading = false;
				lastUpdate = new Date();
				error = '';
			})
			.catch((err) => {
				console.error(err);
				loading = false;
				error = err.message;
			});
	}

	async function onUpdate(service: DockerService) {
		if (pullingServices.includes(service.name)) {
			return;
		}

		pullingServices = pullingServices.concat(service.name);
		try {
			await fetch('/api/docker', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
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
		} finally {
			pullingServices = pullingServices.filter((s) => s !== service.name);
		}
	}

	async function onRestart(service: DockerService) {
		if (!selectedService || service.name !== selectedService?.name) {
			selectedService = service;
			return;
		}
		if (restartingServices.includes(service.name)) {
			return;
		}

		restartingServices = restartingServices.concat(service.name);
		selectedService = null;
		try {
			await fetch('/api/docker', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					action: 'restart',
					service: service.name,
					filepath: service.filepath,
					envpath: service.envpath
				})
			});
			invalidate('mc:stats');
		} catch (err) {
			console.error(err);
		} finally {
			restartingServices = restartingServices.filter((s) => s !== service.name);
		}
	}

	function formatStatus(status: string) {
		return status.replace(' (healthy)', '').replace('Up ', '');
	}
</script>

<Card class={$$props.class ?? ''}>
	<svelte:fragment slot="header">
		<div class="flex flex-row items-center">
			<div>Docker Services</div>
			{#if !loading && diffInMinutes > 1}
				<div class="badge bg-warning ms-2">
					{formatDistanceToNow(lastUpdate, { addSuffix: true })}
				</div>
			{/if}
			<div class="flex-1"></div>
			<div class="font-normal normal-case me-2">
				{#key totalCpu}
					<span in:fade>{totalCpu.toFixed(0)}%</span>
				{/key}
				<span class="text-secondary">CPU</span>
			</div>
			<div class="font-normal normal-case">
				{#key totalRam}
					<span in:fade>{formatSize(totalRam)}</span>
				{/key}
				<span class="text-secondary">RAM</span>
			</div>
		</div>
	</svelte:fragment>

	<div class="flex flex-col">
		<div
			class="grid grid-cols-[auto_1fr] sm:grid-cols-[1fr_auto_1fr_auto_auto_auto_auto] items-center gap-x-2"
		>
			{#if loading}
				<div class="spinner"></div>
			{:else if error && diffInMinutes > 2}
				<div class="text-error text-xl font-bold">{error}</div>
			{/if}
			{#each services as service (service.name)}
				<div class="sm:hidden">Name</div>
				<div class="truncate text-right sm:text-left" transition:slide>
					<TextWithTooltip text={service.name} />
				</div>

				<div class="sm:hidden">State</div>
				<div class="text-right sm:text-left" transition:slide>
					<span
						class="badge"
						class:bg-success={service.state === 'running'}
						class:bg-warning={service.state !== 'running'}
					>
						{service.state}
					</span>
				</div>

				<div class="sm:hidden">Uptime</div>
				<div class="truncate text-right sm:text-left" transition:slide>
					<TextWithTooltip text={formatStatus(service.status)} />
				</div>

				<div class="sm:hidden">CPU</div>
				<div class="text-nowrap text-right" transition:slide>
					{service.cpu.toFixed(0)}%
				</div>

				<div class="sm:hidden">Memory</div>
				<div class="text-nowrap text-right" transition:slide>
					{formatSize(service.memuse, 0)}
				</div>

				<div class="sm:hidden">Update</div>
				<div class="text-right sm:text-left" transition:slide>
					{#if pullingServices.includes(service.name)}
						<div class="spinner"></div>
					{:else}
						<button class="btn btn-primary btn-small" on:click={() => onUpdate(service)}>
							<i class="fa-solid fa-download"></i>
						</button>
					{/if}
				</div>

				<div class="sm:hidden">Restart</div>
				<div class="text-right sm:text-left" transition:slide>
					{#if restartingServices.includes(service.name)}
						<div class="spinner"></div>
					{:else}
						<button class="btn btn-primary btn-small" on:click={() => onRestart(service)}>
							<i class="fa-solid fa-arrows-rotate"></i>
						</button>
					{/if}
				</div>

				<div class="sm:hidden last:hidden border-b border-primary/30 col-span-2 -mx-4 my-2"></div>
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
