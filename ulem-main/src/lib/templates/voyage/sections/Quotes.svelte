<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  export let invitation: any;

  const quoteImages: string[] = invitation?.quote?.imageUrls || [];
  const bgImage = quoteImages[0] || '';
  const couplePhoto = quoteImages[1] || quoteImages[0] || '';
  const quoteText: string = invitation?.quote?.text || 'Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah semoga ridho-Mu tercurah mengiringi pernikahan kami.';
  const quoteSource: string = invitation?.quote?.source || 'QS. Yasin : 36';

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

<section
  bind:this={sectionEl}
  class="relative flex w-full items-center justify-center overflow-hidden"
  style="min-height:100svh;background:#0d1b2a;"
>
  <!-- BG photo -->
  {#if bgImage}
    <div class="absolute inset-0">
      <img
        src={bgImage}
        alt=""
        class="h-full w-full object-cover"
        style="filter:brightness(0.25) sepia(30%);"
      />
    </div>
  {/if}

  <!-- Security pattern overlay -->
  <div
    class="pointer-events-none absolute inset-0"
    style="
    background-image:
      repeating-linear-gradient(45deg, rgba(201,168,76,0.02) 0, rgba(201,168,76,0.02) 1px, transparent 0, transparent 50%),
      repeating-linear-gradient(-45deg, rgba(201,168,76,0.02) 0, rgba(201,168,76,0.02) 1px, transparent 0, transparent 50%);
    background-size: 20px 20px;
  "
  ></div>

  <div class="relative z-10 mx-auto flex w-full max-w-sm flex-col items-center px-6 py-20">
    {#if visible}
      <!-- VISA STAMP PAGE header -->
      <div in:fade={{ duration: 600 }} class="mb-8 flex w-full items-center gap-3">
        <div
          style="flex:1;height:1px;background:linear-gradient(to right,transparent,rgba(201,168,76,0.35));"
        ></div>
        <p
          class="text-xs tracking-[0.5em] uppercase"
          style="color:rgba(201,168,76,0.5);font-family:var(--font-heading,serif);"
        >
          Page 02
        </p>
        <div
          style="flex:1;height:1px;background:linear-gradient(to left,transparent,rgba(201,168,76,0.35));"
        ></div>
      </div>

      <!-- Large decorative visa stamp circle -->
      <div
        in:fade={{ delay: 200, duration: 700 }}
        class="relative mb-8 flex items-center justify-center"
        style="width:160px;height:160px;"
      >
        <!-- Outer dashed ring -->
        <svg class="absolute inset-0" width="160" height="160" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r="76"
            stroke="#c9a84c"
            stroke-width="1"
            stroke-dasharray="4 3"
            fill="none"
            opacity="0.4"
          />
          <circle
            cx="80"
            cy="80"
            r="68"
            stroke="#c9a84c"
            stroke-width="0.5"
            fill="none"
            opacity="0.2"
          />
          <!-- Text around circle -->
          <path id="stamp-text-path" d="M80,12 A68,68 0 1,1 79.9,12" fill="none" />
          <text font-size="6.5" fill="#c9a84c" opacity="0.5" font-family="serif" letter-spacing="4">
            <textPath href="#stamp-text-path">THE WEDDING OF • THE WEDDING OF •</textPath>
          </text>
        </svg>
        <!-- Couple photo -->
        {#if couplePhoto}
          <div
            class="overflow-hidden rounded-full"
            style="width:110px;height:110px;border:1px solid rgba(201,168,76,0.3);"
          >
            <img
              src={couplePhoto}
              alt="Couple"
              class="h-full w-full object-cover"
              style="filter:sepia(20%) brightness(0.9);"
            />
          </div>
        {:else}
          <div
            style="width:110px;height:110px;border-radius:50%;background:rgba(201,168,76,0.05);border:1px solid rgba(201,168,76,0.2);"
          ></div>
        {/if}
        <!-- APPROVED stamp -->
        <div
          class="absolute right-1 bottom-1 px-2 py-0.5"
          style="background:rgba(10,30,50,0.9);border:1.5px solid rgba(201,168,76,0.55);transform:rotate(12deg);"
        >
          <p
            class="text-sm tracking-[0.3em] uppercase"
            style="color:#c9a84c;font-family:var(--font-heading,serif);"
          >
            Approved
          </p>
        </div>
      </div>

      <!-- Quote text -->
      <div
        in:fly={{ y: 20, delay: 400, duration: 700, easing: cubicOut }}
        class="relative px-2 text-center"
      >
        <!-- Top corner bracket -->
        <div class="mb-4 flex justify-center">
          <svg width="28" height="18" viewBox="0 0 28 18">
            <path
              d="M2 16 L2 2 L14 2"
              stroke="#c9a84c"
              stroke-width="1"
              fill="none"
              opacity="0.5"
            />
            <path
              d="M26 16 L26 2 L14 2"
              stroke="#c9a84c"
              stroke-width="1"
              fill="none"
              opacity="0.5"
            />
          </svg>
        </div>

        <p
          class="text-sm leading-loose italic"
          style="color:rgba(228,216,180,0.8);font-family:var(--font-heading,serif);"
        >
          {quoteText}
        </p>

        <!-- Bottom corner bracket -->
        <div class="mt-4 flex justify-center">
          <svg width="28" height="18" viewBox="0 0 28 18">
            <path
              d="M2 2 L2 16 L14 16"
              stroke="#c9a84c"
              stroke-width="1"
              fill="none"
              opacity="0.5"
            />
            <path
              d="M26 2 L26 16 L14 16"
              stroke="#c9a84c"
              stroke-width="1"
              fill="none"
              opacity="0.5"
            />
          </svg>
        </div>

        <p
          class="mt-3 text-sm tracking-[0.3em] uppercase"
          style="color:rgba(201,168,76,0.4);font-family:var(--font-heading,serif);"
        >
          {quoteSource}
        </p>
      </div>

      <!-- Entry stamp box at bottom -->
      <div
        in:fade={{ delay: 600, duration: 600 }}
        class="mt-10 w-full p-3"
        style="border:1px dashed rgba(201,168,76,0.25);background:rgba(201,168,76,0.03);"
      >
        <div class="flex items-center justify-between">
          <div>
            <p
              class="text-sm tracking-[0.35em] uppercase"
              style="color:rgba(201,168,76,0.35);font-family:var(--font-heading,serif);"
            >
              Entry Permit
            </p>
            <p
              class="mt-0.5 text-xs"
              style="color:rgba(201,168,76,0.5);font-family:var(--font-heading,serif);"
            >
              Valid for one lifetime
            </p>
          </div>
          <div
            style="width:40px;height:40px;border:1px solid rgba(201,168,76,0.2);display:flex;align-items:center;justify-content:center;"
          >
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path
                d="M10 2 L12 8 L18 8 L13.5 12 L15 18 L10 14.5 L5 18 L6.5 12 L2 8 L8 8 Z"
                fill="none"
                stroke="#c9a84c"
                stroke-width="0.8"
                opacity="0.4"
              />
            </svg>
          </div>
        </div>
      </div>
    {/if}
  </div>
</section>
