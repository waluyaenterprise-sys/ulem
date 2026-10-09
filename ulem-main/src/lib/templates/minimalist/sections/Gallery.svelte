<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  export let invitation: any;

  const images: string[] = invitation.gallery?.imageUrls || [];

  const PREVIEW = 6;
  let expanded = false;

  $: displayed = expanded ? images : images.slice(0, PREVIEW);
  $: hasMore = images.length > PREVIEW;

  let sectionEl: HTMLElement;
  let visible = false;

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
    observer.observe(sectionEl);
    return () => observer.disconnect();
  });

  let selected: string | null = null;
  function open(src: string) {
    selected = src;
    document.body.style.overflow = 'hidden';
  }
  function close() {
    selected = null;
    document.body.style.overflow = '';
  }
</script>

<section bind:this={sectionEl} class="w-full bg-white px-6 py-16 lg:px-10 lg:py-24">
  {#if visible}
    <div class="mx-auto max-w-6xl">
      <!-- HEADER -->
      <div in:fade={{ duration: 1000 }} class="mb-8 text-center">
        <p class="font-script text-4xl text-[#F0A269] lg:text-5xl">Our Moment</p>
        <div class="mx-auto mt-3 h-px w-12 bg-[#F0A269]/30"></div>
      </div>

      <!-- COLUMNS MASONRY — no gaps, images fill naturally -->
      <div
        in:fade={{ duration: 1100, delay: 200 }}
        class="columns-2 gap-1.5 space-y-1.5 lg:columns-3 lg:gap-2 lg:space-y-2 xl:columns-4"
      >
        {#each displayed as src, i (src)}
          <button
            type="button"
            class="block w-full overflow-hidden rounded-xl bg-gray-100 focus:outline-none"
            style="break-inside: avoid;"
            in:fly={{ y: 40, delay: i >= PREVIEW ? (i - PREVIEW) * 120 : 0, duration: 700, easing: cubicOut }}
            on:click={() => open(src)}
          >
            <img
              {src}
              alt=""
              class="block w-full object-contain transition-transform duration-500 hover:scale-105"
            />
          </button>
        {/each}
      </div>

      <!-- EXPAND / COLLAPSE -->
      {#if hasMore}
        <div in:fade={{ delay: 400 }} class="mt-6 text-center">
          <button
            on:click={() => (expanded = !expanded)}
            class="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-2.5
              text-xs text-gray-500 shadow-sm transition hover:bg-gray-50 active:scale-95"
          >
            {#if expanded}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 15l7-7 7 7"
                />
              </svg>
              Sembunyikan
            {:else}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              Lihat semua ({images.length} foto)
            {/if}
          </button>
        </div>
      {/if}
    </div>
  {/if}
</section>

<!-- LIGHTBOX -->
{#if selected}
  <button
    type="button"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
    in:fade={{ duration: 200 }}
    out:fade={{ duration: 200 }}
    on:click={close}
  >
    <img src={selected} alt="" class="max-h-full max-w-full rounded-xl object-contain shadow-2xl" />
  </button>
{/if}
