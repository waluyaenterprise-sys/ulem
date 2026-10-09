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
  <img
    src="/assets/dark-root.svg"
    alt="Wave"
    class="pointer-events-none absolute -top-10 w-full scale-130"
  />

  <img
    src="/assets/coral.svg"
    alt="Whale"
    class="pointer-events-none absolute bottom-20 left-25 z-10 w-[200%] max-w-none -translate-x-1/2 translate-y-1/2 -rotate-60 transform"
  />
  <img
    src="/assets/coral.svg"
    alt="Whale"
    class=" pointer-events-none absolute right-10 bottom-20 z-10 w-[220%] max-w-none translate-x-1/2 translate-y-1/2 -scale-100 transform"
  />
  <div class="relative z-20 mb-20">
    <h1 class="reveal text-center font-script text-6xl" use:reveal>Love Story</h1>

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
  </div>
</section>
