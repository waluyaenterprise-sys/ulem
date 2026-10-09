<!-- src/routes/invite/[slug]/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import type { SvelteComponent } from 'svelte';
  import { fade } from 'svelte/transition';
  import { CLIENT_TEMPLATES } from '$lib/templates/templates.js';
  import Credit from '$lib/Credit.svelte';
  import MusicPlayer from '$lib/MusicPlayer.svelte';

  export let data; // { templateId, eventData }

  const { groom, bride, cover } = data.eventData;
  const ogTitle = `Undangan Pernikahan ${bride?.name ?? ''} & ${groom?.name ?? ''}`;
  const ogDescription =
    'Kami mengundang Anda untuk hadir dan memberikan doa restu pada hari bahagia kami.';
  const coverImage = cover?.imageUrls?.[0] ?? data.eventData.gallery?.imageUrls?.[0] ?? '';
  const ogImage = coverImage ? new URL(coverImage, data.siteOrigin).href : '';
  const ogType = 'website';

  let CoverComponent: typeof SvelteComponent | null = null;
  let mainSections: Array<{ name: string; component: typeof SvelteComponent }> = [];
  let showCover = true;
  let musicVisible = false;

  let musicPlayer: MusicPlayer;

  function handleOpen() {
    showCover = false;
    musicVisible = true;
    musicPlayer?.play();
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  }

  onMount(async () => {
    const loader = CLIENT_TEMPLATES[data.templateId];
    if (!loader) {
      console.error('Template tidak ditemukan:', data.templateId);
      return;
    }

    const mod = await loader();
    CoverComponent = mod.Cover;

    // Load semua section
    const loadedSections = [];
    for (const [name, compLoader] of Object.entries(mod.sections)) {
      const compMod = await (compLoader as () => Promise<any>)();
      loadedSections.push({ name, component: compMod.default || compMod });
    }
    mainSections = loadedSections;
  });
</script>

<svelte:head>
  <title>{ogTitle}</title>
  <meta name="description" content={ogDescription} />

  <!-- Open Graph -->
  <meta property="og:type" content={ogType} />
  <meta property="og:title" content={ogTitle} />
  <meta property="og:description" content={ogDescription} />
  {#if ogImage}
    <meta property="og:image" content={ogImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
  {/if}

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={ogTitle} />
  <meta name="twitter:description" content={ogDescription} />
  {#if ogImage}
    <meta name="twitter:image" content={ogImage} />
  {/if}
</svelte:head>

<!-- Cover khusus -->
{#if showCover && CoverComponent}
  <div class="wedding-cover fixed inset-0 z-50 bg-white">
    <svelte:component this={CoverComponent} invitation={data.eventData} on:open={handleOpen} />
  </div>
{/if}

<!-- Isi utama -->
{#if !showCover}
  <div in:fade={{ duration: 600 }}>
    {#each mainSections as { component }}
      <svelte:component this={component} invitation={data.eventData} />
    {/each}
  </div>
{/if}

<!-- Music player: mounted early so YT API loads during cover, plays on open -->
<MusicPlayer bind:this={musicPlayer} url={data.eventData.songUrl ?? ''} visible={musicVisible} />

<style>
  @media (min-width: 768px) {
    .wedding-cover {
      left: auto;
      width: 26.875rem;
    }
  }
</style>
