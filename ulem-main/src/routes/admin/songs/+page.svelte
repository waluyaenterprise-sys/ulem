<script lang="ts">
  import { onMount } from 'svelte';
  import { authHeaders } from '$lib/auth';
  import { uploadAudio } from '$lib/upload';
  import { PUBLIC_API_URL } from '$env/static/public';

  const CX = {
    card: 'mb-4 rounded-2xl bg-white p-6 shadow-sm',
    input:
      'w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition focus:border-gray-400 focus:bg-white focus:outline-none',
    label: 'mb-1 block text-sm font-medium text-gray-700',
    btn: 'rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:opacity-40',
    btnGhost:
      'rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50',
    btnRed:
      'rounded-xl border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50',
    btnBlue:
      'rounded-xl border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-50'
  };

  interface Song {
    id: string;
    title: string;
    url: string;
    createdAt: string;
  }

  let songs = $state<Song[]>([]);
  let loading = $state(true);
  let error = $state('');

  let showForm = $state(false);
  let editingId = $state<string | null>(null);
  let form = $state({ title: '', url: '' });
  let saving = $state(false);
  let formError = $state('');

  let uploading = $state(false);
  let uploadError = $state('');

  async function loadSongs() {
    loading = true;
    error = '';
    try {
      const res = await fetch(`${PUBLIC_API_URL}/songs`, { headers: authHeaders() });
      if (!res.ok) throw new Error('Failed to load songs');
      songs = await res.json();
    } catch (e: any) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  function openCreate() {
    editingId = null;
    form = { title: '', url: '' };
    formError = '';
    showForm = true;
  }

  function openEdit(song: Song) {
    editingId = song.id;
    form = { title: song.title, url: song.url };
    formError = '';
    showForm = true;
  }

  function closeForm() {
    showForm = false;
    editingId = null;
    form = { title: '', url: '' };
    formError = '';
  }

  async function handleFileUpload(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    uploading = true;
    uploadError = '';
    try {
      form.url = await uploadAudio(file, 'song');
      if (!form.title) {
        form.title = file.name.replace(/\.[^.]+$/, '');
      }
    } catch (err: any) {
      uploadError = err.message ?? 'Upload failed';
    } finally {
      uploading = false;
    }
  }

  async function handleSave() {
    if (!form.title.trim() || !form.url.trim()) {
      formError = 'Title and URL are required';
      return;
    }
    saving = true;
    formError = '';
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${PUBLIC_API_URL}/songs/${editingId}` : `${PUBLIC_API_URL}/songs`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ title: form.title.trim(), url: form.url.trim() })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? 'Failed to save');
      }
      await loadSongs();
      closeForm();
    } catch (e: any) {
      formError = e.message;
    } finally {
      saving = false;
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus lagu ini?')) return;
    try {
      const res = await fetch(`${PUBLIC_API_URL}/songs/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      if (!res.ok) throw new Error('Failed to delete');
      await loadSongs();
    } catch (e: any) {
      alert(e.message);
    }
  }

  onMount(loadSongs);
</script>

<svelte:head><title>Manajemen Lagu — Admin</title></svelte:head>

<div class="mx-auto max-w-3xl">
  <div class="mb-6 flex items-center justify-between">
    <div>
      <h1 class="text-xl font-semibold text-gray-900">Manajemen Lagu</h1>
      <p class="mt-1 text-sm text-gray-500">Upload dan kelola lagu untuk undangan.</p>
    </div>
    <button type="button" class={CX.btn} onclick={openCreate}>+ Tambah Lagu</button>
  </div>

  {#if showForm}
    <div class={CX.card}>
      <h2 class="mb-4 text-base font-semibold text-gray-800">
        {editingId ? 'Edit Lagu' : 'Tambah Lagu Baru'}
      </h2>

      <div class="space-y-4">
        <div>
          <label class={CX.label}>Upload File Audio</label>
          <label
            class="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-500 transition hover:border-gray-400 hover:bg-gray-50 {uploading
              ? 'pointer-events-none opacity-50'
              : ''}"
          >
            {#if uploading}
              <span class="animate-pulse">Uploading…</span>
            {:else}
              <span>Pilih file audio (mp3, ogg, wav, dll)</span>
            {/if}
            <input
              type="file"
              accept="audio/*"
              class="hidden"
              onchange={handleFileUpload}
              disabled={uploading}
            />
          </label>
          {#if uploadError}
            <p class="mt-1 text-xs text-red-500">{uploadError}</p>
          {/if}
          {#if form.url}
            <div class="mt-2 rounded-xl border border-gray-200 bg-gray-50 p-2">
              <!-- svelte-ignore a11y_media_has_caption -->
              <audio controls src={form.url} class="w-full"></audio>
              <p class="mt-1 truncate text-xs text-gray-400">{form.url}</p>
            </div>
          {/if}
        </div>

        <div>
          <label class={CX.label}>Judul Lagu *</label>
          <input bind:value={form.title} type="text" placeholder="Nama lagu" class={CX.input} />
        </div>

        <div>
          <label class={CX.label}>URL Lagu *</label>
          <input bind:value={form.url} type="text" placeholder="https://…" class={CX.input} />
          <p class="mt-1 text-xs text-gray-400">Terisi otomatis setelah upload file di atas.</p>
        </div>

        {#if formError}
          <p class="text-sm text-red-500">{formError}</p>
        {/if}

        <div class="flex gap-2">
          <button type="button" class={CX.btn} onclick={handleSave} disabled={saving}>
            {saving ? 'Menyimpan…' : 'Simpan'}
          </button>
          <button type="button" class={CX.btnGhost} onclick={closeForm}>Batal</button>
        </div>
      </div>
    </div>
  {/if}

  {#if loading}
    <p class="text-sm text-gray-400">Memuat lagu…</p>
  {:else if error}
    <p class="text-sm text-red-500">{error}</p>
  {:else if songs.length === 0}
    <div class={CX.card}>
      <p class="text-center text-sm text-gray-400">
        Belum ada lagu. Klik "Tambah Lagu" untuk mulai.
      </p>
    </div>
  {:else}
    <div class="space-y-3">
      {#each songs as song (song.id)}
        <div class="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-gray-900">{song.title}</p>
            <!-- svelte-ignore a11y_media_has_caption -->
            <audio controls src={song.url} class="mt-1 h-8 w-full max-w-xs"></audio>
            <p class="mt-1 truncate text-xs text-gray-400">{song.url}</p>
          </div>
          <div class="flex shrink-0 gap-2">
            <button type="button" class={CX.btnBlue} onclick={() => openEdit(song)}>Edit</button>
            <button type="button" class={CX.btnRed} onclick={() => handleDelete(song.id)}
              >Hapus</button
            >
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
