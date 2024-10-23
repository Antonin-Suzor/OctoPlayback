<script lang="ts">
    import {convertFileSrc} from '@tauri-apps/api/core';
    import type {Config, Grid, Playlist, Track} from './octoTypes';
    import {getGridFromXY} from './logic';

    let audio: HTMLAudioElement;
    let playing = false;
    let currentPlaylist: Playlist;
    let currentTrack: Track;
    let currentTwinNumber = 0;
    let volumeSlider: HTMLInputElement;
    let currentVolume = 80;

    let hasConfig = false;
    let config: Config;
    let currentGrid: Grid;
    let currentX: number;
    let currentY: number;
    let maxTwinCount: number;

    let fileInput: HTMLInputElement;
    function loadConfigFile() {
        const file = fileInput.files?.[0];  // Get the first file

        if (file) {
            const fileReader = new FileReader();

            // When the file will be read
            fileReader.onload = () => {
                try {
                    config = JSON.parse(fileReader.result as string);
                    maxTwinCount = config.maxTwinCount;
                    currentX = config.map.startX;
                    currentY = config.map.startY;
                    currentGrid = getGridFromXY(config, currentX, currentY);
                    hasConfig = true;
                } catch (error) {
                    hasConfig = false;
                }
            };

            // Read the file as text
            fileReader.readAsText(file);
        }
    }

    async function playPlaylist(name: string): Promise<void> {
        const playlist = config.playlists.find(playlist => playlist.name === name) as Playlist;
        const firstTrackName = playlist.trackNameList.at(0);
        const firstTrack = config.tracks.find(track => track.name === firstTrackName) as Track;
        audio.src = convertFileSrc(firstTrack.filepathTwins[currentTwinNumber]);
        currentPlaylist = playlist;
        currentTrack = firstTrack;
    }

    function playPause() {
        if (!audio) {
            return;
        }
        if (audio.paused) {
            audio.play();
            playing = true;
        }
        else {
            audio.pause();
            playing = false;
        }
    }
    function restartTrack() {
        if (!audio) {
            return;
        }
        audio.currentTime = 0;
    }
    function changeVolume() {
        let newVolume = Number.parseInt(volumeSlider.value) / 100;
        currentVolume = newVolume;
        audio.volume = newVolume;
    }
</script>

<body>
    <h1>OctoPlayback</h1>
    <p>A loop-based music player with Octopath Traveler OST in mind</p>
    <input bind:this={fileInput} accept=".json" type="file" on:change={loadConfigFile} />
    {#if !hasConfig}
        <h2>It seems that you have not loaded a config file.</h2>
    {:else}
        <div><!-- horizontal break --></div>
        {#if maxTwinCount > 1}
            Twin selection:
            {#each {length: maxTwinCount} as _, i}
            <label>
                <input type="radio" name="currentTwinNumber" value={i} bind:group={currentTwinNumber} />
                {i + 1}
            </label>
            {/each}
        {/if}
        <audio bind:this={audio} controls>
            If you see this, some error has occurred when loading an audio file.
        </audio>
        <div>
            Track controls:
            <button on:click={playPause}>{playing ? 'Playing' : 'Paused'}</button>
            <button on:click={restartTrack}>Restart</button>
            <input bind:this={volumeSlider} type="range" name="currentVolume" min="0" max="100" value="80" on:change={changeVolume} />
        </div>
        <div><!-- horizontal break --></div>
        {#each currentGrid.playlistNameMatrix as playListNameList, i}
            <ol>
                Matrix line {i}
                {#each playListNameList as playlistName, j}
                    <li>Line item {j} <button on:click={() => playPlaylist(playlistName)}>Playlist: {playlistName}</button></li>
                {/each}
            </ol>
        {/each}
    {/if}
</body>

<style>
    body {
        text-align: center;
    }
    * {
        border: 1px solid gray;
    }
</style>
