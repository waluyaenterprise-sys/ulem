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

  function s(delayMs: number) {
    return `animation: storyFadeIn 0.7s ease ${delayMs}ms both;`;
  }
</script>

<section
  bind:this={el}
  class="relative w-full overflow-hidden px-6 py-24"
  style="background:#0d0905;"
>
  <!-- Film grain -->
  <div
    class="film-grain pointer-events-none absolute inset-0"
    style="opacity:0.3"
    aria-hidden="true"
  ></div>

  {#if visible}
    <!-- Scene header -->
    <div style={s(0)} class="mb-12 text-center">
      <p
        class="text-xs tracking-[0.6em] uppercase"
        style="color:#7a6848;font-family:var(--font-heading,sans-serif);"
      >
        Scene IV
      </p>
      <p
        class="mt-1 text-xl font-bold"
        style="color:#f5e6c8;font-family:var(--font-heading,sans-serif);letter-spacing:-0.01em;"
      >
        Our Story
      </p>
      <div class="mx-auto mt-3" style="width:40px;height:1px;background:#c9933a;opacity:0.6;"></div>
    </div>

    <!-- Filmstrip timeline -->
    <div class="relative mx-auto max-w-sm">
      <!-- Vertical center line -->
      <div
        class="pointer-events-none absolute inset-y-0"
        style="left:50%;width:1px;background:linear-gradient(to bottom,transparent,rgba(201,147,58,0.25) 5%,rgba(201,147,58,0.25) 95%,transparent);transform:translateX(-0.5px);"
        aria-hidden="true"
      ></div>

      {#each stories as story, i}
        {@const dateInfo = story.date ? formatIndonesianDate(story.date) : null}
        {@const isLeft = i % 2 === 0}

        <div
          style={s(200 + i * 180) +
            `display:flex;justify-content:${isLeft ? 'flex-start' : 'flex-end'};padding-${isLeft ? 'right' : 'left'}:calc(50% + 18px);`}
          class="relative mb-8"
        >
          <!-- Node on spine -->
          <div
            class="absolute flex items-center justify-center text-xs font-bold"
            style="top:14px;left:calc(50% - 12px);width:24px;height:24px;background:#c9933a;color:#0d0905;font-family:var(--font-heading,sans-serif);z-index:1;border-radius:2px;"
          >
            {String(i + 1).padStart(2, '0')}
          </div>

          <!-- Card -->
          <div
            style="background:#120c06;border:1px solid rgba(201,147,58,0.18);overflow:hidden;width:100%;"
          >
            {#if story.imageUrls?.[0] || story.imageUrl}
              <div style="height:100px;overflow:hidden;">
                <img
                  src={story.imageUrls?.[0] || story.imageUrl}
                  alt={story.title}
                  class="h-full w-full object-cover"
                  style="filter:sepia(0.5) brightness(0.8) contrast(1.05);"
                />
              </div>
            {/if}
            <div class="p-3">
              {#if dateInfo}
                <p
                  class="mb-1 text-xs tracking-widest uppercase"
                  style="color:#c9933a;font-family:var(--font-heading,sans-serif);"
                >
                  {dateInfo.monthName}
                  {dateInfo.year}
                </p>
              {/if}
              <p
                class="mb-1 text-sm font-bold"
                style="color:#f5e6c8;font-family:var(--font-heading,sans-serif);"
              >
                {story.title}
              </p>
              {#if story.description}
                <p
                  class="text-xs leading-relaxed"
                  style="color:#5a4e38;font-family:var(--font-body,sans-serif);"
                >
                  {story.description}
                </p>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</section>

<style>
  @keyframes storyFadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .film-grain {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
    background-repeat: repeat;
  }
</style>
