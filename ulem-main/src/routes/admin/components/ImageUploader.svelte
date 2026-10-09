<script lang="ts">
  import { uploadImage, deleteImages } from '$lib/upload';
  
  let { 
    images = $bindable([] as string[]),
    folder,
    maxImages = null as number | null,
    minImages = null as number | null,
    multipleImage = true as boolean,
    label = 'Foto'
  } = $props();

  let uploading = $state<Record<number, number>>({});
  let dragOver = $state(false);

  async function handleFile(file: File, index: number) {
    uploading = { ...uploading, [index]: 0 };
    try {
      const url = await uploadImage(file, folder);
      images[index] = url;
      images = [...images];
    } catch (e: any) {
      alert(e.message ?? 'Upload gagal');
    } finally {
      const { [index]: _, ...rest } = uploading;
      uploading = rest;
    }
  }

  function addSlot() {
    images = [...images, ''];
  }

  function removeImage(index: number) {
    const url = images[index];
    images = images.filter((_, i) => i !== index);
    deleteImages([url]).catch(() => {});
  }

  function canAdd(): boolean {
    if (!multipleImage) return images.length === 0;
    if (maxImages !== null) return images.length < maxImages;
    return true;
  }

  function hint(): string {
    if (!multipleImage) return '1 gambar';
    if (minImages !== null && maxImages !== null) return `${minImages}-${maxImages} gambar`;
    if (minImages !== null) return `Min. ${minImages} gambar`;
    if (maxImages !== null) return `Maks. ${maxImages} gambar`;
    return '';
  }
</script>

<div>
  {#if label}
    <p class="mb-2 text-sm font-medium text-gray-600">
      {label}
      {#if hint()}<span class="ml-1 text-xs font-normal text-gray-400">({hint()})</span>{/if}
    </p>
  {/if}
  <div class="flex flex-wrap gap-3">
    {#each images as url, i}
      <div class="flex flex-col items-start gap-1">
        {#if url}
          <div class="relative">
            <img src={url} alt="{folder} {i + 1}" class="h-24 w-24 rounded-xl border object-cover" />
            <button
              type="button"
              onclick={() => removeImage(i)}
              class="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow">×</button>
          </div>
        {:else if uploading[i] !== undefined}
          <div class="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-blue-200 bg-blue-50 text-xs text-blue-600">
            <svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            Mengupload...
          </div>
        {:else}
          <label
            class="flex h-24 w-24 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-sm text-gray-400 transition hover:border-gray-400 hover:bg-gray-50"
            class:drag-over={dragOver}
            ondragover={(e: DragEvent) => { e.preventDefault(); dragOver = true; }}
            ondragleave={() => dragOver = false}
            ondrop={(e: DragEvent) => {
              e.preventDefault();
              dragOver = false;
              const file = e.dataTransfer?.files?.[0];
              if (file) handleFile(file, i);
            }}
          >
            +
            <input
              type="file"
              accept="image/*"
              class="hidden"
              onchange={(e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) handleFile(file, i);
              }}
            />
          </label>
        {/if}
        <button type="button" onclick={() => removeImage(i)} class="text-xs text-red-500 hover:underline">Hapus</button>
      </div>
    {/each}
    {#if canAdd()}
      <button type="button" onclick={addSlot} class="flex h-24 w-24 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-2xl text-gray-400 transition hover:border-gray-400 hover:bg-gray-50">+</button>
    {/if}
  </div>
</div>

<style>
  .drag-over {
    border-color: #3b82f6 !important;
    background: #eff6ff;
  }
</style>
