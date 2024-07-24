<script lang="ts">
	import { slide } from 'svelte/transition';

	import type { Device } from '$lib/models/device';
	import type { SmartDevice } from '$lib/models/smart';
	import { typewriter } from '$lib/transitions/typewriter';
	import { formatSize } from '$lib/util';

	import Card from './Card.svelte';

	export let devicesPromise: Promise<Device[]>;
	export let smartDevicesPromise: Promise<SmartDevice[]>;

	let loading = true;
	let devices: Device[] = [];

	let loadingSmart = true;
	let smartDevicesMap: Map<string, SmartDevice> = new Map();

	$: devicesPromise, smartDevicesPromise, setup();

	function setup() {
		devicesPromise.then((newDevices) => {
			devices = newDevices;
			loading = false;
		});

		smartDevicesPromise.then((newSmartDevices) => {
			const newSmartDevicesMap: Map<string, SmartDevice> = new Map();
			for (const newSmartDevice of newSmartDevices) {
				newSmartDevicesMap.set(newSmartDevice.canonicaldevicefile, newSmartDevice);
			}
			smartDevicesMap = newSmartDevicesMap;
			loadingSmart = false;
		});
	}
</script>

<Card class="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-2 {$$props.class}">
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
						<div in:typewriter={{ speed: 2 }}>
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
