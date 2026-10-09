<script lang="ts">
  import { onMount } from 'svelte';
  import { getAdaptiveNameStyle } from '$lib/utils/adaptiveName';

  export let invitation: any;

  const groom = invitation.groom;
  const bride = invitation.bride;

  const groomName: string = groom?.name || 'Groom';
  const brideName: string = bride?.name || 'Bride';
  const groomFather: string = groom?.father || '';
  const groomMother: string = groom?.mother || '';
  const brideFather: string = bride?.father || '';
  const brideMother: string = bride?.mother || '';
  const groomImage: string = groom?.imageUrls?.[0] || '';
  const brideImage: string = bride?.imageUrls?.[0] || '';
  const groomNotes: string = groom?.notes || '';
  const brideNotes: string = bride?.notes || '';
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
  const groomNameStyle = getAdaptiveNameStyle(groomName, { maxRem: 2.05, minRem: 1.05, endAt: 24 });
  const brideNameStyle = getAdaptiveNameStyle(brideName, { maxRem: 2.05, minRem: 1.05, endAt: 24 });

  function reveal(node: HTMLElement, { delay = 0, x = 0 } = {}) {
    node.style.opacity = '0';
    node.style.transform = `translateX(${x}px) translateY(20px)`;
    node.style.transition = `opacity 1s ease ${delay}ms, transform 1s cubic-bezier(0.22,1,0.36,1) ${delay}ms`;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.style.opacity = '1';
          node.style.transform = 'translateX(0) translateY(0)';
          observer.unobserve(node);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    observer.observe(node);
    return { destroy: () => observer.disconnect() };
  }
</script>

<section
  class="relative w-full overflow-hidden px-5 py-16"
  style="background: linear-gradient(180deg, #EDD9A3 0%, #F4E8C1 40%, #EDD9A3 100%);"
