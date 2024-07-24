<script lang="ts">
	import type { Device } from '$lib/models/device';
	import type { SmartDevice } from '$lib/models/smart';
	import { formatSize } from '$lib/util';

	import Card from './Card.svelte';

	export let device: Device;
	export let smart: SmartDevice | null;

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

	<div class="flex flex-row items-center justify-between">
		<div class="text-secondary">
			{model.split(' ', 2)[0]}
		</div>
		<div class="text-secondary">
			{formatSize(Number(size), 0)}
		</div>
	</div>
</Card>
