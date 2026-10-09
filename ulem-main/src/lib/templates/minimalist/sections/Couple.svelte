<script lang="ts">
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  export let invitation: any;

  const groom = invitation.groom;
  const bride = invitation.bride;

  const groomName: string = groom.name || 'Groom';
  const brideName: string = bride.name || 'Bride';
  const groomFather: string = groom.father || '';
  const groomMother: string = groom.mother || '';
  const brideFather: string = bride.father || '';
  const brideMother: string = bride.mother || '';
  const groomImage: string = groom.imageUrls?.[0] || '';
  const brideImage: string = bride.imageUrls?.[0] || '';
  const groomIG: string = groom.socialMedia?.instagram || '';
  const brideIG: string = bride.socialMedia?.instagram || '';
  const groomAditionalInfo: string = groom.notes || '';
  const brideAditionalInfo: string = bride.notes || '';

  // Extract @username from full URL or use as-is
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

  let sectionEl: HTMLElement;
  let visible = false;

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
    observer.observe(sectionEl);
    return () => observer.disconnect();
  });
</script>

<section
  bind:this={sectionEl}
  class="relative w-full bg-white px-6 py-16 text-center lg:px-10 lg:py-24"
>
  {#if visible}
    <div class="mx-auto max-w-6xl">
      <!-- HEADER -->
      <div in:fly={{ y: -30, duration: 1100, easing: cubicOut }}>
        <p class="font-script text-4xl text-[#F0A269] lg:text-5xl">Bride &amp; Groom</p>
      </div>

      <div in:fly={{ y: 20, delay: 150, duration: 1100, easing: cubicOut }}>
        <p class="mt-4 text-sm text-gray-500 italic lg:text-base">
          Assalamu'alaikum Warahmatullahi Wabarakatuh
        </p>
        <p
          class="mx-auto mt-3 max-w-xs text-xs leading-relaxed text-gray-400 lg:max-w-2xl lg:text-sm"
        >
          Dengan memohon rahmat dan ridho Allah SWT, kami mengundang kehadiran Bapak/Ibu/Saudara/i
          untuk menyaksikan pernikahan kami.
        </p>
      </div>

      <div
        in:fade={{ delay: 200, duration: 900 }}
        class="mx-auto mt-10 h-px w-16 bg-[#F0A269]/30"
      ></div>

      <div
        class="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-start lg:gap-6"
      >
        <!-- BRIDE CARD -->
        <div
          in:fly={{ x: -70, delay: 300, duration: 1100, easing: cubicOut }}
          class="mx-auto max-w-xs overflow-hidden rounded-3xl bg-gray-50 shadow-sm lg:mx-0 lg:max-w-105"
        >
          {#if brideImage}
            <img
              src={brideImage}
              alt={brideName}
              class="h-72 w-full object-cover object-top lg:h-120"
            />
          {:else}
            <div
              class="flex h-72 w-full items-center justify-center bg-gray-100 text-gray-300 lg:h-120"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          {/if}
          <div class="px-6 py-6 lg:px-8 lg:py-8">
            <h2 class="font-jomolhari text-2xl text-gray-800 lg:text-3xl">{brideName}</h2>
            {#if brideFather || brideMother}
              <p class="mt-2 text-xs leading-relaxed text-gray-500 lg:text-sm">
                Putri Kedua {brideAditionalInfo} dari<br />
                <span class="font-medium text-gray-700">Bapak {brideFather}</span>
                {#if brideMother}
                  &amp; <span class="font-medium text-gray-700">Ibu {brideMother}</span>
                {/if}
              </p>
            {/if}
            {#if brideAditionalInfo}
              <p class="mt-2 text-xs text-gray-500 italic">{brideAditionalInfo}</p>
            {/if}
            {#if brideIG}
              <a
                href={igUrl(brideIG)}
                target="_blank"
                rel="noopener noreferrer"
                class="mt-3 inline-flex items-center gap-1 text-xs text-gray-400 transition hover:text-[#F0A269]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3.5 w-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                  />
                </svg>
                {igHandle(brideIG)}
              </a>
            {/if}
          </div>
        </div>

        <!-- DIVIDER -->
        <div
          in:fade={{ delay: 400, duration: 900 }}
          class="mx-auto mt-6 flex items-center gap-3 lg:mt-0 lg:flex-col lg:gap-0 lg:self-stretch"
        >
          <div class="h-px flex-1 bg-gray-200 lg:h-full lg:w-px lg:flex-none"></div>
          <p class="font-jomolhari text-2xl text-[#F0A269]/60 lg:py-4">&amp;</p>
          <div class="h-px flex-1 bg-gray-200 lg:h-full lg:w-px lg:flex-none"></div>
        </div>

        <!-- GROOM CARD -->
        <div
          in:fly={{ x: 70, delay: 500, duration: 1100, easing: cubicOut }}
          class="mx-auto mt-6 max-w-xs overflow-hidden rounded-3xl bg-gray-50 shadow-sm lg:mx-0 lg:mt-0 lg:max-w-105"
        >
          {#if groomImage}
            <img src={groomImage} alt={groomName} class="h-72 w-full object-cover lg:h-120" />
          {:else}
            <div
              class="flex h-72 w-full items-center justify-center bg-gray-100 text-gray-300 lg:h-120"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          {/if}
          <div class="px-6 py-6 lg:px-8 lg:py-8">
            <h2 class="font-jomolhari text-2xl text-gray-800 lg:text-3xl">{groomName}</h2>
            {#if groomFather || groomMother}
              <p class="mt-2 text-xs leading-relaxed text-gray-500 lg:text-sm">
                Putra Pertama {groomAditionalInfo} dari<br />
                <span class="font-medium text-gray-700">Bapak {groomFather}</span>
                {#if groomMother}
                  &amp; <span class="font-medium text-gray-700">Ibu {groomMother}</span>
                {/if}
              </p>
            {/if}
            {#if groomAditionalInfo}
              <p class="mt-2 text-xs text-gray-500 italic">{groomAditionalInfo}</p>
            {/if}
            {#if groomIG}
              <a
                href={igUrl(groomIG)}
                target="_blank"
                rel="noopener noreferrer"
                class="mt-3 inline-flex items-center gap-1 text-xs text-gray-400 transition hover:text-[#F0A269]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3.5 w-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                  />
                </svg>
                {igHandle(groomIG)}
              </a>
            {/if}
          </div>
        </div>
      </div>
    </div>
  {/if}
</section>
