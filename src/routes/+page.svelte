<script lang="ts">
	import { onMount } from 'svelte';
	import { invoke } from '@tauri-apps/api/tauri';
	import { Lyrics } from 'paroles';
	import {
		getLyrics,
		getCurrentPlaying,
		downloadLyrics,
		getAllPlayers,
		getDefualtPlayer
	} from '$lib/utils';
	import { currentPlaying, type Track } from '$lib/stores';
	import * as Tabs from '$lib/components/ui/tabs';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Download } from 'lucide-svelte';
	import { plainLyrics } from '$lib/stores';
	import CurrentPlaying from '$lib/components/CurrentPlaying.svelte';
	import { browser } from '$app/environment';

	let lyrics;
	let sync: Lyrics;
	let time: number = 0;
	let currentLine: { text: any };
	let nextLine;
	let prevPlaying: Track | null;
	let defaultPlayer;

	$: {
		if (browser) {
			defaultPlayer = localStorage.getItem('defaultPlayer') || 'spotify';
		}
	}

	let currentPlayingArtist;
	let currentPlayingTitle;
	let prevPlayingTitle;

	const leadTime = -600;
	console.log('iii');
	onMount(async () => {
		prevPlaying = await getCurrentPlaying();
		lyrics = await getLyrics(prevPlaying);
		sync = new Lyrics(lyrics);
		const defaultPlayer = localStorage.getItem('defaultPlayer') || 'spotify';
		console.log('dp', defaultPlayer);
		time = await invoke('get_current_audio_time', { player: defaultPlayer });

		if (prevPlaying) {
			prevPlayingTitle = prevPlaying.title;
		}

		if (sync) {
			currentLine = sync.atTime(time - leadTime / 1000);
			nextLine = sync.atTime(time + 1);
		}
	});

	setInterval(async () => {
		const defaultPlayer = await getDefualtPlayer();
		time = await invoke('get_current_audio_time', { player: defaultPlayer });
		if (sync) {
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
	}, 300); // Update every second
</script>

<div
	class="relative flex min-h-[80vh] min-w-full items-center justify-center rounded-xl bg-white dark:bg-black"
>
	<Tabs.Root value="syncedLyrics">
		<div class="absolute left-0 top-0 min-w-full gap-2 text-sm uppercase">
			<CurrentPlaying title={currentPlayingTitle} artist={currentPlayingArtist} />
			<div class="flex min-w-full items-center justify-center">
				<Tabs.List>
					<Tabs.Trigger class="dark:data-[state=active]:bg-black" value="syncedLyrics"
						>Synced lyrics</Tabs.Trigger
					>
					<Tabs.Trigger class="dark:data-[state=active]:bg-black" value="plainLyrics"
						>Plain lyrics</Tabs.Trigger
					>
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

<div class="relative">
	<div class="absolute bottom-0 left-0">
		{defaultPlayer}
	</div>
</div>
