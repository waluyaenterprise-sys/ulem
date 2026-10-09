<script lang="ts">
  import { onMount } from 'svelte';
  import { formatIndonesianDate } from '$lib/utils/formatDate';

  export let invitation: any;

  const stories: any[] = invitation?.loveStories ?? [];

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
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    );
    if (sectionEl) observer.observe(sectionEl);
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
    <p class="font-heading text-2xl tracking-[0.3em] text-[#a89880] uppercase">Our Love Story</p>
    <div class="mx-auto mt-3 w-8 border-t border-[#c9b49a]"></div>
  </div>

  <!-- STORY ENVELOPES -->
  <div class="flex flex-col items-center gap-10">
    {#each stories as story, i}
      {@const info = story.date ? formatIndonesianDate(story.date) : null}

      <div
        class="w-full max-w-xs"
        style="opacity:{visible ? 1 : 0};transform:translateY({visible
          ? 0
          : 40}px);transition:opacity 700ms {150 + i * 200}ms ease,transform 700ms {150 +
          i * 200}ms cubic-bezier(0.33,1,0.68,1)"
      >
        <!-- Envelope wrapper -->
        <div class="relative bg-[#f0ece4] shadow-lg" style="border-radius: 4px;">
          <!-- Envelope top flap (triangle pointing down) -->
          <div class="envelope-flap"></div>

          <!-- Wax seal sitting on the fold line -->
          <div class="wax-seal" style="top: 32px;">
            <span style="font-family: serif; font-style: italic;"
              >{String(i + 1).padStart(2, '0')}</span
            >
          </div>

          <!-- Letter content inside envelope -->
          <div class="px-5 pt-10 pb-6">
            {#if story.imageUrl}
              <div class="mb-4 overflow-hidden" style="box-shadow: 0 2px 12px rgba(0,0,0,0.12);">
                <img
                  src={story.imageUrl}
                  alt={story.title}
                  class="h-52 w-full object-cover"
                  style="transform:{visible
                    ? 'scale(1)'
                    : 'scale(1.08)'};transition:transform 1000ms {250 + i * 200}ms ease"
                />
              </div>
            {/if}

            {#if info}
              <p
                class="mb-2 font-heading text-[10px] tracking-[0.25em] text-[#a89880] uppercase"
                style="opacity:{visible ? 1 : 0};transform:translateY({visible
                  ? 0
                  : 8}px);transition:opacity 500ms {350 + i * 200}ms,transform 500ms {350 +
                  i * 200}ms ease"
              >
                {info.day}
                {info.monthName}
                {info.year}
              </p>
            {/if}

            <h3
              class="mb-3 font-script text-2xl text-[#3a3028]"
              style="opacity:{visible ? 1 : 0};transform:translateY({visible
                ? 0
                : 10}px);transition:opacity 600ms {420 + i * 200}ms,transform 600ms {420 +
                i * 200}ms ease"
            >
              {story.title}
            </h3>
            <div
              class="mb-3 border-t border-dashed border-[#d6ccc0]"
              style="transform:scaleX({visible ? 1 : 0});transition:transform 400ms {480 +
                i * 200}ms ease;transform-origin:left"
            ></div>
            <p
              class="font-body text-xs leading-relaxed text-[#7a6e62]"
              style="opacity:{visible ? 1 : 0};transition:opacity 600ms {540 + i * 200}ms ease"
            >
              {story.description}
            </p>
          </div>

          <div class="h-px w-full bg-[#d6ccc0]"></div>
          <div class="envelope-bottom"></div>
        </div>
      </div>
    {/each}
  </div>
</section>

<style>
  /* Envelope flap triangle via clip-path */
  .envelope-flap {
    width: 100%;
    height: 65px;
    background: #e8e0d4;
    clip-path: polygon(0 0, 100% 0, 50% 100%);
  }

  /* Envelope bottom triangle (V shape at bottom of flap area) */
  .envelope-bottom {
    width: 100%;
    height: 52px;
    background: #f0ece4;
    clip-path: polygon(0 100%, 100% 100%, 50% 0);
    margin-top: -1px;
  }

  /* Wax seal circle */
  .wax-seal {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #c9b49a;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 14px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
  }
</style>
