<script lang="ts">
  import { onMount } from 'svelte';
  import { authHeaders } from '$lib/auth';
  import { PUBLIC_API_URL } from '$env/static/public';

  const API = PUBLIC_API_URL;

  const CX = {
    card: 'mb-4 rounded-2xl bg-white p-6 shadow-sm',
    input:
      'w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition focus:border-gray-400 focus:bg-white focus:outline-none',
    select:
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

  const SECTIONS = [
    'groom',
    'bride',
    'cover',
    'quote',
    'gallery',
    'events',
    'gifts',
    'loveStory',
    'closing'
  ] as const;

  type Section = (typeof SECTIONS)[number];

  interface Template {
    id: string;
    name: string;
    slug: string;
  }

  interface TemplateRule {
    id: string;
    templateId: string;
    section: Section;
    hasImage: boolean;
    multipleImage: boolean;
    minImages: number | null;
    maxImages: number | null;
  }

  let templates = $state<Template[]>([]);
  let rules = $state<TemplateRule[]>([]);
  let selectedTemplateId = $state('');
  let loadingTemplates = $state(true);
  let loadingRules = $state(false);
  let error = $state('');

  let showForm = $state(false);
  let editingId = $state<string | null>(null);
  let form = $state({
    section: '' as Section | '',
    hasImage: false,
    multipleImage: false,
    minImages: '',
    maxImages: ''
  });
  let saving = $state(false);
  let formError = $state('');

  async function loadTemplates() {
    loadingTemplates = true;
    error = '';
    try {
      const res = await fetch(`${API}/templates`, { headers: authHeaders() });
      if (!res.ok) throw new Error('Failed to load templates');
      templates = await res.json();
      if (templates.length > 0 && !selectedTemplateId) {
        selectedTemplateId = templates[0].id;
        await loadRules();
      }
    } catch (e: any) {
      error = e.message;
    } finally {
      loadingTemplates = false;
    }
  }

  async function loadRules() {
    if (!selectedTemplateId) return;
    loadingRules = true;
    error = '';
    try {
      const res = await fetch(`${API}/template-rules?templateId=${selectedTemplateId}`, {
        headers: authHeaders()
      });
      if (!res.ok) throw new Error('Failed to load template rules');
      rules = await res.json();
    } catch (e: any) {
      error = e.message;
    } finally {
      loadingRules = false;
    }
  }

  async function onTemplateChange() {
    await loadRules();
  }

  function usedSections(): Section[] {
    return rules.filter((r) => r.id !== editingId).map((r) => r.section);
  }

  function availableSections(): Section[] {
    const used = usedSections();
    return SECTIONS.filter((s) => !used.includes(s));
  }

  function openCreate() {
    editingId = null;
    form = { section: '', hasImage: false, multipleImage: false, minImages: '', maxImages: '' };
    formError = '';
    showForm = true;
  }

  function openEdit(rule: TemplateRule) {
    editingId = rule.id;
    form = {
      section: rule.section,
      hasImage: rule.hasImage,
      multipleImage: rule.multipleImage,
      minImages: rule.minImages !== null ? String(rule.minImages) : '',
      maxImages: rule.maxImages !== null ? String(rule.maxImages) : ''
    };
    formError = '';
    showForm = true;
  }

  function closeForm() {
    showForm = false;
    editingId = null;
    formError = '';
  }

  async function save() {
    if (!form.section) {
      formError = 'Section is required.';
      return;
    }
    saving = true;
    formError = '';
    try {
      const payload = {
        templateId: selectedTemplateId,
        section: form.section,
        hasImage: form.hasImage,
        multipleImage: form.multipleImage,
        minImages: form.minImages !== '' ? Number(form.minImages) : null,
        maxImages: form.maxImages !== '' ? Number(form.maxImages) : null
      };

      let res: Response;
      if (editingId) {
        res = await fetch(`${API}/template-rules/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...authHeaders() },
          body: JSON.stringify({
            hasImage: payload.hasImage,
            multipleImage: payload.multipleImage,
            minImages: payload.minImages,
            maxImages: payload.maxImages
          })
        });
      } else {
        res = await fetch(`${API}/template-rules`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeaders() },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? 'Save failed');
      await loadRules();
      closeForm();
    } catch (e: any) {
      formError = e.message;
    } finally {
      saving = false;
    }
  }

  async function remove(id: string, section: string) {
    if (!confirm(`Hapus rule untuk section "${section}"?`)) return;
    try {
      const res = await fetch(`${API}/template-rules/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message);
      }
      await loadRules();
    } catch (e: any) {
      alert(e.message);
    }
  }

  onMount(loadTemplates);
</script>

<svelte:head><title>Template Rules — Admin</title></svelte:head>

<div class="mx-auto max-w-4xl">
  <!-- Header -->
  <div class="mb-6 flex items-center justify-between">
    <div>
      <h1 class="text-xl font-semibold text-gray-900">Template Rules</h1>
      <p class="mt-1 text-sm text-gray-500">Atur aturan section untuk setiap template.</p>
    </div>
    <button
      type="button"
      onclick={openCreate}
      disabled={!selectedTemplateId || availableSections().length === 0}
      class={CX.btn}
    >
      + Rule Baru
    </button>
  </div>

  <!-- Template selector -->
  <div class={CX.card}>
    <label for="template-select" class={CX.label}>Pilih Template</label>
    {#if loadingTemplates}
      <p class="text-sm text-gray-400">Memuat templates…</p>
    {:else}
      <select
        id="template-select"
        class={CX.select}
        bind:value={selectedTemplateId}
        onchange={onTemplateChange}
      >
        {#each templates as t}
          <option value={t.id}>{t.name} ({t.slug})</option>
        {/each}
      </select>
    {/if}
  </div>

  <!-- Error -->
  {#if error}
    <div class="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
  {/if}

  <!-- Table -->
  <div class={CX.card + ' overflow-hidden p-0!'}>
    {#if loadingRules}
      <p class="p-6 text-sm text-gray-400">Memuat rules…</p>
    {:else if !selectedTemplateId}
      <p class="p-6 text-sm text-gray-400">Pilih template untuk melihat rules.</p>
    {:else if rules.length === 0}
      <p class="p-6 text-sm text-gray-400">
        Belum ada rules. Klik <strong>+ Rule Baru</strong> untuk menambahkan.
      </p>
    {:else}
      <table class="w-full text-sm">
        <thead class="border-b border-gray-100 bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left font-medium text-gray-500">Section</th>
            <th class="px-6 py-3 text-center font-medium text-gray-500">Has Image</th>
            <th class="px-6 py-3 text-center font-medium text-gray-500">Multiple Image</th>
            <th class="px-6 py-3 text-center font-medium text-gray-500">Min</th>
            <th class="px-6 py-3 text-center font-medium text-gray-500">Max</th>
            <th class="px-6 py-3 text-right font-medium text-gray-500">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          {#each rules as rule}
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-3 font-medium text-gray-900">{rule.section}</td>
              <td class="px-6 py-3 text-center">
                {#if rule.hasImage}
                  <span class="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">Ya</span>
                {:else}
                  <span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">Tidak</span>
                {/if}
              </td>
              <td class="px-6 py-3 text-center">
                {#if rule.multipleImage}
                  <span class="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">Ya</span>
                {:else}
                  <span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">Tidak</span>
                {/if}
              </td>
              <td class="px-6 py-3 text-center text-gray-600">
                {rule.minImages !== null ? rule.minImages : '—'}
              </td>
              <td class="px-6 py-3 text-center text-gray-600">
                {rule.maxImages !== null ? rule.maxImages : '—'}
              </td>
              <td class="px-6 py-3 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button type="button" onclick={() => openEdit(rule)} class={CX.btnBlue}>Edit</button>
                  <button type="button" onclick={() => remove(rule.id, rule.section)} class={CX.btnRed}>Hapus</button>
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
  <button
    type="button"
    class="fixed inset-0 z-40 bg-black/30"
    aria-label="Tutup form"
    onclick={closeForm}
  ></button>

  <div class="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl">
    <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
      <h2 class="text-base font-semibold text-gray-900">
        {editingId ? 'Edit Rule' : 'Rule Baru'}
      </h2>
      <button type="button" onclick={closeForm} class="text-gray-400 hover:text-gray-600">✕</button>
    </div>

    <div class="flex-1 overflow-y-auto p-6">
      <div class="space-y-4">
        <!-- Section -->
        <div>
          <label for="rule-section" class={CX.label}>Section *</label>
          <select
            id="rule-section"
            bind:value={form.section}
            disabled={!!editingId}
            class={CX.select}
          >
            <option value="">— Pilih section —</option>
            {#if editingId}
              <option value={form.section}>{form.section}</option>
            {:else}
              {#each availableSections() as s}
                <option value={s}>{s}</option>
              {/each}
            {/if}
          </select>
          {#if editingId}
            <p class="mt-1 text-xs text-gray-400">Section tidak dapat diubah setelah dibuat.</p>
          {/if}
        </div>

        <!-- Has Image -->
        <div class="flex items-center gap-3">
          <input
            id="rule-hasImage"
            type="checkbox"
            bind:checked={form.hasImage}
            class="h-4 w-4 rounded border-gray-300 text-gray-900"
          />
          <label for="rule-hasImage" class="text-sm font-medium text-gray-700">Has Image</label>
        </div>

        <!-- Multiple Image -->
        <div class="flex items-center gap-3">
          <input
            id="rule-multipleImage"
            type="checkbox"
            bind:checked={form.multipleImage}
            disabled={!form.hasImage}
            class="h-4 w-4 rounded border-gray-300 text-gray-900 disabled:opacity-40"
          />
          <label
            for="rule-multipleImage"
            class="text-sm font-medium text-gray-700"
            class:opacity-40={!form.hasImage}
          >
            Multiple Image
          </label>
        </div>

        <!-- Min / Max Images -->
        {#if form.hasImage && form.multipleImage}
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="rule-minImages" class={CX.label}>Min Images</label>
              <input
                id="rule-minImages"
                type="number"
                min="0"
                bind:value={form.minImages}
                placeholder="Opsional"
                class={CX.input}
              />
            </div>
            <div>
              <label for="rule-maxImages" class={CX.label}>Max Images</label>
              <input
                id="rule-maxImages"
                type="number"
                min="0"
                bind:value={form.maxImages}
                placeholder="Opsional"
                class={CX.input}
              />
            </div>
          </div>
        {/if}
      </div>

      {#if formError}
        <div class="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{formError}</div>
      {/if}
    </div>

    <div class="flex gap-3 border-t border-gray-100 px-6 py-4">
      <button type="button" onclick={closeForm} class="{CX.btnGhost} flex-1">Batal</button>
      <button type="button" onclick={save} disabled={saving} class="{CX.btn} flex-1">
        {saving ? 'Menyimpan…' : editingId ? 'Simpan Perubahan' : 'Buat Rule'}
      </button>
    </div>
  </div>
{/if}
