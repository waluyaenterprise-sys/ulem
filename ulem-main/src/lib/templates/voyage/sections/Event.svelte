<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  export let invitation: any;

  const events: any[] = invitation?.events || [];

  const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const MONTHS_ID = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
  ];

  function formatDate(dateStr: string, startTime?: string, endTime?: string) {
    if (!dateStr) return { day: '--', month: '---', year: '----', time: '--:--', timeRange: '--:--' };
    const d = new Date(dateStr);
    const wib = new Date(d.getTime() + 7 * 60 * 60 * 1000);

    let time = '';
    let timeRange = '';
    if (startTime) {
      const [h, m] = startTime.split(':');
      time = `${h || '00'}:${m || '00'}`;
      timeRange = `${time} WIB`;
      if (endTime) {
        const [eh, em] = endTime.split(':');
        timeRange = `${time} - ${eh || '00'}:${em || '00'} WIB`;
      }
    } else {
      time =
        String(wib.getUTCHours()).padStart(2, '0') +
        ':' +
        String(wib.getUTCMinutes()).padStart(2, '0');
      timeRange = `${time} WIB`;
    }

    return {
      day: DAYS[wib.getUTCDay()],
      date: wib.getUTCDate() + ' ' + MONTHS_ID[wib.getUTCMonth()] + ' ' + wib.getUTCFullYear(),
      time,
      timeRange,
      short: new Date(d.getTime() + 7 * 60 * 60 * 1000)
        .toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          timeZone: 'UTC'
        })
        .toUpperCase()
    };
  }

  let visible = false;
  let sectionEl: HTMLElement;
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
    if (sectionEl) observer.observe(sectionEl);
    return () => observer.disconnect();
  });
</script>

