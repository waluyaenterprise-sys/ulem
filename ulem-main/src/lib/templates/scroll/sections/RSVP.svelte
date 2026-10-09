<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { fetchRsvps, submitRsvp, formatRsvpTime, type Rsvp } from '$lib/rsvp';

  export let invitation: any;

  let name = '';
  let presence: 'hadir' | 'mungkin' | 'tidak' | null = null;
  let ucapan = '';
  let submitted = false;
  let submitting = false;
  let error = '';
  let responses: Rsvp[] = [];

  const presenceColors: Record<string, string> = {
    hadir: 'color: #15803d;',
    mungkin: 'color: #d97706;',
    tidak: 'color: #dc2626;'
  };

  const presenceLabels: Record<string, string> = {
    hadir: '✓ Hadir',
    mungkin: '~ Mungkin',
    tidak: '✕ Tidak Hadir'
  };

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
      error = e.message ?? 'Gagal mengirim konfirmasi.';
    } finally {
      submitting = false;
    }
  }

  function reveal(node: HTMLElement, { delay = 0 } = {}) {
    node.style.opacity = '0';
    node.style.transform = 'translateY(24px)';
    node.style.transition = `opacity 0.9s ease ${delay}ms, transform 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}ms`;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.style.opacity = '1';
          node.style.transform = 'translateY(0)';
          observer.unobserve(node);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    observer.observe(node);
    return { destroy: () => observer.disconnect() };
  }

  onMount(() => {
    if (invitation?.slug) {
      fetchRsvps(invitation.slug).then((data) => {
        responses = data;
      });
    }
  });
</script>

<section
  class="relative w-full overflow-hidden px-5 py-16"
  style="background: linear-gradient(160deg, #F4E8C1 0%, #EDD9A3 50%, #F0DFA8 100%);"
