<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  export let invitation: any;

  const images: string[] = invitation.gallery?.imageUrls || [];

  // Main viewer
  let current = 0;
  let prevIdx = -1;
  let transitioning = false;
  let interval: ReturnType<typeof setInterval>;

  // Touch swipe
  let touchStartX = 0;

  onMount(() => {
    if (images.length > 1) interval = setInterval(advance, 3500);
  });
  onDestroy(() => clearInterval(interval));

  function advance() {
    if (transitioning || images.length <= 1) return;
    go((current + 1) % images.length);
  }

  function go(i: number) {
    if (i === current || transitioning) return;
    prevIdx = current;
    transitioning = true;
    current = i;
    setTimeout(() => {
      transitioning = false;
      prevIdx = -1;
    }, 700);
  }

  function onTouchStart(e: TouchEvent) {
    touchStartX = e.touches[0].clientX;
  }
  function onTouchEnd(e: TouchEvent) {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 44) {
      clearInterval(interval);
      go(diff > 0 ? (current + 1) % images.length : (current - 1 + images.length) % images.length);
      if (images.length > 1) interval = setInterval(advance, 3500);
    }
  }

  function reveal(node: HTMLElement, { delay = 0 } = {}) {
    node.style.opacity = '0';
    node.style.transition = `opacity 1s ease ${delay}ms`;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          node.style.opacity = '1';
          io.unobserve(node);
        }
      },
      { threshold: 0.1 }
    );
    io.observe(node);
    return { destroy: () => io.disconnect() };
  }
</script>

<section class="w-full bg-black">
  <!-- Header -->
  <div use:reveal class="px-8 pt-14 pb-6 text-center">
    <p class="font-body text-[9px] tracking-[0.5em] text-white/30 uppercase">Kenangan</p>
    <p class="mt-2 font-heading text-3xl font-light text-white">Gallery</p>
  </div>

  {#if images.length === 0}
    <div class="flex h-64 items-center justify-center">
      <p class="font-body text-sm text-white/20 italic">Foto akan segera ditambahkan</p>
    </div>
  {:else}
    <!-- Full-screen viewer -->
    <div
      class="relative h-svh w-full overflow-hidden"
      on:touchstart={onTouchStart}
      on:touchend={onTouchEnd}
    >
      {#each images as img, i}
        <div
          class="g-slide absolute inset-0 bg-contain bg-center bg-no-repeat"
          class:g-active={i === current}
          class:g-leaving={i === prevIdx}
          style="background-image: url('{img}');"
        ></div>
      {/each}

      <!-- Bottom gradient -->
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 h-32"
        style="background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);"
      ></div>

      <!-- Counter bottom-left -->
      <div class="absolute bottom-5 left-6 z-10">
        <span class="font-heading text-3xl font-extralight text-white"
          >{String(current + 1).padStart(2, '0')}</span
        >
        <span class="font-body text-sm text-white/30">
          / {String(images.length).padStart(2, '0')}</span
        >
      </div>

      <!-- Dots bottom-right -->
      <div class="absolute right-6 bottom-6 z-10 flex gap-2">
        {#each images as _, i}
          <button
            class="dot-btn"
            class:dot-active={i === current}
            on:click={() => {
              clearInterval(interval);
              go(i);
              if (images.length > 1) interval = setInterval(advance, 3500);
            }}
            aria-label="Go to {i + 1}"
          ></button>
        {/each}
      </div>

      <!-- Left / Right tap zones -->
      {#if images.length > 1}
        <button
          class="absolute inset-y-0 left-0 w-1/3"
          on:click={() => {
            clearInterval(interval);
            go((current - 1 + images.length) % images.length);
            if (images.length > 1) interval = setInterval(advance, 3500);
          }}
          aria-label="Previous"
        ></button>
        <button
          class="absolute inset-y-0 right-0 w-1/3"
          on:click={() => {
            clearInterval(interval);
            go((current + 1) % images.length);
            if (images.length > 1) interval = setInterval(advance, 3500);
          }}
          aria-label="Next"
        ></button>
      {/if}
    </div>

    <!-- Filmstrip thumbnails -->
    {#if images.length > 1}
      <div
        class="flex gap-1 overflow-x-auto px-3 py-3"
        style="-ms-overflow-style:none; scrollbar-width:none;"
      >
        {#each images as img, i}
          <button
            class="film-thumb shrink-0 overflow-hidden transition-all duration-300"
            class:film-active={i === current}
            on:click={() => {
              clearInterval(interval);
              go(i);
              if (images.length > 1) interval = setInterval(advance, 3500);
            }}
          >
            <img src={img} alt="" class="h-full w-full object-cover" loading="lazy" />
          </button>
        {/each}
      </div>
    {/if}
  {/if}

  <div class="h-10"></div>
</section>

<style>
  .g-slide {
    opacity: 0;
    transition: opacity 700ms cubic-bezier(0.4, 0, 0.2, 1);
    will-change: opacity;
  }
  .g-active {
    opacity: 1;
  }
  .g-leaving {
    opacity: 0;
  }

  .dot-btn {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.25);
    transition: all 300ms ease;
  }
  .dot-active {
    background: white;
    transform: scale(1.3);
  }

  .film-thumb {
    width: 56px;
    height: 56px;
    border-radius: 2px;
    opacity: 0.35;
    border: 1.5px solid transparent;
  }
  .film-active {
    opacity: 1;
    border-color: white;
  }
</style>
