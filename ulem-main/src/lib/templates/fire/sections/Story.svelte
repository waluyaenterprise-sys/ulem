<script lang="ts">
  export let invitation: any;
  const stories = invitation?.loveStories ?? [];

  function reveal(node: HTMLElement) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('is-visible');
          observer.unobserve(node);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(node);

    return {
      destroy() {
        observer.disconnect();
      }
    };
  }
</script>

<section class="relative min-h-svh w-full overflow-hidden py-30">
  <div class="relative mb-20">
    <h1 class="reveal relative z-40 text-center font-script text-5xl text-[#BA2623]" use:reveal>
      Love Story
    </h1>
    <img
      src="/assets/fire/branch.svg"
      alt="coral"
      class="absolute -top-95 left-10 z-30 scale-60 rotate-90"
    />
    {#each stories as story, i}
      <div
        class="reveal relative z-20 mx-auto mt-20 flex w-11/12 items-start gap-3"
        class:flex-row-reverse={i % 2 !== 0}
        use:reveal
      >
        <!-- Foto -->
        <div class="relative w-40 shrink-0">
          <img src={story.imageUrl} alt={story.title} class="w-full rounded-md object-cover" />
        </div>

        <!-- Deskripsi -->
        <div class="flex-1" class:text-left={i % 2 !== 0}>
          <p class="text-sm font-semibold text-gray-800">{story.title}</p>
          <p class="mt-1 text-xs leading-snug text-gray-600">{story.description}</p>
        </div>
      </div>
    {/each}
    <img
      src="/assets/fire/flower-green.svg"
      alt="coral"
      class="absolute -right-20 -bottom-50 max-w-none"
    />
    <img src="/assets/fire/flower.svg" alt="" class="absolute -bottom-85 -left-30 z-20" />
  </div>
</section>
