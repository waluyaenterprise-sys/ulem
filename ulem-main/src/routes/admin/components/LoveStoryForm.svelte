<script lang="ts">
  import ImageUpload from './ImageUpload.svelte';

  interface StoryItem {
    title: string;
    date: string;
    description: string;
    imageUrl: string;
  }

  let {
    stories = $bindable([] as StoryItem[]),
    hasImage = true,
    maxImages = null as number | null,
    minImages = null as number | null
  } = $props();

  function addStory() {
    stories = [...stories, { title: '', date: '', description: '', imageUrl: '' }];
  }

  function removeStory(i: number) {
    if (confirm('Hapus cerita ini?')) {
      stories = stories.filter((_, x) => x !== i);
    }
  }
</script>

<div class="mb-4 rounded-2xl bg-white p-6 shadow-sm">
  <div class="mb-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
    <h2 class="text-base font-semibold text-gray-900">Love Story</h2>
    <button
      type="button"
      onclick={addStory}
      class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto sm:py-1.5"
      >+ Tambah Cerita</button
    >
  </div>
  {#if stories.length === 0}
    <p class="text-sm text-gray-400">Belum ada cerita.</p>
  {/if}
  {#each stories as story, i}
    <div class="mb-4 rounded-xl border border-gray-200 p-4">
      <div class="mb-3 flex items-center justify-between">
        <span class="text-sm font-semibold text-gray-700">Cerita {i + 1}</span>
        <button
          type="button"
          onclick={() => removeStory(i)}
          class="text-xs text-red-500 hover:underline">Hapus</button
        >
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <div>
          <label for="st-title-{i}" class="mb-1 block text-sm font-medium text-gray-700"
            >Judul *</label
          >
          <input
            id="st-title-{i}"
            bind:value={story.title}
            type="text"
            placeholder="mis. Pertemuan Pertama"
            class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition focus:border-gray-400 focus:bg-white focus:outline-none"
          />
        </div>
        <div>
          <label for="st-date-{i}" class="mb-1 block text-sm font-medium text-gray-700"
            >Tanggal *</label
          >
          <input
            id="st-date-{i}"
            bind:value={story.date}
            type="date"
            class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition focus:border-gray-400 focus:bg-white focus:outline-none"
          />
        </div>
        <div class="sm:col-span-2">
          <label for="st-desc-{i}" class="mb-1 block text-sm font-medium text-gray-700"
            >Cerita</label
          >
          <textarea
            id="st-desc-{i}"
            bind:value={story.description}
            rows="3"
            placeholder="Ceritakan kisahnya…"
            class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition focus:border-gray-400 focus:bg-white focus:outline-none"
          ></textarea>
        </div>
      </div>
      {#if hasImage}
        <div class="mt-3">
          <p class="mb-2 text-sm font-medium text-gray-600">Foto *</p>
          <ImageUpload folder="stories" bind:value={story.imageUrl} />
        </div>
      {/if}
    </div>
  {/each}
</div>
