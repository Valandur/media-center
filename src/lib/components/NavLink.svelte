<script lang="ts">
	import { page } from '$app/stores';

	export let path: string;
	export let exact: boolean = false;

	$: isActive = exact ? $page.url.pathname === path : $page.url.pathname.startsWith(path);
</script>

<a href={path} class={isActive ? 'text-primary' : 'text-secondary'}>
	<slot />
</a>