<section bind:this={sectionEl} class="w-full px-5 py-16" style="background:#081018;">
  {#if visible}
    <!-- Section header -->
    <div in:fade={{ duration: 600 }} class="mb-10 text-center">
      <p
        class="text-xs tracking-[0.55em] uppercase"
        style="color:rgba(201,168,76,0.5);font-family:var(--font-heading,serif);"
      >
        Itinerary
      </p>
      <p
        class="mt-2 text-sm tracking-[0.45em] uppercase"
        style="color:#c9a84c;font-family:var(--font-heading,serif);"
      >
        Flight Schedule
      </p>
      <div style="width:40px;height:1px;background:rgba(201,168,76,0.4);margin:10px auto 0;"></div>
    </div>

    <!-- One boarding pass per event -->
    {#each events as evt, i}
      {@const dt = formatDate(evt.date, evt.startTime, evt.endTime)}
      {@const img = evt.imageUrls?.[0] || evt.images?.[0] || ''}
      <div
        in:fly={{ y: 30, delay: 200 + i * 150, duration: 700, easing: cubicOut }}
        class="mx-auto mb-6"
        style="max-width:360px;"
      >
        <!-- Boarding pass card -->
        <div
          class="relative overflow-hidden"
          style="background:#0f2035;border:1px solid rgba(201,168,76,0.25);"
        >
          <!-- Top colored stripe (airline style) -->
          <div
            style="height:3px;background:linear-gradient(to right,#c9a84c,#e8d08a,#c9a84c);"
          ></div>

          <!-- Header row -->
          <div
            class="flex items-center justify-between px-4 py-2"
            style="border-bottom:1px solid rgba(201,168,76,0.12);"
          >
            <div class="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <!-- Plane icon -->
                <path
                  d="M2 8 L14 5 L12 8 L14 11 Z"
                  fill="none"
                  stroke="#c9a84c"
                  stroke-width="0.8"
                  opacity="0.6"
                />
                <path d="M6 8 L8 6 L10 8 L8 10 Z" fill="#c9a84c" opacity="0.3" />
              </svg>
              <span
                class="text-sm tracking-[0.4em] uppercase"
                style="color:rgba(201,168,76,0.55);font-family:var(--font-heading,serif);"
              >
                Boarding Pass
              </span>
            </div>
            <span
              class="text-sm tracking-[0.3em] uppercase"
              style="color:rgba(201,168,76,0.35);font-family:monospace;"
            >
              WD-{String(i + 1).padStart(3, '0')}
            </span>
          </div>

          <!-- Event photo -->
          {#if img}
            <div style="height:140px;overflow:hidden;">
              <img
                src={img}
                alt={evt.title}
                class="h-full w-full object-cover"
                style="filter:brightness(0.75) sepia(20%);"
              />
            </div>
          {/if}

          <!-- Route: FROM → TO -->
          <div class="flex items-center justify-between px-4 py-4">
            <div class="text-left">
              <p
                class="text-sm tracking-[0.3em] uppercase"
                style="color:rgba(201,168,76,0.35);font-family:var(--font-heading,serif);"
              >
                From
              </p>
              <p
                class="mt-0.5 text-2xl leading-none font-bold"
                style="color:#c9a84c;font-family:var(--font-heading,serif);"
              >
                YOU
              </p>
              <p
                class="mt-1 text-xs"
                style="color:rgba(201,168,76,0.4);font-family:var(--font-heading,serif);"
              >
                Your Home
              </p>
            </div>

            <!-- Dashed line with plane -->
            <div class="flex flex-1 items-center px-3">
              <div style="flex:1;border-top:1px dashed rgba(201,168,76,0.25);"></div>
              <svg width="18" height="14" viewBox="0 0 18 14" style="margin:0 4px;">
                <path
                  d="M1 8 C4 8 6 4 9 4 C12 4 14 8 17 8"
                  fill="none"
                  stroke="rgba(201,168,76,0.4)"
                  stroke-width="0.8"
                />
                <path d="M15 4 L17 8 L13 7 Z" fill="rgba(201,168,76,0.4)" />
              </svg>
              <div style="flex:1;border-top:1px dashed rgba(201,168,76,0.25);"></div>
            </div>

            <div class="text-right">
              <p
                class="text-sm tracking-[0.3em] uppercase"
                style="color:rgba(201,168,76,0.35);font-family:var(--font-heading,serif);"
              >
                To
              </p>
              <p
                class="mt-0.5 text-2xl leading-none font-bold"
                style="color:#c9a84c;font-family:var(--font-heading,serif);"
              >
                {evt.type === 'akad' ? 'AKAD' : 'RSPSI'}
              </p>
              <p
                class="mt-1 text-right text-xs"
                style="color:rgba(201,168,76,0.4);font-family:var(--font-heading,serif);"
              >
                {evt.title}
              </p>
            </div>
          </div>

          <!-- Perforation tear line -->
          <div class="relative flex items-center" style="margin:0 -1px;">
            <div
              style="width:14px;height:14px;border-radius:50%;background:#081018;border:1px solid rgba(201,168,76,0.2);margin-left:-7px;flex-shrink:0;"
            ></div>
            <div style="flex:1;border-top:2px dashed rgba(201,168,76,0.2);"></div>
            <div
              style="width:14px;height:14px;border-radius:50%;background:#081018;border:1px solid rgba(201,168,76,0.2);margin-right:-7px;flex-shrink:0;"
            ></div>
          </div>

          <!-- Bottom stub: details -->
          <div class="grid grid-cols-3 gap-2 px-4 py-4">
            <div>
              <p
                class="text-sm tracking-[0.2em] uppercase"
                style="color:rgba(201,168,76,0.35);font-family:var(--font-heading,serif);"
              >
                Date
              </p>
              <p
                class="mt-0.5 text-sm leading-snug"
                style="color:rgba(228,216,180,0.8);font-family:var(--font-heading,serif);"
              >
                {dt.short}
              </p>
            </div>
            <div>
              <p
                class="text-sm tracking-[0.2em] uppercase"
                style="color:rgba(201,168,76,0.35);font-family:var(--font-heading,serif);"
              >
                Boarding
              </p>
              <p
                class="mt-0.5 text-sm"
                style="color:rgba(228,216,180,0.8);font-family:var(--font-heading,serif);"
              >
                {dt.timeRange}
              </p>
            </div>
            <div>
              <p
                class="text-sm tracking-[0.2em] uppercase"
                style="color:rgba(201,168,76,0.35);font-family:var(--font-heading,serif);"
              >
                Seat
              </p>
              <p
                class="mt-0.5 text-sm"
                style="color:#c9a84c;font-family:var(--font-heading,serif);"
              >
                LOVE
              </p>
            </div>
            <div class="col-span-3">
              <p
                class="text-sm tracking-[0.2em] uppercase"
                style="color:rgba(201,168,76,0.35);font-family:var(--font-heading,serif);"
              >
                Gate / Venue
              </p>
              <p
                class="mt-0.5 text-sm leading-snug"
                style="color:rgba(228,216,180,0.75);font-family:var(--font-heading,serif);"
              >
                {evt.location}
              </p>
              {#if evt.locationUrl}
                <a
                  href={evt.locationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mt-1 inline-flex items-center gap-1 text-sm tracking-[0.25em] uppercase"
                  style="color:#c9a84c;font-family:var(--font-heading,serif);"
                >
                  View Map →
                </a>
              {/if}
            </div>
          </div>

          <!-- Barcode decoration -->
          <div class="px-4 pb-4">
            <div class="flex w-full gap-px" style="height:28px;">
              {#each Array(60) as _, bi}
                <div
                  style="
                  flex:1;
                  height:{20 + Math.sin(bi * 1.3) * 8}px;
                  background:rgba(201,168,76,{0.15 + Math.abs(Math.sin(bi * 0.7)) * 0.2});
                  align-self:center;
                "
                ></div>
              {/each}
            </div>
            <p
              class="mt-1 text-center text-sm tracking-[0.3em]"
              style="color:rgba(201,168,76,0.2);font-family:monospace;"
            >
              WD{String(i + 1).padStart(2, '0')}{Math.random()
                .toString(36)
                .substring(2, 10)
                .toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    {/each}
  {/if}
</section>
