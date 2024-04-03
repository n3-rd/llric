<script lang="ts">
	import { downloadLyrics } from '$lib/utils';
	import { Download } from 'lucide-svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';

	export let title: string;
	export let artist: string;
</script>

<div class="flex min-w-full justify-between">
	<div class="flex gap-2">
		<div class="song-title font-semibold text-gray-900 dark:text-white">
			{title} -
		</div>
		<div class="song-artist text-gray-600 dark:text-gray-300">{artist}</div>
	</div>

	<Tooltip.Root>
		<Tooltip.Trigger>
			<button
				on:click={async () => {
					console.log('Downloading lyrics');
					await downloadLyrics();
				}}
			>
				<Download />
			</button>
		</Tooltip.Trigger>
		<Tooltip.Content side="bottom">
			<p>Download LRC file</p>
		</Tooltip.Content>
	</Tooltip.Root>
</div>
