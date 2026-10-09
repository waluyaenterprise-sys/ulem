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
    hadir: 'text-[#6b8c6b] bg-[#eef3ee]',
    mungkin: 'text-[#9c8c4a] bg-[#f5f0dc]',
    tidak: 'text-[#9c5a5a] bg-[#f5eaea]'
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

<section bind:this={sectionEl} class="w-full bg-[#f5f0e8] px-6 py-16">
  {#if visible}
    <div class="mx-auto max-w-6xl">
      <!-- HEADER -->
      <div in:fade={{ duration: 700 }} class="mb-10 text-center">
        <p class="font-heading text-xl tracking-[0.3em] text-[#a89880] uppercase">
          Messages & Prayers
        </p>
        <div class="mx-auto mt-3 w-8 border-t border-[#c9b49a]"></div>
        <p class="mt-3 font-body text-xs text-[#9c8c7c]">Konfirmasi Kehadiran</p>
      </div>

      <div class="mt-8 flex flex-col gap-8">
        <!-- FORM CARD -->
        <div
          in:fly={{ y: 30, delay: 200, duration: 700, easing: cubicOut }}
          class="border border-[#e0d8cc] bg-[#f0ece4] p-6"
        >
          <!-- NAME -->
          <div class="mb-4">
            <label
              for="rsvp-name"
              class="mb-1.5 block font-heading text-[10px] tracking-[0.2em] text-[#a89880] uppercase"
              >Nama Lengkap</label
            >
            <input
              id="rsvp-name"
              type="text"
              bind:value={name}
              placeholder="Tulis nama Anda"
              class="w-full border border-[#d6ccc0] bg-white px-4 py-3 font-body text-sm text-[#3a3028]
                focus:border-[#c9b49a] focus:ring-0 focus:outline-none"
            />
          </div>

          <!-- PRESENCE TOGGLE -->
          <div class="mb-6">
            <p
              class="mb-2 block font-heading text-[10px] tracking-[0.2em] text-[#a89880] uppercase"
            >
              Kehadiran
            </p>
            <div class="grid grid-cols-3 gap-2">
              {#each ['hadir', 'mungkin', 'tidak'] as const as val}
                <button
                  type="button"
                  on:click={() => (presence = val)}
                  class="border py-2.5 font-body text-xs transition-all
                    {presence === val
                    ? val === 'hadir'
                      ? 'border-[#6b8c6b] bg-[#eef3ee] text-[#6b8c6b]'
                      : val === 'mungkin'
                        ? 'border-[#9c8c4a] bg-[#f5f0dc] text-[#9c8c4a]'
                        : 'border-[#9c5a5a] bg-[#f5eaea] text-[#9c5a5a]'
                    : 'border-[#d6ccc0] bg-white text-[#9c8c7c] hover:bg-[#f5f0e8]'}"
                >
                  {val === 'hadir' ? 'Hadir' : val === 'mungkin' ? 'Mungkin' : 'Tidak Hadir'}
                </button>
              {/each}
            </div>
          </div>

          <!-- UCAPAN -->
          <div class="mb-5">
            <label
              for="rsvp-ucapan"
              class="mb-1.5 block font-heading text-[10px] tracking-[0.2em] text-[#a89880] uppercase"
              >Ucapan &amp; Doa</label
            >
            <textarea
              id="rsvp-ucapan"
              bind:value={ucapan}
              rows="3"
              placeholder="Tuliskan doa &amp; ucapan terbaik Anda..."
              class="w-full resize-none border border-[#d6ccc0] bg-white px-4 py-3 font-body text-sm text-[#3a3028]
                focus:border-[#c9b49a] focus:ring-0 focus:outline-none"
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
              class="border border-[#c9b49a] bg-[#f5f0e8] py-3 text-center font-body text-xs text-[#7a6e62]"
            >
              Terima kasih, konfirmasi terkirim!
            </div>
          {:else}
            <button
              type="button"
              on:click={submit}
              class="w-full border border-[#c9b49a] bg-[#c9b49a] py-3 font-heading text-xs tracking-[0.25em] text-white
                uppercase transition hover:bg-[#b8a38a] active:scale-[0.98]"
            >
              Kirim
            </button>
          {/if}
        </div>

        <!-- RESPONSES -->
        <div class="space-y-3" style="max-height: 400px; overflow-y: auto;">
          {#if responses.length > 0}
            <p class="mb-4 font-heading text-[10px] tracking-[0.25em] text-[#a89880] uppercase">
              Konfirmasi Masuk
            </p>
            {#each responses as r (r.id)}
              <div
                in:fly={{ y: 16, duration: 400, easing: cubicOut }}
                class="flex items-start gap-3 border border-[#e0d8cc] bg-[#f0ece4] px-4 py-3"
              >
                <!-- AVATAR -->
                <div
                  class="flex h-8 w-8 shrink-0 items-center justify-center bg-[#c9b49a] font-heading text-xs text-white"
                >
                  {r.name.charAt(0).toUpperCase()}
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center justify-between gap-2">
                    <p class="truncate font-heading text-sm text-[#3a3028]">{r.name}</p>
                    <span
                      class="shrink-0 px-2 py-0.5 font-body text-[10px] {presenceColor[r.presence]}"
                    >
                      {presenceLabel[r.presence]}
                    </span>
                  </div>
                  {#if r.message}
                    <p class="mt-1 font-body text-xs leading-relaxed text-[#7a6e62]">{r.message}</p>
                  {/if}
                  <p class="mt-0.5 font-body text-[10px] text-[#b0a898]">
                    {formatRsvpTime(r.createdAt)}
                  </p>
                </div>
              </div>
            {/each}
          {/if}
        </div>
      </div>
    </div>
  {/if}
</section>
