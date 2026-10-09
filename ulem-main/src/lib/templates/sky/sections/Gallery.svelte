<script lang="ts">
  import { onMount } from 'svelte';

  export let invitation: any;

  const images: string[] = invitation.gallery?.imageUrls || [];

  let visible = false;
  let sectionEl: HTMLElement;

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
  <img
    src="/assets/sky/stars.svg"
    alt=""
    class="absolute -right-55 w-[120%] max-w-none -rotate-15"
  />
  <img
    src="/assets/sky/stars.svg"
    alt=""
    class="absolute -left-70 w-[120%] max-w-none -scale-x-100 rotate-15 transform"
  />
  <h1 class="  px-4 py-3 font-script text-3xl text-[#71B8F4]">Our Gallery</h1>

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
