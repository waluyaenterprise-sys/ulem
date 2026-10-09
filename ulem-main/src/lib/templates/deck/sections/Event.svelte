<script lang="ts">
  import { onMount } from 'svelte';
  import { formatIndonesianDate } from '$lib/utils/formatDate';

  export let invitation: any;
  const events: any[] = invitation?.events || [];

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
        <p class="deck-label mb-1">Jadwal</p>
        <h2 class="deck-title">Acara Pernikahan</h2>
      </div>

      <div class="space-y-3 overflow-y-auto" style="max-height: 65vh; scrollbar-width: none;">
        {#each events as ev, i}
          {@const dateInfo = ev.date ? formatIndonesianDate(ev.date, ev.startTime, ev.endTime) : null}

          <div class="deck-card" style="animation: deckIn 0.6s ease {i * 0.1}s both;">
            <div class="deck-card-header">
              <span class="deck-label">{ev.name || 'Acara ' + (i + 1)}</span>
              <span class="deck-num">0{i + 3}</span>
            </div>
            <div class="deck-body space-y-2">
              {#if dateInfo}
                <div>
                  <p class="deck-label mb-0.5">Tanggal</p>
                  <p style="font-size: 13px; color: rgba(255,255,255,0.75); font-weight: 600;">
                    {dateInfo.day} {dateInfo.monthName} {dateInfo.year}
                  </p>
                </div>
              {/if}
              {#if dateInfo?.timeRange}
                <div>
                  <p class="deck-label mb-0.5">Waktu</p>
                  <p style="font-size: 13px; color: rgba(255,255,255,0.75); font-weight: 600;">
                    {dateInfo.timeRange}
                  </p>
                </div>
              {/if}
              {#if ev.place || ev.address}
                <div>
                  <p class="deck-label mb-0.5">Lokasi</p>
                  <p style="font-size: 12px; color: rgba(255,255,255,0.55); line-height: 1.5;">
                    {ev.place || ''}{ev.place && ev.address ? ', ' : ''}{ev.address || ''}
                  </p>
                </div>
              {/if}
              {#if ev.mapsUrl}
                <a
                  href={ev.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style="display: block; margin-top: 8px; text-align: center; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 8px; font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.5); text-decoration: none; letter-spacing: 0.1em; text-transform: uppercase;"
                >
                  Buka Maps →
                </a>
              {/if}
            </div>
          </div>
        {/each}
        {#if events.length === 0}
          <p class="deck-small py-8 text-center">Informasi acara belum tersedia</p>
        {/if}
      </div>
    </div>
  {/if}
</section>
