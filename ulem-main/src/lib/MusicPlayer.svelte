<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  /** Direct URL to an MP3 (or any browser-supported audio format) */
  export let url: string = '';
  /** Show the floating toggle button */
  export let visible: boolean = false;

  let audio: HTMLAudioElement | null = null;
  let playing = false;

  /** Call from a user-gesture handler to start playback */
  export function play() {
    if (!audio) return;
    audio.play().catch(() => {
      // Browser blocked autoplay — user can tap the button manually
    });
  }

  export function pause() {
    audio?.pause();
  }

  function toggle() {
    if (!audio) return;
    playing ? pause() : play();
  }

  onMount(() => {
    if (!url) return;
    audio = new Audio(url);
    audio.loop = true;
    audio.volume = 0.5;
    audio.addEventListener('play', () => (playing = true));
    audio.addEventListener('pause', () => (playing = false));
    audio.addEventListener('ended', () => (playing = false));
  });

  onDestroy(() => {
    audio?.pause();
    audio = null;
  });
</script>

<!-- Floating music toggle button -->
{#if url && visible}
  <button
    type="button"
    on:click={toggle}
    aria-label={playing ? 'Pause music' : 'Play music'}
    class="fixed right-4 bottom-6 z-50 flex items-center gap-2 rounded-full bg-white/90
      px-4 py-2.5 shadow-lg backdrop-blur-sm transition
      hover:scale-105 active:scale-95"
  >
    {#if playing}
      <!-- Pause icon -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 text-[#F0A269]"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
      </svg>
      <span class="text-[10px] tracking-wide text-gray-500">Pause</span>
    {:else}
      <!-- Music note icon -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 text-[#F0A269]"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
      </svg>
      <span class="text-[10px] tracking-wide text-gray-500">Music</span>
    {/if}
  </button>
{/if}
