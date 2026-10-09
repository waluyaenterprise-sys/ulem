<script lang="ts">
  import { onMount } from 'svelte';
  import ImageUpload from '../components/ImageUpload.svelte';
  import { authHeaders } from '$lib/auth';
  import { PUBLIC_API_URL } from '$env/static/public';

  const API = PUBLIC_API_URL;

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

  interface Template {
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
    createdAt: string;
    updatedAt: string;
  }

  let templates: Template[] = [];
  let loading = true;
  let error = '';

  // ── Form state ────────────────────────────────────────────────────────────
  let showForm = false;
  let editingId: string | null = null;
  let form = { name: '', slug: '', imageUrl: '' };
  let saving = false;
  let formError = '';

  // ── Load all templates ─────────────────────────────────────────────────
  async function loadTemplates() {
    loading = true;
    error = '';
    try {
      const res = await fetch(`${API}/templates`, { headers: authHeaders() });
      if (!res.ok) throw new Error('Failed to load templates');
      templates = await res.json();
    } catch (e: any) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  // ── Open form ─────────────────────────────────────────────────────────
  function openCreate() {
    editingId = null;
    form = { name: '', slug: '', imageUrl: '' };
    formError = '';
    showForm = true;
  }

  function openEdit(t: Template) {
    editingId = t.id;
    form = { name: t.name, slug: t.slug, imageUrl: t.imageUrl ?? '' };
    formError = '';
    showForm = true;
  }

  function closeForm() {
    showForm = false;
    formError = '';
  }

  // ── Auto-slug from name ───────────────────────────────────────────────
  function onNameInput() {
    if (!editingId) {
      form.slug = form.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    }
  }

  // ── Save (create or update) ───────────────────────────────────────────
  async function save() {
    if (!form.name.trim() || !form.slug.trim()) {
      formError = 'Name and slug are required.';
      return;
    }
    saving = true;
    formError = '';
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API}/templates/${editingId}` : `${API}/templates`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          imageUrl: form.imageUrl || undefined
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? 'Save failed');
      await loadTemplates();
      closeForm();
    } catch (e: any) {
      formError = e.message;
    } finally {
      saving = false;
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────
  async function remove(id: string, name: string) {
    if (!confirm(`Delete template "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API}/templates/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message);
      }
      await loadTemplates();
    } catch (e: any) {
      alert(e.message);
    }
  }

  onMount(loadTemplates);
</script>

<svelte:head><title>Templates — Admin</title></svelte:head>

<div class="mx-auto max-w-4xl">
  <!-- Header -->
  <div class="mb-6 flex items-center justify-between">
    <div>
      <h1 class="text-xl font-semibold text-gray-900">Templates</h1>
      <p class="mt-1 text-sm text-gray-500">Kelola template undangan.</p>
    </div>
    <button type="button" on:click={openCreate} class={CX.btn}>+ Template Baru</button>
  </div>

  <!-- Error -->
  {#if error}
    <div class="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
  {/if}

  <!-- Table -->
  <div class={CX.card + ' overflow-hidden p-0!'}>
    {#if loading}
      <p class="p-6 text-sm text-gray-400">Loading…</p>
    {:else if templates.length === 0}
      <p class="p-6 text-sm text-gray-400">
        No templates yet. Click <strong>+ New Template</strong> to add one.
      </p>
    {:else}
      <table class="w-full text-sm">
        <thead class="border-b border-gray-100 bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left font-medium text-gray-500">Preview</th>
            <th class="px-6 py-3 text-left font-medium text-gray-500">Name</th>
            <th class="px-6 py-3 text-left font-medium text-gray-500">Slug</th>
            <th class="px-6 py-3 text-left font-medium text-gray-500">Demo</th>
            <th class="px-6 py-3 text-right font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          {#each templates as t}
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-3">
                {#if t.imageUrl}
                  <img
                    src={t.imageUrl}
                    alt={t.name}
                    class="h-14 w-14 rounded-xl border object-cover"
                  />
                {:else}
                  <div
                    class="flex h-14 w-14 items-center justify-center rounded-xl border border-dashed border-gray-300 text-xs text-gray-400"
                  >
                    No img
                  </div>
                {/if}
              </td>
              <td class="px-6 py-3 font-medium text-gray-900">{t.name}</td>
              <td class="px-6 py-3 font-mono text-gray-500">{t.slug}</td>
              <td class="px-6 py-3">
                <a
                  href="/wedding/demo-{t.slug}"
                  target="_blank"
                  class="text-blue-600 hover:underline">demo-{t.slug} ↗</a
                >
              </td>
              <td class="px-6 py-3 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button type="button" on:click={() => openEdit(t)} class={CX.btnBlue}>Edit</button
                  >
                  <button type="button" on:click={() => remove(t.id, t.name)} class={CX.btnRed}
                    >Delete</button
                  >
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</div>

<!-- ── Slide-over form ─────────────────────────────────────────────────── -->
{#if showForm}
  <!-- Backdrop -->
  <button
    type="button"
    class="fixed inset-0 z-40 bg-black/30"
    aria-label="Close form"
    on:click={closeForm}
  ></button>

  <!-- Panel -->
  <div class="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl">
    <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
      <h2 class="text-base font-semibold text-gray-900">
        {editingId ? 'Edit Template' : 'New Template'}
      </h2>
      <button type="button" on:click={closeForm} class="text-gray-400 hover:text-gray-600">✕</button
      >
    </div>

    <div class="flex-1 overflow-y-auto p-6">
      <div class="space-y-4">
        <div>
          <label for="t-name" class={CX.label}>Name *</label>
          <input
            id="t-name"
            bind:value={form.name}
            on:input={onNameInput}
            type="text"
            placeholder="e.g. Lumiere"
            class={CX.input}
          />
        </div>
        <div>
          <label for="t-slug" class={CX.label}>Slug *</label>
          <input
            id="t-slug"
            bind:value={form.slug}
            type="text"
            placeholder="e.g. lumiere"
            class={CX.input}
          />
          <p class="mt-1 text-xs text-gray-400">Used in URL: /wedding/demo-{form.slug || '…'}</p>
        </div>
        <div>
          <p class={CX.label}>Preview Image</p>
          <ImageUpload folder="templates" bind:value={form.imageUrl} />
        </div>
      </div>

      {#if formError}
        <div class="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{formError}</div>
      {/if}
    </div>

    <div class="flex gap-3 border-t border-gray-100 px-6 py-4">
      <button type="button" on:click={closeForm} class="{CX.btnGhost} flex-1">Cancel</button>
      <button type="button" on:click={save} disabled={saving} class="{CX.btn} flex-1">
        {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Create Template'}
      </button>
    </div>
  </div>
{/if}
