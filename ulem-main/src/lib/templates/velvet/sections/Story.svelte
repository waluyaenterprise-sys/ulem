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

<section
  bind:this={sectionEl}
  class="relative w-full overflow-hidden px-5 py-20"
  style="background: linear-gradient(160deg, #1c0f0a 0%, #2d1a0e 50%, #1c0f0a 100%);"
>
  <!-- Background warm glow -->
  <div
    class="pointer-events-none absolute"
    style="width:450px;height:450px;border-radius:50%;background:radial-gradient(circle, rgba(232,164,90,0.08) 0%, transparent 70%);bottom:0;right:-100px;"
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
      Our Love Story
    </p>
    <div
      class="mx-auto mt-4"
      style="width:50px;height:1px;background:linear-gradient(to right,transparent,rgba(232,164,90,0.6),transparent);"
    ></div>
  </div>

  <!-- Stories timeline -->
  <div class="relative flex flex-col items-center gap-0">
    <!-- Vertical timeline line -->
    <div
      class="pointer-events-none absolute"
      style="
        width:1px;
        top:0;bottom:0;left:50%;
        transform:translateX(-50%);
        background:linear-gradient(to bottom, transparent, rgba(232,164,90,0.25) 10%, rgba(232,164,90,0.25) 90%, transparent);
      "
    ></div>

    {#each stories as story, i}
      {@const info = story.date ? formatIndonesianDate(story.date) : null}
      {@const isLeft = i % 2 === 0}

      <div
        class="relative z-10 w-full max-w-sm"
        style="
          opacity:{visible ? 1 : 0};
          transform:translateY({visible ? 0 : 40}px);
          transition: opacity 700ms {150 + i * 200}ms ease, transform 700ms {150 +
          i * 200}ms cubic-bezier(0.33,1,0.68,1);
          margin-bottom: {i < stories.length - 1 ? '32px' : '0'};
        "
      >
        <!-- Number badge on timeline -->
        <div
          class="absolute flex items-center justify-center rounded-full"
          style="
            width:36px;height:36px;
            left:50%;transform:translateX(-50%);
            top:-18px;
            background: rgba(232,164,90,0.18);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(232,164,90,0.45);
            color: rgba(232,164,90,0.9);
            font-size: 12px;
            font-family: var(--font-heading, sans-serif);
          "
        >
          {String(i + 1).padStart(2, '0')}
        </div>

        <!-- Glass card -->
        <div
          class="mt-4 overflow-hidden rounded-2xl"
          style="
            background: rgba(255,200,120,0.07);
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
            border: 1px solid rgba(232,164,90,0.20);
            box-shadow: 0 8px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,230,170,0.10);
          "
        >
          {#if story.imageUrl}
            <div class="relative overflow-hidden" style="height:220px;">
              <img
                src={story.imageUrl}
                alt={story.title}
                class="h-full w-full object-cover"
                style="transform:{visible
                  ? 'scale(1)'
                  : 'scale(1.08)'};transition:transform 1000ms {250 + i * 200}ms ease"
              />
              <div
                class="absolute inset-x-0 bottom-0"
                style="height:70px;background:linear-gradient(to top, rgba(45,26,14,0.88), transparent);"
              ></div>
            </div>
          {/if}

          <div class="px-6 py-6">
            {#if info}
              <p
                class="mb-2 text-[10px] tracking-[0.25em] uppercase"
                style="color: rgba(232,164,90,0.65); font-family: var(--font-heading, sans-serif);
                  opacity:{visible ? 1 : 0};transition:opacity 500ms {350 + i * 200}ms ease"
              >
                {info.day}
                {info.monthName}
                {info.year}
              </p>
            {/if}

            <h3
              class="mb-3 text-2xl"
              style="font-family: var(--font-script, serif); color: rgba(255,230,180,0.95);
                opacity:{visible ? 1 : 0};transition:opacity 600ms {420 + i * 200}ms ease"
            >
              {story.title}
            </h3>

            <div
              style="height:1px;background:linear-gradient(to right,rgba(232,164,90,0.3),transparent);margin-bottom:12px;
                transform:scaleX({visible ? 1 : 0});transition:transform 400ms {480 +
                i * 200}ms ease;transform-origin:left"
            ></div>

            <p
              class="text-xs leading-relaxed"
              style="color: rgba(255,200,140,0.6); font-family: var(--font-body, sans-serif);
                opacity:{visible ? 1 : 0};transition:opacity 600ms {540 + i * 200}ms ease"
            >
              {story.description}
            </p>
          </div>
        </div>
      </div>
    {/each}
  </div>
</section>
