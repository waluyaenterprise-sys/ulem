<script lang="ts">
  import { formatIndonesianDate } from '$lib/utils/formatDate';

  export let invitation: any;

  const stories: any[] = invitation.loveStories ?? [];

  function reveal(node: HTMLElement, { delay = 0 } = {}) {
    node.style.opacity = '0';
    node.style.transform = 'translateY(28px)';
    node.style.transition = `opacity 0.9s ease ${delay}ms, transform 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}ms`;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.style.opacity = '1';
          node.style.transform = 'translateY(0)';
          observer.unobserve(node);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    observer.observe(node);
    return { destroy: () => observer.disconnect() };
  }

  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
</script>

<section
  class="relative w-full overflow-hidden px-5 py-16"
  style="background: linear-gradient(160deg, #F4E8C1 0%, #F0DFA8 50%, #EDD9A3 100%);"
>
  <!-- Lined paper effect -->
  <div
    class="pointer-events-none absolute inset-0 opacity-[0.04]"
    style="background-image: repeating-linear-gradient(0deg, transparent, transparent 27px, #8B4513 27px, #8B4513 28px);"
  ></div>
  <div
    class="pointer-events-none absolute inset-0"
    style="box-shadow: inset 0 0 70px rgba(139,69,19,0.15);"
  ></div>

  <!-- Left margin line -->
  <div
    class="pointer-events-none absolute top-0 bottom-0 left-12 w-px opacity-10"
    style="background: #C9A227;"
  ></div>

  <div class="relative z-10 mx-auto max-w-sm">
    <!-- Header -->
    <div use:reveal class="mb-10 text-center">
      <p class="font-body text-[9px] tracking-[0.4em] text-amber-800/50 uppercase">Catatan Hati</p>
      <p class="mt-1 font-script text-4xl text-amber-900">Kisah Cinta Kami</p>
      <div class="mx-auto mt-3 flex items-center justify-center gap-2">
        <div class="h-px w-10 bg-amber-700/40"></div>
        <div class="h-1 w-1 rotate-45 bg-amber-700/50"></div>
        <div class="h-px w-10 bg-amber-700/40"></div>
      </div>
    </div>

    <!-- Stories -->
    {#if stories.length === 0}
      <p class="text-center font-body text-sm text-amber-800/40 italic">
        Kisah akan segera hadir...
      </p>
    {/if}

    {#each stories as story, i}
      {@const dateInfo = story.date ? formatIndonesianDate(story.date) : null}
      <div use:reveal={{ delay: i * 140 }} class="relative mb-8 flex gap-4">
        <!-- Chapter indicator -->
        <div class="flex w-10 shrink-0 flex-col items-center gap-1 pt-1">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-sm font-heading text-sm font-bold text-white italic"
            style="background: linear-gradient(135deg, #C9A227 0%, #8B6914 100%);"
          >
            {romanNumerals[i] ?? i + 1}
          </div>
          {#if i < stories.length - 1}
            <div
              class="mt-1 w-px flex-1"
              style="background: repeating-linear-gradient(to bottom, #C9A227 0px, #C9A227 4px, transparent 4px, transparent 8px);"
            ></div>
          {/if}
        </div>

        <!-- Story card -->
        <div
          class="flex-1 overflow-hidden"
          style="
            background: rgba(255,255,255,0.4);
            border: 1px solid rgba(184,134,11,0.25);
            box-shadow: 3px 3px 0 rgba(139,105,20,0.3);
          "
        >
          {#if story.imageUrl}
            <div class="relative h-40 w-full overflow-hidden">
              <img
                src={story.imageUrl}
                alt={story.title}
                class="h-full w-full object-cover"
                style="filter: sepia(20%) saturate(0.9);"
              />
              <div
                class="absolute inset-0"
                style="background: linear-gradient(to bottom, transparent 40%, rgba(244,232,193,0.7) 100%);"
              ></div>
            </div>
          {/if}

          <div class="px-4 py-4">
            {#if dateInfo}
              <p class="font-body text-[10px] tracking-wider text-amber-700/60 uppercase">
                {dateInfo.day}
                {dateInfo.monthName}
                {dateInfo.year}
              </p>
            {/if}
            <h3 class="mt-1 font-heading text-base font-bold text-amber-900 italic">
              {story.title}
            </h3>
            <p class="mt-2 font-body text-xs leading-relaxed text-amber-900/60">
              {story.description}
            </p>
          </div>
        </div>
      </div>
    {/each}
  </div>
</section>
