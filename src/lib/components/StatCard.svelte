<script lang="ts">
	import { typewriter } from '$lib/transitions/typewriter';

	import Card from './Card.svelte';

	export let label: string;
	export let value: string | number | Promise<string | number>;
	export let suffix: string | undefined = undefined;

	let timer: ReturnType<typeof setInterval> | null = null;
	let loading = typeof value === 'object';
	let val = typeof value === 'object' ? '' : value;

	$: value, setup();

	function setup() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}

		if (typeof value === 'object') {
			if (loading) {
				timer = setInterval(() => (val = val + '.'), 500);
			}

			value.then((newValue) => {
				if (timer) {
					clearInterval(timer);
					timer = null;
				}

				loading = false;
				val = newValue;
			});
		}
	}
</script>

<Card class={$$props.class}>
	<div class="flex items-baseline space-x-2">
		{#key val}
			<div
				class="text-2xl font-semibold text-primary whitespace-pre-wrap"
				in:typewriter={{ speed: 2 }}
			>
				{#if loading}
					...
				{:else if typeof val !== 'undefined'}
					{val}
				{:else}
					&nbsp;
				{/if}
			</div>
		{/key}
		{#if suffix}
			<div class="text-sm">{suffix}</div>
		{/if}
	</div>
	<div class="text-sm text-secondary">{label}</div>
</Card>
