<script lang="ts">
  import { onMount } from 'svelte';

  export let invitation: any;
  const gallery: string[] = invitation.gallery?.imageUrls ?? [];

  let el: HTMLElement;
  let visible = false;
  let selected: string | null = null;

  onMount(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          visible = true;
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (el) obs.observe(el);
    return () => obs.disconnect();
  });
</script>

<section
  data-deck-page
  bind:this={el}
  class="deck-page deck-page-bg relative flex h-svh w-full flex-col items-center justify-center overflow-hidden px-6"
  style="scroll-snap-align: start;"
>
  <!-- Lightbox -->
  {#if selected}
    <button
      class="fixed inset-0 z-50 flex items-center justify-center"
      style="background: rgba(0,0,0,0.95);"
      on:click={() => (selected = null)}
    >
      <img
        src={selected}
        alt="Gallery"
        style="max-width: 92vw; max-height: 82vh; object-fit: contain; border-radius: 12px;"
      />
      <span
        style="position: absolute; top: 18px; right: 20px; font-size: 20px; color: rgba(255,255,255,0.4); cursor: pointer;"
        >✕</span
      >
    </button>
  {/if}

  {#if visible}
    <div style="width: 100%; max-width: 340px;">
      <div class="mb-5" style="animation: deckIn 0.5s ease both;">
        <p class="deck-label mb-1">Album</p>
        <h2 class="deck-title">Galeri Foto</h2>
      </div>

      <div class="deck-card" style="animation: deckIn 0.6s ease both;">
        <div class="deck-card-header">
          <span class="deck-label">Momen bersama</span>
          <span class="deck-num">{gallery.length} foto</span>
        </div>
        <div class="deck-body">
          {#if gallery.length === 0}
            <p class="deck-small py-6 text-center">Belum ada foto</p>
          {:else}
            <div class="grid grid-cols-3 gap-1.5">
              {#each gallery as img, i}
                <button
                  on:click={() => (selected = img)}
                  style="aspect-ratio: 1; border-radius: 8px; overflow: hidden; cursor: pointer; animation: deckIn 0.5s ease {i *
                    0.05}s both; border: 1px solid rgba(255,255,255,0.06);"
                >
                  <img src={img} alt="foto {i + 1}" class="h-full w-full object-contain" />
                </button>
              {/each}
            </div>
            <p class="deck-small mt-3 text-center">Tap foto untuk memperbesar</p>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</section>

