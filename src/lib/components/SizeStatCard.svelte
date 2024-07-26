<script lang="ts">
	import { getSize } from '$lib/util';

	import StatCard from './StatCard.svelte';

	export let label: string;
	export let value: number | Promise<number>;
	export let unitSuffix: string = '';
	export let right: boolean = false;

	let unit = typeof value === 'object' ? 'B' : getSize(value)[1];
	$: size =
		typeof value === 'object'
			? value.then((b) => {
					const [newSize, newUnit] = getSize(b);
					unit = newUnit;
					return newSize;
				})
			: getSize(value)[0];
</script>

<StatCard {label} value={size} suffix="{unit}{unitSuffix}" class={$$props.class ?? ''} {right} />
