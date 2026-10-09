<script lang="ts">
  import { getAdaptiveNameStyle } from '$lib/utils/adaptiveName';
  import Petals from './Petal.svelte';
  import FlowerIcon from './FlowerIcon.svelte';
  export let invitation: any;

  const groom = invitation.groom;
  const bride = invitation.bride;

  const groomName: string = groom?.name || 'Groom';
  const brideName: string = bride?.name || 'Bride';
  const groomFather: string = groom?.father || '';
  const groomMother: string = groom?.mother || '';
  const brideFather: string = bride?.father || '';
  const brideMother: string = bride?.mother || '';
  const groomIG: string = groom?.socialMedia?.instagram || '';
  const brideIG: string = bride?.socialMedia?.instagram || '';

  function igUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://instagram.com/${url}`;
  }
  function igHandle(url: string): string {
    if (!url) return '';
    const match = url.match(/instagram\.com\/([^/?#]+)/);
    return match ? `@${match[1]}` : url;
  }
  const groomImage: string = groom?.imageUrls?.[0] || '';
  const brideImage: string = bride?.imageUrls?.[0] || '';
  const groomNameStyle = getAdaptiveNameStyle(groomName, { maxRem: 2.15, minRem: 1.1, endAt: 24 });
  const brideNameStyle = getAdaptiveNameStyle(brideName, { maxRem: 2.15, minRem: 1.1, endAt: 24 });

  function reveal(node: HTMLElement, { delay = 0, x = 0, y = 0 } = {}) {
    node.style.opacity = '0';
    node.style.transform = `translateX(${x}px) translateY(${y}px)`;
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

<!-- Intro line -->
<section class="relative w-full bg-white px-8 py-14 text-center">
  <!-- Decorative flowers -->
  <div class="pointer-events-none absolute top-4 left-8 z-10">
    <FlowerIcon size={28} opacity={0.3} color="#6b7280" />
  </div>
  <div class="pointer-events-none absolute top-4 right-8 z-10">
    <FlowerIcon size={22} opacity={0.25} color="#6b7280" />
  </div>

  <p use:reveal class="font-body text-[9px] tracking-[0.45em] text-gray-400 uppercase">Mempelai</p>
    <div class="mt-2 flex items-center justify-center gap-3">
      <FlowerIcon size={18} opacity={0.35} color="#6b7280" />
      <p class="font-heading text-3xl font-light text-gray-900">
        Pengantin Kami
      </p>
      <FlowerIcon size={18} opacity={0.35} color="#6b7280" />
    </div>
  <p
    use:reveal={{ delay: 160, y: 10 }}
    class="mx-auto mt-4 max-w-xs font-body text-xs leading-relaxed text-gray-400 italic"
  >
    Dengan penuh rasa syukur, kami bermaksud menyatukan dua hati dalam ikatan suci pernikahan.
  </p>
</section>

<!-- Bride — full bleed photo + text below -->
<section class="w-full overflow-hidden bg-black">
  <Petals />
  <div use:reveal={{ x: -30 }} class="relative h-[60vh] w-full overflow-hidden">
    {#if brideImage}
      <img
        src={brideImage}
        alt={brideName}
        class="h-full w-full object-cover transition-transform duration-[3s] ease-out"
        style="transform: scale(1.05);"
      />
    {:else}
      <div class="flex h-full w-full items-center justify-center bg-gray-900">
        <svg viewBox="0 0 24 24" class="h-20 w-20 text-gray-700" fill="currentColor">
          <path
            d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
          />
        </svg>
      </div>
    {/if}
    <!-- Bottom gradient -->
    <div
      class="absolute inset-0"
      style="background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7) 100%);"
    ></div>
    <!-- Name on photo -->
    <div class="absolute bottom-0 left-0 px-8 pb-7">
      <p class="font-body text-[9px] tracking-[0.4em] text-white/50 uppercase">Mempelai Wanita</p>
      <h2 class="mt-1 font-heading text-3xl font-light text-white" style={brideNameStyle}>
        {brideName}
      </h2>
    </div>
  </div>

  <!-- Details below photo -->
  <div use:reveal={{ delay: 80, y: 16 }} class="bg-white px-8 py-7">
    {#if brideFather || brideMother}
      <p class="font-body text-xs leading-relaxed text-gray-500">
        Putri dari
        {#if brideFather}<span class="font-medium text-gray-800"> Bapak {brideFather}</span>{/if}
        {#if brideFather && brideMother}<span class="text-gray-400"> &amp; </span>{/if}
        {#if brideMother}<span class="font-medium text-gray-800">Ibu {brideMother}</span>{/if}
      </p>
    {/if}
    {#if bride?.notes}
      <p class="mt-2 font-body text-xs text-gray-400 italic">{bride.notes}</p>
    {/if}
    {#if brideIG}
      <a
        href={igUrl(brideIG)}
        target="_blank"
        rel="noopener noreferrer"
        class="mt-3 inline-flex items-center gap-1.5 text-xs text-gray-400 transition hover:text-[#F0A269]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-3.5 w-3.5"
          fill="currentColor"
          viewBox="0 0 24 24"
          ><path
            d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
          /></svg
        >
        {igHandle(brideIG)}
      </a>
    {/if}
  </div>
</section>

<!-- Ampersand divider -->
<section class="flex w-full items-center justify-center bg-white py-8">
  <div class="flex items-center gap-4">
    <div class="h-px w-16 bg-gray-100"></div>
    <FlowerIcon size={28} opacity={0.35} color="#6b7280" />
    <p class="font-heading text-4xl font-light text-gray-200">&amp;</p>
    <FlowerIcon size={28} opacity={0.35} color="#6b7280" />
    <div class="h-px w-16 bg-gray-100"></div>
  </div>
</section>

<!-- Groom — full bleed photo + text below -->
<section class="w-full overflow-hidden bg-black">
  <Petals />
  <div use:reveal={{ x: 30 }} class="relative h-[60vh] w-full overflow-hidden">
    {#if groomImage}
      <img
        src={groomImage}
        alt={groomName}
        class="h-full w-full object-cover transition-transform duration-[3s] ease-out"
        style="transform: scale(1.05);"
      />
    {:else}
      <div class="flex h-full w-full items-center justify-center bg-gray-900">
        <svg viewBox="0 0 24 24" class="h-20 w-20 text-gray-700" fill="currentColor">
          <path
            d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
          />
        </svg>
      </div>
    {/if}
    <div
      class="absolute inset-0"
      style="background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7) 100%);"
    ></div>
    <div class="absolute bottom-0 left-0 px-8 pb-7">
      <p class="font-body text-[9px] tracking-[0.4em] text-white/50 uppercase">Mempelai Pria</p>
      <h2 class="mt-1 font-heading text-3xl font-light text-white" style={groomNameStyle}>
        {groomName}
      </h2>
    </div>
  </div>

  <div use:reveal={{ delay: 80, y: 16 }} class="bg-white px-8 py-7">
    {#if groomFather || groomMother}
      <p class="font-body text-xs leading-relaxed text-gray-500">
        Putra dari
        {#if groomFather}<span class="font-medium text-gray-800"> Bapak {groomFather}</span>{/if}
        {#if groomFather && groomMother}<span class="text-gray-400"> &amp; </span>{/if}
        {#if groomMother}<span class="font-medium text-gray-800">Ibu {groomMother}</span>{/if}
      </p>
    {/if}
    {#if groom?.notes}
      <p class="mt-2 font-body text-xs text-gray-400 italic">{groom.notes}</p>
    {/if}
    {#if groomIG}
      <a
        href={igUrl(groomIG)}
        target="_blank"
        rel="noopener noreferrer"
        class="mt-3 inline-flex items-center gap-1.5 text-xs text-gray-400 transition hover:text-[#F0A269]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-3.5 w-3.5"
          fill="currentColor"
          viewBox="0 0 24 24"
          ><path
            d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
          /></svg
        >
        {igHandle(groomIG)}
      </a>
    {/if}
  </div>
</section>
