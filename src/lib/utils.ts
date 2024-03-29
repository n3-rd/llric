import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";
import { invoke } from '@tauri-apps/api/tauri';
import { currentLyrics, currentPlaying, plainLyrics, type Track } from "./stores";


export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
    y?: number;
    x?: number;
    start?: number;
    duration?: number;
};

export const flyAndScale = (
    node: Element,
    params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
    const style = getComputedStyle(node);
    const transform = style.transform === "none" ? "" : style.transform;

    const scaleConversion = (
        valueA: number,
        scaleA: [number, number],
        scaleB: [number, number]
    ) => {
        const [minA, maxA] = scaleA;
        const [minB, maxB] = scaleB;

        const percentage = (valueA - minA) / (maxA - minA);
        const valueB = percentage * (maxB - minB) + minB;

        return valueB;
    };

    const styleToString = (
        style: Record<string, number | string | undefined>
    ): string => {
        return Object.keys(style).reduce((str, key) => {
            if (style[key] === undefined) return str;
            return str + `${key}:${style[key]};`;
        }, "");
    };

    return {
        duration: params.duration ?? 200,
        delay: 0,
        css: (t) => {
            const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
            const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
            const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

            return styleToString({
                transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                opacity: t
            });
        },
        easing: cubicOut
    };
};

export let lyricsLoading = true;

export const getLyrics = async (track: Track) => {
    lyricsLoading = true;
    try {
        const response = await fetch(
            `https://lrclib.net/api/search?artist_name=${track.artist}&track_name=${track.title}`
        );
        if (!response.ok) {
            throw new Error('Failed to fetch lyrics');
        }
        const data = await response.json();
        const lyrics = data[0].syncedLyrics;
        currentLyrics.set(lyrics);
        plainLyrics.set(data[0].plainLyrics);
        lyricsLoading = false;
        return lyrics;
    } catch (error) {
        console.error('Error fetching lyrics:', error);
        lyricsLoading = false;
        throw error;
    }
};

export const getCurrentPlaying = async () => {
    try {
        const response: Track = await invoke('get_current_media_metadata');
        currentPlaying.set(response);
        return response;
    } catch (error) {
        console.error('Error getting current playing track:', error);
        throw error;
    }
};