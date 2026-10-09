<script lang="ts">
  export let invitation: any;

  const images: string[] = invitation.gallery.imageUrls || [];

  function reveal(node: HTMLElement, { delay = 0 } = {}) {
    node.style.opacity = '0';
    node.style.transform = 'scale(0.95)';
    node.style.transition = `opacity 0.8s ease ${delay}ms, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms`;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.style.opacity = '1';
          node.style.transform = 'scale(1)';
          observer.unobserve(node);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(node);
    return { destroy: () => observer.disconnect() };
  }

  // Varied rotation for old-photograph effect
  const rotations = [-1.5, 1, -0.5, 1.8, -1.2, 0.8, -1.8, 1.3, -0.7, 1.5, -1, 0.5];
</script>

<section
  class="relative w-full overflow-hidden px-5 py-16"
  style="background: linear-gradient(160deg, #2C1810 0%, #3D2318 50%, #2C1810 100%);"
>
  <!-- Subtle pattern -->
  <div
    class="pointer-events-none absolute inset-0 opacity-[0.04]"
    style="
      background-image: radial-gradient(circle, #C9A227 1px, transparent 1px);
      background-size: 24px 24px;
    "
  ></div>

  <div class="relative z-10 mx-auto max-w-sm">
    <!-- Header -->
    <div use:reveal class="mb-10 text-center">
      <p class="font-body text-[9px] tracking-[0.4em] text-amber-400/50 uppercase">
        Kenangan Berharga
      </p>
      <p class="mt-1 font-script text-4xl text-amber-300">Galeri Foto</p>
      <div class="mx-auto mt-3 flex items-center justify-center gap-2">
        <div class="h-px w-10 bg-amber-600/40"></div>
        <div class="h-1 w-1 rotate-45 bg-amber-500/60"></div>
        <div class="h-px w-10 bg-amber-600/40"></div>
      </div>
    </div>

    <!-- Photo grid — mix of sizes for collage feel -->
    {#if images.length === 0}
      <p class="text-center font-body text-sm text-amber-700/40 italic">
        Foto akan segera ditambahkan...
      </p>
    {:else}
      <div class="grid grid-cols-2 gap-3">
        {#each images as img, i}
          <div
            use:reveal={{ delay: i * 80 }}
            class="overflow-hidden"
            class:col-span-2={i === 0}
            style="
              border: 3px solid #F4E8C1;
              box-shadow: 4px 4px 12px rgba(0,0,0,0.5);
              transform: rotate({rotations[i % rotations.length]}deg);
              background: #F4E8C1;
              padding: 4px 4px 20px 4px;
            "
          >
            <img
              src={img}
              alt="Gallery {i + 1}"
              class="block w-full object-contain"
              class:h-56={i === 0}
              class:h-32={i !== 0}
              style="filter: sepia(15%) contrast(1.05);"
            />
          </div>
        {/each}
      </div>
    {/if}
  </div>
</section>