>
  <!-- Texture lines -->
  <div
    class="pointer-events-none absolute inset-0 opacity-[0.035]"
    style="background-image: repeating-linear-gradient(0deg, transparent, transparent 27px, #8B4513 27px, #8B4513 28px);"
  ></div>
  <div
    class="pointer-events-none absolute inset-0"
    style="box-shadow: inset 0 0 60px rgba(139,69,19,0.15);"
  ></div>

  <div class="relative z-10 mx-auto max-w-sm">
    <!-- Header -->
    <div use:reveal class="mb-10 text-center">
      <p class="font-body text-[9px] tracking-[0.4em] text-amber-800/50 uppercase">Mempelai</p>
      <p class="mt-1 font-script text-4xl text-amber-900">Pengantin Kami</p>
      <div class="mx-auto mt-3 flex items-center justify-center gap-2">
        <div class="h-px w-10 bg-amber-700/40"></div>
        <div class="h-1 w-1 rotate-45 bg-amber-700/50"></div>
        <div class="h-px w-10 bg-amber-700/40"></div>
      </div>
      <p class="mt-3 font-body text-xs leading-relaxed text-amber-900/60 italic">
        Dengan penuh kebahagiaan, kami bermaksud untuk menyatukan dua hati dalam ikatan suci
        pernikahan.
      </p>
    </div>

    <!-- Bride card -->
    <div
      use:reveal={{ delay: 120, x: -40 }}
      class="mb-6 overflow-hidden"
      style="
        background: linear-gradient(160deg, #FBF3DC 0%, #F4E8C1 100%);
        border: 2px solid #C9A227;
        box-shadow: 5px 5px 0 #8B6914, 0 0 20px rgba(139,69,19,0.15);
        transform: rotate(-0.4deg);
      "
    >
      {#if brideImage}
        <div class="relative h-60 w-full overflow-hidden">
          <img src={brideImage} alt={brideName} class="h-full w-full object-cover" />
          <!-- aged overlay -->
          <div
            class="absolute inset-0"
            style="background: linear-gradient(to bottom, rgba(244,232,193,0.1) 0%, rgba(237,217,163,0.4) 100%);"
          ></div>
        </div>
      {:else}
        <div class="flex h-52 w-full items-center justify-center" style="background: #E8D9B0;">
          <svg viewBox="0 0 24 24" class="h-16 w-16 text-amber-700/30" fill="currentColor">
            <path
              d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
            />
          </svg>
        </div>
      {/if}

      <div class="px-6 py-5" style="border-top: 1px solid rgba(184,134,11,0.3);">
        <p class="font-body text-[9px] tracking-[0.35em] text-amber-700/60 uppercase">
          Mempelai Wanita
        </p>
        <h2
          class="mt-1 font-heading text-2xl font-bold text-amber-900 italic"
          style={brideNameStyle}
        >
          {brideName}
        </h2>
        {#if brideFather || brideMother}
          <p class="mt-2 font-body text-xs leading-relaxed text-amber-900/60">
            Putri dari
            {#if brideFather}<span class="font-semibold text-amber-800">Bapak {brideFather}</span
              >{/if}
            {#if brideFather && brideMother}
              &amp;
            {/if}
            {#if brideMother}<span class="font-semibold text-amber-800">Ibu {brideMother}</span
              >{/if}
          </p>
        {/if}
        {#if brideNotes}
          <p class="mt-2 font-body text-xs text-amber-800/50 italic">{brideNotes}</p>
        {/if}
        {#if brideIG}
          <a
            href={igUrl(brideIG)}
            target="_blank"
            rel="noopener noreferrer"
            class="mt-3 inline-flex items-center gap-1.5 text-xs text-amber-800/60 transition hover:text-amber-700"
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
    <div use:reveal={{ delay: 200 }} class="my-4 text-center">
      <p class="font-script text-5xl text-amber-800/40">&amp;</p>
    </div>

    <!-- Groom card -->
    <div
      use:reveal={{ delay: 280, x: 40 }}
      class="mb-6 overflow-hidden"
      style="
        background: linear-gradient(160deg, #FBF3DC 0%, #F4E8C1 100%);
        border: 2px solid #C9A227;
        box-shadow: -5px 5px 0 #8B6914, 0 0 20px rgba(139,69,19,0.15);
        transform: rotate(0.4deg);
      "
    >
      {#if groomImage}
        <div class="relative h-60 w-full overflow-hidden">
          <img src={groomImage} alt={groomName} class="h-full w-full object-cover" />
          <div
            class="absolute inset-0"
            style="background: linear-gradient(to bottom, rgba(244,232,193,0.1) 0%, rgba(237,217,163,0.4) 100%);"
          ></div>
        </div>
      {:else}
        <div class="flex h-52 w-full items-center justify-center" style="background: #E8D9B0;">
          <svg viewBox="0 0 24 24" class="h-16 w-16 text-amber-700/30" fill="currentColor">
            <path
              d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
            />
          </svg>
        </div>
      {/if}

      <div class="px-6 py-5" style="border-top: 1px solid rgba(184,134,11,0.3);">
        <p class="font-body text-[9px] tracking-[0.35em] text-amber-700/60 uppercase">
          Mempelai Pria
        </p>
        <h2
          class="mt-1 font-heading text-2xl font-bold text-amber-900 italic"
          style={groomNameStyle}
        >
          {groomName}
        </h2>
        {#if groomFather || groomMother}
          <p class="mt-2 font-body text-xs leading-relaxed text-amber-900/60">
            Putra dari
            {#if groomFather}<span class="font-semibold text-amber-800">Bapak {groomFather}</span
              >{/if}
            {#if groomFather && groomMother}
              &amp;
            {/if}
            {#if groomMother}<span class="font-semibold text-amber-800">Ibu {groomMother}</span
              >{/if}
          </p>
        {/if}
        {#if groomNotes}
          <p class="mt-2 font-body text-xs text-amber-800/50 italic">{groomNotes}</p>
        {/if}
        {#if groomIG}
          <a
            href={igUrl(groomIG)}
            target="_blank"
            rel="noopener noreferrer"
            class="mt-3 inline-flex items-center gap-1.5 text-xs text-amber-800/60 transition hover:text-amber-700"
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
  </div>
</section>
