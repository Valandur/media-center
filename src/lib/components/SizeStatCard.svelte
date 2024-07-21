<script lang="ts">
	import { getSize } from '$lib/util';

	import StatCard from './StatCard.svelte';

	export let label: string;
	export let bytes: number;
	export let unitSuffix: string = '';

	$: [size, unit] = getSize(bytes);
</script>

<StatCard {label} value={size} suffix="{unit}{unitSuffix}" type="secondary" />
