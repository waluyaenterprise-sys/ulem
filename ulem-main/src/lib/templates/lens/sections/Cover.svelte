<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';
  import Petals from './Petal.svelte';
  import FlowerIcon from './FlowerIcon.svelte';

  export let invitation: any;

  const groomFirst: string = (invitation.groom?.name || 'Groom').split(' ')[0];
  const brideFirst: string = (invitation.bride?.name || 'Bride').split(' ')[0];
  const guestName: string = invitation.guestName || 'Tamu Undangan';
  const images: string[] = invitation.cover?.imageUrls?.length
    ? invitation.cover.imageUrls
    : ['/images/default/cover.png'];

  let current = 0;
  let prev = -1;
  let direction: 'next' | 'prev' = 'next';
  let transitioning = false;
  let show = false;
  let interval: ReturnType<typeof setInterval>;

  const dispatch = createEventDispatcher();

  onMount(() => {
    show = true;
    if (images.length > 0) {
      interval = setInterval(advance, 4500);
    }
  });

  onDestroy(() => clearInterval(interval));

  function advance() {
    if (transitioning || images.length <= 1) return;
    direction = 'next';
    prev = current;
    transitioning = true;
    setTimeout(() => {
      current = (current + 1) % images.length;
      transitioning = false;
      prev = -1;
    }, 700);
  }

  function openInvitation() {
    dispatch('open');
  }
</script>

{#if show}
  <section
    in:fade={{ duration: 500 }}
class="lens-cover relative flex min-h-svh w-full flex-col items-center justify-end overflow-hidden bg-black"
  >
    <Petals />

    <!-- Decorative flowers -->
    <div class="pointer-events-none absolute top-4 right-4 z-10">
      <FlowerIcon size={48} opacity={0.15} />
    </div>
    <div class="pointer-events-none absolute bottom-28 left-4 z-10">
      <FlowerIcon size={36} opacity={0.1} />
    </div>

    <!-- Slides -->
    {#each images as img, i}
      <div
        class="slide absolute inset-0 bg-cover bg-center"
        class:active={i === current}
        class:leaving={i === prev}
        style="background-image: url('{img}');"
      ></div>
    {/each}

    <!-- Gradient overlay — bottom-heavy for text legibility -->
    <div
      class="pointer-events-none absolute inset-0"
      style="background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.08) 40%, rgba(0,0,0,0.72) 80%, rgba(0,0,0,0.88) 100%);"
    ></div>

    <!-- Slide dots -->
    {#if images.length > 1}
      <div class="absolute top-8 right-6 flex gap-1.5">
        {#each images as _, i}
          <div class="dot transition-all duration-500" class:active={i === current}></div>
        {/each}
      </div>
    {/if}

    <!-- Content -->
    <div class="relative z-10 w-full px-8 pb-14 text-white">
      <!-- Label -->
      <p class="font-body text-[10px] tracking-[0.45em] text-white/50 uppercase">
        Wedding Invitation
      </p>

      <!-- Names -->
      <h1 class="mt-3 font-heading text-5xl leading-none font-light tracking-tight text-white">
        {brideFirst}
      </h1>
      <div class="my-2 flex items-center gap-3">
        <div class="h-px w-8 bg-white/40"></div>
        <p class="font-body text-sm text-white/50">&amp;</p>
        <div class="h-px w-8 bg-white/40"></div>
      </div>
      <h1 class="font-heading text-5xl leading-none font-light tracking-tight text-white">
        {groomFirst}
      </h1>

      <!-- Guest -->
      {#if guestName}
        <div class="mt-6 border-l-2 border-white/20 pl-4">
          <p class="font-body text-[10px] tracking-widest text-white/40 uppercase">Kepada</p>
          <p class="mt-0.5 font-body text-sm text-white/70">{guestName}</p>
        </div>
      {/if}

      <!-- CTA -->
      <button
        class="mt-8 flex items-center gap-3 font-body text-sm tracking-[0.2em] text-white/80 uppercase transition-all active:scale-95"
        on:click={openInvitation}
      >
        <span>Buka Undangan</span>
        <div
          class="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 backdrop-blur-sm"
        >
          <svg
            viewBox="0 0 24 24"
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </div>
      </button>
    </div>
  </section>
{/if}

<style>
  .slide {
    opacity: 0;
    transform: scale(1.04);
    transition:
      opacity 700ms cubic-bezier(0.4, 0, 0.2, 1),
      transform 4500ms ease;
    will-change: opacity, transform;
  }
  .slide.active {
    opacity: 1;
    transform: scale(1);
  }
  .slide.leaving {
    opacity: 0;
    transform: scale(1);
    transition: opacity 700ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .dot {
    width: 16px;
    height: 2px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 1px;
    transition: all 400ms ease;
  }
  .dot.active {
    width: 28px;
    background: rgba(255, 255, 255, 0.9);
  }
</style>
