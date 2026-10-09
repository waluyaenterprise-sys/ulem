<script lang="ts">
  // import './layout.css';
  import { onMount } from 'svelte';
  import favicon from '$lib/assets/favicon.svg';
  import { page } from '$app/stores';

  let { children } = $props();

  let isPublished = $derived($page.data.isPublished ?? true);
  let isPreviewMode = $derived($page.url.searchParams.get('preview') === 'true');
  let isEmbedded = $derived($page.url.searchParams.get('embed') === 'true');
  let embeddedInvitationUrl = $derived.by(() => {
    const params = new URLSearchParams($page.url.searchParams);
    params.set('embed', 'true');
    return `${$page.url.pathname}?${params.toString()}`;
  });
  // Keep the cover metadata aligned with the ceremony date shown by the
  // templates, even when the reception happens to be listed first.
  let weddingEvent = $derived(
    $page.data.eventData?.events?.find((event: any) => event.type?.toLowerCase() === 'akad') ??
      $page.data.eventData?.events?.[0]
  );
  let weddingDate = $derived.by(() => {
    const date = weddingEvent?.date;
    if (!date) return '';

    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      // Read legacy (+07:00) records and the new UTC-midnight records in the
      // same calendar timezone, so the desktop cover matches the akad date.
      timeZone: 'Asia/Jakarta'
    }).format(new Date(date));
  });
  let sideImageUrl = $state('');

  function isLandscapeImage(src: string) {
    return new Promise<boolean>((resolve) => {
      const image = new Image();
      image.onload = () => resolve(image.naturalWidth >= image.naturalHeight);
      image.onerror = () => resolve(false);
      image.src = src;
    });
  }

  onMount(async () => {
    if (isEmbedded) return;

    const galleryImages = ($page.data.eventData?.gallery?.imageUrls ?? []).filter(
      (url: unknown): url is string => typeof url === 'string' && url.length > 0
    );
    const shuffledImages = [...galleryImages].sort(() => Math.random() - 0.5);

    for (const imageUrl of shuffledImages) {
      if (await isLandscapeImage(imageUrl)) {
        sideImageUrl = imageUrl;
        return;
      }
    }

    sideImageUrl = shuffledImages[0] ?? '';
  });

  const WA_NUMBER = '628981219376';
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class:embedded={isEmbedded} class="wedding-layout flex min-h-screen bg-[#f3efe8]">
  {#if !isEmbedded}
  <aside class="wedding-side-panel" aria-label="Informasi mempelai">
      {#if sideImageUrl}
        <img
          class="wedding-side-image"
          src={sideImageUrl}
          alt="Foto {$page.data.eventData?.bride?.name ?? 'mempelai wanita'} dan {$page.data.eventData?.groom?.name ?? 'mempelai pria'}"
        />
      {/if}
    <div class="wedding-side-overlay"></div>
      <div class="wedding-side-content">
        <p class="wedding-side-kicker">The Wedding Of</p>
      <h1>
        {$page.data.eventData?.bride?.name ?? 'Mempelai Wanita'}
        <span>&amp;</span>
        {$page.data.eventData?.groom?.name ?? 'Mempelai Pria'}
        </h1>
      </div>
      {#if weddingEvent}
        <footer class="wedding-side-footer">
          <p>{weddingEvent.title ?? 'Undangan Pernikahan'}</p>
          {#if weddingDate}<strong>{weddingDate}</strong>{/if}
        </footer>
      {/if}
    </aside>
  {/if}

  <main class="wedding-phone relative w-full max-w-107.5 bg-white">
    <div class:mobile-invitation={!isEmbedded}>
    {@render children()}

    {#if !isPublished && !isPreviewMode}
      <!-- Watermark diagonal text tiled -->
      <div
        class="pointer-events-none absolute inset-0 z-40 overflow-hidden"
        aria-hidden="true"
      >
        <div
          class="absolute inset-0"
          style="background-image: repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 80px,
            rgba(0,0,0,0.04) 80px,
            rgba(0,0,0,0.04) 82px
          );"
        ></div>
        {#each Array(12) as _, row}
          {#each Array(4) as _, col}
            <span
              class="absolute select-none font-bold tracking-widest uppercase"
              style="font-size: 1.1rem; transform: rotate(-35deg); top: {row * 120 - 40}px; left: {col * 180 - 60}px; white-space: nowrap; color: #39ff14; opacity: 0.55; text-shadow: 0 0 6px #39ff14;"
            >
              PREVIEW
            </span>
          {/each}
        {/each}
      </div>

      <!-- Bottom banner -->
      <div class="pointer-events-auto sticky bottom-0 z-50 w-full bg-gray-900 px-4 py-3 text-center text-sm text-white shadow-lg">
        <span class="opacity-80">Ini adalah preview undangan.</span>
        Untuk mengaktifkan, silakan lakukan pembayaran ke WhatsApp
        <a
          href="https://wa.me/{WA_NUMBER}?text={encodeURIComponent('Halo, saya ingin melakukan pembayaran untuk mengaktifkan undangan digital saya.')}"
          target="_blank"
          rel="noopener noreferrer"
          class="ml-1 inline-flex items-center gap-1 font-semibold text-green-400 underline underline-offset-2 hover:text-green-300"
        >
          +{WA_NUMBER} ↗
        </a>
      </div>
    {/if}
    </div>

    {#if !isEmbedded}
      <iframe
        class="desktop-invitation-frame"
        src={embeddedInvitationUrl}
        title="Undangan pernikahan"
      ></iframe>
    {/if}
  </main>
</div>

<style>
  .wedding-side-panel {
    display: none;
  }

  .desktop-invitation-frame {
    display: none;
  }

  @media (min-width: 768px) {
    .wedding-layout {
      justify-content: flex-end;
    }

    .wedding-phone {
      z-index: 1;
      flex: 0 0 26.875rem;
      min-height: 100vh;
      box-shadow: -12px 0 36px rgb(20 16 12 / 12%);
    }

    .wedding-layout:not(.embedded) .mobile-invitation {
      display: none;
    }

    .wedding-layout:not(.embedded) .desktop-invitation-frame {
      display: block;
      width: 100%;
      height: 100vh;
      border: 0;
      background: white;
    }

    .wedding-side-panel {
      position: fixed;
      inset: 0 26.875rem 0 0;
      display: grid;
      overflow: hidden;
      place-items: center;
      background: #1e1914;
    }

    .wedding-side-image {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .wedding-side-overlay {
      position: absolute;
      inset: 0;
      background: rgb(0 0 0 / 45%);
    }

    .wedding-side-content {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: none;
      padding: 2rem;
      color: white;
      text-align: center;
      text-shadow: 0 2px 16px rgb(0 0 0 / 45%);
    }

    .wedding-side-kicker {
      margin: 0 0 1.5rem;
      font-family: var(--font-alt);
      font-size: 0.9rem;
      font-weight: 600;
      letter-spacing: 0.28em;
      text-transform: uppercase;
    }

    .wedding-side-content h1 {
      max-width: 75%;
      margin: 0 auto;
      font-family: var(--font-script);
      font-size: clamp(3.5rem, 6vw, 6.5rem);
      font-weight: 400;
      line-height: 1.08;
      overflow-wrap: anywhere;
    }

    .wedding-side-content h1 span {
      display: block;
      margin: 0.2em 0;
      font-size: 0.55em;
    }

    .wedding-side-footer {
      position: absolute;
      right: 2rem;
      bottom: 2rem;
      left: 2rem;
      z-index: 1;
      color: white;
      font-family: var(--font-alt);
      text-align: center;
      text-shadow: 0 2px 12px rgb(0 0 0 / 55%);
    }

    .wedding-side-footer p {
      margin: 0 0 0.35rem;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.22em;
      text-transform: uppercase;
    }

    .wedding-side-footer strong {
      font-size: 0.95rem;
      font-weight: 500;
      letter-spacing: 0.08em;
    }
  }
</style>
