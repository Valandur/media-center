<script lang="ts">
	import { onMount } from 'svelte';
	import { afterNavigate, beforeNavigate } from '$app/navigation';

	import NavLink from '$lib/components/NavLink.svelte';

	import '../theme/app.css';

	let loaded = false;
	onMount(() => {
		loaded = true;
	});
	beforeNavigate((event) => {
		if (!event.willUnload) {
			loaded = false;
		}
	});
	afterNavigate(() => {
		loaded = true;
	});

	function toggleDarkMode() {
		document.documentElement.classList.toggle('dark');
	}

	function toggleMonochrome() {
		document.body.classList.toggle('is-monochrome');
	}
</script>

<div
	class="app-preloader fixed z-50 grid h-full w-full place-content-center bg-slate-50 dark:bg-navy-900"
	class:animate-[var(--ease-in-out)_fade-out_500ms_forwards]={loaded}
>
	<div class="app-preloader-inner relative inline-block size-48"></div>
</div>

<!-- Page Wrapper -->
<div id="root" class="h-100vh flex grow bg-slate-50 dark:bg-navy-900" class:cloak={!loaded}>
	<!-- Sidebar -->
	<div class="sidebar print:hidden">
		<!-- Main Sidebar -->
		<div class="main-sidebar">
			<div
				class="flex h-full w-full flex-col items-center border-r border-slate-150 bg-white dark:border-navy-700 dark:bg-navy-800"
			>
				<!-- Application Logo -->
				<div class="flex pt-4">
					<a href="/">
						<img
							class="size-11 transition-transform duration-500 ease-in-out hover:rotate-[360deg]"
							src="/images/app-logo.png"
							alt="logo"
						/>
					</a>
				</div>

				<!-- Main Sections Links -->
				<div class="is-scrollbar-hidden flex grow flex-col space-y-4 overflow-y-auto pt-6">
					<NavLink path="/" exact>
						<i class="fa-solid fa-house fa-xl"></i>
					</NavLink>

					<NavLink path="/file-browser">
						<i class="fa-solid fa-folder-tree fa-xl"></i>
					</NavLink>
				</div>

				<div class="flex flex-col items-center space-y-3 py-3">
					<NavLink path="/logout">
						<i class="fa-solid fa-right-from-bracket fa-xl"></i>
					</NavLink>
				</div>
			</div>
		</div>
	</div>

	<!-- App Header Wrapper-->
	<nav class="header print:hidden">
		<!-- App Header  -->
		<div class="header-container relative flex w-full bg-white dark:bg-navy-700 print:hidden">
			<!-- Header Items -->
			<div class="flex w-full items-center justify-between">
				<!-- Left: Sidebar Toggle Button -->
				<div>
					<h1 class="text-3xl text-primary dark:text-accent-light">rclone</h1>
				</div>

				<!-- Right: Header buttons -->
				<div class="-mr-1.5 flex items-center space-x-2">
					<!-- Dark Mode Toggle -->
					<button
						class="darkmode-toggle btn size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
						onclick={toggleDarkMode}
					>
						<svg
							class="darkmode-moon size-6 text-amber-400"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								d="M11.75 3.412a.818.818 0 01-.07.917 6.332 6.332 0 00-1.4 3.971c0 3.564 2.98 6.494 6.706 6.494a6.86 6.86 0 002.856-.617.818.818 0 011.1 1.047C19.593 18.614 16.218 21 12.283 21 7.18 21 3 16.973 3 11.956c0-4.563 3.46-8.31 7.925-8.948a.818.818 0 01.826.404z"
							/>
						</svg>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="darkmode-sun size-6 text-amber-400"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>

					<!-- Monochrome Mode Toggle -->
					<button
						class="monochrome-toggle btn size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
						onclick={toggleMonochrome}
					>
						<i
							class="fa-solid fa-palette bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-lg font-semibold text-transparent"
						></i>
					</button>
				</div>
			</div>
		</div>
	</nav>

	<!-- Main Content -->
	<slot />
</div>
