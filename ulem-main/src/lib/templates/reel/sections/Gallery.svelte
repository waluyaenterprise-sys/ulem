<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  export let invitation: any;

  const images: string[] =
    invitation?.gallery?.imageUrls ||
    invitation?.galleries?.flatMap((g: any) => g.imageUrls || []) ||
    [];

  let el: HTMLElement;
  let visible = false;
  let lightboxIndex: number | null = null;

  function openLightbox(i: number) {
    lightboxIndex = i;
  }
  function closeLightbox() {
    lightboxIndex = null;
  }
  function prev() {
    if (lightboxIndex !== null) lightboxIndex = (lightboxIndex - 1 + images.length) % images.length;
  }
  function next() {
    if (lightboxIndex !== null) lightboxIndex = (lightboxIndex + 1) % images.length;
  }

  onMount(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          visible = true;
          obs.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    if (el) obs.observe(el);
    return () => obs.disconnect();
  });

  function s(delayMs: number) {
    return `animation: galleryFadeIn 0.7s ease ${delayMs}ms both;`;
  }
</script>

<section
  bind:this={el}
  class="relative w-full overflow-hidden px-6 py-24"
  style="background:#faf0dc;"
>
  <!-- Film grain -->
  <div
    class="film-grain pointer-events-none absolute inset-0"
    style="opacity:0.18"
    aria-hidden="true"
  ></div>

  {#if visible}
    <!-- Scene header -->
    <div style={s(0)} class="mb-8 text-center">
      <p
        class="text-xs tracking-[0.6em] uppercase"
        style="color:#7a6848;font-family:var(--font-heading,sans-serif);"
      >
        Scene V
      </p>
      <p
        class="mt-1 text-xl font-bold"
        style="color:#1a1008;font-family:var(--font-heading,sans-serif);letter-spacing:-0.01em;"
      >
        The Stills
      </p>
      <p class="mt-1 text-xs" style="color:#7a6848;font-family:var(--font-body,sans-serif);">
        Galeri Foto
      </p>
      <div class="mx-auto mt-3" style="width:40px;height:1px;background:#c9933a;opacity:0.6;"></div>
    </div>

    <!-- Filmstrip grid -->
    <!-- Top perforation strip -->
    <div style={s(150)} class="mb-2 flex items-center justify-center gap-2 overflow-hidden">
      {#each Array(14) as _}
        <div
          style="width:10px;height:7px;background:#1a1008;border:1px solid #c9a96e;border-radius:1px;opacity:0.35;flex-shrink:0;"
        ></div>
      {/each}
    </div>

    <!-- Photo grid -->
    <div style={s(200)} class="grid grid-cols-2 gap-0.5">
      {#each images as img, i}
        <button
          onclick={() => openLightbox(i)}
          class="relative overflow-hidden"
          style="aspect-ratio:3/2;background:#1a1008;"
        >
          <img
            src={img}
            alt=""
            class="h-full w-full object-contain transition-transform duration-500"
            style="filter:sepia(0.4) contrast(1.1) brightness(0.85);"
          />
          <!-- Frame number overlay -->
          <div
            class="absolute right-1 bottom-1 px-1 text-xs font-bold"
            style="background:rgba(0,0,0,0.6);color:#c9933a;font-family:var(--font-heading,sans-serif);font-size:0.6rem;"
          >
            {String(i + 1).padStart(2, '0')}
          </div>
        </button>
      {/each}
    </div>

    <!-- Bottom perforation strip -->
    <div style={s(300)} class="mt-2 flex items-center justify-center gap-2 overflow-hidden">
      {#each Array(14) as _}
        <div
          style="width:10px;height:7px;background:#1a1008;border:1px solid #c9a96e;border-radius:1px;opacity:0.35;flex-shrink:0;"
        ></div>
      {/each}
    </div>
  {/if}
</section>

<!-- Lightbox -->
{#if lightboxIndex !== null}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center"
    style="background:rgba(13,9,5,0.97);"
    in:fade={{ duration: 250 }}
  >
    <!-- Film grain in lightbox -->
    <div
      class="film-grain pointer-events-none absolute inset-0"
      style="opacity:0.25"
      aria-hidden="true"
    ></div>

    <!-- Close -->
    <button
      onclick={closeLightbox}
      class="absolute top-4 right-4 z-10 text-lg"
      style="color:#c9933a;background:transparent;border:1px solid rgba(201,147,58,0.4);width:36px;height:36px;display:flex;align-items:center;justify-content:center;"
      >✕</button
    >

    <!-- Image -->
    <div class="relative max-h-[80vh] max-w-[90vw]">
      <!-- Letterbox top -->
      <div style="height:10px;background:#000;" aria-hidden="true"></div>
      <img
        src={images[lightboxIndex]}
        alt=""
        class="block max-h-[70vh] max-w-[90vw] object-contain"
        style="filter:sepia(0.25) contrast(1.05);"
      />
      <!-- Letterbox bottom -->
      <div style="height:10px;background:#000;" aria-hidden="true"></div>
    </div>

    <!-- Nav -->
    <button
      onclick={prev}
      class="absolute left-4 text-lg"
      style="color:#c9933a;background:transparent;border:1px solid rgba(201,147,58,0.4);width:40px;height:40px;display:flex;align-items:center;justify-content:center;"
      >‹</button
    >
    <button
      onclick={next}
      class="absolute right-4 text-lg"
      style="color:#c9933a;background:transparent;border:1px solid rgba(201,147,58,0.4);width:40px;height:40px;display:flex;align-items:center;justify-content:center;"
      >›</button
    >

    <!-- Counter -->
    <div
      class="absolute bottom-4 text-xs tracking-widest"
      style="color:#5a4e38;font-family:var(--font-heading,sans-serif);"
    >
      {String((lightboxIndex ?? 0) + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
    </div>
  </div>
{/if}

<style>
  @keyframes galleryFadeIn {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .film-grain {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
    background-repeat: repeat;
  }
</style>
