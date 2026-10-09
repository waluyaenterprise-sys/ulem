<script lang="ts">
  import { formatIndonesianDate } from '$lib/utils/formatDate';

  export let invitation: any;

  const stories: any[] = invitation.loveStories ?? [];

  // Fallback pool for stories without images
  const fallbackPool: string[] = (invitation.gallery?.imageUrls || []).filter(Boolean);

  function bgFor(story: any, idx: number): string {
    return story.imageUrl || fallbackPool[idx % (fallbackPool.length || 1)] || '';
  }

  function reveal(node: HTMLElement, { delay = 0, y = 30 } = {}) {
    node.style.opacity = '0';
    node.style.transform = `translateY(${y}px)`;
    node.style.transition = `opacity 1.1s ease ${delay}ms, transform 1.1s cubic-bezier(0.22,1,0.36,1) ${delay}ms`;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          node.style.opacity = '1';
          node.style.transform = 'none';
          io.unobserve(node);
        }
      },
      { threshold: 0.1 }
    );
    io.observe(node);
    return { destroy: () => io.disconnect() };
  }
</script>

<!-- Header section — plain black -->
<section class="w-full bg-black px-8 py-14 text-center">
  <p use:reveal class="font-body text-[9px] tracking-[0.5em] text-white/30 uppercase">
    Perjalanan Kami
  </p>
  <p use:reveal={{ delay: 80, y: 12 }} class="mt-3 font-heading text-3xl font-light text-white">
    Our Story
  </p>
  {#if stories.length === 0}
    <p class="mt-6 font-body text-sm text-white/25 italic">Kisah akan segera hadir...</p>
  {/if}
</section>

<!-- Each story = full-height section with photo background -->
{#each stories as story, i}
  {@const dateInfo = story.date ? formatIndonesianDate(story.date) : null}
  {@const bg = bgFor(story, i)}
  {@const alignRight = i % 2 !== 0}

  <section class="relative flex min-h-svh w-full flex-col justify-end overflow-hidden">
    <!-- Photo -->
    {#if bg}
      <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('{bg}');"></div>
    {:else}
      <div class="absolute inset-0 bg-neutral-800"></div>
    {/if}

    <!-- Gradient -->
    <div
      class="pointer-events-none absolute inset-0"
      style="background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.1) 80%, transparent 100%);"
    ></div>

    <!-- Chapter watermark -->
    <div
      class="pointer-events-none absolute top-6 font-heading font-extralight text-white/6 select-none"
      class:right-6={alignRight}
      class:left-6={!alignRight}
      style="font-size: clamp(60px, 18vw, 110px); line-height: 1;"
    >
      {String(i + 1).padStart(2, '0')}
    </div>

    <!-- Text block -->
    <div class="relative z-10 px-8 pb-12" class:text-right={alignRight}>
      {#if dateInfo}
        <p use:reveal class="font-body text-[10px] tracking-[0.4em] text-white/35 uppercase">
          {dateInfo.day}
          {dateInfo.monthName}
          {dateInfo.year}
        </p>
      {/if}
      <h3
        use:reveal={{ delay: 80, y: 16 }}
        class="mt-2 font-heading text-3xl font-light text-white"
      >
        {story.title}
      </h3>
      <div
        use:reveal={{ delay: 160 }}
        class="my-4 h-px w-10 bg-white/25"
        class:ml-auto={alignRight}
      ></div>
      <p
        use:reveal={{ delay: 220, y: 10 }}
        class="max-w-xs font-body text-sm leading-relaxed text-white/60"
        class:ml-auto={alignRight}
      >
        {story.description}
      </p>
    </div>
  </section>
{/each}
