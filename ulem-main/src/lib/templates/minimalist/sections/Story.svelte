<script lang="ts">
  import { formatIndonesianDate } from '$lib/utils/formatDate';

  export let invitation: any;

  const stories: any[] = invitation?.loveStories ?? [];

  function reveal(node: HTMLElement, { delay = 0 } = {}) {
    node.style.transitionDelay = `${delay}ms`;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('is-visible');
          observer.unobserve(node);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    );
    observer.observe(node);
    return { destroy: () => observer.disconnect() };
  }
</script>

<section class="relative w-full bg-[#fafafa] px-0 py-20">
  <!-- HEADER -->
  <div class="reveal-item mb-14 px-6 text-center" use:reveal>
    <p class="font-script text-4xl text-[#F0A269]">Our Love Story</p>
    <p class="mt-2 text-xs tracking-[0.3em] text-gray-400 uppercase">A journey of two souls</p>
  </div>

  <!-- STORIES -->
  <div class="relative flex flex-col gap-0">
    {#each stories as story, i}
      {@const info = story.date ? formatIndonesianDate(story.date) : null}

      <div class="reveal-item relative flex gap-0" use:reveal={{ delay: i * 120 }}>
        <!-- LEFT RAIL -->
        <div class="relative flex w-14 shrink-0 flex-col items-center">
          <!-- line top -->
          <div class="w-px flex-1 bg-gray-200" class:invisible={i === 0}></div>
          <!-- dot -->
          <div class="dot-pulse relative z-10 h-2.5 w-2.5 shrink-0 rounded-full bg-[#F0A269]"></div>
          <!-- line bottom -->
          <div class="w-px flex-1 bg-gray-200" class:invisible={i === stories.length - 1}></div>
        </div>

        <!-- CARD -->
        <div
          class="mr-6 mb-10 flex-1 overflow-hidden rounded-2xl bg-white shadow-[0_2px_20px_rgba(0,0,0,0.06)]"
        >
          <!-- PHOTO with gradient + chapter number -->
          <div class="relative h-60 w-full overflow-hidden">
            {#if story.imageUrl}
              <img
                src={story.imageUrl}
                alt={story.title}
                class="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
              />
            {:else}
              <div class="h-full w-full bg-gray-100"></div>
            {/if}

            <!-- gradient overlay -->
            <div
              class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"
            ></div>

            <!-- Chapter number (large, top-right) -->
            <span
              class="absolute top-4 right-5 font-jomolhari text-5xl leading-none font-bold text-white/20 select-none"
            >
              {String(i + 1).padStart(2, '0')}
            </span>

            <!-- Title + date overlaid bottom -->
            <div class="absolute right-0 bottom-0 left-0 px-5 pb-4">
              <h3 class="font-jomolhari text-lg leading-snug text-white">{story.title}</h3>
              {#if info}
                <p class="mt-1 text-[10px] tracking-widest text-white/60 uppercase">
                  {info.day}
                  {info.monthName}
                  {info.year}
                </p>
              {/if}
            </div>
          </div>

          <!-- Description -->
          <div class="px-5 py-4">
            <p class="text-xs leading-relaxed text-gray-500">{story.description}</p>
          </div>
        </div>
      </div>
    {/each}

    <!-- CLOSING -->
    <div class="reveal-item flex items-center gap-0" use:reveal={{ delay: stories.length * 120 }}>
      <div class="flex w-14 shrink-0 flex-col items-center">
        <div class="w-px flex-1 bg-gray-200"></div>
        <div class="flex h-6 w-6 items-center justify-center rounded-full bg-[#F0A269]/20">
          <div class="h-1.5 w-1.5 rounded-full bg-[#F0A269]"></div>
        </div>
        <div class="flex-1"></div>
      </div>
      <p class="mr-6 pb-2 font-jomolhari text-xs text-gray-400 italic">
        ...dan seterusnya bersama.
      </p>
    </div>
  </div>
</section>

<style>
  :global(.reveal-item) {
    opacity: 0;
    transform: translateY(28px);
    transition:
      opacity 1.2s cubic-bezier(0.22, 1, 0.36, 1),
      transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
  }
  :global(.reveal-item.is-visible) {
    opacity: 1;
    transform: translateY(0);
  }
  :global(.dot-pulse.is-visible) {
    animation: pulse-dot 1.8s ease-out 0.3s 1;
  }
  @keyframes pulse-dot {
    0% {
      box-shadow: 0 0 0 0 rgba(240, 162, 105, 0.7);
    }
    70% {
      box-shadow: 0 0 0 8px rgba(240, 162, 105, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(240, 162, 105, 0);
    }
  }
</style>
