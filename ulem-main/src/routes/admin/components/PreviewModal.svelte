<script lang="ts">
  import { PUBLIC_API_URL } from '$env/static/public';
  import { fade } from 'svelte/transition';

  const API = PUBLIC_API_URL;

  let {
    open = $bindable(false),
    form,
    templateSlug
  }: {
    open: boolean;
    form: any;
    templateSlug: string;
  } = $props();

  let previewSlug = $state('');
  let loading = $state(false);
  let error = $state('');
  let iframeKey = $state(0);

  async function syncPreview() {
    if (!templateSlug) {
      error = 'Pilih template terlebih dahulu';
      return;
    }
    loading = true;
    error = '';

    const payload = {
      templateSlug,
      songUrl: form.songUrl || '',
      groom: {
        name: form.groom?.name || 'Groom',
        father: form.groom?.father || '',
        mother: form.groom?.mother || '',
        notes: form.groom?.notes || '',
        socialMedia: form.groom?.socialMedia || {},
        imageUrls: form.groom?.imageUrls?.filter(Boolean) ?? []
      },
      bride: {
        name: form.bride?.name || 'Bride',
        father: form.bride?.father || '',
        mother: form.bride?.mother || '',
        notes: form.bride?.notes || '',
        socialMedia: form.bride?.socialMedia || {},
        imageUrls: form.bride?.imageUrls?.filter(Boolean) ?? []
      },
      cover: { imageUrls: form.cover?.imageUrls?.filter(Boolean) ?? [] },
      quote: { text: form.quote?.text || '', source: form.quote?.source || '', imageUrls: form.quote?.imageUrls?.filter(Boolean) ?? [] },
      gallery: { imageUrls: form.gallery?.imageUrls?.filter(Boolean) ?? [] },
      events: (form.events || []).map((event: any) => ({
        ...event,
        // Preview uses the same storage format as the save action: date is
        // calendar-only and the editable clock values remain separate.
        date: event.date
          ? new Date(`${event.date.slice(0, 10)}T00:00:00.000Z`).toISOString()
          : event.date,
        startTime: event.startTime || event.date?.slice(11, 16) || '',
        endTime: event.endTime || undefined
      })),
      gifts: form.gifts || [],
      loveStories: form.loveStories || [],
      closing: { message: form.closing?.message || '', imageUrls: form.closing?.imageUrls?.filter(Boolean) ?? [] }
    };

    try {
      if (previewSlug) {
        const res = await fetch(`${API}/invitations/preview/${previewSlug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 404) {
            previewSlug = '';
            return syncPreview();
          }
          throw new Error(data.message ?? 'Gagal update preview');
        }
      } else {
        const res = await fetch(`${API}/invitations/preview`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message ?? 'Gagal membuat preview');
        previewSlug = data.slug;
      }
      iframeKey++;
    } catch (e: any) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  function refresh() {
    iframeKey++;
  }

  $effect(() => {
    if (open) {
      error = '';
      syncPreview();
    }
  });
</script>

{#if open}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    in:fade={{ duration: 200 }}
    role="dialog"
    aria-modal="true"
    aria-label="Preview Undangan"
    onclick={(e) => {
      if (e.target === e.currentTarget) open = false;
    }}
    onkeydown={(e) => {
      if (e.key === 'Escape') open = false;
    }}
  >
    <div
      class="flex h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      in:fade={{ duration: 200 }}
    >
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-gray-100 px-5 py-3">
        <p class="text-sm font-semibold text-gray-700">Live Preview</p>
        <button
          type="button"
          onclick={() => (open = false)}
          class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          aria-label="Tutup"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1">
        {#if loading}
          <div class="flex h-full items-center justify-center">
            <div class="text-center">
              <svg class="mx-auto h-8 w-8 animate-spin text-gray-300" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              <p class="mt-3 text-sm text-gray-400">Membuat preview…</p>
            </div>
          </div>
        {:else if error}
          <div class="flex h-full items-center justify-center px-6">
            <div class="text-center">
              <p class="text-sm text-red-500">{error}</p>
              <button type="button" onclick={syncPreview} class="mt-3 text-sm text-gray-500 underline hover:text-gray-700">Coba lagi</button>
            </div>
          </div>
        {:else if previewSlug}
          {#key iframeKey}
            <iframe
              src={`/wedding/${previewSlug}?preview=true`}
              class="h-full w-full border-none"
              title="Preview Undangan"
              sandbox="allow-scripts allow-same-origin"
            />
          {/key}
        {/if}
      </div>

      <!-- Footer -->
      {#if previewSlug}
        <div class="flex items-center gap-3 border-t border-gray-100 px-5 py-3">
          <button
            type="button"
            onclick={refresh}
            class="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
          >
            🔄 Refresh Preview
          </button>
          <button
            type="button"
            onclick={() => (open = false)}
            class="rounded-lg bg-gray-900 px-5 py-2 text-xs font-medium text-white transition hover:bg-gray-800"
          >
            Tutup
          </button>
        </div>
      {/if}
    </div>
  </div>
{/if}
