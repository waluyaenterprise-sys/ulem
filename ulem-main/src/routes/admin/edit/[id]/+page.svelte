<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import InvitationForm from '../../components/InvitationForm.svelte';
  import { authHeaders } from '$lib/auth';
  import { PUBLIC_API_URL } from '$env/static/public';

  let invitationId = $derived($page.params.id);
  let invitation = $state<Record<string, any> | null>(null);
  let loading = $state(true);
  let error = $state('');

  async function load() {
    loading = true;
    error = '';
    try {
      const res = await fetch(`${PUBLIC_API_URL}/invitations/detail/${invitationId}`, {
        headers: authHeaders()
      });
      if (!res.ok) throw new Error('Data undangan tidak ditemukan');
      invitation = await res.json();
    } catch (e: any) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  onMount(load);
</script>

<svelte:head><title>Edit Undangan — Admin</title></svelte:head>

<div class="mx-auto max-w-3xl">
  <div class="mb-6 flex items-center gap-3">
    <a
      href="/admin/list"
      class="flex h-8 w-8 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-gray-50"
      title="Kembali"
    >
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </a>
    <div>
      <h1 class="text-xl font-semibold text-gray-900">Edit Undangan</h1>
      {#if invitation}
        <p class="mt-0.5 text-sm text-gray-500">
          {[invitation.groom?.name, invitation.bride?.name].filter(Boolean).join(' & ')} ·
          <code class="font-mono text-xs">{invitation.slug}</code>
        </p>
      {/if}
    </div>
  </div>

  {#if loading}
    <div class="flex items-center justify-center py-20 text-gray-400">
      <svg class="mr-2 h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
      Memuat data…
    </div>
  {:else if error}
    <div class="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
      {error}
    </div>
  {:else if invitation}
    <InvitationForm invitationId={invitationId} initialData={invitation} />
  {/if}
</div>
