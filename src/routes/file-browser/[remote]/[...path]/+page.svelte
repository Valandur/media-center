<script lang="ts">
	import { parseISO } from 'date-fns/parseISO';
	import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';

	import FileTreeNode from '$lib/components/FileTreeLevel.svelte';
	import type { TreeNode } from '$lib/models/tree';
	import { formatSize } from '$lib/util';

	import type { PageServerData } from './$types';

	export let data: PageServerData;

	$: remote = data.remote;
	$: tree = data.tree;
	$: about = data.about;
	$: path = data.path;
	$: files = data.files;

	$: pathParts = path.split('/');

	async function onExpand(node: TreeNode) {
		try {
			const res = await fetch(
				`/file-browser/${remote}?/expand&path=${encodeURIComponent(node.path)}`
			);
			console.log(await res.json());
		} catch (err) {
			console.error(err);
		}
	}
</script>

<main
	class="main-content filemanager-app w-full px-[var(--margin-x)] pb-4 flex flex-col overflow-y-auto"
>
	<div class="mt-5 flex items-center justify-between">
		<h3 class="text-lg font-medium text-slate-700 line-clamp-1 dark:text-navy-50">File Browser</h3>
	</div>

	<div class="mt-4 flex-1 grid grid-cols-12 gap-4 overflow-hidden">
		<div class="col-span-3 flex flex-col overflow-hidden">
			<div class="flex-1 overflow-y-auto">
				<div class="mt-2 flex items-center justify-between">
					<span class="text-xs font-medium uppercase">Folders</span>
				</div>
				<ul class="mt-1 space-y-1 font-inter text-xs+ font-medium">
					{#await tree}
						<div
							class="spinner is-elastic size-5 animate-spin rounded-full border-2 border-slate-150 border-r-slate-500 dark:border-navy-500 dark:border-r-navy-300 m-2"
						></div>
					{:then nodes}
						{#each nodes as node}
							<FileTreeNode {node} current={path} basePath="/file-browser/{remote}" />
						{/each}
					{/await}
				</ul>
			</div>

			{#if about}
				<div class="mx-4 h-px bg-slate-200 dark:bg-navy-500"></div>

				<div class="flex flex-col p-4">
					<div class="flex items-center justify-between">
						<p>
							<span class="font-medium text-slate-600 dark:text-navy-100">
								{formatSize(about.used)}
							</span>
							of {formatSize(about.total)}
						</p>
					</div>

					<div class="progress mt-2 h-2 bg-slate-150 dark:bg-navy-500">
						<div
							class="rounded-full bg-info"
							style="width: {(about.used / about.total) * 100}%"
						></div>
					</div>
				</div>
			{/if}
		</div>

		<div class="col-span-9 flex flex-col overflow-hidden">
			<ul class="flex flex-wrap items-center space-x-2">
				<li class="flex items-center space-x-2">
					{#if path}
						<a
							class="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
							href="/file-browser/{remote}"
						>
							{remote}
						</a>
						<span class="text-xs font-light">/</span>
					{:else}
						{remote}
					{/if}
				</li>
				{#each pathParts as part, index}
					<li class="flex items-center space-x-2">
						{#if index < pathParts.length - 1}
							<a
								class="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
								href="/file-browser/{remote}/{pathParts.slice(0, index + 1).join('/')}"
							>
								{part}
							</a>
						{:else}
							{part}
						{/if}
						{#if index < pathParts.length - 1}
							<span class="text-xs font-light">/</span>
						{/if}
					</li>
				{/each}
			</ul>

			<div class="card mt-3 overflow-y-auto">
				<table class="is-hoverable w-full text-left">
					<thead>
						<tr>
							<th
								class="whitespace-nowrap rounded-tl-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5"
							>
								Name
							</th>
							<th
								class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5"
							>
								Last edit
							</th>
							<th
								class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5"
							>
								Size
							</th>

							<th
								class="whitespace-nowrap rounded-tr-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5"
							></th>
						</tr>
					</thead>

					<tbody>
						{#each files as file}
							{@const modTime = parseISO(file.modTime)}
							<tr class="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
								<td class="whitespace-nowrap px-4 py-3 sm:px-5">
									<div class="flex items-center space-x-4">
										{#if file.dir}
											<i class="fa-solid fa-folder fa-xl w-6 text-warning"></i>
											<a
												href="/file-browser/{remote}/{file.path}"
												class="font-medium text-slate-700 dark:text-navy-100">{file.name}</a
											>
										{:else}
											<i class="fa-solid fa-file fa-xl w-6"></i>
											<span class="font-medium text-slate-700 dark:text-navy-100">{file.name}</span>
										{/if}
									</div>
								</td>
								<td class="whitespace-nowrap px-4 py-3 sm:px-5">
									{modTime.getTime() > 0
										? formatDistanceToNow(modTime, { addSuffix: true })
										: '---'}
								</td>
								<td class="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-navy-100 sm:px-5">
									{#if file.size > 0}
										{formatSize(file.size)}
									{:else}
										---
									{/if}
								</td>
								<td class="whitespace-nowrap px-4 py-3 sm:px-5">
									<button
										class="btn size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="size-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											stroke-width="2"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
											/>
										</svg>
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</main>
