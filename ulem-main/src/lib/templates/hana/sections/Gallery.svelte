<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  export let invitation: any;

  const images: string[] = invitation?.gallery.imageUrls || [];

  let el: HTMLElement;
  let visible = false;

  // Lightbox
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
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    if (el) observer.observe(el);
    return () => observer.disconnect();
  });
</script>

<section bind:this={el} class="w-full px-6 py-20" style="background:#f7f4f0;">
  <!-- Header -->
  <div
    class="mb-10 text-center"
    style="opacity:{visible ? 1 : 0};transform:translateY({visible
      ? 0
      : -14}px);transition:opacity 700ms ease,transform 700ms ease;"
  >
    <p
      class="text-xs tracking-[0.5em] uppercase"
      style="color:#b8a99a;font-family:var(--font-heading,serif);"
    >
      Momen Bersama
    </p>
    <p class="mt-2 text-2xl" style="color:#4a3f35;font-family:var(--font-script,cursive);">
      Gallery
    </p>
    <div class="mx-auto mt-3 flex items-center gap-2" style="width:140px;">
      <div
        style="flex:1;height:1px;background:linear-gradient(to right,transparent,#8fa89c 60%);"
      ></div>
      <svg width="6" height="6" viewBox="0 0 6 6"
        ><rect
          x="0.5"
          y="0.5"
          width="5"
          height="5"
          transform="rotate(45 3 3)"
          fill="none"
          stroke="#8fa89c"
          stroke-width="0.8"
        /></svg
      >
      <div
        style="flex:1;height:1px;background:linear-gradient(to left,transparent,#8fa89c 60%);"
      ></div>
    </div>
  </div>

  <!-- Pinterest-style 2-col grid -->
  {#if visible}
    <div class="mx-auto grid max-w-xs grid-cols-2 gap-2">
      {#each images as src, i}
        <button
          in:fade={{ delay: i * 60, duration: 500 }}
          onclick={() => openLightbox(i)}
          class="block w-full cursor-pointer overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
          style="
            border:1px solid #ede7e0;
            box-shadow:0 2px 12px rgba(180,150,130,0.08);
            aspect-ratio:{i % 3 === 0 ? '3/4' : '1/1'};
          "
          aria-label="Lihat foto {i + 1}"
        >
          <img
            {src}
            alt="Gallery {i + 1}"
            class="h-full w-full object-contain"
            style="filter:brightness(0.95) saturate(0.88);"
          />
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
    style="background:rgba(74,63,53,0.92);"
    in:fade={{ duration: 200 }}
  >
    <button
      onclick={closeLightbox}
      class="absolute top-4 right-4 text-2xl transition-opacity hover:opacity-70"
      style="color:#faf8f5;font-family:var(--font-heading,serif);"
      aria-label="Tutup">✕</button
    >

    <button
      onclick={prev}
      class="absolute left-3 text-xl transition-opacity hover:opacity-70"
      style="color:#faf8f5;"
      aria-label="Foto sebelumnya">‹</button
    >

    <div
      style="max-width:90vw;max-height:80vh;border:1px solid rgba(255,255,255,0.15);box-shadow:0 20px 60px rgba(0,0,0,0.4);"
    >
      <img
        src={images[lightboxIndex]}
        alt="Gallery {lightboxIndex + 1}"
        style="max-width:90vw;max-height:80vh;object-fit:contain;display:block;"
      />
    </div>

    <button
      onclick={next}
      class="absolute right-3 text-xl transition-opacity hover:opacity-70"
      style="color:#faf8f5;"
      aria-label="Foto berikutnya">›</button
    >

    <p
      class="absolute bottom-4 text-xs tracking-widest"
      style="color:rgba(250,248,245,0.5);font-family:var(--font-heading,serif);"
    >
      {lightboxIndex + 1} / {images.length}
    </p>
  </div>
{/if}
