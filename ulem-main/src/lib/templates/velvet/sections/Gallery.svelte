<script lang="ts">
  import { onMount } from 'svelte';

  export let invitation: any;

  const images: string[] = invitation?.gallery?.imageUrls || [];

  let visible = false;
  let sectionEl: HTMLElement;

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

<section
  bind:this={sectionEl}
  class="relative w-full overflow-hidden px-5 py-20"
  style="background: linear-gradient(160deg, #1c0f0a 0%, #2d1a0e 50%, #1c0f0a 100%);"
>
  <!-- Warm glow -->
  <div
    class="pointer-events-none absolute"
    style="width:500px;height:500px;border-radius:50%;background:radial-gradient(circle, rgba(232,164,90,0.08) 0%, transparent 70%);top:0;left:50%;transform:translateX(-50%);"
  ></div>

  <!-- Header -->
  <div
    class="mb-12 text-center transition-all duration-700"
    style="opacity:{visible ? 1 : 0};transform:translateY({visible ? 0 : -16}px)"
  >
    <p
      class="text-2xl tracking-[0.3em] uppercase"
      style="color: rgba(232,164,90,0.85); font-family: var(--font-heading, sans-serif);"
    >
      Gallery
    </p>
    <div
      class="mx-auto mt-4"
      style="width:50px;height:1px;background:linear-gradient(to right,transparent,rgba(232,164,90,0.6),transparent);"
    ></div>
  </div>

  <!-- Masonry-style grid -->
  <div class="gallery-grid relative z-10">
    {#each images as img, i}
      <div
        class="gallery-item overflow-hidden rounded-2xl"
        style="
          opacity:{visible ? 1 : 0};
          transform:translateY({visible ? 0 : 30}px);
          transition: opacity 700ms {100 + i * 80}ms ease, transform 700ms {100 +
          i * 80}ms cubic-bezier(0.33,1,0.68,1);
          background: rgba(255,200,120,0.05);
          border: 1px solid rgba(232,164,90,0.18);
          box-shadow: 0 4px 30px rgba(0,0,0,0.4);
        "
      >
        <div
          class="relative overflow-hidden"
          style="height:{i % 3 === 0 ? '220px' : i % 3 === 1 ? '170px' : '195px'};"
        >
          <img
            src={img}
            alt="Gallery"
            class="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <!-- Warm tint overlay -->
          <div
            class="pointer-events-none absolute inset-0"
            style="background:linear-gradient(to bottom, transparent 60%, rgba(28,15,10,0.5));"
          ></div>
        </div>
      </div>
    {/each}
  </div>
</section>

<style>
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  /* Every 5th item spans full width for visual variety */
  .gallery-item:nth-child(5n) {
    grid-column: 1 / -1;
  }
</style>
