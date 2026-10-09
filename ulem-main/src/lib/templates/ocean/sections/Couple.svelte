<script lang="ts">
  import { getAdaptiveNameStyle } from '$lib/utils/adaptiveName';
  import { onMount } from 'svelte';

  export let invitation: any;

  const groomName: string = invitation.groom.name || 'GROOM';
  const brideName: string = invitation.bride.name || 'BRIDE';
  const groomFatherName: string = invitation.groom.father || '';
  const groomMotherName: string = invitation.groom.mother || '';
  const brideFatherName: string = invitation.bride.father || '';
  const brideMotherName: string = invitation.bride.mother || '';
  const groomImage: string = invitation.groom.imageUrls?.[0] || '';
  const brideImage: string = invitation.bride.imageUrls?.[0] || '';
  const groomIG: string = invitation.groom.socialMedia?.instagram || '';
  const brideIG: string = invitation.bride.socialMedia?.instagram || '';
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
  const groomNameStyle = getAdaptiveNameStyle(groomName, { maxRem: 2.1, minRem: 1.15, endAt: 30 });
  const brideNameStyle = getAdaptiveNameStyle(brideName, { maxRem: 2.1, minRem: 1.15, endAt: 30 });

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
      {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    if (el) observer.observe(el);
  });
</script>

<section
  bind:this={el}
  class="relative flex min-h-svh w-full items-center justify-center overflow-hidden"
