<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { PUBLIC_API_URL } from '$env/static/public';
  import { customerHeaders, customerLogout } from '$lib/customerAuth';

  let invitation = $state<any>(null);
  let error = $state('');
  let loading = $state(true);

  onMount(async () => {
    const response = await fetch(`${PUBLIC_API_URL}/customer/invitation`, { headers: customerHeaders() });
    if (!response.ok) { customerLogout(); await goto('/customer/login'); return; }
    invitation = await response.json();
    loading = false;
  });

  function logout() { customerLogout(); goto('/customer/login'); }
</script>

<svelte:head><title>Dashboard Customer — ulem</title></svelte:head>

<main class="min-h-screen bg-[#f5f1ea] p-5 sm:p-10">
  {#if loading}<p class="text-center text-stone-500">Memuat dashboard…</p>
  {:else if error}<p class="text-center text-red-600">{error}</p>
  {:else}
    <div class="mx-auto max-w-4xl">
      <div class="flex items-start justify-between gap-4"><div><p class="font-script text-4xl text-[#c9a84c]">ulem</p><h1 class="mt-4 text-3xl font-semibold text-stone-900">{invitation.bride.name} &amp; {invitation.groom.name}</h1><p class="mt-1 text-sm text-stone-500">Akses undangan Anda sudah aktif.</p></div><button onclick={logout} class="text-sm text-stone-500 underline">Keluar</button></div>
      <div class="mt-8 grid gap-5 sm:grid-cols-2">
        <a href={`/edit-wedding/${invitation.slug}?customer=true`} class="rounded-3xl bg-stone-900 p-7 text-white shadow-lg transition hover:-translate-y-1"><p class="text-xs tracking-[0.2em] text-stone-400 uppercase">Kelola undangan</p><h2 class="mt-3 text-xl font-semibold">Edit Undangan</h2><p class="mt-2 text-sm leading-relaxed text-stone-300">Perbarui data, foto, acara, dan konten undangan Anda.</p></a>
        <a href={`/blast?slug=${encodeURIComponent(invitation.slug)}&customer=true`} class="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm transition hover:-translate-y-1"><p class="text-xs tracking-[0.2em] text-[#c9a84c] uppercase">Sebarkan undangan</p><h2 class="mt-3 text-xl font-semibold text-stone-900">Blast Undangan</h2><p class="mt-2 text-sm leading-relaxed text-stone-500">Buat pesan dan tautan personal untuk tamu Anda.</p></a>
      </div>
      <a href={`/wedding/${invitation.slug}`} target="_blank" class="mt-6 inline-block text-sm font-medium text-stone-700 underline">Lihat undangan ↗</a>
    </div>
  {/if}
</main>
