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
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    );
    observer.observe(sectionEl);
    return () => observer.disconnect();
  });
</script>

<section bind:this={sectionEl} class="w-full bg-[#f5f0e8] px-6 py-16">
  <!-- HEADER -->
  <div
    class="mb-12 text-center"
    style="opacity:{visible ? 1 : 0};transform:translateY({visible
      ? 0
      : -16}px);transition:opacity 700ms ease,transform 700ms ease"
  >
    <p class="font-heading text-2xl tracking-[0.3em] text-[#a89880] uppercase">Wedding Event</p>
    <div class="mx-auto mt-3 w-8 border-t border-[#c9b49a]"></div>
  </div>

  <!-- EVENT CARDS -->
  <div class="flex flex-col items-center gap-8">
    {#each events as event, i}
        {@const info = event.date ? formatIndonesianDate(event.date, event.startTime, event.endTime) : null}
      <div
        class="w-full max-w-xs overflow-hidden rounded-2xl bg-white shadow-lg"
        style="opacity:{visible ? 1 : 0};transform:translateY({visible ? 0 : 50}px) scale({visible
          ? 1
          : 0.97});transition:opacity 800ms {200 + i * 250}ms ease,transform 800ms {200 +
          i * 250}ms cubic-bezier(0.33,1,0.68,1)"
      >
        <!-- IMAGE — tall portrait -->
        {#if event.imageUrls?.[0]}
          <img
            src={event.imageUrls[0]}
            alt={event.title}
            class="h-64 w-full object-cover"
            style="transform:{visible
              ? 'scale(1)'
              : 'scale(1.1)'};transition:transform 1000ms {300 + i * 250}ms ease"
          />
        {:else}
          <div class="flex h-64 w-full items-center justify-center bg-[#ece8e0] text-[#c9b49a]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-14 w-14"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        {/if}

        <!-- INFO: stacked vertically -->
        <div class="flex flex-col gap-2.5 px-5 py-5">
          <!-- Event name -->
          <p
            class="font-heading text-xs tracking-[0.25em] text-[#a89880] uppercase"
            style="opacity:{visible ? 1 : 0};transform:translateY({visible
              ? 0
              : 8}px);transition:opacity 500ms {380 + i * 250}ms,transform 500ms {380 +
              i * 250}ms ease"
          >
            {event.title}
          </p>
          <div
            class="w-6 border-t border-[#c9b49a]"
            style="transform:scaleX({visible ? 1 : 0});transition:transform 400ms {440 +
              i * 250}ms ease;transform-origin:left"
          ></div>

          <!-- Date & time -->
          {#if info}
            <div
              style="opacity:{visible ? 1 : 0};transform:translateY({visible
                ? 0
                : 8}px);transition:opacity 500ms {500 + i * 250}ms,transform 500ms {500 +
                i * 250}ms ease"
            >
              <p class="font-heading text-lg font-semibold text-[#3a3028]">
                {info.dayName}, {info.day}
                {info.monthName}
                {info.year}
              </p>
              <p class="mt-0.5 font-body text-sm text-[#a89880]">
                  {info.timeRange}
              </p>
            </div>
          {/if}

          <!-- Location + maps button -->
          <div
            style="opacity:{visible ? 1 : 0};transform:translateY({visible
              ? 0
              : 8}px);transition:opacity 500ms {600 + i * 250}ms,transform 500ms {600 +
              i * 250}ms ease"
          >
            <p class="font-body text-sm leading-relaxed text-[#6b5f52]">{event.location}</p>
            {#if event.locationUrl && event.locationUrl !== '#'}
              <a
                href={event.locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="mt-3 inline-flex w-fit items-center gap-1.5 border border-[#c9b49a] px-4 py-1.5 font-body text-xs text-[#a89880] transition hover:bg-[#c9b49a]/10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Lihat Lokasi
              </a>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>
</section>
