<script lang="ts">
  import { getAdaptiveNameStyle } from '$lib/utils/adaptiveName';

  export let invitation: any;

  const groom = invitation.groom;
  const bride = invitation.bride;

  const groomName = groom?.name || 'Groom';
  const brideName = bride?.name || 'Bride';
  const groomFather = groom?.father || '';
  const groomMother = groom?.mother || '';
  const brideFather = bride?.father || '';
  const brideMother = bride?.mother || '';
  const groomImage =
    groom?.imageUrls?.[0] ||
    groom?.imageUrl ||
    invitation?.groomImage ||
    invitation?.goomImage ||
    '';
  const brideImage = bride?.imageUrls?.[0] || bride?.imageUrl || invitation?.brideImage || '';
  const groomNotes = groom?.notes || '';
  const brideNotes = bride?.notes || '';
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
  const groomNameStyle = getAdaptiveNameStyle(groomName, { maxRem: 2.8, minRem: 1.35, endAt: 30 });
  const brideNameStyle = getAdaptiveNameStyle(brideName, { maxRem: 2.8, minRem: 1.35, endAt: 30 });

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

<!-- Section intro — white strip for breathing room -->
<section class="w-full bg-white px-8 py-12 text-center">
  <p use:reveal class="font-body text-[9px] tracking-[0.5em] text-gray-400 uppercase">Mempelai</p>
  <p use:reveal={{ delay: 80, y: 12 }} class="mt-2 font-heading text-3xl font-light text-gray-900">
    Dua Hati, Satu Tujuan
  </p>
  <p
    use:reveal={{ delay: 180, y: 10 }}
    class="mx-auto mt-4 max-w-xs font-body text-xs leading-relaxed text-gray-400 italic"
  >
    Dengan penuh rasa syukur, kami bermaksud menyatukan dua hati dalam ikatan suci pernikahan.
  </p>
</section>

<!-- Bride — photo fills entire section -->
<section class="relative min-h-svh w-full overflow-hidden">
  <!-- Photo -->
  {#if brideImage}
    <img
      src={brideImage}
      alt={brideName}
      class="absolute inset-0 h-full w-full object-cover"
      loading="lazy"
      decoding="async"
    />
  {:else}
    <div class="absolute inset-0 bg-neutral-800"></div>
  {/if}

  <!-- Bottom overlay for text -->
  <div
    class="pointer-events-none absolute inset-0"
    style="background: linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.3) 45%, transparent 75%);"
  ></div>

  <!-- Text anchored bottom-left -->
  <div class="absolute right-0 bottom-0 left-0 z-10 px-8 pb-12">
    <div use:reveal={{ y: 20 }}>
      <p class="font-body text-[9px] tracking-[0.45em] text-white/40 uppercase">Mempelai Wanita</p>
      <h2 class="mt-2 font-heading text-4xl font-light text-white" style={brideNameStyle}>
        {brideName}
      </h2>
      {#if brideFather || brideMother}
        <p class="mt-2 font-body text-xs leading-relaxed text-white/55">
          Putri dari
          {#if brideFather}<span class="text-white/80"> Bapak {brideFather}</span>{/if}
          {#if brideFather && brideMother}<span class="text-white/40"> &amp; </span>{/if}
          {#if brideMother}<span class="text-white/80">Ibu {brideMother}</span>{/if}
        </p>
      {/if}
      {#if brideNotes}
        <p class="mt-2 font-body text-xs text-white/35 italic">{brideNotes}</p>
      {/if}
      {#if brideIG}
        <a
          href={igUrl(brideIG)}
          target="_blank"
          rel="noopener noreferrer"
          class="mt-2 inline-flex items-center gap-1.5 text-xs text-white/40 transition hover:text-white/70"
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
  </div>
</section>

<!-- Ampersand transition strip -->
<section class="flex w-full items-center justify-center bg-black py-10">
  <p class="font-heading text-5xl font-extralight text-white/20">&amp;</p>
</section>

<!-- Groom — photo fills entire section -->
<section class="relative min-h-svh w-full overflow-hidden">
  {#if groomImage}
    <img
      src={groomImage}
      alt={groomName}
      class="absolute inset-0 h-full w-full object-cover"
      loading="lazy"
      decoding="async"
    />
  {:else}
    <div class="absolute inset-0 bg-neutral-800"></div>
  {/if}

  <div
    class="pointer-events-none absolute inset-0"
    style="background: linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.3) 45%, transparent 75%);"
  ></div>

  <div class="absolute right-0 bottom-0 left-0 z-10 px-8 pb-12">
    <div use:reveal={{ y: 20 }}>
      <p class="font-body text-[9px] tracking-[0.45em] text-white/40 uppercase">Mempelai Pria</p>
      <h2 class="mt-2 font-heading text-4xl font-light text-white" style={groomNameStyle}>
        {groomName}
      </h2>
      {#if groomFather || groomMother}
        <p class="mt-2 font-body text-xs leading-relaxed text-white/55">
          Putra dari
          {#if groomFather}<span class="text-white/80"> Bapak {groomFather}</span>{/if}
          {#if groomFather && groomMother}<span class="text-white/40"> &amp; </span>{/if}
          {#if groomMother}<span class="text-white/80">Ibu {groomMother}</span>{/if}
        </p>
      {/if}
      {#if groomNotes}
        <p class="mt-2 font-body text-xs text-white/35 italic">{groomNotes}</p>
      {/if}
      {#if groomIG}
        <a
          href={igUrl(groomIG)}
          target="_blank"
          rel="noopener noreferrer"
          class="mt-2 inline-flex items-center gap-1.5 text-xs text-white/40 transition hover:text-white/70"
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
  </div>
</section>
