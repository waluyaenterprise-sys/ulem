<script lang="ts">
  import { onMount } from 'svelte';

  export let invitation: any;

  const groomName: string = invitation.groom?.name || 'Groom';
  const groomFather: string = invitation.groom?.father || '';
  const groomMother: string = invitation.groom?.mother || '';
  const groomNotes: string = invitation.groom?.notes || '';
  const groomImage: string = invitation.groom?.imageUrls?.[0] || '';

  const brideName: string = invitation.bride?.name || 'Bride';
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

<section
  bind:this={el}
  class="relative w-full overflow-hidden px-5 py-20"
  style="background: linear-gradient(160deg, #1c0f0a 0%, #2d1a0e 45%, #1c0f0a 100%);"
>
  <!-- Warm glow -->
  <div
    class="pointer-events-none absolute"
    style="width:500px;height:500px;border-radius:50%;background:radial-gradient(circle, rgba(232,164,90,0.09) 0%, transparent 70%);top:50%;left:50%;transform:translate(-50%,-50%);"
  ></div>

  <!-- Header -->
  <div
    class="mb-14 text-center transition-all duration-700"
    class:opacity-100={visible}
    class:opacity-0={!visible}
    class:translate-y-0={visible}
    class:translate-y-6={!visible}
  >
    <p
      class="text-2xl tracking-[0.3em] uppercase"
      style="color: rgba(232,164,90,0.85); font-family: var(--font-heading, sans-serif);"
    >
      The Couple
    </p>
    <div
      class="mx-auto mt-4"
      style="width:50px;height:1px;background:linear-gradient(to right,transparent,rgba(232,164,90,0.6),transparent);"
    ></div>
  </div>

  <!-- Cards -->
  <div class="relative z-10 flex flex-col items-center gap-8">
    <!-- Bride card -->
    <div
      class="w-full max-w-sm overflow-hidden rounded-3xl transition-all delay-100 duration-700"
      class:opacity-100={visible}
      class:opacity-0={!visible}
      class:translate-y-0={visible}
      class:translate-y-10={!visible}
      style="
        background: rgba(255,200,120,0.07);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        border: 1px solid rgba(232,164,90,0.22);
        box-shadow: 0 8px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,230,170,0.10);
      "
    >
      {#if brideImage}
        <div class="relative overflow-hidden" style="height:320px;">
          <img src={brideImage} alt={brideName} class="h-full w-full object-cover" />
          <!-- Bottom fade to card bg -->
          <div
            class="absolute inset-x-0 bottom-0"
            style="height:100px;background:linear-gradient(to top, rgba(45,26,14,0.9), transparent);"
          ></div>
          <!-- Warm border glow on image -->
          <div
            class="absolute inset-0"
            style="box-shadow:inset 0 -2px 0 rgba(232,164,90,0.3);"
          ></div>
        </div>
      {:else}
        <div
          class="flex items-center justify-center"
          style="height:200px;background:rgba(255,200,120,0.05);"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="rgba(232,164,90,0.4)"
            stroke-width="1"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      {/if}

      <div class="px-7 py-6 text-center">
        <p
          class="mb-1 text-[10px] tracking-[0.3em] uppercase"
          style="color: rgba(232,164,90,0.65); font-family: var(--font-heading, sans-serif);"
        >
          Bride
        </p>
        <div
          class="mx-auto mb-4"
          style="width:30px;height:1px;background:rgba(232,164,90,0.4);"
        ></div>
        <p
          class="mb-1 text-2xl"
          style="font-family: var(--font-script, serif); color: rgba(255,230,180,0.95);"
        >
          {brideName}
        </p>
        {#if brideNotes}
          <p
            class="text-xs"
            style="color: rgba(232,164,90,0.65); font-family: var(--font-body, sans-serif);"
          >
            {brideNotes}
          </p>
        {/if}
        {#if brideFather || brideMother}
          <p
            class="mt-3 text-[11px] leading-relaxed"
            style="color: rgba(255,210,150,0.55); font-family: var(--font-body, sans-serif);"
          >
            Putri dari<br />
            Bapak {brideFather}
            {#if brideMother}<br />&amp; Ibu {brideMother}{/if}
          </p>
        {/if}
        {#if brideNotes}
          <p
            class="mt-1 text-xs italic"
            style="color:rgba(232,164,90,0.55);font-family:var(--font-body,sans-serif);"
          >
            {brideNotes}
          </p>
        {/if}
        {#if brideIG}
          <a
            href={igUrl(brideIG)}
            target="_blank"
            rel="noopener noreferrer"
            class="mt-3 inline-flex items-center gap-1.5 text-xs"
            style="color:rgba(232,164,90,0.8);"
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

    <!-- Ampersand divider -->
    <div
      class="flex items-center gap-4 transition-all delay-200 duration-500"
      class:opacity-100={visible}
      class:opacity-0={!visible}
    >
      <div style="width:50px;height:1px;background:rgba(232,164,90,0.3);"></div>
      <span
        class="text-4xl"
        style="font-family: var(--font-script, serif); color: rgba(232,164,90,0.6);">&amp;</span
      >
      <div style="width:50px;height:1px;background:rgba(232,164,90,0.3);"></div>
    </div>

    <!-- Groom card -->
    <div
      class="w-full max-w-sm overflow-hidden rounded-3xl transition-all delay-300 duration-700"
      class:opacity-100={visible}
      class:opacity-0={!visible}
      class:translate-y-0={visible}
      class:translate-y-10={!visible}
      style="
        background: rgba(255,200,120,0.07);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        border: 1px solid rgba(232,164,90,0.22);
        box-shadow: 0 8px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,230,170,0.10);
      "
    >
      {#if groomImage}
        <div class="relative overflow-hidden" style="height:320px;">
          <img src={groomImage} alt={groomName} class="h-full w-full object-cover" />
          <div
            class="absolute inset-x-0 bottom-0"
            style="height:100px;background:linear-gradient(to top, rgba(45,26,14,0.9), transparent);"
          ></div>
          <div
            class="absolute inset-0"
            style="box-shadow:inset 0 -2px 0 rgba(232,164,90,0.3);"
          ></div>
        </div>
      {:else}
        <div
          class="flex items-center justify-center"
          style="height:200px;background:rgba(255,200,120,0.05);"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="rgba(232,164,90,0.4)"
            stroke-width="1"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      {/if}

      <div class="px-7 py-6 text-center">
        <p
          class="mb-1 text-[10px] tracking-[0.3em] uppercase"
          style="color: rgba(232,164,90,0.65); font-family: var(--font-heading, sans-serif);"
        >
          Groom
        </p>
        <div
          class="mx-auto mb-4"
          style="width:30px;height:1px;background:rgba(232,164,90,0.4);"
        ></div>
        <p
          class="mb-1 text-2xl"
          style="font-family: var(--font-script, serif); color: rgba(255,230,180,0.95);"
        >
          {groomName}
        </p>
        {#if groomNotes}
          <p
            class="text-xs"
            style="color: rgba(232,164,90,0.65); font-family: var(--font-body, sans-serif);"
          >
            {groomNotes}
          </p>
        {/if}
        {#if groomFather || groomMother}
          <p
            class="mt-3 text-[11px] leading-relaxed"
            style="color: rgba(255,210,150,0.55); font-family: var(--font-body, sans-serif);"
          >
            Putra dari<br />
            Bapak {groomFather}
            {#if groomMother}<br />&amp; Ibu {groomMother}{/if}
          </p>
        {/if}
        {#if groomNotes}
          <p
            class="mt-1 text-xs italic"
            style="color:rgba(232,164,90,0.55);font-family:var(--font-body,sans-serif);"
          >
            {groomNotes}
          </p>
        {/if}
        {#if groomIG}
          <a
            href={igUrl(groomIG)}
            target="_blank"
            rel="noopener noreferrer"
            class="mt-3 inline-flex items-center gap-1.5 text-xs"
            style="color:rgba(232,164,90,0.8);"
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