>
  <div
    class="pointer-events-none absolute inset-0 opacity-[0.035]"
    style="background-image: repeating-linear-gradient(0deg, transparent, transparent 27px, #8B4513 27px, #8B4513 28px);"
  ></div>
  <div
    class="pointer-events-none absolute inset-0"
    style="box-shadow: inset 0 0 60px rgba(139,69,19,0.15);"
  ></div>

  <div class="relative z-10 mx-auto max-w-sm">
    <!-- Header -->
    <div use:reveal class="mb-8 text-center">
      <p class="font-body text-[9px] tracking-[0.4em] text-amber-800/50 uppercase">Daftar Hadir</p>
      <p class="mt-1 font-script text-4xl text-amber-900">Konfirmasi Kehadiran</p>
      <div class="mx-auto mt-3 flex items-center justify-center gap-2">
        <div class="h-px w-10 bg-amber-700/40"></div>
        <div class="h-1 w-1 rotate-45 bg-amber-700/50"></div>
        <div class="h-px w-10 bg-amber-700/40"></div>
      </div>
      <p class="mt-3 font-body text-xs text-amber-900/50 italic">
        Mohon konfirmasi kehadiran Anda untuk membantu persiapan kami.
      </p>
    </div>

    <!-- Form card -->
    <div
      use:reveal={{ delay: 100 }}
      class="mb-6 overflow-hidden"
      style="
        background: rgba(255,255,255,0.45);
        border: 1px solid rgba(184,134,11,0.35);
        box-shadow: 4px 4px 0 rgba(139,105,20,0.25), 0 0 30px rgba(139,69,19,0.1);
      "
    >
      <!-- Form header stamp -->
      <div
        class="flex items-center gap-3 px-5 py-3"
        style="background: linear-gradient(135deg, rgba(201,162,39,0.2) 0%, rgba(139,105,20,0.12) 100%); border-bottom: 1px solid rgba(184,134,11,0.25);"
      >
        <svg viewBox="0 0 24 24" class="h-4 w-4 shrink-0 text-amber-700/70" fill="currentColor">
          <path
            d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"
          />
        </svg>
        <p class="font-body text-[10px] tracking-[0.3em] text-amber-800/70 uppercase">
          Formulir Kehadiran
        </p>
      </div>

      <div class="px-5 py-5">
        <!-- Name -->
        <div class="mb-4">
          <label
            class="mb-1.5 block font-body text-[10px] tracking-[0.25em] text-amber-800/60 uppercase"
          >
            Nama Tamu
          </label>
          <input
            type="text"
            bind:value={name}
            placeholder="Tulis nama Anda..."
            class="w-full border-b-2 bg-transparent px-0 py-2 font-body text-sm text-amber-900 placeholder-amber-700/30 focus:outline-none"
            style="border-color: rgba(184,134,11,0.4);"
          />
        </div>

        <!-- Presence -->
        <div class="mb-4">
          <p class="mb-2 block font-body text-[10px] tracking-[0.25em] text-amber-800/60 uppercase">
            Kehadiran
          </p>
          <div class="grid grid-cols-3 gap-2">
            {#each [['hadir', 'Hadir'], ['mungkin', 'Mungkin'], ['tidak', 'Tidak']] as [val, label]}
              <button
                type="button"
                on:click={() => (presence = val as any)}
                class="rounded-sm border py-2.5 font-body text-[11px] font-medium tracking-wider uppercase transition-all active:scale-95"
                style="
                  {presence === val
                  ? `background: rgba(201,162,39,0.2); border-color: #C9A227; color: #5C3A00;`
                  : `background: rgba(255,255,255,0.3); border-color: rgba(184,134,11,0.25); color: #8B6914;`}
                "
              >
                {label}
              </button>
            {/each}
          </div>
        </div>

        <!-- Message -->
        <div class="mb-5">
          <label
            class="mb-1.5 block font-body text-[10px] tracking-[0.25em] text-amber-800/60 uppercase"
          >
            Ucapan &amp; Doa
          </label>
          <textarea
            bind:value={ucapan}
            rows="3"
            placeholder="Tuliskan doa terbaik Anda..."
            class="w-full resize-none border-b-2 bg-transparent px-0 py-2 font-body text-sm text-amber-900 placeholder-amber-700/30 focus:outline-none"
            style="border-color: rgba(184,134,11,0.4);"
          ></textarea>
        </div>

        {#if error}
          <p in:fade class="mb-3 font-body text-xs text-red-700">{error}</p>
        {/if}

        {#if submitted}
          <div
            in:fade
            class="py-3 text-center font-body text-sm font-medium"
            style="color: #15803d; background: rgba(21,128,61,0.08); border: 1px solid rgba(21,128,61,0.2);"
          >
            Terima kasih, konfirmasi terkirim ✓
          </div>
        {:else}
          <button
            type="button"
            disabled={submitting}
            on:click={submit}
            class="w-full py-3 font-body text-[11px] font-semibold tracking-[0.3em] uppercase transition-all active:scale-[0.98] disabled:opacity-50"
            style="background: linear-gradient(135deg, #C9A227 0%, #8B6914 100%); color: #FBF3DC; box-shadow: 2px 2px 0 #5C3A00;"
          >
            {submitting ? 'Mengirim...' : 'Kirim Konfirmasi'}
          </button>
        {/if}
      </div>
    </div>

    <!-- Response list -->
    {#if responses.length > 0}
      <div use:reveal={{ delay: 200 }}>
        <p class="mb-3 font-body text-[9px] tracking-[0.35em] text-amber-800/50 uppercase">
          Daftar Hadir ({responses.length})
        </p>
        <div class="space-y-2" style="max-height: 400px; overflow-y: auto;">
          {#each responses.slice(0, 8) as r}
            <div
              class="flex items-start gap-3 px-4 py-3"
              style="background: rgba(255,255,255,0.35); border-left: 3px solid #C9A227;"
            >
              <div
                class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-sm font-heading text-xs font-bold text-white"
                style="background: linear-gradient(135deg, #C9A227 0%, #8B6914 100%);"
              >
                {r.name.charAt(0).toUpperCase()}
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between gap-2">
                  <p class="font-heading text-sm font-semibold text-amber-900">{r.name}</p>
                  <span class="shrink-0 font-body text-[10px]" style={presenceColors[r.presence]}>
                    {presenceLabels[r.presence] ?? r.presence}
                  </span>
                </div>
                {#if r.message}
                  <p class="mt-1 font-body text-xs leading-relaxed text-amber-900/60 italic">
                    "{r.message}"
                  </p>
                {/if}
                <p class="mt-1 font-body text-[10px] text-amber-700/40">
                  {formatRsvpTime(r.createdAt)}
                </p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</section>
