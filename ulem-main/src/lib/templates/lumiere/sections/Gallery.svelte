<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  export let invitation: any;

  const images: string[] = invitation?.gallery?.imageUrls || [];

  // Pre-assign slight random rotations per polaroid for variety
  const rotations = [-4, 3, -2, 5, -3, 2, -5, 4, -1, 3, -4, 2];

  let visible = false;
  let sectionEl: HTMLElement;
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
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible = true;
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    );
    if (sectionEl) observer.observe(sectionEl);
    return () => observer.disconnect();
  });
</script>

<section bind:this={sectionEl} class="w-full overflow-hidden bg-[#f5f0e8] px-4 py-16">
  <!-- HEADER -->
  <div
    class="mb-10 text-center"
    style="opacity:{visible ? 1 : 0};transform:translateY({visible
      ? 0
      : -16}px);transition:opacity 700ms ease,transform 700ms ease"
  >
    <p class="font-heading text-2xl tracking-[0.3em] text-[#a89880] uppercase">Gallery</p>
    <div class="mx-auto mt-3 w-8 border-t border-[#c9b49a]"></div>
  </div>

  <!-- ROWS OF HANGING POLAROIDS -->
  <!-- Split images into rows of 3 -->
  {#each Array(Math.ceil(images.length / 3)) as _, rowIdx}
    {@const rowImages = images.slice(rowIdx * 3, rowIdx * 3 + 3)}

    <div
      class="mb-10"
      style="opacity:{visible ? 1 : 0};transform:translateY({visible
        ? 0
        : 24}px);transition:opacity 600ms {150 + rowIdx * 200}ms ease,transform 600ms {150 +
        rowIdx * 200}ms ease"
    >
      <!-- String line -->
      <div class="string-line mb-0"></div>

      <!-- Polaroids hanging from the string -->
      <div class="flex justify-around">
        {#each rowImages as img, colIdx}
          {@const globalIdx = rowIdx * 3 + colIdx}
          {@const rot = rotations[globalIdx % rotations.length]}

          <div
            class="flex flex-col items-center"
            style="transform:rotate({rot}deg) translateY({visible
              ? 0
              : 30}px);transform-origin:top center;opacity:{visible
              ? 1
              : 0};transition:opacity 600ms {300 +
              rowIdx * 200 +
              colIdx * 120}ms ease,transform 700ms {300 +
              rowIdx * 200 +
              colIdx * 120}ms cubic-bezier(0.33,1,0.68,1)"
          >
            <!-- Clip + thread -->
            <div class="clip"></div>
            <div class="thread"></div>

            <!-- Polaroid -->
            <button
              onclick={() => openLightbox(globalIdx)}
              class="bg-white p-2 pb-6 shadow-md cursor-pointer transition-shadow hover:shadow-lg"
              style="width: 100px;"
              aria-label="Lihat foto {globalIdx + 1}"
            >
              <div class="h-24 w-full overflow-hidden bg-gray-200">
                <img src={img} alt="Gallery" class="h-full w-full object-cover" />
              </div>
            </button>
          </div>
        {/each}

        <!-- Fill empty slots if last row has fewer than 3 -->
        {#each Array(3 - rowImages.length) as _}
          <div style="width: 100px;"></div>
        {/each}
      </div>
    </div>
  {/each}
</section>

<!-- Lightbox -->
{#if lightboxIndex !== null}
  <div
    role="dialog"
    aria-modal="true"
    aria-label="Lightbox foto"
    tabindex="-1"
    class="fixed inset-0 z-50 flex items-center justify-center"
    style="background:rgba(92,81,71,0.96);"
    in:fade={{ duration: 200 }}
  >
    <button
      onclick={closeLightbox}
      class="absolute top-5 right-5 flex h-9 w-9 items-center justify-center transition-all duration-200"
      style="background:rgba(255,255,255,0.1);color:#f5f0e8;"
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
      style="background:#c9b49a;color:#fff;"
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
      style="max-width:90vw;max-height:82vh;object-fit:contain;display:block;border:1px solid rgba(201,180,154,0.3);"
    />

    <button
      onclick={next}
      class="absolute right-4 flex h-10 w-10 items-center justify-center transition-all duration-200"
      style="background:#c9b49a;color:#fff;"
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
        style="color:#c9b49a;font-family:var(--font-heading,serif);"
        >{String(lightboxIndex + 1).padStart(2, '0')}</span
      >
      <span style="color:#a89880;font-family:var(--font-heading,serif);">/</span>
      <span class="text-sm" style="color:#a89880;font-family:var(--font-heading,serif);"
        >{String(images.length).padStart(2, '0')}</span
      >
    </div>
  </div>
{/if}

<style>
  .string-line {
    position: relative;
    width: 100%;
    height: 2px;
    background: linear-gradient(to right, transparent, #9c8c7c 10%, #9c8c7c 90%, transparent);
  }

  .clip {
    width: 6px;
    height: 18px;
    background: #c9b49a;
    border-radius: 2px;
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
  }

  .thread {
    width: 1.5px;
    height: 14px;
    background: #9c8c7c;
    margin: 0 auto;
  }
</style>
