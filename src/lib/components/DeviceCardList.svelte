<script lang="ts">
	import { scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { cubicInOut } from 'svelte/easing';

	import type { Device } from '$lib/models/device';
	import type { SmartDevice } from '$lib/models/smart';

	import DeviceCard from './DeviceCard.svelte';
	import Card from './Card.svelte';

	interface DeviceWithExtra extends Device {
		smart: SmartDevice | null;
	}

	export let devices: Promise<Device[]>;
	export let smartDevices: Promise<SmartDevice[]>;

	let loading = true;
	let pendingSmart: Map<string, SmartDevice> = new Map();
	let devicesWithExtra: (DeviceWithExtra | null)[] = [null];

	$: devices, smartDevices, setup();

	function setup() {
		devices.then((newDevices) => {
			loading = false;

			devicesWithExtra = newDevices
				.map((dev) => {
					const smart = pendingSmart.get(dev.canonicaldevicefile) ?? null;
					return { ...dev, smart };
				})
				.sort((a, b) => a.devicename.localeCompare(b.devicename));
		});
		smartDevices.then((newSmartDevices) => {
			const pending: Map<string, SmartDevice> = new Map();
			for (const newSmartDevice of newSmartDevices) {
				pending.set(newSmartDevice.canonicaldevicefile, newSmartDevice);
			}

			pendingSmart = pending;
			if (!loading) {
				devicesWithExtra = devicesWithExtra.map((dev) =>
					dev ? { ...dev, smart: pending.get(dev.canonicaldevicefile) ?? null } : null
				);
			}
		});
	}
</script>

<div
	class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 {$$props.class}"
>
	{#each devicesWithExtra as device (device?.devicename)}
		<div
			in:scale={{ delay: 250, duration: 200, easing: cubicInOut }}
			out:scale={{ duration: 200, easing: cubicInOut }}
			animate:flip={{ delay: 250, duration: 200, easing: cubicInOut }}
		>
			{#if !device}
				<Card class="w-full h-full flex flex-col justify-between transition-colors">
					<div class="flex flex-row items-center justify-between">
						<h3 class="flex-1 text-primary text-xl overflow-hidden text-nowrap text-ellipsis">
							...
						</h3>
						<div class="flex-shrink-0 spinner"></div>
					</div>

					<div class="flex flex-row items-center justify-between">
						<div class="text-secondary">&nbsp;</div>
						<div class="text-secondary">&nbsp;</div>
					</div>

					<h3 class="text-primary text-sm mb-1">&nbsp;</h3>
				</Card>
			{:else}
				<DeviceCard {device} smart={device.smart} />
			{/if}
		</div>
	{/each}
</div>
