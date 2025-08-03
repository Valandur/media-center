<script lang="ts">
	import { scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { cubicInOut } from 'svelte/easing';

	import type { Session } from '$lib/models/jellyfin';
	import { formatSpeed } from '$lib/util';

	import Card from './Card.svelte';

	export let jellyfinPromise: Promise<Session[]>;

	let loading = true;
	let sessions: Session[] = [];
	let error = '';

	$: jellyfinPromise, setup();

	function setup() {
		jellyfinPromise
			.then((newSessions) => {
				sessions = newSessions;
				loading = false;
				error = '';
			})
			.catch((err) => {
				console.error(err);
				sessions = [];
				loading = false;
				error = err.message;
			});
	}
</script>

<div class="grid grid-cols-4 auto-rows-max gap-4" class:mt-4={error || sessions.length > 0}>
	{#if error}
		<div transition:scale>
			<Card class="h-full">
				<svelte:fragment slot="header">Jellyfin Error</svelte:fragment>
				<div class="text-error text-xl font-bold">{error}</div>
			</Card>
		</div>
	{/if}

	{#each sessions as session (session.Id)}
		<div
			style="order: {session.Id};"
			in:scale={{ delay: 250, duration: 200, easing: cubicInOut }}
			out:scale={{ duration: 200, easing: cubicInOut }}
			animate:flip={{ delay: 250, duration: 200, easing: cubicInOut }}
		>
			<Card>
				<svelte:fragment slot="header">
					<div class="flex flex-row items-center justify-between">
						<div>{session.UserName}</div>
						<div class="badge bg-info">{session.DeviceName}</div>
					</div>
				</svelte:fragment>

				<div class="flex flex-col">
					<div class="font-bold mb-4">
						{#if session.NowPlayingItem}
							{#if session.NowPlayingItem.SeriesId}
								{session.NowPlayingItem.SeriesName} - {session.NowPlayingItem.Name}
							{:else}
								{session.NowPlayingItem.Name}
							{/if}
						{:else}
							---
						{/if}
					</div>

					<div class="flex flex-row items-center gap-2">
						<div class="flex-1">{session.RemoteEndPoint}</div>
						<div>
							{#if session.TranscodingInfo}
								{formatSpeed(session.TranscodingInfo.Bitrate / 8)}
							{:else}
								---
							{/if}
						</div>
					</div>

					<div class="flex flex-row items-center gap-2">
						{#if session.TranscodingInfo}
							<div class="flex-1">
								{session.TranscodingInfo.Width}x{session.TranscodingInfo.Height}
							</div>

							<div class="badge bg-info">
								{session.TranscodingInfo.AudioCodec}
							</div>

							<div class="badge bg-info">
								{session.TranscodingInfo.VideoCodec}
							</div>
						{:else}
							---
						{/if}
					</div>
				</div>
			</Card>
		</div>
	{/each}
</div>
