<script lang="ts">
  import ImageUploader from './ImageUploader.svelte';

  interface EventItem {
    type: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    locationUrl: string;
    imageUrls: string[];
  }

  let {
    events = $bindable([] as EventItem[]),
    maxImages = null as number | null,
    minImages = null as number | null,
    multipleImage = true as boolean,
    hasImages = true
  } = $props();

  function addEvent() {
    events = [
      ...events,
      {
        type: 'akad',
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        locationUrl: '',
        imageUrls: []
      }
    ];
  }

  function removeEvent(i: number) {
    if (confirm('Hapus acara ini?')) {
      events = events.filter((_, x) => x !== i);
    }
  }
</script>

<div class="mb-4 rounded-2xl bg-white p-6 shadow-sm">
  <div class="mb-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
    <h2 class="text-base font-semibold text-gray-900">Acara</h2>
    <button
      type="button"
      onclick={addEvent}
      class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto sm:py-1.5"
      >+ Tambah Acara</button
    >
  </div>
  {#if events.length === 0}
    <p class="text-sm text-gray-400">Belum ada acara. Tambahkan akad nikah dan resepsi.</p>
  {/if}
  {#each events as event, i}
    <div class="mb-4 rounded-xl border border-gray-200 p-4">
      <div class="mb-3 flex items-center justify-between">
        <span class="text-sm font-semibold text-gray-700">Acara {i + 1}</span>
        <button
          type="button"
          onclick={() => removeEvent(i)}
          class="text-xs text-red-500 hover:underline">Hapus</button
        >
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <div>
          <label for="ev-type-{i}" class="mb-1 block text-sm font-medium text-gray-700">Jenis</label
          >
          <select
            id="ev-type-{i}"
            bind:value={event.type}
            class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition focus:border-gray-400 focus:bg-white focus:outline-none"
          >
            <option value="akad">Akad Nikah</option>
            <option value="reception">Resepsi</option>
            <option value="other">Lainnya</option>
          </select>
        </div>
        <div>
          <label for="ev-title-{i}" class="mb-1 block text-sm font-medium text-gray-700"
            >Judul</label
          >
          <input
            id="ev-title-{i}"
            bind:value={event.title}
            type="text"
            placeholder="mis. Akad Nikah"
            class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition focus:border-gray-400 focus:bg-white focus:outline-none"
          />
        </div>
        <div>
          <label for="ev-date-{i}" class="mb-1 block text-sm font-medium text-gray-700"
            >Tanggal *</label
          >
          <input
            id="ev-date-{i}"
            bind:value={event.date}
            type="date"
            class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition focus:border-gray-400 focus:bg-white focus:outline-none"
          />
        </div>
        <div>
          <label for="ev-start-{i}" class="mb-1 block text-sm font-medium text-gray-700"
            >Jam Mulai *</label
          >
          <input
            id="ev-start-{i}"
            bind:value={event.startTime}
            type="time"
            class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition focus:border-gray-400 focus:bg-white focus:outline-none"
          />
        </div>
        <div>
          <label for="ev-end-{i}" class="mb-1 block text-sm font-medium text-gray-700"
            >Jam Selesai</label
          >
          <input
            id="ev-end-{i}"
            bind:value={event.endTime}
            type="time"
            class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition focus:border-gray-400 focus:bg-white focus:outline-none"
          />
        </div>
        <div>
          <label for="ev-loc-{i}" class="mb-1 block text-sm font-medium text-gray-700"
            >Lokasi *</label
          >
          <input
            id="ev-loc-{i}"
            bind:value={event.location}
            type="text"
            placeholder="Nama & alamat venue"
            class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition focus:border-gray-400 focus:bg-white focus:outline-none"
          />
        </div>
        <div class="sm:col-span-2">
          <label for="ev-url-{i}" class="mb-1 block text-sm font-medium text-gray-700"
            >URL Google Maps (opsional)</label
          >
          <input
            id="ev-url-{i}"
            bind:value={event.locationUrl}
            type="text"
            placeholder="https://goo.gl/maps/…"
            class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition focus:border-gray-400 focus:bg-white focus:outline-none"
          />
        </div>
      </div>
      {#if hasImages}
        <div class="mt-3">
          <ImageUploader
            bind:images={event.imageUrls}
            folder="events"
            maxImages={maxImages ?? undefined}
            minImages={minImages ?? undefined}
            multipleImage={multipleImage ?? undefined}
            label="Foto Acara"
          />
        </div>
      {/if}
    </div>
  {/each}
</div>
