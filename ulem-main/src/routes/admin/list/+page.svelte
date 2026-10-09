<script lang="ts">
  import { onMount } from 'svelte';
  import { authHeaders } from '$lib/auth';
  import { PUBLIC_API_URL } from '$env/static/public';

  const API = PUBLIC_API_URL;

  interface Invitation {
    id: string;
    slug: string;
    templateSlug: string;
    songUrl: string | null;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
    groom?: { name: string };
    bride?: { name: string };
  }

  let invitations: Invitation[] = $state([]);
  let loading = $state(true);
  let error = $state('');
  let search = $state('');
  let deleting = $state<string | null>(null);
  let confirmDelete = $state<Invitation | null>(null);
  let generatingCode = $state<string | null>(null);

  async function load() {
    loading = true;
    error = '';
    try {
      const res = await fetch(`${API}/invitations`, { headers: authHeaders() });
      if (!res.ok) throw new Error('Gagal memuat data undangan');
      invitations = await res.json();
    } catch (e: any) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  async function deleteInvitation(id: string) {
    deleting = id;
    try {
      const res = await fetch(`${API}/invitations/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      if (!res.ok) throw new Error('Gagal menghapus data');
      invitations = invitations.filter((i) => i.id !== id);
    } catch (e: any) {
      alert(e.message);
    } finally {
      deleting = null;
      confirmDelete = null;
    }
  }

  let filtered = $derived(
    invitations.filter((inv) => {
      const q = search.toLowerCase();
      return (
        inv.slug.toLowerCase().includes(q) ||
        inv.templateSlug.toLowerCase().includes(q) ||
        inv.groom?.name?.toLowerCase().includes(q) ||
        inv.bride?.name?.toLowerCase().includes(q)
      );
    })
  );

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  let togglingPublish = $state<string | null>(null);

  async function togglePublish(inv: Invitation) {
    togglingPublish = inv.id;
    try {
      const res = await fetch(`${API}/invitations/${inv.id}/publish`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ isPublished: !inv.isPublished })
      });
      if (!res.ok) throw new Error('Gagal mengubah status');
      invitations = invitations.map((i) =>
        i.id === inv.id ? { ...i, isPublished: !inv.isPublished } : i
      );
    } catch (e: any) {
      alert(e.message);
    } finally {
      togglingPublish = null;
    }
  }

  async function generateCustomerCode(inv: Invitation) {
    if (!inv.isPublished) return alert('Aktifkan undangan setelah pembayaran terlebih dahulu.');
    generatingCode = inv.id;
    try {
      const res = await fetch(`${API}/invitations/${inv.id}/customer-access`, { method: 'POST', headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? 'Gagal membuat kode akses');
      await navigator.clipboard.writeText(data.accessCode);
      alert(`Kode akses customer: ${data.accessCode}\n\nKode sudah disalin. Kirim bersama link ${window.location.origin}/customer/login`);
    } catch (e: any) {
      alert(e.message);
    } finally {
      generatingCode = null;
    }
  }

  onMount(load);
</script>

<svelte:head>
  <title>List Pengantin — Admin</title>
</svelte:head>

<!-- Header row -->
<div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
  <div>
    <h1 class="text-xl font-semibold text-gray-900">Data Pengantin</h1>
    <p class="mt-0.5 text-sm text-gray-500">Daftar seluruh undangan yang telah dibuat</p>
  </div>
  <div class="flex gap-2 sm:ml-auto">
    <a
      href="/admin"
      class="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white
             transition hover:bg-slate-700"
    >
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Tambah Undangan
    </a>
  </div>
</div>

<!-- Search + stats -->
<div class="mb-4 flex flex-col gap-3 sm:flex-row">
  <div class="relative max-w-sm flex-1">
    <svg
      class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
    <input
      bind:value={search}
      placeholder="Cari nama, slug, template..."
      class="w-full rounded-xl border border-gray-200 bg-white py-2 pr-4 pl-9 text-sm
             transition focus:border-gray-400 focus:outline-none"
    />
  </div>
  <div class="flex items-center text-sm text-gray-500">
    <span class="font-medium text-gray-900">{filtered.length}</span>&nbsp;undangan ditemukan
  </div>
</div>

<!-- Content -->
{#if loading}
  <div class="flex items-center justify-center py-20 text-gray-400">
    <svg class="mr-2 h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
      ></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
    </svg>
    Memuat data...
  </div>
{:else if error}
  <div class="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
    {error}
    <button onclick={load} class="ml-2 underline">Coba lagi</button>
  </div>
{:else if filtered.length === 0}
  <div class="flex flex-col items-center justify-center py-20 text-gray-400">
    <svg class="mb-3 h-12 w-12 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
    <p class="text-sm">Belum ada data undangan</p>
  </div>
{:else}
  <!-- Table -->
  <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-100 bg-gray-50/70">
            <th
              class="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
              >Pengantin</th
            >
            <th
              class="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
              >Slug</th
            >
            <th
              class="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
              >Template</th
            >
            <th
              class="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
              >Dibuat</th
            >
            <th
              class="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
              >Status</th
            >
            <th
              class="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
              >Aksi</th
            >
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          {#each filtered as inv (inv.id)}
            <tr class="transition-colors hover:bg-gray-50/60">
              <!-- Names -->
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <div
                    class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-600"
                  >
                    {(inv.groom?.name?.[0] ?? inv.slug[0]).toUpperCase()}
                  </div>
                  <div>
                    {#if inv.groom?.name || inv.bride?.name}
                      <p class="font-medium text-gray-900">
                        {[inv.groom?.name, inv.bride?.name].filter(Boolean).join(' & ')}
                      </p>
                    {:else}
                      <p class="text-gray-400 italic">Tidak ada nama</p>
                    {/if}
                  </div>
                </div>
              </td>

              <!-- Slug -->
              <td class="px-4 py-3">
                <code class="rounded-lg bg-gray-100 px-2 py-1 text-xs text-gray-700"
                  >{inv.slug}</code
                >
              </td>

              <!-- Template -->
              <td class="px-4 py-3">
                <span
                  class="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-700 capitalize"
                >
                  {inv.templateSlug}
                </span>
              </td>

              <!-- Date -->
              <td class="px-4 py-3 text-xs whitespace-nowrap text-gray-500">
                {formatDate(inv.createdAt)}
              </td>

              <!-- Published -->
              <td class="px-4 py-3">
                <button
                  onclick={() => togglePublish(inv)}
                  disabled={togglingPublish === inv.id}
                  class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition disabled:opacity-50
                    {inv.isPublished
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}"
                >
                  <span class="h-1.5 w-1.5 rounded-full {inv.isPublished ? 'bg-green-500' : 'bg-gray-400'}"></span>
                  {togglingPublish === inv.id ? '…' : inv.isPublished ? 'Published' : 'Draft'}
                </button>
              </td>

              <!-- Actions -->
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <button
                    onclick={() => generateCustomerCode(inv)}
                    disabled={generatingCode === inv.id}
                    class="text-xs font-medium text-emerald-600 transition hover:text-emerald-800 disabled:opacity-50"
                    title="Buat kode akses customer"
                  >
                    {generatingCode === inv.id ? '...' : 'Kode akses'}
                  </button>
                  <span class="text-gray-200">|</span>
                  <a
                    href="/wedding/{inv.slug}"
                    target="_blank"
                    class="inline-flex items-center gap-1 text-xs font-medium text-blue-600 transition hover:text-blue-800"
                    title="Preview"
                  >
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Preview
                  </a>
                  <span class="text-gray-200">|</span>
                  <a
                    href="/admin/edit/{inv.id}"
                    class="inline-flex items-center gap-1 text-xs font-medium text-amber-600 transition hover:text-amber-800"
                    title="Edit"
                  >
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </a>
                  <span class="text-gray-200">|</span>
                  <button
                    onclick={() => (confirmDelete = inv)}
                    class="inline-flex items-center gap-1 text-xs font-medium text-red-500 transition hover:text-red-700"
                    title="Hapus"
                  >
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
{/if}

<!-- Delete Confirmation Modal -->
{#if confirmDelete}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
    <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
      <div class="mb-4 flex items-center gap-3">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
          <svg class="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div>
          <h3 class="font-semibold text-gray-900">Hapus Undangan</h3>
          <p class="mt-0.5 text-sm text-gray-500">Tindakan ini tidak bisa dibatalkan</p>
        </div>
      </div>
      <p class="mb-5 text-sm text-gray-600">
        Yakin ingin menghapus undangan
        <strong class="text-gray-900">{confirmDelete.slug}</strong>?
      </p>
      <div class="flex gap-3">
        <button
          onclick={() => (confirmDelete = null)}
          class="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Batal
        </button>
        <button
          onclick={() => confirmDelete && deleteInvitation(confirmDelete.id)}
          disabled={!!deleting}
          class="flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
        >
          {deleting ? 'Menghapus...' : 'Ya, Hapus'}
        </button>
      </div>
    </div>
  </div>
{/if}
