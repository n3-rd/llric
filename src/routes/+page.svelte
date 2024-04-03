<script lang="ts">
	import { onMount } from 'svelte';
	import { invoke } from '@tauri-apps/api/tauri';
	import { Lyrics } from 'paroles';
	import { getLyrics, getCurrentPlaying } from '$lib/utils';
	import { currentPlaying, type Track } from '$lib/stores';
	import * as Tabs from '$lib/components/ui/tabs';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Download } from 'lucide-svelte';
	import { plainLyrics } from '$lib/stores';

	let lyrics;
	let sync: Lyrics;
	let time: number = 0;
	let currentLine: { text: any };
	let nextLine;
	let prevPlaying: Track | null;

	let currentPlayingArtist;
	let currentPlayingTitle;
	let prevPlayingTitle;

	const leadTime = -600;

	onMount(async () => {
		prevPlaying = await getCurrentPlaying();
		lyrics = await getLyrics(prevPlaying);
		sync = new Lyrics(lyrics);
		time = await invoke('get_current_audio_time');

		if (prevPlaying) {
			prevPlayingTitle = prevPlaying.title;
		}

		if (sync) {
			currentLine = sync.atTime(time - leadTime / 1000);
			nextLine = sync.atTime(time + 1);
		}
	});

	setInterval(async () => {
		time = await invoke('get_current_audio_time');
		if (sync) {
			console.log(await getCurrentPlaying());
			let playInfo = await getCurrentPlaying();
			currentPlayingArtist = playInfo.artist;
			currentPlayingTitle = playInfo.title;

			// Check if the song has changed
			if (prevPlayingTitle !== currentPlayingTitle) {
				// Update the lyrics and other related information
				lyrics = await getLyrics(playInfo);
				sync = new Lyrics(lyrics);
				currentLine = sync.atTime(time - leadTime / 1000);
				nextLine = sync.atTime(time + 1);

				// Update the previous playing title
				prevPlayingTitle = currentPlayingTitle;
			} else {
				currentLine = sync.atTime(time - leadTime / 1000);
				nextLine = sync.atTime(time + 1);
			}
		}
	}, 1000); // Update every second
</script>

<div class="relative flex min-h-[80vh] min-w-full items-center justify-center rounded-xl">
	<Tabs.Root value="syncedLyrics">
		<div class="absolute left-0 top-0 min-w-full gap-2 text-sm uppercase">
			<div class="flex min-w-full justify-between">
				<div class="flex gap-2">
					<div class="song-title font-semibold text-gray-900">
						{currentPlayingTitle} -
					</div>
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
				{currentLine?.text || '-'}
			</div>
		</Tabs.Content>
		<Tabs.Content value="plainLyrics" class="whitespace-pre pt-16">
			<ScrollArea class="h-[70vh] w-full p-4">
				{$plainLyrics}
			</ScrollArea>
		</Tabs.Content>
	</Tabs.Root>
</div>
