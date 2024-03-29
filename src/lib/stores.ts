import { writable } from "svelte/store";

export type Track = {
    artist: string;
    title: string;
    album: string;
};

export type Lyrics = Array<{ time: number; text: string }>;

const currentPlaying = writable<Track | null>(null);

export const currentLyrics = writable<Array<Lyrics> | null>(null);
export const plainLyrics = writable<string | null>(null);


export { currentPlaying };