<script lang="ts">
	import { slide } from 'svelte/transition';

	import type { Device } from '$lib/models/device';
	import type { FileSystem } from '$lib/models/file-system';
	import type { SmartDevice } from '$lib/models/smart';
	import { formatSize } from '$lib/util';

	import Card from './Card.svelte';
	import Progress from './Progress.svelte';

	export let device: Device;
	export let smart: SmartDevice | null;
	export let fileSystems: FileSystem[];

	$: bg = smart ? (smart.overallstatus === 'GOOD' ? 'bg-success/25' : 'bg-warning/25') : '';
</script>

<Card class="w-full h-full {bg} flex flex-col transition-colors {$$props.class}">
	{@const name = device?.devicename ?? smart?.devicename}
	{@const model = device?.model ?? smart?.model ?? ''}
	{@const size = device?.size ?? smart?.size ?? 0}
	{@const status = smart?.overallstatus ?? ''}

	<div class="flex flex-row items-center justify-between">
		<h3 class="flex-1 text-primary text-xl overflow-hidden text-nowrap text-ellipsis">
			{name}
		</h3>
		<div
			class="flex-shrink-0"
			class:text-primary={status === 'GOOD'}
			class:text-warning={status && status !== 'GOOD'}
			class:text-info={!status}
		>
			{status}
		</div>
	</div>

	<div class="flex flex-row items-center justify-between mb-4">
		<div class="text-secondary">
			{model.split(' ', 2)[0]}
		</div>
		<div class="text-secondary">
			{formatSize(Number(size), 0)}
		</div>
	</div>

	{#if fileSystems.length > 0}
		<div class="flex flex-col" transition:slide>
			<h3 class="text-primary text-sm mb-1">File Systems</h3>
			{#each fileSystems as fs (fs.devicefile)}
				<div class="flex flex-row items-center justify-between text-sm">
					<div class="flex-1">
						{fs.devicename}
					</div>
					<div class="flex-1">
						{fs.type}
					</div>
					<div class="flex-1 text-right">
						<Progress total={Number(fs.size)} remaining={Number(fs.available)} />
					</div>
				</div>
			{/each}
		</div>
	{/if}
</Card>
