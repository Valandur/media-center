<script lang="ts">
	import NavLink from '$lib/components/NavLink.svelte';

	import '@fortawesome/fontawesome-free/css/all.min.css';
	import '../app.css';
</script>

<div class="flex flex-col h-screen w-screen overflow-hidden">
	<header class="flex flex-row justify-between items-center h-12 p-4">
		<div class="font-extrabold text-primary text-xl">Home</div>
		<button class="btn btn-primary lg:hidden">Menu</button>
	</header>

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