>
  <div class="relative mx-4 min-h-svh w-full overflow-visible">
    <!-- CORAL (TIDAK DIUBAH) -->
    <img
      alt=""
      src="/assets/coral.svg"
      class="pointer-events-none absolute bottom-470 left-25 z-10 w-[200%] max-w-none -translate-x-1/2 translate-y-1/2"
    />
    <img
      alt=""
      src="/assets/coral.svg"
      class="pointer-events-none absolute -right-1 bottom-470 z-10 w-[220%] max-w-none translate-x-1/2 translate-y-1/2 -scale-100 -rotate-90 transform"
    />
    <img
      alt=""
      src="/assets/coral.svg"
      class="pointer-events-none absolute right-10 bottom-320 z-10 w-[220%] max-w-none translate-x-1/2 translate-y-1/2 -scale-100 -rotate-40 transform"
    />
    <img
      alt=""
      src="/assets/coral.svg"
      class="pointer-events-none absolute bottom-270 left-25 z-10 w-[200%] max-w-none -translate-x-1/2 translate-y-1/2 -rotate-20 transform"
    />
    <img
      alt=""
      src="/assets/coral.svg"
      class="pointer-events-none absolute right-10 bottom-150 z-10 w-[220%] max-w-none translate-x-1/2 translate-y-1/2 -scale-100 -rotate-40 transform"
    />
    <img
      alt=""
      src="/assets/coral.svg"
      class="pointer-events-none absolute bottom-100 left-25 z-10 w-[200%] max-w-none -translate-x-1/2 translate-y-1/2 -rotate-20 transform"
    />
    <img
      alt=""
      src="/assets/coral.svg"
      class="pointer-events-none absolute bottom-20 left-25 z-10 w-[200%] max-w-none -translate-x-1/2 translate-y-1/2 -rotate-60 transform"
    />
    <img
      alt=""
      src="/assets/coral.svg"
      class="pointer-events-none absolute right-10 bottom-20 z-10 w-[220%] max-w-none translate-x-1/2 translate-y-1/2 -scale-100 transform"
    />

    <!-- CARD -->
    <div
      class="
				relative z-20 mx-auto my-30 w-10/12
				rounded-t-[180px] rounded-b-[180px]
				border border-[#193D7A] bg-white px-6 text-center shadow-lg transition-all
				duration-2000 ease-[cubic-bezier(.22,1,.36,1)] sm:h-140
			"
      class:opacity-100={visible}
      class:opacity-0={!visible}
      class:translate-y-0={visible}
      class:translate-y-20={!visible}
    >
      <!-- ORNAMENT -->
      <div
        class="
					mt-15 mb-6 flex justify-center
					transition-all delay-150 duration-1400
				"
        class:opacity-100={visible}
        class:opacity-0={!visible}
        class:translate-y-0={visible}
        class:translate-y-8={!visible}
      >
        <img alt="" src="/assets/seahorse.svg" class="w-[30%]" />
        <img alt="" src="/assets/seahorse.svg" class="w-[30%] -scale-x-100 transform" />
      </div>

      <!-- TITLE -->
      <h2
        class="
					font-script text-3xl
					transition-all delay-300 duration-1400
				"
        class:opacity-100={visible}
        class:opacity-0={!visible}
        class:translate-y-0={visible}
        class:translate-y-8={!visible}
      >
        We Are Getting Married!
      </h2>

      <p
        class="
					mt-6 font-jomolhari text-base
					transition-all delay-450 duration-1400
				"
        class:opacity-100={visible}
        class:opacity-0={!visible}
        class:translate-y-0={visible}
        class:translate-y-8={!visible}
      >
        Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang pasangan.
      </p>

      <!-- BRIDE -->
      <div class="mb-15">
        <img
          alt=""
          src={brideImage}
          class="
						mx-auto mt-12 h-90 w-10/12 rounded-full border object-cover
						transition-all delay-600 duration-1400
					"
          class:opacity-100={visible}
          class:opacity-0={!visible}
          class:translate-y-0={visible}
          class:translate-y-12={!visible}
        />

        <p
          class="
						mt-8 font-script text-3xl
						transition-all delay-750 duration-1400
					"
          style={brideNameStyle}
          class:opacity-100={visible}
          class:opacity-0={!visible}
          class:translate-y-0={visible}
          class:translate-y-8={!visible}
        >
          {brideName}
        </p>

        <p
          class="
						text-gray-1400 mt-5 font-jomolhari text-sm leading-relaxed
						transition-all delay-850 duration-1400
					"
          class:opacity-100={visible}
          class:opacity-0={!visible}
          class:translate-y-0={visible}
          class:translate-y-8={!visible}
        >
          Putri pertama <br />
          {brideFatherName} & {brideMotherName}
        </p>
        {#if invitation.bride?.notes}
          <p class="mt-2 font-jomolhari text-xs italic text-gray-500">{invitation.bride.notes}</p>
        {/if}
        {#if brideIG}
          <a
            href={igUrl(brideIG)}
            target="_blank"
            rel="noopener noreferrer"
            class="mt-3 inline-flex items-center gap-1.5 text-xs text-gray-400 transition hover:text-gray-600"
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

      <h1
        class="
					my-15 font-jomolhari text-6xl
					transition-all delay-1000 duration-1400
				"
        class:opacity-100={visible}
        class:opacity-0={!visible}
        class:scale-100={visible}
        class:scale-90={!visible}
      >
        &amp;
      </h1>

      <!-- GROOM -->
      <div>
        <img
          alt=""
          src={groomImage}
          class="
						mx-auto mt-12 h-90 w-10/12 rounded-full border object-cover
						transition-all delay-2100 duration-1400
					"
          class:opacity-100={visible}
          class:opacity-0={!visible}
          class:translate-y-0={visible}
          class:translate-y-12={!visible}
        />

        <p
          class="
						mt-8 font-script text-3xl
						transition-all delay-2500 duration-1400
					"
          style={groomNameStyle}
          class:opacity-100={visible}
          class:opacity-0={!visible}
          class:translate-y-0={visible}
          class:translate-y-8={!visible}
        >
          {groomName}
        </p>

        <p
          class="
						mt-5 font-jomolhari text-sm leading-relaxed text-gray-700
						transition-all delay-2700 duration-700
					"
          class:opacity-100={visible}
          class:opacity-0={!visible}
          class:translate-y-0={visible}
          class:translate-y-8={!visible}
        >
          Putra pertama <br />
          {groomFatherName} & {groomMotherName}
        </p>
        {#if invitation.groom?.notes}
          <p class="mt-2 font-jomolhari text-xs italic text-gray-500">{invitation.groom.notes}</p>
        {/if}
        {#if groomIG}
          <a
            href={igUrl(groomIG)}
            target="_blank"
            rel="noopener noreferrer"
            class="mt-3 inline-flex items-center gap-1.5 text-xs text-gray-400 transition hover:text-gray-600"
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
