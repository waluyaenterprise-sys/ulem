<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import Credit from '$lib/Credit.svelte';
  import { getAdaptiveNameStyle } from '$lib/utils/adaptiveName';

  export let invitation: any;

  const closingImages: string[] = invitation?.closing?.imageUrls || [];
  const closingMessage: string = invitation?.closing?.message || '';
  const groomName: string = invitation?.groom?.name || 'Groom';
  const brideName: string = invitation?.bride?.name || 'Bride';
  const bgImage = closingImages[0] || '';
  const groomNameStyle = getAdaptiveNameStyle(groomName, { maxRem: 2.2, minRem: 1.05, endAt: 24 });
  const brideNameStyle = getAdaptiveNameStyle(brideName, { maxRem: 2.2, minRem: 1.05, endAt: 24 });

  // Departure board rows — flip board animation
  const destinations = [
    { dest: 'Forever Together', status: 'DEPARTED', gate: 'LOVE' },
    { dest: 'A New Chapter', status: 'ON TIME', gate: 'LIFE' },
    { dest: 'Eternal Happiness', status: 'BOARDING', gate: 'BLISS' }
  ];

  let visible = false;
  let sectionEl: HTMLElement;
  let boardVisible = false;

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible = true;
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    );
    if (sectionEl) observer.observe(sectionEl);
    return () => observer.disconnect();
  });

  $: if (visible) {
    setTimeout(() => (boardVisible = true), 600);
  }
</script>

<section
  bind:this={sectionEl}
  class="relative w-full overflow-hidden"
  style="min-height:100svh;background:#0d1b2a;"
