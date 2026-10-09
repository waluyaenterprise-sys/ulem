<script lang="ts">
  import { onMount } from 'svelte';

  export let invitation: any;

  const images: string[] = invitation.gallery?.imageUrls || [];

  let visible = false;
  export let sectionEl: HTMLElement;

  let selectedImage: string | null = null;

  function openModal(img: string) {
    selectedImage = img;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    selectedImage = null;
    document.body.style.overflow = '';
  }

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible = true;
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionEl) observer.observe(sectionEl);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
</script>

<section
  bind:this={sectionEl}
  class="relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden"
>
  <div>
    <img
      src="/assets/earth/branch.svg"
      alt="Wave"
      class="pointer-events-none absolute -top-5 -right-30 w-[60%] max-w-none"
    />
    <img
      src="/assets/earth/branch.svg"
      alt="Wave"
      class="pointer-events-none absolute -right-30 bottom-5 w-[60%] max-w-none -scale-x-100 rotate-180"
    />

    <img
      src="/assets/earth/branch.svg"
      alt="Wave"
      class="pointer-events-none absolute -top-5 -left-30 w-[60%] max-w-none -scale-x-100"
    />
    <img
      src="/assets/earth/branch.svg"
      alt="Wave"
      class="pointer-events-none absolute bottom-5 -left-30 w-[60%] max-w-none rotate-180"
    />
    <img
      src="/assets/earth/little-branch.svg"
      alt="Wave"
      class="pointer-events-none absolute right-0 -bottom-30 w-[80%] max-w-none"
    />
    <img
      src="/assets/earth/little-branch.svg"
      alt="Wave"
      class="pointer-events-none absolute -bottom-30 left-0 w-[80%] max-w-none -scale-x-100"
    />
  </div>
  <h1 class="  px-4 py-3 font-script text-3xl text-[#0A5D0A]">Our Gallery</h1>

  <div class="relative z-10 columns-2 gap-4 p-4 sm:columns-3">
    {#each images as image, i}
      <div
        class="
					mb-4 break-inside-avoid overflow-hidden rounded-2xl shadow-sm
					transition-all
					duration-5000
					ease-[cubic-bezier(0.16,1,0.3,1)]
				"
        class:opacity-0={!visible}
        class:translate-y-12={!visible}
        style="transition-delay: {i * 300}ms"
      >
        <img src={image} alt="gallery" class="w-full object-contain" />
      </div>
    {/each}
  </div>
</section>
