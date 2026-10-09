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

<section bind:this={el} class="w-full px-6 py-20" style="background:#f7f4f0;">
  <!-- Header -->
  <div
    class="mb-12 text-center"
    style="opacity:{visible ? 1 : 0};transform:translateY({visible
      ? 0
      : -14}px);transition:opacity 700ms ease,transform 700ms ease;"
  >
    <p
      class="text-xs tracking-[0.5em] uppercase"
      style="color:#b8a99a;font-family:var(--font-heading,serif);"
    >
      Waktu & Tempat
    </p>
    <p class="mt-2 text-2xl" style="color:#4a3f35;font-family:var(--font-script,cursive);">
      Acara Pernikahan
    </p>
    <div class="mx-auto mt-3 flex items-center gap-2" style="width:140px;">
      <div
        style="flex:1;height:1px;background:linear-gradient(to right,transparent,#8fa89c 60%);"
      ></div>
      <svg width="6" height="6" viewBox="0 0 6 6"
        ><rect
          x="0.5"
          y="0.5"
          width="5"
          height="5"
          transform="rotate(45 3 3)"
          fill="none"
          stroke="#8fa89c"
          stroke-width="0.8"
        /></svg
      >
      <div
        style="flex:1;height:1px;background:linear-gradient(to left,transparent,#8fa89c 60%);"
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
          background:#fff;
          border:1px solid #ede7e0;
          box-shadow:0 4px 24px rgba(180,150,130,0.07);
          opacity:{visible ? 1 : 0};
          transform:translateY({visible ? 0 : 30}px);
          transition:opacity 700ms {200 + i * 200}ms ease,transform 700ms {200 +
          i * 200}ms cubic-bezier(0.33,1,0.68,1);
        "
      >
        <!-- Top image -->
        {#if event.imageUrls?.[0]}
          <div style="height:160px;overflow:hidden;">
            <img
              src={event.imageUrls[0]}
              alt={event.name}
              class="h-full w-full object-cover"
              style="filter:brightness(0.94) saturate(0.85);"
            />
          </div>
        {/if}

        <!-- Accent bar (alternating colors) -->
        <div
          style="height:2px;background:linear-gradient(to right,{i % 2 === 0
            ? '#d4a0a0'
            : '#8fa89c'},{i % 2 === 0 ? '#e8c4b8' : '#b8cfc5'});opacity:0.6;"
        ></div>

        <div class="px-6 py-6">
          <!-- Event name -->
          <p
            class="mb-1 text-xs tracking-[0.5em] uppercase"
            style="color:{i % 2 === 0
              ? '#d4a0a0'
              : '#8fa89c'};font-family:var(--font-heading,serif);"
          >
            {event.type || 'Ceremony'}
          </p>
          <p class="mb-4 text-xl" style="color:#4a3f35;font-family:var(--font-script,cursive);">
            {event.name}
          </p>

          <div
            style="height:1px;background:linear-gradient(to right,#e8ddd5,transparent);margin-bottom:16px;"
          ></div>

          <!-- Date & time -->
          {#if info}
            <div class="mb-3 flex items-start gap-3">
              <!-- Calendar icon -->
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                class="mt-0.5 shrink-0"
                style="color:{i % 2 === 0 ? '#d4a0a0' : '#8fa89c'};"
              >
                <rect
                  x="1"
                  y="2"
                  width="14"
                  height="13"
                  rx="1.5"
                  stroke="currentColor"
                  stroke-width="0.9"
                />
                <line x1="1" y1="6" x2="15" y2="6" stroke="currentColor" stroke-width="0.9" />
                <line x1="4" y1="0.5" x2="4" y2="4" stroke="currentColor" stroke-width="0.9" />
                <line x1="12" y1="0.5" x2="12" y2="4" stroke="currentColor" stroke-width="0.9" />
              </svg>
              <div>
                <p class="text-sm" style="color:#6b5d52;font-family:var(--font-body,sans-serif);">
                  {info.dayName}, {info.day}
                  {info.monthName}
                  {info.year}
                </p>
                  <p
                    class="mt-0.5 text-xs"
                    style="color:#9a8a7e;font-family:var(--font-body,sans-serif);"
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
                width="14"
                height="16"
                viewBox="0 0 14 16"
                fill="none"
                class="mt-0.5 shrink-0"
                style="color:{i % 2 === 0 ? '#d4a0a0' : '#8fa89c'};"
              >
                <path
                  d="M7 1C4.24 1 2 3.24 2 6C2 10 7 15 7 15C7 15 12 10 12 6C12 3.24 9.76 1 7 1Z"
                  stroke="currentColor"
                  stroke-width="0.9"
                />
                <circle cx="7" cy="6" r="1.5" stroke="currentColor" stroke-width="0.8" />
              </svg>
              <div class="flex-1">
                {#if event.location}
                  <p
                    class="text-sm font-medium"
                    style="color:#6b5d52;font-family:var(--font-body,sans-serif);"
                  >
                    {event.location}
                  </p>
                {/if}
              </div>
            </div>
          {/if}

          <!-- Map button — uses locationUrl or mapsUrl, whichever is available -->
          {#if mapUrl}
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="mt-1 inline-flex items-center gap-2 px-4 py-2 text-xs tracking-[0.35em] uppercase transition-all duration-200"
              style="
                border:1px solid {i % 2 === 0 ? '#d4a0a0' : '#8fa89c'};
                color:{i % 2 === 0 ? '#d4a0a0' : '#8fa89c'};
                font-family:var(--font-heading,serif);
              "
              onmouseenter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  i % 2 === 0 ? 'rgba(212,160,160,0.08)' : 'rgba(143,168,156,0.08)';
              }}
              onmouseleave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              <svg width="11" height="13" viewBox="0 0 11 13" fill="none">
                <path
                  d="M5.5 1C3.01 1 1 3.01 1 5.5C1 8.75 5.5 12 5.5 12C5.5 12 10 8.75 10 5.5C10 3.01 7.99 1 5.5 1Z"
                  stroke="currentColor"
                  stroke-width="0.9"
                />
                <circle cx="5.5" cy="5.5" r="1.5" stroke="currentColor" stroke-width="0.8" />
              </svg>
              Lihat Peta
            </a>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</section>
