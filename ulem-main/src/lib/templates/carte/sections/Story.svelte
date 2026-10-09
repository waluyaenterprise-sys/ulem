<script lang="ts">
  import { onMount } from 'svelte';
  import { formatIndonesianDate } from '$lib/utils/formatDate';

  export let invitation: any;

  const stories: any[] = invitation?.loveStories ?? [];

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

<section bind:this={el} class="w-full px-6 py-20" style="background:#faf6ef;">
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
      — Perjalanan Cinta —
    </p>
    <p class="mt-2 text-2xl" style="color:#2a1010;font-family:var(--font-script,cursive);">
      Our Story
    </p>
    <div class="mx-auto mt-3 flex items-center gap-2" style="width:160px;">
      <div
        style="flex:1;height:1px;background:linear-gradient(to right,transparent,#b8962e);"
      ></div>
      <svg width="7" height="7" viewBox="0 0 7 7">
        <rect
          x="0.5"
          y="0.5"
          width="6"
          height="6"
          transform="rotate(45 3.5 3.5)"
          fill="none"
          stroke="#b8962e"
          stroke-width="0.8"
        />
      </svg>
      <div style="flex:1;height:1px;background:linear-gradient(to left,transparent,#b8962e);"></div>
    </div>
  </div>

  <!-- Timeline -->
  <div class="relative flex flex-col items-center">
    <!-- Vertical spine — like a menu's center fold -->
    <div
      class="absolute top-0 bottom-0 w-px"
      style="left:50%;background:linear-gradient(to bottom,transparent,#b8962e 10%,#b8962e 90%,transparent);opacity:0.4;"
      aria-hidden="true"
    ></div>

    {#each stories as story, i}
      {@const info = story.date ? formatIndonesianDate(story.date) : null}
      {@const isLeft = i % 2 === 0}
      <div
        class="relative mb-10 w-full"
        style="
          opacity:{visible ? 1 : 0};
          transform:translateX({visible ? 0 : isLeft ? -20 : 20}px);
          transition:opacity 700ms {200 + i * 180}ms ease,transform 700ms {200 +
          i * 180}ms cubic-bezier(0.33,1,0.68,1);
          padding-{isLeft ? 'right' : 'left'}:calc(50% + 18px);
          padding-{isLeft ? 'left' : 'right'}:0;
        "
      >
        <!-- Timeline dot -->
        <div
          class="absolute top-4"
          style="left:calc(50% - 5px);width:10px;height:10px;background:#faf6ef;border:1.5px solid #6b1414;box-shadow:0 0 0 3px rgba(107,20,20,0.12);"
          aria-hidden="true"
        ></div>

        <!-- Story card -->
        <div
          style="background:#fff;border:1px solid #e8d8c8;box-shadow:1px 3px 12px rgba(107,20,20,0.06);"
        >
          <!-- Top accent -->
          <div
            style="height:2px;background:linear-gradient(to right,#6b1414,#b8962e);opacity:0.6;"
          ></div>

          {#if story.imageUrls?.[0]}
            <div style="height:120px;overflow:hidden;">
              <img
                src={story.imageUrls[0]}
                alt={story.title}
                class="h-full w-full object-cover"
                style="filter:sepia(0.15) brightness(0.94);"
              />
            </div>
          {/if}

          <div class="px-4 py-4">
            {#if info}
              <p
                class="mb-1 text-xs tracking-widest uppercase"
                style="color:#b8962e;font-family:var(--font-heading,serif);"
              >
                {info.monthName}
                {info.year}
              </p>
            {/if}
            <p
              class="mb-1 text-sm font-medium"
              style="color:#2a1010;font-family:var(--font-heading,serif);"
            >
              {story.title || ''}
            </p>
            {#if story.description}
              <p
                class="text-xs leading-relaxed"
                style="color:#7a5050;font-family:var(--font-body,sans-serif);"
              >
                {story.description}
              </p>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>
</section>
