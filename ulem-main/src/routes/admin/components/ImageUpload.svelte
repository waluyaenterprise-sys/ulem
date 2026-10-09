<script lang="ts">
  import { uploadImage } from '$lib/upload';

  export let value: string = '';
  export let folder: string = 'misc';

  let uploading = false;
  let errorMsg = '';

  async function handleChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    uploading = true;
    errorMsg = '';
    try {
      value = await uploadImage(file, folder);
    } catch (err: any) {
      errorMsg = err.message ?? 'Upload failed';
    } finally {
      uploading = false;
    }
  }
</script>

<div class="space-y-1">
  {#if value}
    <div class="relative inline-block">
      <img src={value} alt="preview" class="h-24 w-24 rounded-xl border object-cover" />
      <button
        type="button"
        class="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs leading-none text-white shadow"
        on:click={() => (value = '')}>×</button
      >
    </div>
  {/if}

  <label
    class="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-500 transition hover:border-gray-400 hover:bg-gray-50 {uploading
      ? 'pointer-events-none opacity-50'
      : ''}"
  >
    {#if uploading}
      <span class="animate-pulse">Uploading…</span>
    {:else}
      <span>{value ? 'Change image' : 'Upload image'}</span>
    {/if}
    <input
      type="file"
      accept="image/*"
      class="hidden"
      on:change={handleChange}
      disabled={uploading}
    />
  </label>

  {#if errorMsg}
    <p class="text-xs text-red-500">{errorMsg}</p>
  {/if}
</div>
