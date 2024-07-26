<script lang="ts">
	import { fade, slide } from 'svelte/transition';

	import type { Device } from '$lib/models/device';
	import type { SmartDevice } from '$lib/models/smart';
	import { formatSize } from '$lib/util';

	import Card from './Card.svelte';

	export let devicesPromise: Promise<Device[]>;
	export let smartDevicesPromise: Promise<SmartDevice[]>;

	let loading = true;
	let devices: Device[] = [];
	let devError = '';

	let loadingSmart = true;
	let smartDevicesMap: Map<string, SmartDevice> = new Map();
	let smartDevError = '';

	$: devicesPromise, smartDevicesPromise, setup();

	function setup() {
		devicesPromise
			.then((newDevices) => {
				devices = newDevices;
				loading = false;
			})
			.catch((err) => {
				console.log(err);
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
			})
			.catch((err) => {
				console.error(err);
				smartDevError = err.message;
			});
	}
</script>

{#if devError}
	<Card>
		<svelte:fragment slot="header">Devices Error</svelte:fragment>
		{devError}
	</Card>
{/if}

{#if smartDevError}
	<Card>
		<svelte:fragment slot="header">S.M.A.R.T. Error</svelte:fragment>
		{smartDevError}
	</Card>
{/if}

<Card class={$$props.class ?? ''}>
	<svelte:fragment slot="header">Devices</svelte:fragment>

	<div class="flex flex-col">
		<div class="grid grid-cols-[1fr_4fr_1fr_2fr_2fr] items-center gap-x-2">
			{#if loading}
				<div class="spinner"></div>
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
