<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { invalidate } from '$app/navigation';
	import { differenceInMinutes } from 'date-fns/differenceInMinutes';
	import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';

	import type { DockerContainer } from '$lib/models/omv';
	import { formatSize } from '$lib/util';

	import Card from './Card.svelte';
	import TextWithTooltip from './TextWithTooltip.svelte';

	export let composePromise: Promise<DockerContainer[]>;

	interface DockerContainerGroup {
		name: string;
		cpu: number;
		memuse: number;
		containers: DockerContainer[];
		expanded: boolean;
	}

	let loading = true;
	let error = '';
	let lastUpdate = new Date(0);
	let containerGroups: DockerContainerGroup[] = [];
	let selContainer: DockerContainer | null = null;

	$: composePromise, setup();
	$: diffInMinutes = differenceInMinutes(new Date(), lastUpdate);
	$: totalCpu = containerGroups.reduce((total, grp) => total + grp.cpu, 0);
	$: totalRam = containerGroups.reduce((total, grp) => total + grp.memuse, 0);

	function setup() {
		composePromise
			.then((rawContainers) => {
				rawContainers = rawContainers.sort((a, b) => a.name.localeCompare(b.name));
				const newContainers: Map<string, DockerContainerGroup> = new Map();

				for (const container of rawContainers) {
					const baseName = container.name.split('_', 2)[0];
					let existing = newContainers.get(baseName);
					if (!existing) {
						existing = {
							name: baseName,
							cpu: 0,
							memuse: 0,
							containers: [],
							expanded: false
						};
						newContainers.set(baseName, existing);
					}

					existing.cpu += container.cpu;
					existing.memuse += container.memuse;
					existing.containers.push(container);
				}

				containerGroups = [...newContainers.values()];

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

	$: onToggle = (group: DockerContainerGroup) => {
		group.expanded = !group.expanded;
		containerGroups = containerGroups;
	};

	$: onUpdate = async (container: DockerContainer) => {
		if (container.runningAction !== null) {
			return;
		}

		try {
			container.runningAction = '--placeholder--';
			containerGroups = containerGroups;
			await fetch('/api/docker', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					action: 'pull',
					service: container.service,
					filepath: container.filepath,
					envpath: container.envpath
				})
			});
			invalidate('mc:stats');
		} catch (err) {
			console.error(err);
		}
	};

	$: onRestart = async (container: DockerContainer) => {
		if (!selContainer || container.name !== selContainer?.name) {
			selContainer = container;
			return;
		}
		if (container.runningAction !== null) {
			return;
		}

		selContainer = null;
		try {
			container.runningAction = '--placeholder--';
			containerGroups = containerGroups;
			await fetch('/api/docker', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					action: 'restart',
					service: container.service,
					filepath: container.filepath,
					envpath: container.envpath
				})
			});
			invalidate('mc:stats');
		} catch (err) {
			console.error(err);
		}
	};

	function formatStatus(status: string) {
		return status.replace(' (healthy)', '').replace('Up ', '');
	}
</script>

