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
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    if (el) obs.observe(el);
    return () => obs.disconnect();
  });

  function s(delayMs: number) {
    return `animation: eventFadeIn 0.7s ease ${delayMs}ms both;`;
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
    <div style={s(0)} class="mb-10 text-center">
      <p
        class="text-xs tracking-[0.6em] uppercase"
        style="color:#7a6848;font-family:var(--font-heading,sans-serif);"
      >
        Scene III
      </p>
      <p
        class="mt-1 text-xl font-bold"
        style="color:#1a1008;font-family:var(--font-heading,sans-serif);letter-spacing:-0.01em;"
      >
        On The Screen
      </p>
      <p class="mt-1 text-xs" style="color:#7a6848;font-family:var(--font-body,sans-serif);">
        Jadwal Acara
      </p>
      <div class="mx-auto mt-3" style="width:40px;height:1px;background:#c9933a;opacity:0.6;"></div>
    </div>

    <!-- Event cards — styled like vintage film program booklets -->
    {#each events as event, i}
      {@const dateInfo = event.date ? formatIndonesianDate(event.date, event.startTime, event.endTime) : null}

      <div style={s(200 + i * 180)} class="relative mx-auto mb-6 max-w-sm overflow-hidden">
        <!-- Ticket-punch holes left side -->
        <div
          class="absolute top-0 bottom-0 left-0 flex w-8 flex-col items-center justify-around py-3"
          style="background:#1a1008;"
          aria-hidden="true"
        >
          {#each Array(6) as _}
            <div style="width:6px;height:6px;border-radius:50%;background:#0d0905;"></div>
          {/each}
        </div>

        <!-- Ticket body -->
        <div
          style="margin-left:32px;background:#1a1008;border:1px solid rgba(201,147,58,0.2);border-left:none;"
        >
          <!-- Top accent bar -->
          <div
            style="height:3px;background:linear-gradient(to right,#c9933a,#e8c07a,#c9933a);"
          ></div>

          <div class="p-5">
            <!-- Event type badge -->
            <div class="mb-3 flex items-center gap-2">
              <span
                class="px-2 py-0.5 text-xs tracking-[0.4em] uppercase"
                style="background:rgba(201,147,58,0.12);border:1px solid rgba(201,147,58,0.3);color:#c9933a;font-family:var(--font-heading,sans-serif);"
                >{event.type === 'akad'
                  ? 'Akad Nikah'
                  : event.type === 'reception'
                    ? 'Resepsi'
                    : event.name || event.title || 'Acara'}</span
              >
            </div>

            <!-- Date info -->
            {#if dateInfo}
              <div class="mb-4">
                <p
                  style="font-size:2.5rem;font-family:var(--font-heading,sans-serif);font-weight:900;color:#f5e6c8;line-height:1;"
                >
                  {dateInfo.day}
                </p>
                <p
                  class="text-sm"
                  style="color:#c9a96e;font-family:var(--font-heading,sans-serif);"
                >
                  {dateInfo.dayName}, {dateInfo.monthName}
                  {dateInfo.year}
                </p>
                <p
                  class="mt-1 text-lg font-bold"
                  style="color:#c9933a;font-family:var(--font-heading,sans-serif);"
                >
                  {dateInfo.timeRange}
                </p>
              </div>
            {/if}

            <!-- Divider dashes -->
            <div class="mb-4" style="border-top:1px dashed rgba(201,147,58,0.2);"></div>

            <!-- Location -->
            <div class="flex items-start gap-3">
              <span style="color:#c9933a;font-size:0.85rem;margin-top:2px;flex-shrink:0;">📍</span>
              <div>
                <p
                  class="text-sm leading-snug"
                  style="color:#c9a96e;font-family:var(--font-body,sans-serif);"
                >
                  {event.location || ''}
                </p>
                {#if event.locationUrl || event.mapsUrl}
                  <a
                    href={event.locationUrl || event.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="mt-1 inline-block text-xs tracking-widest uppercase"
                    style="color:#7a6848;font-family:var(--font-heading,sans-serif);text-decoration:none;"
                    >Lihat Peta →</a
                  >
                {/if}
              </div>
            </div>
          </div>
        </div>
      </div>
    {/each}
  {/if}
</section>

<style>
  @keyframes eventFadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
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
