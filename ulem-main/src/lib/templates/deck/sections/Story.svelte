<script lang="ts">
  import { onMount } from 'svelte';
  import { formatIndonesianDate } from '$lib/utils/formatDate';

  export let invitation: any;
  const stories: any[] = invitation?.loveStories ?? [];

  let el: HTMLElement;
  let visible = false;
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
  {#if visible}
    <div style="width: 100%; max-width: 340px;">
      <div class="mb-5" style="animation: deckIn 0.5s ease both;">
        <p class="deck-label mb-1">Perjalanan</p>
        <h2 class="deck-title">Our Story</h2>
      </div>

      {#if stories.length === 0}
        <p class="deck-small py-8 text-center">Kisah belum ditambahkan</p>
      {:else}
        <div class="relative overflow-y-auto" style="max-height: 65vh; scrollbar-width: none;">
          <!-- Spine line -->
          <div
            class="pointer-events-none absolute inset-y-0 left-3"
            style="width: 1px; background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.08) 10%, rgba(255,255,255,0.08) 90%, transparent);"
            aria-hidden="true"
          ></div>

          <div class="space-y-3 pl-9">
            {#each stories as s, i}
              {@const dateInfo = s.date ? formatIndonesianDate(s.date) : null}
              <div style="animation: deckIn 0.6s ease {i * 0.1}s both; position: relative;">
                <!-- Node -->
                <div
                  style="position: absolute; left: -26px; top: 14px; width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.1);"
                ></div>

                <div class="deck-card">
                  {#if s.imageUrls?.[0] || s.imageUrl}
                    <div style="height: 80px; overflow: hidden;">
                      <img
                        src={s.imageUrls?.[0] || s.imageUrl}
                        alt={s.title}
                        class="h-full w-full object-cover"
                        style="filter: brightness(0.7) saturate(0.9);"
                      />
                    </div>
                  {/if}
                  <div class="deck-body">
                    {#if dateInfo}
                      <p class="deck-label mb-1">
                        {dateInfo.day} {dateInfo.monthName}
                        {dateInfo.year}
                      </p>
                    {/if}
                    <p
                      style="font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.75); margin-bottom: 4px;"
                    >
                      {s.title || 'Momen'}
                    </p>
                    {#if s.story}
                      <p class="deck-small">{s.story}</p>
                    {/if}
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</section>

