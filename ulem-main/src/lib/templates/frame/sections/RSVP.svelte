<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { fetchRsvps, submitRsvp, formatRsvpTime, type Rsvp } from '$lib/rsvp';

  export let invitation: any;

  // Background: second gallery photo, or cover
  const bgImages: string[] = [
    ...(invitation.gallery?.imageUrls || []).slice(1, 3),
    ...(invitation.cover?.imageUrls || [])
  ].filter(Boolean);
  const bg = bgImages[0] || '';

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

  function reveal(node: HTMLElement, { delay = 0, y = 20 } = {}) {
    node.style.opacity = '0';
    node.style.transform = `translateY(${y}px)`;
    node.style.transition = `opacity 1s ease ${delay}ms, transform 1s cubic-bezier(0.22,1,0.36,1) ${delay}ms`;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          node.style.opacity = '1';
          node.style.transform = 'none';
          io.unobserve(node);
        }
      },
      { threshold: 0.08 }
    );
    io.observe(node);
    return { destroy: () => io.disconnect() };
  }

  onMount(() => {
    if (invitation?.slug)
      fetchRsvps(invitation.slug).then((d) => {
        responses = d;
      });
  });

  const statusColor: Record<string, string> = {
    hadir: '#4ade80',
    mungkin: '#fbbf24',
    tidak: '#f87171'
  };
  const statusLabel: Record<string, string> = {
    hadir: 'Hadir',
    mungkin: 'Mungkin',
    tidak: 'Tidak'
  };
</script>

<section class="relative w-full overflow-hidden">
  <!-- Background -->
  {#if bg}
    <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('{bg}');"></div>
  {:else}
    <div class="absolute inset-0 bg-neutral-900"></div>
  {/if}
  <div class="pointer-events-none absolute inset-0" style="background: rgba(0,0,0,0.72);"></div>

  <div class="relative z-10 px-8 py-16 text-white">
    <!-- Header -->
    <div use:reveal class="mb-10 text-center">
      <p class="font-body text-[9px] tracking-[0.5em] text-white/35 uppercase">Konfirmasi</p>
      <p class="mt-2 font-heading text-3xl font-light text-white">RSVP</p>
    </div>

    <!-- Form -->
    <div use:reveal={{ delay: 80 }} class="mx-auto max-w-sm">
      <!-- Name -->
      <div class="mb-6 border-b border-white/15 pb-1">
        <label
          class="block font-body text-[10px] tracking-[0.35em] text-white/35 uppercase"
          for="name">Nama</label
        >
        <input
          id="name"
          type="text"
          bind:value={name}
          placeholder="Nama lengkap Anda"
          class="mt-2 w-full bg-transparent font-body text-sm text-white placeholder-white/20 focus:outline-none"
        />
      </div>

      <!-- Presence -->
      <div class="mb-6">
        <p class="mb-3 font-body text-[10px] tracking-[0.35em] text-white/35 uppercase">
          Kehadiran
        </p>
        <div class="flex gap-2">
          {#each [['hadir', 'Hadir'], ['mungkin', 'Mungkin'], ['tidak', 'Tidak']] as [val, label]}
            <button
              type="button"
              class="flex-1 border py-2.5 font-body text-xs tracking-wider uppercase transition-all duration-200"
              class:rsvp-selected={presence === val}
              class:rsvp-idle={presence !== val}
              on:click={() => (presence = val as any)}
            >
              {label}
            </button>
          {/each}
        </div>
      </div>

      <!-- Message -->
      <div class="mb-8 border-b border-white/15 pb-1">
        <label
          class="block font-body text-[10px] tracking-[0.35em] text-white/35 uppercase"
          for="message">Ucapan &amp; Doa</label
        >
        <textarea
          id="message"
          bind:value={ucapan}
          rows="3"
          placeholder="Tuliskan ucapan terbaik Anda..."
          class="mt-2 w-full resize-none bg-transparent font-body text-sm text-white placeholder-white/20 focus:outline-none"
        ></textarea>
      </div>

      {#if error}
        <p in:fade class="mb-4 font-body text-xs text-red-400">{error}</p>
      {/if}

      {#if submitted}
        <div in:fade class="mb-4 border border-green-500/30 bg-green-500/10 py-3 text-center">
          <p class="font-body text-xs text-green-400">Terima kasih, konfirmasi terkirim ✓</p>
        </div>
      {:else}
        <button
          type="button"
          disabled={submitting}
          on:click={submit}
          class="w-full border border-white/30 bg-white/10 py-3.5 font-body text-[11px] tracking-[0.3em] text-white uppercase backdrop-blur-sm transition-all hover:bg-white/20 active:scale-[0.98] disabled:opacity-40"
        >
          {submitting ? 'Mengirim...' : 'Kirim Konfirmasi'}
        </button>
      {/if}
    </div>

    <!-- Responses -->
    {#if responses.length > 0}
      <div use:reveal={{ delay: 160 }} class="mx-auto mt-12 max-w-sm">
        <p class="mb-4 font-body text-[9px] tracking-[0.4em] text-white/30 uppercase">
          Ucapan ({responses.length})
        </p>
        <div class="space-y-4" style="max-height: 400px; overflow-y: auto;">
          {#each responses.slice(0, 8) as r}
            <div class="border-l border-white/15 pl-4">
              <div class="flex items-baseline justify-between gap-2">
                <p class="font-body text-sm text-white/80">{r.name}</p>
                <span
                  class="font-body text-[10px]"
                  style="color: {statusColor[r.presence] ?? '#9ca3af'};"
                >
                  {statusLabel[r.presence] ?? r.presence}
                </span>
              </div>
              {#if r.message}
                <p class="mt-1 font-body text-xs leading-relaxed text-white/40 italic">
                  "{r.message}"
                </p>
              {/if}
              <p class="mt-1 font-body text-[10px] text-white/20">{formatRsvpTime(r.createdAt)}</p>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</section>

<style>
  .rsvp-selected {
    background: white;
    color: #111;
    border-color: white;
  }
  .rsvp-idle {
    background: rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.45);
    border-color: rgba(255, 255, 255, 0.15);
  }
</style>
