<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { fetchRsvps, submitRsvp, formatRsvpTime, type Rsvp } from '$lib/rsvp';
  import Petals from './Petal.svelte';
  import FlowerIcon from './FlowerIcon.svelte';

  export let invitation: any;

  let name = '';
  let presence: 'hadir' | 'mungkin' | 'tidak' | null = null;
  let ucapan = '';
  let submitted = false;
  let submitting = false;
  let error = '';
  let responses: Rsvp[] = [];

  async function submit() {
    if (!name.trim()) {
      error = 'Nama tidak boleh kosong.';
      return;
    }
    if (!presence) {
      error = 'Pilih konfirmasi kehadiran.';
      return;
    }
    error = '';
    submitting = true;
    try {
      const rsvp = await submitRsvp(invitation.slug, {
        name: name.trim(),
        presence,
        message: ucapan.trim() || undefined
      });
      responses = [rsvp, ...responses];
      name = '';
      presence = null;
      ucapan = '';
      submitted = true;
      setTimeout(() => (submitted = false), 4000);
    } catch (e: any) {
      error = e.message ?? 'Gagal mengirim.';
    } finally {
      submitting = false;
    }
  }

  function reveal(node: HTMLElement, { delay = 0 } = {}) {
    node.style.opacity = '0';
    node.style.transform = 'translateY(20px)';
    node.style.transition = `opacity 0.9s ease ${delay}ms, transform 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}ms`;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          node.style.opacity = '1';
          node.style.transform = 'none';
          io.unobserve(node);
        }
      },
      { threshold: 0.1 }
    );
    io.observe(node);
    return { destroy: () => io.disconnect() };
  }

  onMount(() => {
    if (invitation?.slug) {
      fetchRsvps(invitation.slug).then((data) => {
        responses = data;
      });
    }
  });

  const presenceOpts = [
    { val: 'hadir', label: 'Hadir' },
    { val: 'mungkin', label: 'Mungkin' },
    { val: 'tidak', label: 'Tidak' }
  ] as const;

  const statusColor: Record<string, string> = {
    hadir: '#16a34a',
    mungkin: '#d97706',
    tidak: '#dc2626'
  };
  const statusLabel: Record<string, string> = {
    hadir: 'Hadir',
    mungkin: 'Mungkin',
    tidak: 'Tidak Hadir'
  };
</script>

<section class="relative w-full bg-gray-50 px-8 py-14">
  <!-- Decorative flowers -->
  <div class="pointer-events-none absolute top-4 left-4 z-10">
    <FlowerIcon size={36} opacity={0.3} color="#6b7280" />
  </div>
  <div class="pointer-events-none absolute right-4 bottom-4 z-10">
    <FlowerIcon size={28} opacity={0.25} color="#6b7280" />
  </div>

  <!-- Header -->
  <div use:reveal class="mb-10 text-center">
    <p class="font-body text-[9px] tracking-[0.45em] text-gray-400 uppercase">Konfirmasi</p>
    <div class="mt-2 flex items-center justify-center gap-3">
      <FlowerIcon size={18} opacity={0.35} color="#6b7280" />
      <p class="font-heading text-3xl font-light text-gray-900">RSVP</p>
      <FlowerIcon size={18} opacity={0.35} color="#6b7280" />
    </div>
  </div>

  <!-- Form -->
  <div use:reveal={{ delay: 80 }} class="mx-auto max-w-sm">
    <!-- Name -->
    <div class="mb-6 border-b border-gray-200 pb-1">
      <label class="block font-body text-[10px] tracking-[0.3em] text-gray-400 uppercase">
        Nama
      </label>
      <input
        type="text"
        bind:value={name}
        placeholder="Nama lengkap Anda"
        class="mt-2 w-full bg-transparent font-body text-sm text-gray-800 placeholder-gray-300 focus:outline-none"
      />
    </div>

    <!-- Presence -->
    <div class="mb-6">
      <p class="mb-3 font-body text-[10px] tracking-[0.3em] text-gray-400 uppercase">Kehadiran</p>
      <div class="flex gap-2">
        {#each presenceOpts as opt}
          <button
            type="button"
            class="flex-1 border py-2.5 font-body text-xs tracking-wider uppercase transition-all duration-200"
            class:selected={presence === opt.val}
            on:click={() => (presence = opt.val)}
          >
            {opt.label}
          </button>
        {/each}
      </div>
    </div>

    <!-- Message -->
    <div class="mb-8 border-b border-gray-200 pb-1">
      <label class="block font-body text-[10px] tracking-[0.3em] text-gray-400 uppercase">
        Ucapan &amp; Doa
      </label>
      <textarea
        bind:value={ucapan}
        rows="3"
        placeholder="Tuliskan ucapan terbaik Anda..."
        class="mt-2 w-full resize-none bg-transparent font-body text-sm text-gray-800 placeholder-gray-300 focus:outline-none"
      ></textarea>
    </div>

    {#if error}
      <p in:fade class="mb-4 font-body text-xs text-red-500">{error}</p>
    {/if}

    {#if submitted}
      <div in:fade class="mb-4 border border-green-100 bg-green-50 py-3 text-center">
        <p class="font-body text-xs text-green-600">Terima kasih, konfirmasi terkirim ✓</p>
      </div>
    {:else}
      <button
        type="button"
        disabled={submitting}
        on:click={submit}
        class="w-full bg-gray-900 py-3.5 font-body text-[11px] tracking-[0.3em] text-white uppercase transition-all hover:bg-gray-700 active:scale-[0.98] disabled:opacity-40"
      >
        {submitting ? 'Mengirim...' : 'Kirim Konfirmasi'}
      </button>
    {/if}
  </div>

  <!-- Responses -->
  {#if responses.length > 0}
    <div use:reveal={{ delay: 160 }} class="mx-auto mt-12 max-w-sm">
      <p class="mb-4 font-body text-[9px] tracking-[0.4em] text-gray-400 uppercase">
        Ucapan ({responses.length})
      </p>
      <div class="space-y-3" style="max-height: 400px; overflow-y: auto;">
        {#each responses.slice(0, 10) as r}
          <div class="border-l-2 border-gray-200 pl-4">
            <div class="flex items-baseline justify-between gap-2">
              <p class="font-body text-sm font-medium text-gray-800">{r.name}</p>
              <span
                class="font-body text-[10px]"
                style="color: {statusColor[r.presence] ?? '#9ca3af'};"
              >
                {statusLabel[r.presence] ?? r.presence}
              </span>
            </div>
            {#if r.message}
              <p class="mt-1 font-body text-xs leading-relaxed text-gray-400 italic">
                "{r.message}"
              </p>
            {/if}
            <p class="mt-1 font-body text-[10px] text-gray-300">{formatRsvpTime(r.createdAt)}</p>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</section>

<style>
  .selected {
    background: #111;
    color: white;
    border-color: #111;
  }
  button:not(.selected) {
    border-color: #e5e7eb;
    color: #9ca3af;
  }
</style>