>
  <!-- BG photo -->
  {#if bgImage}
    <div class="absolute inset-0">
      <img
        src={bgImage}
        alt=""
        class="h-full w-full object-cover"
        style="filter:brightness(0.2) sepia(25%);"
      />
    </div>
  {/if}

  <!-- Security pattern -->
  <div
    class="pointer-events-none absolute inset-0"
    style="
    background-image:
      repeating-linear-gradient(45deg, rgba(201,168,76,0.02) 0, rgba(201,168,76,0.02) 1px, transparent 0, transparent 50%),
      repeating-linear-gradient(-45deg, rgba(201,168,76,0.02) 0, rgba(201,168,76,0.02) 1px, transparent 0, transparent 50%);
    background-size:20px 20px;
  "
  ></div>

  <!-- Top / bottom gradient fades -->
  <div
    class="pointer-events-none absolute inset-x-0 top-0"
    style="height:120px;background:linear-gradient(to bottom,#0d1b2a,transparent);"
  ></div>
  <div
    class="pointer-events-none absolute inset-x-0 bottom-0"
    style="height:120px;background:linear-gradient(to top,#0d1b2a,transparent);"
  ></div>

  <div class="relative z-10 flex min-h-svh flex-col items-center justify-center px-5 py-16">
    {#if visible}
      <!-- Departure board -->
      <div
        in:fly={{ y: -20, delay: 200, duration: 800, easing: cubicOut }}
        class="mb-10 w-full"
        style="max-width:360px;"
      >
        <!-- Board header -->
        <div
          class="flex items-center justify-between px-3 py-2"
          style="background:#040c14;border:1px solid rgba(201,168,76,0.2);border-bottom:none;"
        >
          <div class="flex items-center gap-2">
            <svg width="14" height="10" viewBox="0 0 14 10">
              <rect
                x="0.5"
                y="0.5"
                width="13"
                height="9"
                rx="1"
                fill="none"
                stroke="#c9a84c"
                stroke-width="0.6"
                opacity="0.4"
              />
              <line
                x1="4"
                y1="3"
                x2="10"
                y2="3"
                stroke="#c9a84c"
                stroke-width="0.4"
                opacity="0.3"
              />
              <line x1="4" y1="6" x2="8" y2="6" stroke="#c9a84c" stroke-width="0.4" opacity="0.3" />
            </svg>
            <span
              class="text-sm tracking-[0.4em] uppercase"
              style="color:rgba(201,168,76,0.5);font-family:var(--font-heading,serif);"
            >
              Departures
            </span>
          </div>
          <span
            class="text-sm tracking-[0.3em]"
            style="color:rgba(201,168,76,0.3);font-family:monospace;"
          >
            ● LIVE
          </span>
        </div>

        <!-- Board rows -->
        <div style="border:1px solid rgba(201,168,76,0.15);background:#060e18;">
          <!-- Column headers -->
          <div
            class="grid px-3 py-1.5"
            style="grid-template-columns:1fr 70px 40px;border-bottom:1px solid rgba(201,168,76,0.12);"
          >
            {#each ['Destination', 'Status', 'Gate'] as col}
              <p
                class="text-sm tracking-[0.35em] uppercase"
                style="color:rgba(201,168,76,0.3);font-family:var(--font-heading,serif);"
              >
                {col}
              </p>
            {/each}
          </div>

          {#each destinations as row, i}
            <div
              class="grid items-center px-3 py-2.5"
              style="grid-template-columns:1fr 70px 40px;border-bottom:{i < destinations.length - 1
                ? '1px solid rgba(201,168,76,0.08)'
                : 'none'};
              background:{boardVisible ? 'transparent' : '#040c14'};transition:background 200ms {i *
                150}ms;"
            >
              <p
                class="text-sm leading-tight"
                style="color:rgba(228,216,180,{boardVisible
                  ? 0.8
                  : 0});font-family:var(--font-heading,serif);transition:color 400ms {200 +
                  i * 150}ms;"
              >
                {row.dest}
              </p>
              <p
                class="text-xs tracking-wide"
                style="color:{row.status === 'DEPARTED'
                  ? 'rgba(201,168,76,0.7)'
                  : row.status === 'BOARDING'
                    ? 'rgba(107,175,107,0.8)'
                    : 'rgba(200,200,200,0.6)'};font-family:monospace;opacity:{boardVisible
                  ? 1
                  : 0};transition:opacity 400ms {300 + i * 150}ms;"
              >
                {row.status}
              </p>
              <p
                class="text-sm font-bold"
                style="color:rgba(201,168,76,{boardVisible
                  ? 0.6
                  : 0});font-family:monospace;transition:color 400ms {400 + i * 150}ms;"
              >
                {row.gate}
              </p>
            </div>
          {/each}
        </div>
      </div>

      <!-- Names -->
      <div in:fly={{ y: 20, delay: 400, duration: 800, easing: cubicOut }} class="mb-6 text-center">
        <p
          class="mb-3 text-xs tracking-[0.5em] uppercase"
          style="color:rgba(201,168,76,0.4);font-family:var(--font-heading,serif);"
        >
          With love
        </p>
        <p
          class="text-3xl"
          style={brideNameStyle + '; color:#e8d4a0;font-family:var(--font-script,cursive);'}
        >
          {brideName}
        </p>
        <p
          class="my-2 text-sm tracking-[0.4em] uppercase"
          style="color:rgba(201,168,76,0.4);font-family:var(--font-heading,serif);"
        >
          &
        </p>
        <p
          class="text-3xl"
          style={groomNameStyle + '; color:#e8d4a0;font-family:var(--font-script,cursive);'}
        >
          {groomName}
        </p>
      </div>

      <!-- Closing message -->
      {#if closingMessage}
        <div in:fade={{ delay: 600, duration: 700 }} class="mb-8 max-w-xs text-center">
          <div
            style="width:30px;height:1px;background:rgba(201,168,76,0.3);margin:0 auto 14px;"
          ></div>
          <p
            class="text-xs leading-loose italic"
            style="color:rgba(228,216,180,0.55);font-family:var(--font-heading,serif);"
          >
            {closingMessage}
          </p>
        </div>
      {/if}

      <!-- Stamp: "Thank You" -->
      <div
        in:fade={{ delay: 800, duration: 700 }}
        class="relative mb-10 flex items-center justify-center"
        style="width:120px;height:120px;"
      >
        <svg class="absolute inset-0" width="120" height="120" viewBox="0 0 120 120">
          <rect
            x="4"
            y="4"
            width="112"
            height="112"
            rx="4"
            fill="none"
            stroke="#c9a84c"
            stroke-width="1"
            stroke-dasharray="4 3"
            opacity="0.35"
          />
          <rect
            x="10"
            y="10"
            width="100"
            height="100"
            rx="3"
            fill="none"
            stroke="#c9a84c"
            stroke-width="0.5"
            opacity="0.15"
          />
        </svg>
        <div class="relative text-center">
          <p
            class="text-xs tracking-[0.5em] uppercase"
            style="color:rgba(201,168,76,0.4);font-family:var(--font-heading,serif);"
          >
            Thank
          </p>
          <p
            class="text-2xl"
            style="color:rgba(201,168,76,0.55);font-family:var(--font-script,cursive);"
          >
            You
          </p>
          <p
            class="text-sm tracking-[0.3em] uppercase"
            style="color:rgba(201,168,76,0.3);font-family:var(--font-heading,serif);"
          >
            ✦ always ✦
          </p>
        </div>
      </div>

      <!-- Gallery mosaic of closing images -->
      {#if closingImages.length > 1}
        <div
          class="mb-8 grid w-full gap-1.5"
          style="max-width:360px;grid-template-columns:repeat(3,1fr);"
        >
          {#each closingImages.slice(1, 7) as img, i}
            <div
              in:fly={{ y: 12, delay: 900 + i * 80, duration: 500, easing: cubicOut }}
              style="aspect-ratio:1;overflow:hidden;border:1px solid rgba(201,168,76,0.15);"
            >
              <img
                src={img}
                alt=""
                class="h-full w-full object-cover"
                style="filter:sepia(20%) brightness(0.75);"
              />
            </div>
          {/each}
        </div>
      {/if}

      <!-- Credit -->
      <div in:fade={{ delay: 1100, duration: 600 }}>
        <div
          style="width:40px;height:1px;background:rgba(201,168,76,0.2);margin:0 auto 16px;"
        ></div>
        <Credit />
      </div>
    {/if}
  </div>
</section>
