<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { PUBLIC_API_URL } from '$env/static/public';

  const API = PUBLIC_API_URL;

  let slug = $state($page.url.searchParams.get('slug') ?? '');
  let recipientName = $state('');
  let shortNames = $state('');
  let baseUrl = $state('');
  let loading = $state(false);
  let error = $state('');
  interface InvData {
    slug: string;
    groom?: { name: string };
    bride?: { name: string };
  }

  let invitation: InvData | null = $state(null);

  let fetched = $state(false);

  async function fetchInvitation() {
    if (!slug.trim()) return;
    loading = true;
    error = '';
    invitation = null;
    fetched = false;
    try {
      const res = await fetch(`${API}/invitations/${slug.trim()}`);
      if (res.status === 404) throw new Error('Undangan tidak ditemukan');
      if (!res.ok) throw new Error('Gagal memuat undangan');
      const data = await res.json();
      invitation = data;
      const groomFirst = data.groom?.name?.split(' ')[0] ?? '';
      const brideFirst = data.bride?.name?.split(' ')[0] ?? '';
      shortNames = `${brideFirst} & ${groomFirst}`;
      if (typeof window !== 'undefined') baseUrl = window.location.origin;
      fetched = true;
    } catch (e: any) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  let invitationUrl = $derived(
    invitation != null && recipientName
      ? `${baseUrl.replace(/\/$/, '')}/wedding/${(invitation as InvData).slug}/?to=${encodeURIComponent(recipientName)}`
      : ''
  );

  function message() {
    if (!invitation || !recipientName) return '';
    const groom = invitation.groom?.name ?? '';
    const bride = invitation.bride?.name ?? '';
    const closing = shortNames || `${bride.split(' ')[0]} & ${groom.split(' ')[0]}`;
    return `Bismillahirrahmanirrahim

Assalamualaikum wr. wb.

Kepada Yth. Bapak/Ibu/Saudara/i
${recipientName}

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i, teman sekaligus sahabat, untuk menghadiri acara pernikahan kami :

${bride}
&
${groom}

Berikut link undangan kami, untuk informasi lengkapnya bisa kunjungi :

${invitationUrl}

Merupakan Suatu Kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu di acara pernikahan kami.

Jika berkenan mohon untuk mengisi ucapan dan konfirmasi kehadiran di form RSVP untuk berkenan hadir/tidak, serta datang pada jam yang telah ditentukan.

Atas perhatiannya kami ucapkan terima kasih.

Wassalamualaikum wr. wb.

Dari kami yang berbahagia,
${closing}`;
  }

  let copied = $state(false);
  let copiedUrl = $state(false);

  async function copyMessage() {
    await navigator.clipboard.writeText(message());
    copied = true;
    setTimeout(() => (copied = false), 2000);
  }

  async function copyUrl() {
    await navigator.clipboard.writeText(invitationUrl);
    copiedUrl = true;
    setTimeout(() => (copiedUrl = false), 2000);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') fetchInvitation();
  }

  onMount(() => {
    if (slug.trim()) fetchInvitation();
  });
</script>

<svelte:head>
  <title>Generate Pesan Undangan</title>
</svelte:head>

<main class="min-h-screen bg-[#0e0e0e] px-4 py-16 text-white">
  <div class="mx-auto max-w-lg">
    <!-- Header -->
    <div class="mb-10 text-center">
      <p class="mb-2 font-heading text-xs tracking-[0.4em] text-[#c9b49a] uppercase">
        Wedding Invitation
      </p>
      <h1 class="font-heading text-3xl font-semibold tracking-tight">Generate Pesan Undangan</h1>
      <p class="mx-auto mt-3 max-w-xs font-body text-sm leading-relaxed text-white/50">
        Masukkan slug undangan dan nama tamu untuk membuat pesan & link undangan.
      </p>
      <div class="mx-auto mt-5 w-10 border-t border-[#c9b49a]/40"></div>
    </div>

    <!-- Step 1: Slug -->
    <div class="mb-4 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
      <label
        for="slug-input"
        class="mb-2 block text-xs font-medium tracking-wide text-white/60 uppercase"
      >
        Slug Undangan
      </label>
      <div class="flex gap-2">
        <input
          id="slug-input"
          bind:value={slug}
          onkeydown={handleKeydown}
          type="text"
          placeholder="mis. caca-sasa-2"
          class="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 transition focus:border-[#c9b49a]/60 focus:bg-white/10 focus:outline-none"
        />
        <button
          onclick={fetchInvitation}
          disabled={loading || !slug.trim()}
          class="rounded-xl bg-[#c9b49a] px-4 py-2 text-sm font-medium text-[#0e0e0e] transition hover:bg-[#b8a088] disabled:opacity-40"
        >
          {loading ? '...' : 'Cari'}
        </button>
      </div>

      {#if error}
        <p class="mt-2 text-xs text-red-400">{error}</p>
      {/if}

      {#if fetched && invitation}
        <div class="mt-3 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
          <svg
            class="h-4 w-4 shrink-0 text-[#c9b49a]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span class="text-sm text-white/80">
            {invitation.bride?.name ?? '?'} &amp; {invitation.groom?.name ?? '?'}
          </span>
        </div>
      {/if}
    </div>

    <!-- Step 2: Recipient + extras (only after fetch) -->
    {#if fetched && invitation}
      <div class="mb-4 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
        <div class="grid gap-4">
          <div>
            <label
              for="recipient"
              class="mb-2 block text-xs font-medium tracking-wide text-white/60 uppercase"
            >
              Nama Penerima
            </label>
            <input
              id="recipient"
              bind:value={recipientName}
              type="text"
              placeholder="mis. Yuki Hana Lestari, A.Md.Kes"
              class="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 transition focus:border-[#c9b49a]/60 focus:bg-white/10 focus:outline-none"
            />
          </div>

          <div>
            <label
              for="short-names"
              class="mb-2 block text-xs font-medium tracking-wide text-white/60 uppercase"
            >
              Nama Singkat Pengantin
            </label>
            <input
              id="short-names"
              bind:value={shortNames}
              type="text"
              placeholder="mis. Caca & Sasa"
              class="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 transition focus:border-[#c9b49a]/60 focus:bg-white/10 focus:outline-none"
            />
            <p class="mt-1 text-xs text-white/30">
              Untuk bagian penutup pesan. Diisi otomatis dari nama depan.
            </p>
          </div>
        </div>
      </div>

      <!-- Output -->
      {#if recipientName}
        <!-- URL -->
        <div class="mb-4 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
          <div class="mb-2 flex items-center justify-between">
            <span class="text-xs font-medium tracking-wide text-white/60 uppercase"
              >Link Undangan</span
            >
            <button
              onclick={copyUrl}
              class="rounded-lg bg-white/10 px-3 py-1 text-xs font-medium text-white transition hover:bg-white/20"
            >
              {copiedUrl ? 'Tersalin ✓' : 'Salin Link'}
            </button>
          </div>
          <p class="text-sm break-all text-[#c9b49a] select-all">{invitationUrl}</p>
        </div>

        <!-- Message -->
        <div class="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
          <div class="mb-3 flex items-center justify-between">
            <span class="text-xs font-medium tracking-wide text-white/60 uppercase"
              >Pesan Undangan</span
            >
            <button
              onclick={copyMessage}
              class="rounded-lg bg-[#c9b49a] px-3 py-1 text-xs font-medium text-[#0e0e0e] transition hover:bg-[#b8a088]"
            >
              {copied ? 'Tersalin ✓' : 'Salin Pesan'}
            </button>
          </div>
          <pre
            class="font-body text-sm leading-relaxed whitespace-pre-wrap text-white/70">{message()}</pre>
        </div>
      {:else}
        <div class="rounded-2xl border border-dashed border-white/10 p-8 text-center">
          <p class="text-sm text-white/30">Isi nama penerima untuk melihat pesan.</p>
        </div>
      {/if}
    {/if}
  </div>
</main>
