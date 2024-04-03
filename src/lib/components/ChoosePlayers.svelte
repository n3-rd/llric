<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { playerDialog } from '$lib/stores';
	import { Separator } from '$lib/components/ui/separator';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import DialogFooter from './ui/dialog/dialog-footer.svelte';
	import { Footer } from './ui/card';
	import Button from './ui/button/button.svelte';
	import { setDefaultPlayer } from '$lib/utils';
	let dialogOpen: boolean;
	let defaultPlayer: any;
	const players = [
		{
			name: 'Rhythmbox',
			value: 'smplayer,rhythmbox'
		},
		{
			name: 'Clementine',
			value: 'clementine'
		},
		{
			name: 'Spotify',
			value: 'spotify'
		},
		{
			name: 'VLC',
			value: 'vlc'
		},
		{
			name: 'Audacious',
			value: 'audacious'
		},
		{
			name: 'Banshee',
			value: 'banshee'
		},
		{
			name: 'Quod Libet',
			value: 'quodlibet'
		}
	];

	$: {
		dialogOpen = $playerDialog;
		console.log(dialogOpen);
		console.log($playerDialog);
		console.log(defaultPlayer);
	}
</script>

<Dialog.Root bind:open={dialogOpen}>
	<!-- <Dialog.Trigger>Open</Dialog.Trigger> -->
	<Dialog.Content class="z-[999] bg-white dark:bg-black">
		<Dialog.Header>
			<Dialog.Title>Choose music player source</Dialog.Title>
			<Dialog.Description>
				The app will get lyrics from any of the following supported music players
			</Dialog.Description>
			<Separator />
			<div class="w-full">
				<ToggleGroup.Root
					type="single"
					class="relative flex flex-wrap gap-3"
					bind:value={defaultPlayer}
				>
					{#each players as player}
						<ToggleGroup.Item value={player.value}>{player.name}</ToggleGroup.Item>
					{/each}
				</ToggleGroup.Root>
			</div>
		</Dialog.Header>
		<Dialog.Footer>
			<Button
				class="btn btn-primary"
				on:click={() => {
					playerDialog.set(false);

					setDefaultPlayer(defaultPlayer);
				}}>Save</Button
			>
			<Button class="btn btn-secondary" on:click={() => playerDialog.set(false)}>Cancel</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
