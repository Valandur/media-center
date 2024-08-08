<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { differenceInMinutes } from 'date-fns/differenceInMinutes';

	import type { Device } from '$lib/models/device';
	import type { SmartDevice } from '$lib/models/smart';
	import { formatSize } from '$lib/util';

	import Card from './Card.svelte';
	import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';

	export let devicesPromise: Promise<Device[]>;
	export let smartDevicesPromise: Promise<SmartDevice[]>;

	let loading = true;
	let devices: Device[] = [];
	let devError = '';
	let devLastUpdate = new Date(0);

	let loadingSmart = true;
	let smartDevicesMap: Map<string, SmartDevice> = new Map();
	let smartDevError = '';
	let smartDevLastUpdate = new Date(0);

	$: devicesPromise, smartDevicesPromise, setup();
	$: devDiffInMinutes = differenceInMinutes(new Date(), devLastUpdate);
	$: smartDevDiffInMinutes = differenceInMinutes(new Date(), smartDevLastUpdate);

	function setup() {
		devicesPromise
			.then((newDevices) => {
				devices = newDevices;
				loading = false;
				devLastUpdate = new Date();
				devError = '';
			})
			.catch((err) => {
				console.log(err);
				loading = false;
				devError = err.message;
			});

		smartDevicesPromise
			.then((newSmartDevices) => {
				const newSmartDevicesMap: Map<string, SmartDevice> = new Map();
				for (const newSmartDevice of newSmartDevices) {
					newSmartDevicesMap.set(newSmartDevice.canonicaldevicefile, newSmartDevice);
				}
				smartDevicesMap = newSmartDevicesMap;
				loadingSmart = false;
				smartDevLastUpdate = new Date();
				smartDevError = '';
			})
			.catch((err) => {
				console.error(err);
				loadingSmart = false;
				smartDevError = err.message;
			});
	}
</script>

<Card class={$$props.class ?? ''}>
	<svelte:fragment slot="header">
		<div class="flex flex-row items-center justify-between">
			<div>Devices</div>
			{#if devDiffInMinutes > 1}
				<div class="badge bg-warning">
					{formatDistanceToNow(devLastUpdate, { addSuffix: true })}
				</div>
			{:else if smartDevDiffInMinutes > 1}
				<div class="badge bg-warning">
					SMART {formatDistanceToNow(smartDevLastUpdate, { addSuffix: true })}
				</div>
			{/if}
		</div>
	</svelte:fragment>

	<div class="flex flex-col">
		<div class="grid grid-cols-[1fr_4fr_1fr_2fr_2fr] items-center gap-x-2">
			{#if loading}
				<div class="spinner"></div>
			{:else if devError && devDiffInMinutes > 2}
				<div class="text-error text-xl font-bold">{devError}</div>
			{:else if smartDevError && smartDevDiffInMinutes > 2}
				<div class="text-error text-xl font-bold">{smartDevError}</div>
			{/if}

			{#each devices as device (device.devicename)}
				{@const smart = smartDevicesMap.get(device.canonicaldevicefile)}
				{@const bg = smart ? (smart.overallstatus === 'GOOD' ? 'bg-success' : 'bg-warning') : ''}
				{@const temp = device.temperature ? device.temperature + '°C' : '---'}

				<div class="text-nowrap" transition:slide>
					{device.devicename}
				</div>
				<div class="text-nowrap text-ellipsis overflow-hidden" transition:slide>
					{device.model}
				</div>
				<div class="text-nowrap text-right" transition:slide>
					{#key temp}
						<div in:fade>
							{temp}
						</div>
					{/key}
				</div>
				<div class="text-nowrap text-right" transition:slide>
					{formatSize(Number(device.size))}
				</div>
				<div class="text-nowrap text-right" transition:slide>
					{#if smart}
						<span class="badge {bg}">{smart.overallstatus}</span>
					{:else if loadingSmart}
						<div class="spinner"></div>
					{:else}
						---
					{/if}
				</div>
			{/each}
		</div>
	</div>
</Card>
