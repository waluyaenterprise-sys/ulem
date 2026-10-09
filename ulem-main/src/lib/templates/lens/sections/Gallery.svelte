<script lang="ts">
  import { onMount } from 'svelte';
  import Petals from './Petal.svelte';
  import FlowerIcon from './FlowerIcon.svelte';

  export let invitation: any;

  const images: string[] = invitation.gallery?.imageUrls || [];
  let rows: Array<{ type: 'full' | 'half' | 'pair'; imgs: Array<{ url: string; index: number }> }> = [];
  let ready = false;

  onMount(() => {
    Promise.all(
      images.map((url, i) => {
        return new Promise<{ url: string; index: number; landscape: boolean }>((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ url, index: i, landscape: img.naturalWidth > img.naturalHeight });
          img.onerror = () => resolve({ url, index: i, landscape: false });
          img.src = url;
        });
      })
    ).then((loaded) => {
      const remaining = [...loaded];

      while (remaining.length > 0) {
        const cur = remaining.shift()!;
        if (cur.landscape) {
          rows.push({ type: 'full', imgs: [cur] });
        } else {
          const pairIdx = remaining.findIndex((r) => !r.landscape);
          if (pairIdx !== -1) {
            const pair = remaining.splice(pairIdx, 1)[0];
            rows.push({ type: 'pair', imgs: [cur, pair] });
          } else {
            rows.push({ type: 'half', imgs: [cur] });
          }
        }
      }

      ready = true;
      rows = rows;
    });
  });

  function reveal(node: HTMLElement, { delay = 0 } = {}) {
    node.style.opacity = '0';
    node.style.transition = `opacity 0.9s ease ${delay}ms`;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          node.style.opacity = '1';
          io.unobserve(node);
        }
      },
      { threshold: 0.1 }
    );
    io.observe(node);
    return { destroy: () => io.disconnect() };
  }
</script>

<section class="relative w-full bg-black">
  <Petals />

  <div class="pointer-events-none absolute top-4 right-4 z-10">
    <FlowerIcon size={36} opacity={0.1} />
  </div>
  <div class="pointer-events-none absolute left-4 bottom-4 z-10">
    <FlowerIcon size={28} opacity={0.08} />
  </div>

  <div use:reveal class="px-8 pt-14 pb-6 text-center">
    <p class="font-body text-[9px] tracking-[0.45em] text-white/40 uppercase">Kenangan</p>
    <div class="mt-2 flex items-center justify-center gap-3">
      <FlowerIcon size={20} opacity={0.3} />
      <p class="font-heading text-3xl font-light text-white">Gallery</p>
      <FlowerIcon size={20} opacity={0.3} />
    </div>
  </div>

  {#if images.length === 0}
    <div class="flex h-64 items-center justify-center">
      <p class="font-body text-sm text-white/20 italic">Foto akan segera ditambahkan</p>
    </div>
  {:else}
    <div class="px-0.5">
      {#each rows as row}
        {#if row.type === 'full'}
          <div use:reveal class="overflow-hidden">
            <img
              src={row.imgs[0].url}
              alt="Gallery {row.imgs[0].index + 1}"
              class="block h-auto w-full transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
          </div>
        {:else if row.type === 'pair'}
          <div class="flex">
            {#each row.imgs as img}
              <div use:reveal class="w-1/2 overflow-hidden">
                <img
                  src={img.url}
                  alt="Gallery {img.index + 1}"
                  class="block h-auto w-full transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>
            {/each}
          </div>
        {:else}
          <div use:reveal class="w-1/2 overflow-hidden">
            <img
              src={row.imgs[0].url}
              alt="Gallery {row.imgs[0].index + 1}"
              class="block h-auto w-full transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
          </div>
        {/if}
      {/each}
    </div>
  {/if}

  <div class="h-10"></div>
</section>