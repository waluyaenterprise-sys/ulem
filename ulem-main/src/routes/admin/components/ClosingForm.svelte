<script lang="ts">
  import ImageUploader from './ImageUploader.svelte';

  let {
    closingMessage = $bindable(''),
    closingImages = $bindable([] as string[]),
    maxImages = null as number | null,
    minImages = null as number | null,
    multipleImage = true as boolean,
    hasImage = true
  } = $props();
</script>

<div class="mb-4 rounded-2xl bg-white p-6 shadow-sm">
  <h2 class="mb-4 text-base font-semibold text-gray-900">Penutup</h2>
  <div class="mb-4">
    <label for="closing-msg" class="mb-1 block text-sm font-medium text-gray-700">Pesan (opsional)</label>
    <textarea id="closing-msg" bind:value={closingMessage} rows="4" placeholder="Terima kasih telah menjadi bagian dari hari istimewa kami…" class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition focus:border-gray-400 focus:bg-white focus:outline-none"></textarea>
  </div>
  {#if hasImage}
    <ImageUploader bind:images={closingImages} folder="closing" maxImages={maxImages ?? undefined} minImages={minImages ?? undefined} multipleImage={multipleImage ?? undefined} label="Gambar Latar" />
  {/if}
</div>
