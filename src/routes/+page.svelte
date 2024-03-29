<script lang="ts">
	import { Download } from 'lucide-svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { invoke } from '@tauri-apps/api/tauri';
	import { onMount } from 'svelte';
	import { Lyrics } from 'paroles';
	import { getCurrentPlaying, getLyrics, lyricsLoading } from '$lib/utils';
	import { currentPlaying, plainLyrics, type Track } from '$lib/stores';
	import * as Tabs from '$lib/components/ui/tabs';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index';

	/** * @type {string | Lyrics | undefined} */
	let lyrics;
	let sync: Lyrics;
	let time: number;
	let currentLine: { text: any };
	let nextLine;
	let prevPlaying: Track | null;

	let currentPlayingArtist = $currentPlaying?.artist;
	let currentPlayingTitle = $currentPlaying?.title;
	let loading: boolean;

	// Adjust this value to change the lead time (in milliseconds)
	const leadTime = -600;

	const syncTime = async () => {
		let c: number = await invoke('get_current_audio_time');
		c.toFixed(2);
		time = c;
	};

	$: {
		// console.log($currentPlaying);
		// console.log(time);
		// console.log(currentLine);
		currentPlayingArtist = $currentPlaying?.artist;
		currentPlayingTitle = $currentPlaying?.title;
		loading = lyricsLoading;
	}

	onMount(async () => {
		setInterval(syncTime, 1000);
		// check if current playing is the same as the previous one
		// if not, fetch lyrics
		// if it is, do nothing

		getLyrics(await getCurrentPlaying()).then((data) => {
			lyrics = data;
			sync = new Lyrics(lyrics);
			prevPlaying = $currentPlaying;
			console.log('synx', sync.lines);
		});
		setInterval(async () => {
			console.log('curr', $currentPlaying);
			console.log('prev', prevPlaying);
			console.log(await getCurrentPlaying());
			currentLine = sync.atTime(time - leadTime / 1000); // Subtract leadTime from time
			nextLine = sync.atTime(time + 1);
			if ((await getCurrentPlaying()) != prevPlaying) {
				getLyrics(await getCurrentPlaying()).then((data) => {
					lyrics = data;
					sync = new Lyrics(lyrics);
					prevPlaying = $currentPlaying;
				});
			}
		}, 200);
	});
</script>

<div class="relative flex min-h-[80vh] min-w-full items-center justify-center rounded-xl">
	<Tabs.Root value="syncedLyrics">
		<div class="absolute left-0 top-0 min-w-full gap-2 text-sm uppercase">
			<div class="flex min-w-full justify-between">
				<div class="flex gap-2">
					<div class="song-title font-semibold text-gray-900">{currentPlayingTitle} -</div>
					<div class="song-artist text-gray-600">{currentPlayingArtist}</div>
				</div>

				<Tooltip.Root>
					<Tooltip.Trigger>
						<Download />
					</Tooltip.Trigger>
					<Tooltip.Content side="bottom">
						<p>Download LRC file</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</div>
			<div class="flex min-w-full items-center justify-center">
				<Tabs.List>
					<Tabs.Trigger value="syncedLyrics">Synced lyrics</Tabs.Trigger>
					<Tabs.Trigger value="plainLyrics">Plain lyrics</Tabs.Trigger>
				</Tabs.List>
			</div>
		</div>

		<Tabs.Content value="syncedLyrics">
			<div class="lyrics text-center text-3xl font-extrabold">
				<!-- {#if loading}
					<div class="text-2xl">Loading...</div>
				{:else} -->
				{currentLine?.text || 'Loading...'}
				<!-- <div class="sub text-2xl opacity-75">{nextLine?.text || '-'}</div> -->
				<!-- {/if} -->
			</div>
		</Tabs.Content>
		<Tabs.Content value="plainLyrics" class="whitespace-pre pt-16">
			<ScrollArea class="h-[70vh] w-full p-4">
				<!-- {#if loading}
					<div class="text-2xl">Loading...</div>
				{:else} -->
				{$plainLyrics}
				<!-- {/if} -->
			</ScrollArea>
		</Tabs.Content>
	</Tabs.Root>
</div>
