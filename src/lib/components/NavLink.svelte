<script lang="ts">
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';

	export let path: string;
	export let exact: boolean = false;

	$: isActive = exact ? $page.url.pathname === path : $page.url.pathname.startsWith(path);

	const dispatch = createEventDispatcher();
</script>

<a
	href={path}
	class="{isActive ? 'text-primary' : 'text-secondary'} {$$props.class ?? ''} text-nowrap"
	on:click={() => dispatch('click')}
>
	<slot />
</a>
