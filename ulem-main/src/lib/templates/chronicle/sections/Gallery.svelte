<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  export let invitation: any;

  const images: string[] = invitation?.gallery.imageUrls || [];

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

  // Layout: first card is wide (2-col), rest are single
  // Uses index to vary sizes: 0=2col, others alternate
</script>

<section bind:this={el} class="w-full px-6 py-24" style="background:#f0f4ff;">
  <!-- Chapter header -->
  <div
    class="mb-10 flex items-center gap-3"
    style="opacity:{visible ? 1 : 0};transform:translateX({visible
      ? 0
      : -16}px);transition:opacity 600ms ease,transform 600ms ease;"
  >
    <div style="width:3px;height:32px;background:#2c3e6b;flex-shrink:0;"></div>
    <div>
      <p
        class="text-xs tracking-[0.55em] uppercase"
        style="color:#2c3e6b;font-family:var(--font-heading,sans-serif);"
      >
        Chapter 05
      </p>
      <p
        class="text-lg font-bold"
        style="color:#0d1829;font-family:var(--font-heading,sans-serif);letter-spacing:-0.02em;"
      >
        Gallery
      </p>
    </div>
    <!-- Count badge -->
    <div
      class="ml-auto flex items-center gap-1.5 px-3 py-1"
      style="background:#0d1829;border:1px solid rgba(44,60,107,0.3);"
    >
      <span
        class="text-lg font-bold"
        style="color:#2c3e6b;font-family:var(--font-heading,sans-serif);">{images.length}</span
      >
      <span class="text-xs" style="color:#64748b;font-family:var(--font-heading,sans-serif);"
        >foto</span
      >
    </div>
  </div>

  {#if visible}
    <!-- Photo grid — editorial numbered layout -->
    <div class="flex flex-col gap-2">
      {#each images as src, i}
        <button
          in:fade={{ delay: i * 50, duration: 450 }}
          onclick={() => openLightbox(i)}
          class="group relative w-full cursor-pointer overflow-hidden"
          style="aspect-ratio:{i === 0 ? '16/9' : i % 3 === 0 ? '4/3' : '1/1'};"
          aria-label="Lihat foto {i + 1}"
        >
          <img
            {src}
            alt="Gallery {i + 1}"
            class="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />

          <!-- Number badge overlay -->
          <div
            class="absolute top-0 left-0 flex h-7 w-7 items-center justify-center text-xs font-bold"
            style="background:{i % 2 === 0
              ? '#2c3e6b'
              : '#c4754a'};color:#fff;font-family:var(--font-heading,sans-serif);"
          >
            {String(i + 1).padStart(2, '0')}
          </div>

          <!-- Hover overlay -->
          <div
            class="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style="background:rgba(13,24,41,0.5);"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="color:#fff;">
              <path
                d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </div>
        </button>
      {/each}
    </div>
  {/if}
</section>

<!-- Lightbox -->
{#if lightboxIndex !== null}
  <div
    role="dialog"
    aria-modal="true"
    aria-label="Lightbox foto"
    tabindex="-1"
    class="fixed inset-0 z-50 flex items-center justify-center"
    style="background:rgba(13,24,41,0.96);"
    in:fade={{ duration: 200 }}
  >
    <button
      onclick={closeLightbox}
      class="absolute top-5 right-5 flex h-9 w-9 items-center justify-center transition-all duration-200"
      style="background:rgba(255,255,255,0.08);color:#f0f4ff;"
      aria-label="Tutup"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M1 1l12 12M13 1L1 13"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
    </button>

    <button
      onclick={prev}
      class="absolute left-4 flex h-10 w-10 items-center justify-center transition-all duration-200"
      style="background:#2c3e6b;color:#fff;"
      aria-label="Sebelumnya"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M9 2L3 7l6 5"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <img
      src={images[lightboxIndex]}
      alt="Gallery {lightboxIndex + 1}"
      style="max-width:90vw;max-height:82vh;object-fit:contain;display:block;border:1px solid rgba(44,60,107,0.3);"
    />

    <button
      onclick={next}
      class="absolute right-4 flex h-10 w-10 items-center justify-center transition-all duration-200"
      style="background:#2c3e6b;color:#fff;"
      aria-label="Berikutnya"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M5 2l6 5-6 5"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <!-- Counter -->
    <div class="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2">
      <span
        class="text-sm font-bold"
        style="color:#2c3e6b;font-family:var(--font-heading,sans-serif);"
        >{String(lightboxIndex + 1).padStart(2, '0')}</span
      >
      <span style="color:#334155;font-family:var(--font-heading,sans-serif);">/</span>
      <span class="text-sm" style="color:#475569;font-family:var(--font-heading,sans-serif);"
        >{String(images.length).padStart(2, '0')}</span
      >
    </div>
  </div>
{/if}
