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
</script>

<section bind:this={el} class="w-full px-6 py-24" style="background:#f0f4ff;">
  <!-- Chapter header -->
  <div
    class="mb-12 flex items-center gap-3"
    style="opacity:{visible ? 1 : 0};transform:translateX({visible
      ? 0
      : -16}px);transition:opacity 600ms ease,transform 600ms ease;"
  >
    <div style="width:3px;height:32px;background:#2c3e6b;flex-shrink:0;"></div>
    <div>
      <p
        class="text-xs tracking-[0.55em] uppercase"
        style="color:#2c3e6b;font-family:var(--font-heading,sans-serif);"
      >
        Chapter 03
      </p>
      <p
        class="text-lg font-bold"
        style="color:#0d1829;font-family:var(--font-heading,sans-serif);letter-spacing:-0.02em;"
      >
        Acara Pernikahan
      </p>
    </div>
    <div class="ml-auto" aria-hidden="true">
      <span
        style="font-size:80px;font-weight:900;color:rgba(44,60,107,0.06);font-family:var(--font-heading,sans-serif);line-height:1;user-select:none;"
        >03</span
      >
    </div>
  </div>

  <!-- Timeline -->
  <div class="relative flex flex-col gap-0">
    <!-- Vertical track line -->
    <div
      class="pointer-events-none absolute top-0 bottom-0"
      style="left:19px;width:1px;background:linear-gradient(to bottom,#2c3e6b,#c4754a 60%,transparent);opacity:0.25;"
      aria-hidden="true"
    ></div>

    {#each events as event, i}
        {@const info = event.date ? formatIndonesianDate(event.date, event.startTime, event.endTime) : null}
      {@const mapUrl = event.locationUrl || event.mapsUrl}
      {@const nodeColor = i % 2 === 0 ? '#2c3e6b' : '#c4754a'}

      <div
        class="flex gap-5"
        style="
          opacity:{visible ? 1 : 0};
          transform:translateX({visible ? 0 : 20}px);
          transition:opacity 700ms {150 + i * 220}ms ease,transform 700ms {150 +
          i * 220}ms cubic-bezier(0.33,1,0.68,1);
          margin-bottom:{i < events.length - 1 ? '28px' : '0'};
        "
      >
        <!-- Node column -->
        <div class="flex flex-col items-center" style="width:38px;flex-shrink:0;">
          <!-- Node circle -->
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center text-xs font-bold"
            style="background:{nodeColor};color:#fff;font-family:var(--font-heading,sans-serif);z-index:1;position:relative;"
          >
            {String(i + 1).padStart(2, '0')}
          </div>
        </div>

        <!-- Card -->
        <div
          class="flex-1 overflow-hidden"
          style="background:#fff;border:1px solid #e2e8f0;box-shadow:0 2px 16px rgba(13,24,41,0.06);"
        >
          <!-- Event photo -->
          {#if event.imageUrls?.[0]}
            <div style="height:140px;overflow:hidden;">
              <img src={event.imageUrls[0]} alt={event.name} class="h-full w-full object-cover" />
            </div>
          {/if}

          <!-- Header band -->
          <div
            class="px-4 py-3"
            style="background:{nodeColor};background:linear-gradient(135deg,{nodeColor},{i % 2 === 0
              ? '#4a5c8a'
              : '#d98a6a'});"
          >
            <p
              class="mb-0.5 text-xs tracking-[0.4em] uppercase"
              style="color:rgba(255,255,255,0.7);font-family:var(--font-heading,sans-serif);"
            >
              {event.type || 'Ceremony'}
            </p>
            <p
              class="text-lg leading-tight"
              style="color:#fff;font-family:var(--font-script,cursive);"
            >
              {event.name}
            </p>
          </div>

          <!-- Details -->
          <div class="flex flex-col gap-2 px-4 py-4">
            {#if info}
              <div class="flex items-center gap-3">
                <span
                  class="text-xs font-bold tracking-widest uppercase"
                  style="color:{nodeColor};font-family:var(--font-heading,sans-serif);min-width:12px;"
                  >D</span
                >
                <p class="text-sm" style="color:#1e293b;font-family:var(--font-body,sans-serif);">
                  {info.dayName}, {info.day}
                  {info.monthName}
                  {info.year}
                  {#if info?.timeRange}<span style="color:#64748b;"> · {info.timeRange}</span>{/if}
                </p>
              </div>
            {/if}

            {#if event.location}
              <div class="flex items-start gap-3">
                <span
                  class="mt-0.5 text-xs font-bold tracking-widest uppercase"
                  style="color:{nodeColor};font-family:var(--font-heading,sans-serif);min-width:12px;"
                  >L</span
                >
                <p class="text-sm" style="color:#1e293b;font-family:var(--font-body,sans-serif);">
                  {event.location}
                </p>
              </div>
            {/if}

            {#if mapUrl}
              <div class="mt-1">
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-3 py-1.5 text-xs tracking-[0.3em] uppercase transition-all duration-200"
                  style="background:{nodeColor};color:#fff;font-family:var(--font-heading,sans-serif);"
                >
                  <svg width="10" height="11" viewBox="0 0 10 11" fill="none">
                    <path
                      d="M5 0.5C2.52 0.5 0.5 2.52 0.5 5C0.5 8.5 5 10.5 5 10.5C5 10.5 9.5 8.5 9.5 5C9.5 2.52 7.48 0.5 5 0.5Z"
                      stroke="currentColor"
                      stroke-width="0.9"
                    />
                    <circle cx="5" cy="5" r="1.5" stroke="currentColor" stroke-width="0.8" />
                  </svg>
                  Lihat Peta
                </a>
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>

  <!-- Flow connector -->
  <div
    class="mt-8 flex flex-col items-center gap-1"
    style="opacity:{visible ? 1 : 0};transition:opacity 700ms 700ms ease;"
  >
    <div
      style="width:1px;height:20px;background:linear-gradient(to bottom,rgba(13,24,41,0.2),transparent);"
    ></div>
    <div style="width:6px;height:6px;background:#0d1829;transform:rotate(45deg);"></div>
  </div>
</section>
