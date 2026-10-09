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

<section bind:this={el} class="w-full px-6 py-20" style="background:#faf8f5;">
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
      Perjalanan Cinta
    </p>
    <p class="mt-2 text-2xl" style="color:#4a3f35;font-family:var(--font-script,cursive);">
      Our Story
    </p>
    <div class="mx-auto mt-3 flex items-center gap-2" style="width:140px;">
      <div
        style="flex:1;height:1px;background:linear-gradient(to right,transparent,#d4a0a0 60%);"
      ></div>
      <svg width="6" height="6" viewBox="0 0 6 6"
        ><rect
          x="0.5"
          y="0.5"
          width="5"
          height="5"
          transform="rotate(45 3 3)"
          fill="none"
          stroke="#d4a0a0"
          stroke-width="0.8"
        /></svg
      >
      <div
        style="flex:1;height:1px;background:linear-gradient(to left,transparent,#d4a0a0 60%);"
      ></div>
    </div>
  </div>

  <!-- Timeline -->
  <div class="relative flex flex-col items-center">
    <!-- Vertical line -->
    <div
      class="absolute top-0 bottom-0 w-px"
      style="background:linear-gradient(to bottom,transparent,#e8c4b8 10%,#e8c4b8 90%,transparent);left:50%;"
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
          padding-{isLeft ? 'right' : 'left'}:calc(50% + 20px);
          padding-{isLeft ? 'left' : 'right'}:0;
        "
      >
        <!-- Timeline dot -->
        <div
          class="absolute top-4"
          style="left:calc(50% - 5px);width:10px;height:10px;border-radius:50%;background:#fff;border:1.5px solid #d4a0a0;box-shadow:0 0 0 3px rgba(212,160,160,0.15);"
          aria-hidden="true"
        ></div>

        <!-- Card -->
        <div
          class="overflow-hidden"
          style="background:#fff;border:1px solid #ede7e0;box-shadow:0 3px 16px rgba(180,150,130,0.07);"
        >
          {#if story.imageUrls?.[0]}
            <div style="height:130px;overflow:hidden;">
              <img
                src={story.imageUrls[0]}
                alt={story.title}
                class="h-full w-full object-cover"
                style="filter:brightness(0.95) saturate(0.85);"
              />
            </div>
          {/if}
          <div class="px-4 py-4">
            {#if info}
              <p
                class="mb-1 text-xs tracking-widest uppercase"
                style="color:#d4a0a0;font-family:var(--font-heading,serif);"
              >
                {info.monthName}
                {info.year}
              </p>
            {/if}
            <p
              class="mb-1 text-sm font-medium"
              style="color:#4a3f35;font-family:var(--font-heading,serif);"
            >
              {story.title || ''}
            </p>
            {#if story.description}
              <p
                class="text-xs leading-relaxed"
                style="color:#9a8a7e;font-family:var(--font-body,sans-serif);"
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
