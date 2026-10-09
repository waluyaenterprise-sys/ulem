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
  class="relative flex min-h-svh w-full items-center justify-center overflow-hidden py-30"
>
  <img
    src="/assets/wave2.svg"
    alt="Wave"
    class="
	pointer-events-none absolute -top-10 left-0 z-20 w-full
	transition-all
	duration-1800
	ease-[cubic-bezier(0.16,1,0.3,1)]
"
    class:opacity-0={!visible}
    class:-translate-y-16={!visible}
  />

  <img
    src="/assets/blue-skin.svg"
    alt="Wave"
    class="pointer-events-none absolute top-20 left-70 scale-200"
  />

  <img
    src="/assets/wave2.svg"
    alt="Wave"
    class="
		pointer-events-none absolute bottom-0 left-0 z-20 w-full rotate-180
		transition-all
		duration-1800
		ease-[cubic-bezier(0.16,1,0.3,1)]
	"
    class:opacity-0={!visible}
    class:translate-y-16={!visible}
  />

  <div class="z-10 columns-2 gap-4 p-4 sm:columns-3">
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
