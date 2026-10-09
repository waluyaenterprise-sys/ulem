<script lang="ts">
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { formatIndonesianDate } from '$lib/utils/formatDate';

  export let invitation: any;

  const stories: any[] = invitation?.loveStories ?? [];

  let visible = false;
  let sectionEl: HTMLElement;
  let openIndex: number | null = null;

  function toggle(i: number) {
    openIndex = openIndex === i ? null : i;
  }

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

<section bind:this={sectionEl} class="w-full px-5 py-20" style="background:#040404;">
  <!-- HEADER -->
  <div
    class="mb-14 text-center transition-all duration-700"
    style="opacity:{visible ? 1 : 0};transform:translateY({visible ? 0 : -16}px)"
  >
    <p
      class="text-[9px] tracking-[0.45em] uppercase"
      style="color:#c9a84c;font-family:var(--font-heading,sans-serif);"
    >
      Our Love Story
    </p>
    <div style="width:40px;height:1px;background:#c9a84c;margin:12px auto 0;opacity:0.6;"></div>
  </div>

  <!-- ACCORDION STORIES -->
  <div class="mx-auto flex max-w-sm flex-col">
    {#each stories as story, i}
      {@const info = story.date ? formatIndonesianDate(story.date) : null}

      <div
        class="border-b transition-all duration-700"
        style="
          border-color:rgba(201,168,76,0.2);
          opacity:{visible ? 1 : 0};
          transform:translateY({visible ? 0 : 30}px);
          transition-delay:{100 + i * 100}ms;
        "
      >
        <!-- Accordion trigger -->
        <button
          type="button"
          class="flex w-full items-center justify-between gap-4 py-5 text-left transition hover:opacity-80"
          on:click={() => toggle(i)}
        >
          <div class="flex items-center gap-4">
            <!-- Number -->
            <span
              class="shrink-0 text-4xl leading-none font-thin"
              style="color:rgba(201,168,76,{openIndex === i
                ? '0.9'
                : '0.25'});font-family:var(--font-heading,sans-serif);transition:color 0.3s;"
              >{String(i + 1).padStart(2, '0')}</span
            >
            <!-- Title + date -->
            <div>
              <p
                class="text-sm"
                style="color:{openIndex === i
                  ? '#fff'
                  : 'rgba(255,255,255,0.65)'};font-family:var(--font-heading,sans-serif);transition:color 0.3s;"
              >
                {story.title}
              </p>
              {#if info}
                <p
                  class="mt-0.5 text-[10px]"
                  style="color:rgba(201,168,76,0.55);font-family:var(--font-body,sans-serif);"
                >
                  {info.day}
                  {info.monthName}
                  {info.year}
                </p>
              {/if}
            </div>
          </div>

          <!-- Chevron -->
          <div
            class="shrink-0 transition-transform duration-300"
            style="transform:rotate({openIndex === i ? '45deg' : '0deg'});"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <line
                x1="8"
                y1="1"
                x2="8"
                y2="15"
                stroke="#c9a84c"
                stroke-width="1.5"
                stroke-opacity="0.7"
              />
              <line
                x1="1"
                y1="8"
                x2="15"
                y2="8"
                stroke="#c9a84c"
                stroke-width="1.5"
                stroke-opacity="0.7"
              />
            </svg>
          </div>
        </button>

        <!-- Accordion panel -->
        {#if openIndex === i}
          <div transition:slide={{ duration: 350, easing: cubicOut }} class="pb-6">
            {#if story.imageUrl}
              <div
                class="mb-5 overflow-hidden"
                style="height:220px;border:1px solid rgba(201,168,76,0.15);"
              >
                <img
                  src={story.imageUrl}
                  alt={story.title}
                  class="h-full w-full object-cover"
                  style="filter:brightness(0.75);"
                />
              </div>
            {/if}

            <!-- Gold left bar text -->
            <div class="border-l pl-5" style="border-color:rgba(201,168,76,0.4);">
              <p
                class="text-xs leading-[1.9]"
                style="color:rgba(255,255,255,0.55);font-family:var(--font-body,sans-serif);"
              >
                {story.description}
              </p>
            </div>
          </div>
        {/if}
      </div>
    {/each}
  </div>
</section>
