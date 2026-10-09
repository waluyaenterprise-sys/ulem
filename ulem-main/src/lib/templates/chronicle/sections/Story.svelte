<script lang="ts">
  import { onMount } from 'svelte';
  import { formatIndonesianDate } from '$lib/utils/formatDate';

  export let invitation: any;

  const stories: any[] = invitation?.loveStories ?? [];

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

<section bind:this={el} class="w-full px-6 py-24" style="background:#0d1829;">
  <!-- Chapter header -->
  <div
    class="mb-12 flex items-center gap-3"
    style="opacity:{visible ? 1 : 0};transform:translateX({visible
      ? 0
      : -16}px);transition:opacity 600ms ease,transform 600ms ease;"
  >
    <div style="width:3px;height:32px;background:#c4754a;flex-shrink:0;"></div>
    <div>
      <p
        class="text-xs tracking-[0.55em] uppercase"
        style="color:#c4754a;font-family:var(--font-heading,sans-serif);"
      >
        Chapter 04
      </p>
      <p
        class="text-lg font-bold"
        style="color:#f0f4ff;font-family:var(--font-heading,sans-serif);letter-spacing:-0.02em;"
      >
        Our Story
      </p>
    </div>
    <div class="ml-auto" aria-hidden="true">
      <span
        style="font-size:80px;font-weight:900;color:rgba(196,117,74,0.07);font-family:var(--font-heading,sans-serif);line-height:1;user-select:none;"
        >04</span
      >
    </div>
  </div>

  <!-- Story flow: alternating left-right with index badges -->
  <div class="relative flex flex-col">
    <!-- Center spine -->
    <div
      class="pointer-events-none absolute inset-y-0"
      style="left:50%;width:1px;background:linear-gradient(to bottom,transparent,rgba(196,117,74,0.3) 5%,rgba(196,117,74,0.3) 95%,transparent);transform:translateX(-0.5px);"
      aria-hidden="true"
    ></div>

    {#each stories as story, i}
      {@const info = story.date ? formatIndonesianDate(story.date) : null}
      {@const isLeft = i % 2 === 0}

      <div
        class="relative mb-10 flex"
        style="
          opacity:{visible ? 1 : 0};
          transform:translateX({visible ? 0 : isLeft ? -20 : 20}px);
          transition:opacity 700ms {150 + i * 180}ms ease,transform 700ms {150 +
          i * 180}ms cubic-bezier(0.33,1,0.68,1);
          justify-content:{isLeft ? 'flex-start' : 'flex-end'};
          padding-{isLeft ? 'right' : 'left'}:calc(50% + 20px);
        "
      >
        <!-- Spine node -->
        <div
          class="absolute top-3 flex h-7 w-7 items-center justify-center text-xs font-bold"
          style="left:calc(50% - 14px);background:#c4754a;color:#fff;font-family:var(--font-heading,sans-serif);z-index:1;"
        >
          {String(i + 1).padStart(2, '0')}
        </div>

        <!-- Card -->
        <div
          class="w-full overflow-hidden"
          style="background:#151e30;border:1px solid rgba(255,255,255,0.06);"
        >
          {#if story.imageUrls?.[0]}
            <div style="height:110px;overflow:hidden;">
              <img
                src={story.imageUrls[0]}
                alt={story.title}
                class="h-full w-full object-cover"
                style="filter:grayscale(0.15) brightness(0.9);"
              />
            </div>
          {/if}

          <div class="px-4 py-4">
            {#if info}
              <div
                class="mb-2 inline-flex items-center gap-1.5 px-2 py-0.5"
                style="background:rgba(196,117,74,0.12);border:1px solid rgba(196,117,74,0.25);"
              >
                <span
                  class="text-xs tracking-[0.3em]"
                  style="color:#c4754a;font-family:var(--font-heading,sans-serif);"
                  >{info.monthName} {info.year}</span
                >
              </div>
            {/if}

            <p
              class="mt-1 text-sm leading-snug font-semibold"
              style="color:#f0f4ff;font-family:var(--font-heading,sans-serif);"
            >
              {story.title || ''}
            </p>

            {#if story.description}
              <p
                class="mt-1.5 text-xs leading-relaxed"
                style="color:#475569;font-family:var(--font-body,sans-serif);"
              >
                {story.description}
              </p>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>

  <!-- Flow connector -->
  <div
    class="mt-4 flex flex-col items-center gap-1"
    style="opacity:{visible ? 1 : 0};transition:opacity 700ms 700ms ease;"
  >
    <div
      style="width:1px;height:20px;background:linear-gradient(to bottom,rgba(196,117,74,0.4),transparent);"
    ></div>
    <div style="width:6px;height:6px;background:#c4754a;transform:rotate(45deg);"></div>
  </div>
</section>
