<script lang="ts">
  import { onMount } from 'svelte';
  import { formatIndonesianDate } from '$lib/utils/formatDate';

  export let invitation: any;

  const events: any[] = invitation?.events || [];

  let el: HTMLElement;
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
    if (el) observer.observe(el);
    return () => observer.disconnect();
  });
</script>

<section bind:this={el} class="w-full px-6 py-20" style="background:#f5ede0;">
  <!-- Header -->
  <div
    class="mb-12 text-center"
    style="opacity:{visible ? 1 : 0};transform:translateY({visible
      ? 0
      : -14}px);transition:opacity 700ms ease,transform 700ms ease;"
  >
    <p
      class="text-xs tracking-[0.6em] uppercase"
      style="color:#8b1a1a;font-family:var(--font-heading,serif);"
    >
      — Waktu &amp; Tempat —
    </p>
    <p class="mt-2 text-2xl" style="color:#2a1010;font-family:var(--font-script,cursive);">
      Acara Pernikahan
    </p>
    <div class="mx-auto mt-3 flex items-center gap-2" style="width:160px;">
      <div
        style="flex:1;height:1px;background:linear-gradient(to right,transparent,#6b1414);opacity:0.5;"
      ></div>
      <svg width="7" height="7" viewBox="0 0 7 7">
        <rect
          x="0.5"
          y="0.5"
          width="6"
          height="6"
          transform="rotate(45 3.5 3.5)"
          fill="#6b1414"
          opacity="0.6"
        />
      </svg>
      <div
        style="flex:1;height:1px;background:linear-gradient(to left,transparent,#6b1414);opacity:0.5;"
      ></div>
    </div>
  </div>

  <!-- Event cards -->
  <div class="flex flex-col items-center gap-8">
    {#each events as event, i}
        {@const info = event.date ? formatIndonesianDate(event.date, event.startTime, event.endTime) : null}
      {@const mapUrl = event.locationUrl || event.mapsUrl}

      <div
        class="w-full max-w-xs overflow-hidden"
        style="
          background:#faf6ef;
          border:1px solid #ddb880;
          box-shadow:2px 4px 20px rgba(107,20,20,0.08);
          opacity:{visible ? 1 : 0};
          transform:translateY({visible ? 0 : 30}px);
          transition:opacity 700ms {200 + i * 200}ms ease,transform 700ms {200 +
          i * 200}ms cubic-bezier(0.33,1,0.68,1);
        "
      >
        <!-- Maroon header band -->
        <div class="px-5 py-4 text-center" style="background:#6b1414;">
          <p
            class="text-xs tracking-[0.5em] uppercase"
            style="color:rgba(184,150,46,0.8);font-family:var(--font-heading,serif);"
          >
            {event.type || 'Ceremony'}
          </p>
          <p class="mt-1 text-xl" style="color:#f5ede0;font-family:var(--font-script,cursive);">
            {event.name}
          </p>
        </div>

        <!-- Gold line -->
        <div
          style="height:2px;background:linear-gradient(to right,#6b1414,#b8962e,#ddb880,#b8962e,#6b1414);"
        ></div>

        <!-- Event photo -->
        {#if event.imageUrls?.[0]}
          <div style="height:220px;overflow:hidden;">
            <img
              src={event.imageUrls[0]}
              alt={event.name}
              class="h-full w-full object-cover"
              style="filter:sepia(0.2) brightness(0.92);"
            />
          </div>
        {/if}

        <div class="px-6 py-5">
          <!-- Date & time -->
          {#if info}
            <div class="mb-3 flex items-start gap-3">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                class="mt-0.5 shrink-0"
                style="color:#6b1414;"
              >
                <rect
                  x="1"
                  y="2"
                  width="13"
                  height="12"
                  rx="1"
                  stroke="currentColor"
                  stroke-width="0.9"
                />
                <line x1="1" y1="6" x2="14" y2="6" stroke="currentColor" stroke-width="0.9" />
                <line x1="4" y1="0.5" x2="4" y2="3.5" stroke="currentColor" stroke-width="0.9" />
                <line x1="11" y1="0.5" x2="11" y2="3.5" stroke="currentColor" stroke-width="0.9" />
              </svg>
              <div>
                <p class="text-sm" style="color:#3d1010;font-family:var(--font-body,sans-serif);">
                  {info.dayName}, {info.day}
                  {info.monthName}
                  {info.year}
                </p>
                  <p
                    class="mt-0.5 text-xs"
                    style="color:#7a4040;font-family:var(--font-body,sans-serif);"
                  >
                    {info.timeRange}
                  </p>
              </div>
            </div>
          {/if}

          <!-- Venue -->
          {#if event.location}
            <div class="mb-4 flex items-start gap-3">
              <svg
                width="13"
                height="15"
                viewBox="0 0 13 15"
                fill="none"
                class="mt-0.5 shrink-0"
                style="color:#6b1414;"
              >
                <path
                  d="M6.5 1C3.74 1 1.5 3.24 1.5 6C1.5 10 6.5 14 6.5 14C6.5 14 11.5 10 11.5 6C11.5 3.24 9.26 1 6.5 1Z"
                  stroke="currentColor"
                  stroke-width="0.9"
                />
                <circle cx="6.5" cy="6" r="1.5" stroke="currentColor" stroke-width="0.8" />
              </svg>
              <p class="text-sm" style="color:#3d1010;font-family:var(--font-body,sans-serif);">
                {event.location}
              </p>
            </div>
          {/if}

          <!-- Map button -->
          {#if mapUrl}
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-4 py-2 text-xs tracking-[0.35em] uppercase transition-all duration-200"
              style="border:1px solid #6b1414;color:#6b1414;font-family:var(--font-heading,serif);"
            >
              <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                <path
                  d="M5 0.5C2.52 0.5 0.5 2.52 0.5 5C0.5 8.5 5 11.5 5 11.5C5 11.5 9.5 8.5 9.5 5C9.5 2.52 7.48 0.5 5 0.5Z"
                  stroke="currentColor"
                  stroke-width="0.9"
                />
                <circle cx="5" cy="5" r="1.5" stroke="currentColor" stroke-width="0.8" />
              </svg>
              Lihat Peta
            </a>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</section>
