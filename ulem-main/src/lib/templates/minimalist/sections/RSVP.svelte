<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { onMount } from 'svelte';
  import { fetchRsvps, submitRsvp, formatRsvpTime, type Rsvp } from '$lib/rsvp';

  export let invitation: any;

  // Form state
  let name = '';
  let presence: 'hadir' | 'mungkin' | 'tidak' | null = null;
  let ucapan = '';
  let submitted = false;
  let submitting = false;
  let error = '';

  let responses: Rsvp[] = [];

  const presenceLabel: Record<string, string> = {
    hadir: '✓ Hadir',
    mungkin: '~ Mungkin',
    tidak: '✕ Tidak Hadir'
  };

  const presenceColor: Record<string, string> = {
    hadir: 'text-emerald-600 bg-emerald-50',
    mungkin: 'text-amber-600 bg-amber-50',
    tidak: 'text-rose-500 bg-rose-50'
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
      setTimeout(() => (submitted = false), 3000);
    } catch (e: any) {
      error = e.message ?? 'Gagal mengirim konfirmasi.';
    } finally {
      submitting = false;
    }
  }

  // Scroll reveal
  let sectionEl: HTMLElement;
  let visible = false;
  onMount(() => {
    if (invitation?.slug) {
      fetchRsvps(invitation.slug).then((data) => {
        responses = data;
      });
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible = true;
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    );
    observer.observe(sectionEl);
    return () => observer.disconnect();
  });
</script>

<section bind:this={sectionEl} class="w-full bg-[#fafafa] px-6 py-16 lg:px-10 lg:py-24">
  {#if visible}
    <div class="mx-auto max-w-6xl">
      <!-- HEADER -->
      <div in:fly={{ y: -30, duration: 1100, easing: cubicOut }} class="mb-10 text-center">
        <p class="font-script text-4xl text-[#F0A269] lg:text-5xl">RSVP</p>
        <p class="mt-2 text-xs tracking-widest text-gray-400 uppercase">Konfirmasi Kehadiran</p>
        <div class="mx-auto mt-3 h-px w-12 bg-[#F0A269]/30"></div>
      </div>

      <div class="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-start">
        <!-- FORM CARD -->
        <div
          in:fly={{ y: 30, delay: 200, duration: 1100, easing: cubicOut }}
          class="rounded-3xl bg-white p-6 shadow-[0_2px_20px_rgba(0,0,0,0.06)] lg:p-8"
        >
          <!-- NAME -->
          <div class="mb-4">
            <label for="rsvp-name" class="mb-1.5 block text-xs tracking-wide text-gray-500"
              >Nama Lengkap</label
            >
            <input
              id="rsvp-name"
              type="text"
              bind:value={name}
              placeholder="Tulis nama Anda"
              class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm
                focus:border-[#F0A269] focus:ring-0 focus:outline-none"
            />
          </div>

          <!-- PRESENCE TOGGLE -->
          <div class="mb-6">
            <p class="mb-2 block text-xs tracking-wide text-gray-500">Kehadiran</p>
            <div class="grid grid-cols-3 gap-2">
              {#each ['hadir', 'mungkin', 'tidak'] as const as val}
                <button
                  type="button"
                  on:click={() => (presence = val)}
                  class="rounded-2xl border py-2.5 text-xs font-medium transition-all
                    {presence === val
                    ? val === 'hadir'
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                      : val === 'mungkin'
                        ? 'border-amber-300 bg-amber-50 text-amber-700'
                        : 'border-rose-300 bg-rose-50 text-rose-600'
                    : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100'}"
                >
                  {val === 'hadir' ? 'Hadir' : val === 'mungkin' ? 'Mungkin' : 'Tidak Hadir'}
                </button>
              {/each}
            </div>
          </div>

          <!-- UCAPAN -->
          <div class="mb-5">
            <label for="rsvp-ucapan" class="mb-1.5 block text-xs tracking-wide text-gray-500"
              >Ucapan &amp; Doa</label
            >
            <textarea
              id="rsvp-ucapan"
              bind:value={ucapan}
              rows="3"
              placeholder="Tuliskan doa &amp; ucapan terbaik Anda..."
              class="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm
                focus:border-[#F0A269] focus:ring-0 focus:outline-none"
            ></textarea>
          </div>

          <!-- ERROR -->
          {#if error}
            <p in:fade class="mb-3 text-xs text-rose-500">{error}</p>
          {/if}

          <!-- SUBMIT -->
          {#if submitted}
            <div
              in:fade
              class="rounded-2xl bg-emerald-50 py-3 text-center text-xs font-medium text-emerald-600"
            >
              Terima kasih, konfirmasi terkirim! 🎉
            </div>
          {:else}
            <button
              type="button"
              on:click={submit}
              class="w-full rounded-2xl bg-[#F0A269] py-3 text-xs font-medium tracking-widest text-white
                transition hover:bg-[#e8904f] active:scale-[0.98]"
            >
              KIRIM
            </button>
          {/if}
        </div>

        <!-- RESPONSES -->
        <div class="space-y-3 lg:pt-2" style="max-height: 400px; overflow-y: auto;">
          {#if responses.length > 0}
            <p
              class="mb-4 text-center text-xs tracking-widest text-gray-400 uppercase lg:text-left"
            >
              Konfirmasi Masuk
            </p>
            {#each responses as r (r.id)}
              <div
                in:fly={{ y: 16, duration: 400, easing: cubicOut }}
                class="flex items-start gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_1px_8px_rgba(0,0,0,0.05)]"
              >
                <!-- AVATAR -->
                <div
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-500"
                >
                  {r.name.charAt(0).toUpperCase()}
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center justify-between gap-2">
                    <p class="truncate text-sm font-medium text-gray-800">{r.name}</p>
                    <span
                      class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium {presenceColor[
                        r.presence
                      ]}"
                    >
                      {presenceLabel[r.presence]}
                    </span>
                  </div>
                  {#if r.message}
                    <p class="mt-1 text-xs leading-relaxed text-gray-500">{r.message}</p>
                  {/if}
                  <p class="mt-0.5 text-[10px] text-gray-400">{formatRsvpTime(r.createdAt)}</p>
                </div>
              </div>
            {/each}
          {/if}
        </div>
      </div>
    </div>
  {/if}
</section>
