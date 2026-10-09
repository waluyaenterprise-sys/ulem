<script lang="ts">
  import { onMount } from 'svelte';
  import { formatIndonesianDate } from '$lib/utils/formatDate';

  export let invitation: any;

  const events: any[] = invitation?.events || [];

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
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    observer.observe(sectionEl);
    return () => observer.disconnect();
  });
</script>

<section bind:this={sectionEl} class="w-full px-5 py-20" style="background:#040404;">
  <!-- HEADER -->
  <div
    class="mb-14 text-center transition-all duration-700"
    style="opacity:{visible ? 1 : 0};transform:translateY({visible ? 0 : -16}px)"
  >
    <p
      class="text-[9px] tracking-[0.45em] uppercase"
      style="color:#c9a84c;font-family:var(--font-heading,sans-serif);"
    >
      Wedding Event
    </p>
    <div style="width:40px;height:1px;background:#c9a84c;margin:12px auto 0;opacity:0.6;"></div>
  </div>

  <!-- EVENT CARDS — big-number style -->
  <div class="flex flex-col gap-12">
    {#each events as event, i}
        {@const info = event.date ? formatIndonesianDate(event.date, event.startTime, event.endTime) : null}

      <div
        class="relative"
        style="
          opacity:{visible ? 1 : 0};
          transform:translateY({visible ? 0 : 50}px);
          transition:opacity 800ms {200 + i * 300}ms ease, transform 800ms {200 +
          i * 300}ms cubic-bezier(0.33,1,0.68,1);
        "
      >
        <!-- Large ghost day number in background -->
        {#if info}
          <div class="ghost-number select-none" aria-hidden="true">{info.day}</div>
        {/if}

        <!-- Card content -->
        <div class="relative z-10 border-l-2 py-2 pl-7" style="border-color:#c9a84c;">
          <!-- Event name -->
          <p
            class="mb-3 text-[9px] tracking-[0.4em] uppercase"
            style="color:#c9a84c;font-family:var(--font-heading,sans-serif);"
          >
            {event.title}
          </p>

          {#if info}
            <!-- Full date -->
            <p
              class="mb-1 text-2xl font-light"
              style="color:#fff;font-family:var(--font-heading,sans-serif);"
            >
              {info.dayName}, {info.day}
              {info.monthName}
              {info.year}
            </p>
            <p
              class="mb-5 text-sm"
              style="color:rgba(201,168,76,0.7);font-family:var(--font-body,sans-serif);"
            >
                {info.timeRange}
            </p>
          {/if}

          <!-- Location -->
          {#if event.location}
            <p
              class="mb-5 text-sm leading-relaxed"
              style="color:rgba(255,255,255,0.5);font-family:var(--font-body,sans-serif);"
            >
              {event.location}
            </p>
          {/if}

          <!-- Image — cinematic wide crop -->
          {#if event.imageUrls?.[0]}
            <div
              class="overflow-hidden"
              style="height:200px;border:1px solid rgba(201,168,76,0.2);"
            >
              <img
                src={event.imageUrls[0]}
                alt={event.title}
                class="h-full w-full object-cover"
                style="filter:brightness(0.8) contrast(1.05);transform:{visible
                  ? 'scale(1)'
                  : 'scale(1.06)'};transition:transform 1200ms {300 + i * 300}ms ease;"
              />
            </div>
          {/if}

          <!-- Maps link -->
          {#if event.locationUrl && event.locationUrl !== '#'}
            <a
              href={event.locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="mt-5 inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase transition hover:opacity-70"
              style="color:#c9a84c;font-family:var(--font-heading,sans-serif);"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Lihat Lokasi
            </a>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</section>

<style>
  .ghost-number {
    position: absolute;
    right: -10px;
    top: -20px;
    font-size: 9rem;
    font-weight: 700;
    line-height: 1;
    color: rgba(201, 168, 76, 0.06);
    font-family: var(--font-heading, sans-serif);
    pointer-events: none;
    z-index: 0;
  }
</style>
