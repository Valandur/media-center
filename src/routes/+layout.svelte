<script lang="ts">
	import { slide } from 'svelte/transition';
	import '@fortawesome/fontawesome-free/css/all.min.css';

	import NavLink from '$lib/components/NavLink.svelte';

	import '../app.css';

	let showMenu = false;

	function toggle() {
		showMenu = !showMenu;
	}
</script>

<div class="flex flex-col h-screen w-screen overflow-hidden">
	<header class="flex flex-row justify-between items-center py-2 px-4">
		<div class="font-extrabold text-primary text-xl">Media Center</div>
		<button on:click={toggle} class="text-primary lg:hidden">
			<i class="fa-solid fa-bars fa-lg transition-transform" class:rotate-90={showMenu}></i>
		</button>
	</header>

	{#if showMenu}
		<nav
			class="fixed top-0 left-0 right-0 bottom-0 z-10 bg-dark flex flex-col overflow-x-hidden overflow-y-scroll"
			transition:slide={{ axis: 'x' }}
		>
			<div class="flex flex-row items-center justify-between py-2 px-4">
				<div class="whitespace-pre">&nbsp;</div>
				<button class="text-primary" on:click={toggle}>
					<i class="fa-solid fa-xmark fa-lg"></i>
				</button>
			</div>
			<NavLink path="/" exact class="text-3xl p-4" on:click={toggle}>Dashboard</NavLink>
			<NavLink path="/file-browser" class="text-3xl p-4" on:click={toggle}>File Browser</NavLink>
			<NavLink path="/jobs" class="text-3xl p-4" on:click={toggle}>Jobs</NavLink>
		</nav>
	{/if}

	<div class="flex-1 flex flex-row gap-x-16 overflow-hidden">
		<nav class="hidden lg:flex flex-col gap-y-4 px-4 py-8">
			<NavLink path="/" exact>Dashboard</NavLink>
			<NavLink path="/file-browser">File Browser</NavLink>
			<NavLink path="/jobs">Jobs</NavLink>
		</nav>

		<main class="flex-1 p-4 flex flex-col overflow-hidden">
			<slot />
		</main>
	</div>
</div>
