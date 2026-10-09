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

<section
  bind:this={sectionEl}
  class="relative w-full overflow-hidden px-5 py-20"
  style="background: linear-gradient(160deg, #1c0f0a 0%, #2d1a0e 50%, #1c0f0a 100%);"
>
  <!-- Warm radial glow background -->
  <div
    class="pointer-events-none absolute"
    style="width:600px;height:600px;border-radius:50%;background:radial-gradient(circle, rgba(212,119,74,0.10) 0%, transparent 65%);top:30%;left:50%;transform:translate(-50%,-50%);"
  ></div>

  <!-- Header -->
  <div
    class="mb-14 text-center transition-all duration-700"
    style="opacity:{visible ? 1 : 0};transform:translateY({visible ? 0 : -16}px)"
  >
    <p
      class="text-2xl tracking-[0.3em] uppercase"
      style="color: rgba(232,164,90,0.85); font-family: var(--font-heading, sans-serif);"
    >
      Wedding Event
    </p>
    <div
      class="mx-auto mt-4"
      style="width:50px;height:1px;background:linear-gradient(to right,transparent,rgba(232,164,90,0.6),transparent);"
    ></div>
  </div>

  <!-- Event Cards -->
  <div class="relative z-10 flex flex-col items-center gap-10">
    {#each events as event, i}
        {@const info = event.date ? formatIndonesianDate(event.date, event.startTime, event.endTime) : null}

      <div
        class="w-full max-w-sm overflow-hidden rounded-3xl"
        style="
          opacity:{visible ? 1 : 0};
          transform:translateY({visible ? 0 : 50}px);
          transition: opacity 800ms {200 + i * 250}ms ease, transform 800ms {200 +
          i * 250}ms cubic-bezier(0.33,1,0.68,1);
          background: rgba(255,200,120,0.07);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(232,164,90,0.22);
          box-shadow: 0 8px 50px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,230,170,0.12);
        "
      >
        <!-- Image -->
        {#if event.imageUrls?.[0]}
          <div class="relative overflow-hidden" style="height:260px;">
            <img
              src={event.imageUrls[0]}
              alt={event.title}
              class="h-full w-full object-cover"
              style="transform:{visible
                ? 'scale(1)'
                : 'scale(1.08)'};transition:transform 1000ms {300 + i * 250}ms ease"
            />
            <!-- Warm gradient overlay on image bottom -->
            <div
              class="absolute inset-x-0 bottom-0"
              style="height:80px;background:linear-gradient(to top, rgba(45,26,14,0.85), transparent);"
            ></div>
          </div>
        {:else}
          <div
            class="flex items-center justify-center"
            style="height:200px;background:rgba(255,200,120,0.04);"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-14 w-14"
              fill="none"
              viewBox="0 0 24 24"
              stroke="rgba(232,164,90,0.35)"
              stroke-width="1"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        {/if}

        <!-- Content -->
        <div class="px-6 py-6">
          <!-- Event title -->
          <p
            class="mb-2 text-[10px] tracking-[0.3em] uppercase"
            style="color: rgba(232,164,90,0.7); font-family: var(--font-heading, sans-serif);
              opacity:{visible ? 1 : 0};transform:translateY({visible ? 0 : 8}px);
              transition:opacity 500ms {380 + i * 250}ms,transform 500ms {380 + i * 250}ms ease"
          >
            {event.title}
          </p>

          <div
            style="width:28px;height:1px;background:rgba(232,164,90,0.4);margin-bottom:14px;
              transform:scaleX({visible ? 1 : 0});transition:transform 400ms {440 +
              i * 250}ms ease;transform-origin:left"
          ></div>

          {#if info}
            <div
              style="opacity:{visible ? 1 : 0};transform:translateY({visible
                ? 0
                : 8}px);transition:opacity 500ms {500 + i * 250}ms,transform 500ms {500 +
                i * 250}ms ease"
            >
              <p
                class="text-xl font-semibold"
                style="color: rgba(255,230,180,0.95); font-family: var(--font-heading, sans-serif);"
              >
                {info.dayName}, {info.day}
                {info.monthName}
                {info.year}
              </p>
              <p
                class="mt-1 text-sm"
                style="color: rgba(232,164,90,0.65); font-family: var(--font-body, sans-serif);"
              >
                  {info.timeRange}
              </p>
            </div>
          {/if}

          {#if event.location}
            <div
              class="mt-4"
              style="opacity:{visible ? 1 : 0};transform:translateY({visible
                ? 0
                : 8}px);transition:opacity 500ms {600 + i * 250}ms,transform 500ms {600 +
                i * 250}ms ease"
            >
              <p
                class="text-sm leading-relaxed"
                style="color: rgba(255,210,160,0.65); font-family: var(--font-body, sans-serif);"
              >
                {event.location}
              </p>

              {#if event.locationUrl && event.locationUrl !== '#'}
                <a
                  href={event.locationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs transition hover:opacity-80"
                  style="
                    font-family: var(--font-heading, sans-serif);
                    background: rgba(232,164,90,0.15);
                    border: 1px solid rgba(232,164,90,0.35);
                    color: rgba(232,164,90,0.85);
                    backdrop-filter: blur(8px);
                  "
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
          {/if}
        </div>
      </div>
    {/each}
  </div>
</section>
