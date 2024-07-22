<script lang="ts">
	import { typewriter } from '$lib/transitions/typewriter';

	import Card from './Card.svelte';

	export let label: string;
	export let value: string | number;
	export let suffix: string | undefined = undefined;
</script>

<Card class={$$props.class}>
	<div class="flex items-baseline space-x-2">
		{#key value}
			<p
				class="text-2xl font-semibold text-primary whitespace-pre-wrap"
				in:typewriter={{ speed: 2 }}
			>
				{value}
			</p>
		{/key}
		{#if suffix}
			<p class="text-sm">{suffix}</p>
		{/if}
	</div>
	<p class="text-sm">{label}</p>
</Card>
