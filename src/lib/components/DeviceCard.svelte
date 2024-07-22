<script lang="ts">
	import type { SmartDevice } from '$lib/models/smart';
	import { formatSize } from '$lib/util';

	import Card from './Card.svelte';

	export let device: SmartDevice;

	$: bg =
		device.overallstatus === 'GOOD'
			? 'bg-success/40'
			: device.overallstatus === 'BAD_SECTOR'
				? 'bg-warning/40'
				: '';
</script>

<Card class="{bg} {$$props.class}">
	{device.devicename}
	{device.model.split(' ', 2)[0]}
	({formatSize(Number(device.size), 0)})
</Card>
