import { invoke } from '@tauri-apps/api/tauri';
import { Lyrics } from 'paroles';
import { getLyrics, getCurrentPlaying } from '$lib/utils';
import { currentPlaying, type Track } from '$lib/stores';
import type { Load } from '@sveltejs/kit';

let lyrics;
let sync: Lyrics;
let time: number = 0;
let currentLine: { text: any };
let nextLine;
let prevPlaying: Track | null;

let _currentPlayingArtist = currentPlaying?.artist;
let _currentPlayingTitle = currentPlaying?.title;

const leadTime = -600;

export const load: Load = async () => {
    prevPlaying = await getCurrentPlaying();
    lyrics = await getLyrics(prevPlaying);
    sync = new Lyrics(lyrics);
    time = await invoke('get_current_audio_time');

    if (sync) {
        currentLine = sync.atTime(time - leadTime / 1000);
        nextLine = sync.atTime(time + 1);
    }

    return {
        props: {
            currentLine,
            nextLine,
            _currentPlayingArtist,
            _currentPlayingTitle
        }
    };
};