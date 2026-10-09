<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  export let invitation: any;

  const groomName: string = invitation.groom?.name || 'Groom';
  const brideName: string = invitation.bride?.name || 'Bride';
  const coverImage: string = invitation.cover?.imageUrls?.[0] || '';
  const guestName: string = invitation.guestName || 'Tamu Undangan';

  let show = false;

  onMount(() => {
    show = true;
    document.documentElement.style.scrollSnapType = 'y mandatory';
    document.documentElement.style.overflowY = 'scroll';
  });

  const dispatch = createEventDispatcher();
  function open() {
    dispatch('open');
  }
</script>

{#if show}
  <section
    data-deck-page
    in:fade={{ duration: 700 }}
    class="deck-page relative flex h-svh w-full flex-col items-center justify-end overflow-hidden"
  style="scroll-snap-align: start;"
>
    <!-- Full bleed photo -->
    {#if coverImage}
      <img
        src={coverImage}
        alt=""
        class="absolute inset-0 h-full w-full object-cover"
        style="filter: brightness(0.55) saturate(1.05);"
      />
    {:else}
      <div
        class="absolute inset-0"
        style="background: linear-gradient(160deg, #1a1a2a 0%, #0a0a12 100%);"
      ></div>
    {/if}

    <!-- Gradient overlay -->
    <div
      class="absolute inset-0"
      style="background: linear-gradient(to top, rgba(6,6,10,0.95) 0%, rgba(6,6,10,0.4) 45%, transparent 100%);"
    ></div>

    <!-- Top label -->
    <div
      in:fly={{ y: -16, delay: 500, duration: 700, easing: cubicOut }}
      class="absolute top-10 right-0 left-0 flex justify-center"
    >
      <div class="deck-chip">Undangan Pernikahan</div>
    </div>

    <!-- Bottom content -->
    <div
      in:fly={{ y: 32, delay: 400, duration: 800, easing: cubicOut }}
      class="relative z-10 w-full px-8 pb-16 text-center"
    >
      <p class="deck-overline mb-3">Kepada Yth.</p>
      <p class="deck-guest mb-6">{guestName}</p>

      <div class="deck-divider mx-auto mb-6"></div>

      <h1 class="deck-names mb-2">{brideName}</h1>
      <p class="deck-amp mb-2">&</p>
      <h1 class="deck-names mb-8">{groomName}</h1>

      <button on:click={open} class="deck-btn-primary"> Buka Undangan </button>
    </div>

    <!-- Swipe hint -->
    <div
      in:fade={{ delay: 1400, duration: 600 }}
      class="absolute right-0 bottom-4 left-0 flex flex-col items-center gap-1 opacity-40"
      aria-hidden="true"
    >
      <div class="deck-swipe-arrow"></div>
      <span style="font-size: 9px; letter-spacing: 0.2em; color: #fff; text-transform: uppercase;"
        >swipe</span
      >
    </div>
  </section>
{/if}

<style>
  :global(html) {
    overflow-y: scroll;
    scroll-snap-type: y mandatory;
  }
  .deck-page {
    height: 100svh;
  }
  .deck-chip {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 20px;
    padding: 5px 16px;
    font-size: 10px;
    letter-spacing: 0.25em;
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
  }
  .deck-overline {
    font-size: 10px;
    letter-spacing: 0.2em;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
  }
  .deck-guest {
    font-size: 15px;
    color: rgba(255, 255, 255, 0.75);
    font-family: var(--font-body, sans-serif);
  }
  .deck-divider {
    width: 32px;
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
  }
  .deck-names {
    font-family: var(--font-script, cursive);
    font-size: clamp(2.2rem, 11vw, 3.2rem);
    color: #fff;
    line-height: 1;
  }
  .deck-amp {
    font-size: 13px;
    letter-spacing: 0.3em;
    color: rgba(255, 255, 255, 0.35);
    text-transform: uppercase;
  }
  .deck-btn-primary {
    display: inline-block;
    background: #fff;
    color: #08080f;
    border: none;
    border-radius: 100px;
    padding: 13px 36px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
  }
  .deck-swipe-arrow {
    width: 1px;
    height: 20px;
    background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.5));
    animation: deckSwipeArrow 1.4s ease-in-out infinite;
  }
  @keyframes deckSwipeArrow {
    0%,
    100% {
      transform: translateY(0);
      opacity: 0.4;
    }
    50% {
      transform: translateY(-6px);
      opacity: 1;
    }
  }

  /* Shared deck component styles */
  :global(.deck-card) {
    width: 100%;
    max-width: 340px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    overflow: hidden;
  }
  :global(.deck-card-header) {
    padding: 16px 20px 14px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  :global(.deck-label) {
    font-size: 9px;
    letter-spacing: 0.25em;
    color: rgba(255, 255, 255, 0.3);
    text-transform: uppercase;
  }
  :global(.deck-num) {
    font-size: 9px;
    letter-spacing: 0.12em;
    color: rgba(255, 255, 255, 0.15);
  }
  :global(.deck-title) {
    font-family: var(--font-heading, sans-serif);
    font-size: 1.15rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.2;
  }
  :global(.deck-body) {
    padding: 20px;
  }
  :global(.deck-script) {
    font-family: var(--font-script, cursive);
    font-size: clamp(2rem, 10vw, 3rem);
    color: #fff;
    line-height: 1.1;
  }
  :global(.deck-small) {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.45);
    letter-spacing: 0.05em;
  }
  :global(.deck-page-bg) {
    position: absolute;
    inset: 0;
    background: #06060a;
  }
</style>
