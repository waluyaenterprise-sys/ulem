<script lang="ts">
  import { formatIndonesianDate } from '$lib/utils/formatDate';

  export let invitation: any;

  const events: any[] = invitation.events || [];

  // Pool all gallery/cover images for fallback backgrounds
  const fallbackPool: string[] = [
    ...(invitation.gallery?.imageUrls || []),
    ...(invitation.cover?.imageUrls || [])
  ].filter(Boolean);

  function bgFor(event: any, idx: number): string {
    return event.images?.[0] || fallbackPool[idx % fallbackPool.length] || '';
  }

  function reveal(node: HTMLElement, { delay = 0, y = 28 } = {}) {
    node.style.opacity = '0';
    node.style.transform = `translateY(${y}px)`;
    node.style.transition = `opacity 1s ease ${delay}ms, transform 1s cubic-bezier(0.22,1,0.36,1) ${delay}ms`;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          node.style.opacity = '1';
          node.style.transform = 'none';
          io.unobserve(node);
        }
      },
      { threshold: 0.1 }
    );
    io.observe(node);
    return { destroy: () => io.disconnect() };
  }
</script>

{#each events as event, i}
  {@const dateInfo = event.date ? formatIndonesianDate(event.date, event.startTime, event.endTime) : null}
  {@const bg = bgFor(event, i)}

  <section class="relative flex min-h-svh w-full flex-col items-start justify-end overflow-hidden">
    <!-- Photo background -->
    {#if bg}
      <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('{bg}');"></div>
    {:else}
      <div class="absolute inset-0 bg-neutral-900"></div>
    {/if}

    <!-- Strong bottom-up gradient -->
    <div
      class="pointer-events-none absolute inset-0"
      style="background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0.15) 75%, transparent 100%);"
    ></div>

    <!-- Index chip top-right -->
    <div use:reveal={{ delay: 80 }} class="absolute top-7 right-7 z-10">
      <span
        class="font-heading text-[11vw] leading-none font-extralight text-white/8 select-none"
        style="font-size: clamp(48px, 11vw, 80px);"
      >
        {String(i + 1).padStart(2, '0')}
      </span>
    </div>

    <!-- Content -->
    <div class="relative z-10 w-full px-8 pb-14">
      <!-- Type badge -->
      <div use:reveal class="mb-4 inline-block border border-white/20 px-3 py-1">
        <span class="font-body text-[9px] tracking-[0.4em] text-white/50 uppercase">
          {event.type || 'Acara'}
        </span>
      </div>

      <!-- Title -->
      <h2 use:reveal={{ delay: 80, y: 18 }} class="font-heading text-4xl font-light text-white">
        {event.title || event.type || ''}
      </h2>

      <!-- Thin rule -->
      <div use:reveal={{ delay: 150 }} class="my-5 h-px w-12 bg-white/20"></div>

      <!-- Date / time -->
      {#if dateInfo}
        <div use:reveal={{ delay: 200, y: 14 }} class="flex items-baseline gap-4">
          <span class="font-heading text-5xl font-extralight text-white">{dateInfo.day}</span>
          <div>
            <p class="font-body text-sm text-white/70">{dateInfo.dayName},</p>
            <p class="font-body text-xs text-white/50">{dateInfo.monthName} {dateInfo.year}</p>
            {#if dateInfo.timeRange}
              <p class="mt-0.5 font-body text-xs text-white/40">
                {dateInfo.timeRange}
              </p>
            {/if}
          </div>
        </div>
      {/if}

      <!-- Location -->
      {#if event.location}
        <p
          use:reveal={{ delay: 290, y: 10 }}
          class="mt-4 font-body text-sm leading-relaxed text-white/55 italic"
        >
          {event.location}
        </p>
      {/if}

      <!-- Maps -->
      {#if event.locationUrl}
        <a
          use:reveal={{ delay: 360 }}
          href={event.locationUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="mt-6 inline-flex items-center gap-2 border border-white/25 px-5 py-2.5 font-body text-[11px] tracking-[0.3em] text-white/60 uppercase backdrop-blur-sm transition-all hover:border-white/50 hover:text-white/80"
        >
          <svg
            viewBox="0 0 24 24"
            class="h-3 w-3"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
            />
          </svg>
          Lihat Lokasi
        </a>
      {/if}
    </div>
  </section>
{/each}
