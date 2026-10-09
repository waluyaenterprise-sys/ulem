<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  export let invitation: any;

  const images: string[] = invitation?.gallery?.imageUrls || [];
  let visible = false;
  let sectionEl: HTMLElement;
  let lightboxIdx: number | null = null;

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible = true;
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    if (sectionEl) observer.observe(sectionEl);
    return () => observer.disconnect();
  });
</script>

<section bind:this={sectionEl} class="w-full py-16" style="background:#081018;">
  {#if visible}
    <!-- Section header -->
    <div in:fade={{ duration: 600 }} class="mb-10 px-5 text-center">
      <p
        class="text-xs tracking-[0.55em] uppercase"
        style="color:rgba(201,168,76,0.5);font-family:var(--font-heading,serif);"
      >
        Evidence
      </p>
      <p
        class="mt-2 text-sm tracking-[0.45em] uppercase"
        style="color:#c9a84c;font-family:var(--font-heading,serif);"
      >
        Photo Gallery
      </p>
      <div style="width:40px;height:1px;background:rgba(201,168,76,0.4);margin:10px auto 0;"></div>
      <p
        class="mt-3 text-xs tracking-[0.2em]"
        style="color:rgba(201,168,76,0.3);font-family:monospace;"
      >
        CLASSIFIED DOCUMENT — CONTAINS {images.length} PHOTOGRAPHS
      </p>
    </div>

    <!-- Contact sheet / visa photo grid -->
    <div class="px-4">
      <!-- Sheet border -->
      <div class="relative mx-auto" style="max-width:380px;">
        <!-- Outer film frame -->
        <div
          style="
          background:#040c14;
          border:2px solid rgba(201,168,76,0.2);
          padding:12px;
          box-shadow:inset 0 0 30px rgba(0,0,0,0.5);
        "
        >
          <!-- Sheet label strip -->
          <div
            class="mb-3 flex items-center justify-between pb-2"
            style="border-bottom:1px solid rgba(201,168,76,0.12);"
          >
            <p
              class="text-sm tracking-[0.35em] uppercase"
              style="color:rgba(201,168,76,0.3);font-family:monospace;"
            >
              Contact Sheet
            </p>
            <p
              class="text-sm tracking-[0.25em]"
              style="color:rgba(201,168,76,0.2);font-family:monospace;"
            >
              {images.length} exp.
            </p>
          </div>

          <!-- Photo grid -->
          <div class="grid gap-1.5" style="grid-template-columns:repeat(3,1fr);">
            {#each images as img, i}
              <button
                type="button"
                in:fly={{ y: 12, delay: 100 + i * 50, duration: 500, easing: cubicOut }}
                on:click={() => (lightboxIdx = i)}
                aria-label="View photo {i + 1}"
                class="group relative block overflow-hidden"
                style="
                  aspect-ratio:3/4;
                  border:1px solid rgba(201,168,76,0.15);
                  background:#0a1828;
                "
              >
                <!-- Negative number strip top -->
                <div
                  class="absolute top-0 right-0 left-0 z-10 flex items-center justify-between px-1"
                  style="height:12px;background:rgba(4,12,20,0.9);"
                >
                  <span
                    class="text-xs"
                    style="color:rgba(201,168,76,0.35);font-family:monospace;"
                    >{String(i + 1).padStart(2, '0')}</span
                  >
                  <span class="text-xs" style="color:rgba(201,168,76,0.2);font-family:monospace;"
                    >▲</span
                  >
                </div>

                <img
                  src={img}
                  alt="Gallery {i + 1}"
                  class="h-full w-full object-contain transition-all duration-500"
                  style="
                    filter:sepia(15%) brightness(0.75) contrast(1.05);
                    margin-top:12px;height:calc(100% - 12px);
                  "
                />

                <!-- Hover overlay -->
                <div
                  class="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.4);"
                >
                  <span style="color:#c9a84c;font-size:16px;">+</span>
                </div>
              </button>
            {/each}
          </div>

          <!-- Bottom strip -->
          <div
            class="mt-3 flex items-center justify-between pt-2"
            style="border-top:1px solid rgba(201,168,76,0.12);"
          >
            <p
              class="text-sm tracking-[0.3em] uppercase"
              style="color:rgba(201,168,76,0.2);font-family:monospace;"
            >
              WD-GALLERY-{new Date().getFullYear()}
            </p>
            <div class="flex gap-px">
              {#each Array(8) as _}
                <div style="width:4px;height:6px;background:rgba(201,168,76,0.12);"></div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</section>

<!-- Lightbox -->
{#if lightboxIdx !== null && images[lightboxIdx]}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center"
    style="background:rgba(4,8,16,0.95);"
    in:fade={{ duration: 200 }}
    role="dialog"
    aria-modal="true"
    aria-label="Photo viewer"
    tabindex="-1"
  >
    <div class="relative mx-6 w-full" style="max-width:360px;">
      <!-- Close -->
      <button
        type="button"
        on:click={() => (lightboxIdx = null)}
        class="absolute -top-8 right-0 text-xs tracking-[0.4em] uppercase"
        style="color:rgba(201,168,76,0.5);font-family:var(--font-heading,serif);"
      >
        ✕ Close
      </button>

      <div style="border:1px solid rgba(201,168,76,0.3);">
        <!-- Number strip -->
        <div
          class="flex justify-between px-3 py-1.5"
          style="background:#040c14;border-bottom:1px solid rgba(201,168,76,0.15);"
        >
          <span class="text-sm" style="color:rgba(201,168,76,0.4);font-family:monospace;">
            Frame {String(lightboxIdx + 1).padStart(2, '0')} / {String(images.length).padStart(
              2,
              '0'
            )}
          </span>
          <span class="text-sm" style="color:rgba(201,168,76,0.25);font-family:monospace;">
            WD-{new Date().getFullYear()}
          </span>
        </div>
        <img
          src={images[lightboxIdx]}
          alt="Gallery"
          style="width:100%;max-height:70svh;object-fit:cover;display:block;filter:sepia(10%) contrast(1.05);"
        />
      </div>

      <!-- Nav buttons -->
      <div class="mt-3 flex justify-between">
        <button
          type="button"
          on:click={() => {
            if (lightboxIdx !== null && lightboxIdx > 0) lightboxIdx--;
          }}
          class="px-4 py-2 text-xs tracking-[0.3em] uppercase"
          style="color:{lightboxIdx !== null && lightboxIdx > 0
            ? '#c9a84c'
            : 'rgba(201,168,76,0.2)'};font-family:var(--font-heading,serif);border:1px solid {lightboxIdx !==
            null && lightboxIdx > 0
            ? 'rgba(201,168,76,0.3)'
            : 'rgba(201,168,76,0.1)'};"
          disabled={lightboxIdx === null || lightboxIdx === 0}
        >
          ← Prev
        </button>
        <button
          type="button"
          on:click={() => {
            if (lightboxIdx !== null && lightboxIdx < images.length - 1) lightboxIdx++;
          }}
          class="px-4 py-2 text-xs tracking-[0.3em] uppercase"
          style="color:{lightboxIdx !== null && lightboxIdx < images.length - 1
            ? '#c9a84c'
            : 'rgba(201,168,76,0.2)'};font-family:var(--font-heading,serif);border:1px solid {lightboxIdx !==
            null && lightboxIdx < images.length - 1
            ? 'rgba(201,168,76,0.3)'
            : 'rgba(201,168,76,0.1)'};"
          disabled={lightboxIdx === null || lightboxIdx === images.length - 1}
        >
          Next →
        </button>
      </div>
    </div>
  </div>
{/if}
