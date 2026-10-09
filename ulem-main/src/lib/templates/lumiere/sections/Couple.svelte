<script lang="ts">
  import { getAdaptiveNameStyle } from '$lib/utils/adaptiveName';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { onMount } from 'svelte';

  export let invitation: any;

  const groomName: string = invitation.groom?.name || 'Groom';
  const groomFirstName: string = groomName.split(' ')[0];
  const groomFather: string = invitation.groom?.father || '';
  const groomMother: string = invitation.groom?.mother || '';
  const groomNotes: string = invitation.groom?.notes || '';
  const groomImage: string = invitation.groom?.imageUrls?.[0] || '';

  const brideName: string = invitation.bride?.name || 'Bride';
  const brideFirstName: string = brideName.split(' ')[0];
  const brideFather: string = invitation.bride?.father || '';
  const brideMother: string = invitation.bride?.mother || '';
  const brideNotes: string = invitation.bride?.notes || '';
  const brideImage: string = invitation.bride?.imageUrls?.[0] || '';
  const groomIG: string = invitation.groom?.socialMedia?.instagram || '';
  const brideIG: string = invitation.bride?.socialMedia?.instagram || '';
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
  const groomNameStyle = getAdaptiveNameStyle(groomName, { maxRem: 2.2, minRem: 1.15, endAt: 28 });
  const brideNameStyle = getAdaptiveNameStyle(brideName, { maxRem: 2.2, minRem: 1.15, endAt: 28 });

  let visible = false;
  let el: HTMLElement;

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible = true;
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    );
    if (el) observer.observe(el);
  });
</script>

<!-- Warm linen background — clean, editorial, lets polaroids breathe -->
<section bind:this={el} class="min-h-svh w-full bg-[#f5f0e8] px-6 py-16">
  <!-- Section title -->
  <div
    class="mb-12 flex flex-col items-center text-center transition-all duration-700"
    class:opacity-100={visible}
    class:opacity-0={!visible}
    class:translate-y-0={visible}
    class:translate-y-6={!visible}
  >
    <p class="font-heading text-2xl tracking-[0.3em] text-[#a89880] uppercase">The Couple</p>
    <div class="mt-3 w-8 border-t border-[#c9b49a]"></div>
  </div>

  <!-- Polaroids overlapping: groom left, bride right behind -->
  <div
    class="mb-10 flex justify-center transition-all delay-100 duration-700"
    class:opacity-100={visible}
    class:opacity-0={!visible}
    class:translate-y-0={visible}
    class:translate-y-8={!visible}
  >
    <div class="relative" style="width: 310px; height: 310px;">
      <!-- Bride polaroid — front, left side, no rotation -->
      <div
        class="absolute bg-white p-3 pb-4 shadow-xl"
        style="transform: rotate(0deg); width: 200px; top: 0; left: -30px; z-index: 2;"
      >
        <div class="h-44 w-full overflow-hidden bg-gray-200">
          <img src={brideImage} alt={brideName} class="h-full w-full object-cover" />
        </div>
        <p class="mt-2 text-center font-script text-base text-gray-800" style={brideNameStyle}>
          {brideFirstName}
        </p>
      </div>

      <!-- Groom polaroid — behind, right side, rotated right -->
      <div
        class="absolute bg-white p-3 pb-4 shadow-lg"
        style="transform: rotate(10deg); width: 200px; top: 60px; right: -30px; z-index: 1;"
      >
        <div class="h-44 w-full overflow-hidden bg-gray-200">
          <img src={groomImage} alt={groomName} class="h-full w-full object-cover" />
        </div>
        <p class="mt-2 text-center font-script text-base text-gray-800" style={groomNameStyle}>
          {groomFirstName}
        </p>
      </div>
    </div>
  </div>

  <!-- Couple info — two columns -->
  <div
    class="flex w-full items-start justify-center gap-4 transition-all delay-200 duration-700"
    class:opacity-100={visible}
    class:opacity-0={!visible}
    class:translate-y-0={visible}
    class:translate-y-6={!visible}
  >
    <!-- Bride info -->
    <div class="flex flex-1 flex-col items-center text-center">
      <p class="mb-1 font-heading text-[10px] tracking-[0.25em] text-[#a89880] uppercase">Bride</p>
      <div class="mb-3 w-6 border-t border-[#c9b49a]"></div>
      <p class="mb-1 font-script text-lg text-[#5c5147]" style={brideNameStyle}>{brideName}</p>
      {#if brideNotes}
        <p class="font-body text-xs text-[#5c5147]">{brideNotes}</p>
      {/if}
      {#if brideFather || brideMother}
        <p class="mt-2 font-body text-[11px] leading-relaxed text-[#9c8c7c]">
          Putri dari<br />
          Bapak {brideFather}<br />
          {#if brideMother}&amp; Ibu {brideMother}{/if}
        </p>
      {/if}
      {#if brideNotes}
        <p class="mt-1 font-body text-xs italic text-[#9c8c7c]">{brideNotes}</p>
      {/if}
      {#if brideIG}
        <a
          href={igUrl(brideIG)}
          target="_blank"
          rel="noopener noreferrer"
          class="mt-2 inline-flex items-center gap-1.5 text-xs text-[#9c8c7c] transition hover:text-[#6b5d52]"
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

    <!-- Vertical divider -->
    <div class="mt-4 h-24 border-l border-[#d6ccc0]"></div>

    <!-- Groom info -->
    <div class="flex flex-1 flex-col items-center text-center">
      <p class="mb-1 font-heading text-[10px] tracking-[0.25em] text-[#a89880] uppercase">Groom</p>
      <div class="mb-3 w-6 border-t border-[#c9b49a]"></div>
      <p class="mb-1 font-script text-lg text-[#5c5147]" style={groomNameStyle}>{groomName}</p>
      {#if groomNotes}
        <p class="font-body text-xs text-[#5c5147]">{groomNotes}</p>
      {/if}
      {#if groomFather || groomMother}
        <p class="mt-2 font-body text-[11px] leading-relaxed text-[#9c8c7c]">
          Putra dari<br />
          Bapak {groomFather}<br />
          {#if groomMother}&amp; Ibu {groomMother}{/if}
        </p>
      {/if}
      {#if groomNotes}
        <p class="mt-1 font-body text-xs italic text-[#9c8c7c]">{groomNotes}</p>
      {/if}
      {#if groomIG}
        <a
          href={igUrl(groomIG)}
          target="_blank"
          rel="noopener noreferrer"
          class="mt-2 inline-flex items-center gap-1.5 text-xs text-[#9c8c7c] transition hover:text-[#6b5d52]"
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
