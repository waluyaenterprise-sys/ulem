<script lang="ts">
  import { formatIndonesianDate } from '$lib/utils/formatDate';
  import Petals from './Petal.svelte';
  import FlowerIcon from './FlowerIcon.svelte';

  export let invitation: any;

  const stories: any[] = invitation.loveStories ?? [];

  function reveal(node: HTMLElement, { delay = 0, y = 30 } = {}) {
    node.style.opacity = '0';
    node.style.transform = `translateY(${y}px)`;
    node.style.transition = `opacity 1s ease ${delay}ms, transform 1s cubic-bezier(0.22,1,0.36,1) ${delay}ms`;
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

<section class="relative w-full bg-white">
  <!-- Decorative flowers -->
  <div class="pointer-events-none absolute top-4 left-4 z-10">
    <FlowerIcon size={34} opacity={0.3} color="#6b7280" />
  </div>
  <div class="pointer-events-none absolute top-4 right-4 z-10">
    <FlowerIcon size={40} opacity={0.35} color="#6b7280" />
  </div>

  <!-- Header -->
  <div use:reveal class="px-8 pt-14 pb-10 text-center">
    <p class="font-body text-[9px] tracking-[0.45em] text-gray-400 uppercase">Perjalanan Kami</p>
    <div class="mt-2 flex items-center justify-center gap-3">
      <FlowerIcon size={18} opacity={0.35} color="#6b7280" />
      <p class="font-heading text-3xl font-light text-gray-900">Our Story</p>
      <FlowerIcon size={18} opacity={0.35} color="#6b7280" />
    </div>
  </div>

  {#if stories.length === 0}
    <p class="pb-14 text-center font-body text-sm text-gray-300 italic">
      Kisah akan segera hadir...
    </p>
  {/if}

  <!-- Stories: alternating full-bleed photo + text -->
  {#each stories as story, i}
    {@const dateInfo = story.date ? formatIndonesianDate(story.date) : null}
    {@const isEven = i % 2 === 0}

    <div use:reveal={{ delay: i * 60 }} class="story-item w-full">
      <!-- Full-bleed photo -->
      {#if story.imageUrl}
        <div class="relative h-[56vw] max-h-72 w-full overflow-hidden bg-gray-100">
          <img
            src={story.imageUrl}
            alt={story.title}
            class="story-img h-full w-full object-cover transition-transform duration-[2s] ease-out"
          />
          <!-- Chapter number overlay -->
          <div
            class="absolute top-4 font-heading text-7xl leading-none font-bold text-white/10 select-none"
            class:left-4={isEven}
            class:right-4={!isEven}
          >
            {String(i + 1).padStart(2, '0')}
          </div>
        </div>
      {:else}
        <div class="flex h-40 w-full items-center justify-center bg-gray-50">
          <span class="font-heading text-5xl font-bold text-gray-100 select-none">
            {String(i + 1).padStart(2, '0')}
          </span>
        </div>
      {/if}

      <!-- Text block -->
      <div class="px-8 py-7" class:bg-white={isEven} class:bg-gray-50={!isEven}>
        {#if dateInfo}
          <p class="font-body text-[10px] tracking-[0.35em] text-gray-400 uppercase">
            {dateInfo.day}
            {dateInfo.monthName}
            {dateInfo.year}
          </p>
        {/if}
        <h3 class="mt-1 font-heading text-xl font-light text-gray-900">{story.title}</h3>
        <p class="mt-3 font-body text-sm leading-relaxed text-gray-500">{story.description}</p>
      </div>

      <!-- Thin line between stories -->
      {#if i < stories.length - 1}
        <div class="mx-8 h-px bg-gray-100"></div>
      {/if}
    </div>
  {/each}
</section>

<style>
  .story-item:hover .story-img {
    transform: scale(1.03);
  }
</style>
