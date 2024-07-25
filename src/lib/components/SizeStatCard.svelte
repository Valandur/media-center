<script lang="ts">
	import { getSize } from '$lib/util';

	import StatCard from './StatCard.svelte';

	export let label: string;
	export let bytes: number | Promise<number>;
	export let unitSuffix: string = '';

	let unit = typeof bytes === 'object' ? 'B' : getSize(bytes)[1];
	$: size =
		typeof bytes === 'object'
			? bytes.then((b) => {
					const [newSize, newUnit] = getSize(b);
					unit = newUnit;
					return newSize;
				})
			: getSize(bytes)[0];
</script>

<StatCard {label} value={size} suffix="{unit}{unitSuffix}" class={$$props.class ?? ''} />
