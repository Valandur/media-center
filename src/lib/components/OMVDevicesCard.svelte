<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { differenceInMinutes } from 'date-fns/differenceInMinutes';
	import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';

	import type { Device, SmartDevice } from '$lib/models/omv';
	import { formatSize } from '$lib/util';

	import Card from './Card.svelte';
	import TextWithTooltip from './TextWithTooltip.svelte';

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
			{#if !loading && devDiffInMinutes > 1}
				<div class="badge bg-warning">
					{formatDistanceToNow(devLastUpdate, { addSuffix: true })}
				</div>
			{:else if !loadingSmart && smartDevDiffInMinutes > 1}
				<div class="badge bg-warning">
					SMART {formatDistanceToNow(smartDevLastUpdate, { addSuffix: true })}
				</div>
			{/if}
		</div>
	</svelte:fragment>

	<div class="flex flex-col">
		<div
			class="grid grid-cols-[auto_1fr] sm:grid-cols-[1fr_4fr_auto_auto_auto] items-center gap-x-2"
		>
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

				<div class="sm:hidden">Name</div>
				<div class="text-nowrap text-right sm:text-left" transition:slide>
					{device.devicename}
				</div>

				<div class="sm:hidden">Model</div>
				<div class="truncate text-right sm:text-left" transition:slide>
					<TextWithTooltip text={device.model} />
				</div>

				<div class="sm:hidden">Temperature</div>
				<div class="text-nowrap text-right" transition:slide>
					{#key temp}
						<div in:fade>
							{temp}
						</div>
					{/key}
				</div>

				<div class="sm:hidden">Size</div>
				<div class="text-nowrap text-right" transition:slide>
					{formatSize(Number(device.size))}
				</div>

				<div class="sm:hidden">Status</div>
				<div class="text-nowrap text-right" transition:slide>
					{#if smart}
						<span class="badge {bg}">{smart.overallstatus}</span>
					{:else if loadingSmart}
						<div class="spinner"></div>
					{:else}
						---
					{/if}
				</div>

				<div class="sm:hidden last:hidden border-b border-primary/30 col-span-2 -mx-4 my-2"></div>
			{/each}
		</div>
	</div>
</Card>
