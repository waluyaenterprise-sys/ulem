<script lang="ts">
  import ImageUploader from './ImageUploader.svelte';

  let {
    coverImages = $bindable([] as string[]),
    quoteText = $bindable(''),
    quoteSource = $bindable(''),
    quoteImages = $bindable([] as string[]),
    galleryImages = $bindable([] as string[]),
    coverMax = null as number | null,
    coverMin = null as number | null,
    quoteMax = null as number | null,
    quoteMin = null as number | null,
    galleryMax = null as number | null,
    galleryMin = null as number | null,
    coverMultiple = true as boolean,
    quoteMultiple = true as boolean,
    galleryMultiple = true as boolean,
    hasCover = true,
    hasQuote = true,
    hasGallery = true,
    errors = $bindable({} as Record<string, string>)
  } = $props();
</script>

{#if hasCover}
  <div class="mb-4 rounded-2xl bg-white p-6 shadow-sm">
    <h2 class="mb-3 text-base font-semibold text-gray-900">Cover</h2>
    <ImageUploader bind:images={coverImages} folder="cover" maxImages={coverMax ?? undefined} minImages={coverMin ?? undefined} multipleImage={coverMultiple ?? undefined} label="Foto Cover" />
  </div>
{/if}

<div class="mb-4 rounded-2xl bg-white p-6 shadow-sm">
  <h2 class="mb-3 text-base font-semibold text-gray-900">Quote</h2>
  <div class="mb-4">
    <label for="quote-text" class="mb-1 block text-sm font-medium text-gray-700">Teks Quote (opsional)</label>
    <textarea id="quote-text" bind:value={quoteText} rows="3" placeholder="Ayat atau kata-kata bermakna…" class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition focus:border-gray-400 focus:bg-white focus:outline-none"></textarea>
    <label for="quote-source" class="mb-1 mt-3 block text-sm font-medium text-gray-700">Pengutip / Sumber Quote (opsional)</label>
    <input id="quote-source" bind:value={quoteSource} type="text" placeholder="Contoh: QS. Ar-Rum: 21 atau Rumi" class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition focus:border-gray-400 focus:bg-white focus:outline-none" />
  </div>
  {#if hasQuote}
    <ImageUploader bind:images={quoteImages} folder="quote" maxImages={quoteMax ?? undefined} minImages={quoteMin ?? undefined} multipleImage={quoteMultiple ?? undefined} label="Gambar Quote" />
  {/if}
</div>

{#if hasGallery}
  <div class="mb-4 rounded-2xl bg-white p-6 shadow-sm">
    <h2 class="mb-3 text-base font-semibold text-gray-900">Galeri</h2>
    <ImageUploader bind:images={galleryImages} folder="gallery" maxImages={galleryMax ?? undefined} minImages={galleryMin ?? undefined} multipleImage={galleryMultiple ?? undefined} label="Foto Galeri" />
  </div>
{/if}