<Card class={$$props.class ?? ''}>
	<svelte:fragment slot="header">
		<div class="flex flex-row items-center">
			<div>Docker</div>
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
			{#each containerGroups as group (group.name)}
				{#if group.containers.length > 1}
					<div class="sm:hidden">Name</div>
					<div class="truncate text-right sm:text-left" transition:slide>
						<TextWithTooltip text={group.name} />
					</div>

					<div class="sm:hidden">State</div>
					<div class="text-nowrap text-right sm:text-left sm:col-span-2" transition:slide>
						{#if !group.expanded}
							{#each group.containers as container (container.name)}
								<span
									class="badge me-1"
									class:bg-success={container.state === 'running'}
									class:bg-warning={container.state !== 'running'}
								>
									{container.state}
								</span>
							{/each}
						{/if}
					</div>

					<div class="sm:hidden">CPU</div>
					<div class="text-nowrap text-right" transition:slide>
						{group.cpu.toFixed(0)}%
					</div>

					<div class="sm:hidden">Memory</div>
					<div class="text-nowrap text-right" transition:slide>
						{formatSize(group.memuse, 0)}
					</div>

					<div class="sm:hidden">Expand</div>
					<div class="text-right sm:col-span-2" transition:slide>
						<button class="btn btn-primary btn-small" on:click={() => onToggle(group)}>
							{#if group.expanded}
								<i class="fa-solid fa-caret-up px-0.5"></i>
							{:else}
								<i class="fa-solid fa-caret-down px-0.5"></i>
							{/if}
						</button>
					</div>

					<div class="sm:hidden last:hidden border-b border-primary/30 col-span-2 -mx-4 my-2"></div>
				{/if}

				{#each group.containers as container (container.name)}
					{#if group.expanded || group.containers.length === 1}
						<div class="sm:hidden">Name</div>
						<div class="truncate text-right sm:text-left" transition:slide>
							{#if group.containers.length > 1}
								<span class="sm:hidden">{group.name}</span>
								<i class="fa-solid fa-caret-right pe-1"></i>
							{/if}
							<TextWithTooltip text={container.name} />
						</div>

						<div class="sm:hidden">State</div>
						<div class="text-right sm:text-left" transition:slide>
							<span
								class="badge"
								class:bg-success={container.state === 'running'}
								class:bg-warning={container.state !== 'running'}
							>
								{container.state}
							</span>
						</div>

						<div class="sm:hidden">Uptime</div>
						<div class="truncate text-right sm:text-left" transition:slide>
							<TextWithTooltip text={formatStatus(container.status)} />
						</div>

						<div class="sm:hidden">CPU</div>
						<div class="text-nowrap text-right" transition:slide>
							{container.cpu.toFixed(0)}%
						</div>

						<div class="sm:hidden">Memory</div>
						<div class="text-nowrap text-right" transition:slide>
							{formatSize(container.memuse, 0)}
						</div>

						<div class="sm:hidden">Update</div>
						<div class="text-right sm:text-left" transition:slide>
							{#if container.runningAction}
								<div class="spinner"></div>
							{:else}
								<button class="btn btn-primary btn-small" on:click={() => onUpdate(container)}>
									<i class="fa-solid fa-download"></i>
								</button>
							{/if}
						</div>

						<div class="sm:hidden">Restart</div>
						<div class="text-right sm:text-left" transition:slide>
							{#if container.runningAction}
								<div class="spinner"></div>
							{:else}
								<button class="btn btn-primary btn-small" on:click={() => onRestart(container)}>
									<i class="fa-solid fa-arrows-rotate"></i>
								</button>
							{/if}
						</div>

						<div
							class="sm:hidden last:hidden border-b border-primary/30 col-span-2 -mx-4 my-2"
						></div>
					{/if}
				{/each}
			{/each}
		</div>
	</div>
</Card>

{#if selContainer}
	{@const srv = selContainer}
	<button
		class="fixed top-0 left-0 right-0 bottom-0 bg-dark/95 flex flex-col items-center justify-center z-20"
		transition:fade
		on:click={() => (selContainer = null)}
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
					Are you sure you want to restart this container?
				</div>
				<div class="p-4 text-start">
					<div class="text-lg">Name: {selContainer.name}</div>
					<div class="text-lg">Image: {selContainer.image}</div>
					<div class="text-lg">Filepath: {selContainer.filepath}</div>
					<div class="text-lg">Envpath: {selContainer.envpath}</div>
				</div>
				<div class="p-4 flex flex-row gap-4 justify-center">
					<button type="button" class="btn btn-danger" on:click={() => onRestart(srv)}>
						Yes
					</button>
					<button type="button" class="btn btn-secondary" on:click={() => (selContainer = null)}>
						No
					</button>
				</div>
			</div>
		</div>
	</button>
{/if}
