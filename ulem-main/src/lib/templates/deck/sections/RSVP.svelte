<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchRsvps, submitRsvp, formatRsvpTime, type Rsvp } from '$lib/rsvp';

  export let invitation: any;

  let name = '';
  let presence: 'hadir' | 'mungkin' | 'tidak' | null = null;
  let ucapan = '';
  let submitted = false;
  let submitting = false;
  let error = '';
  let responses: Rsvp[] = [];

  const presenceOptions = [
    { value: 'hadir' as const, label: 'Hadir' },
    { value: 'mungkin' as const, label: 'Mungkin' },
    { value: 'tidak' as const, label: 'Tidak Hadir' }
  ];

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
      setTimeout(() => (submitted = false), 3500);
    } catch (e: any) {
      error = e.message ?? 'Gagal mengirim.';
    } finally {
      submitting = false;
    }
  }

  let el: HTMLElement;
  let visible = false;
  onMount(() => {
    if (invitation?.slug)
      fetchRsvps(invitation.slug).then((d) => {
        responses = d;
      });
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          visible = true;
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (el) obs.observe(el);
    return () => obs.disconnect();
  });

  const presenceColor: Record<string, string> = {
    hadir: '#5cde8c',
    mungkin: '#e8c96b',
    tidak: '#e87b7b'
  };
</script>

<section
  data-deck-page
  bind:this={el}
  class="deck-page deck-page-bg relative flex h-svh w-full flex-col items-center justify-center overflow-hidden px-6"
  style="scroll-snap-align: start;"
>
  {#if visible}
    <div
      style="width: 100%; max-width: 340px; overflow-y: auto; max-height: 90vh; scrollbar-width: none;"
    >
      <div class="mb-5" style="animation: deckIn 0.5s ease both;">
        <p class="deck-label mb-1">Konfirmasi</p>
        <h2 class="deck-title">RSVP</h2>
      </div>

      <div class="deck-card" style="animation: deckIn 0.6s ease both;">
        <div class="deck-body">
          {#if submitted}
            <div style="text-align: center; padding: 24px 0; animation: deckIn 0.4s ease both;">
              <div style="font-size: 1.8rem; margin-bottom: 8px;">✓</div>
              <p style="font-size: 13px; color: rgba(255,255,255,0.65);">
                Terima kasih atas konfirmasinya!
              </p>
            </div>
          {:else}
            <div class="space-y-4">
              <div>
                <label class="deck-label mb-1.5 block" for="deck-name">Nama</label>
                <input
                  id="deck-name"
                  bind:value={name}
                  placeholder="Nama lengkap Anda"
                  style="width: 100%; padding: 9px 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; color: rgba(255,255,255,0.8); font-size: 13px; outline: none;"
                />
              </div>

              <div>
                <p class="deck-label mb-1.5 block">Kehadiran</p>
                <div class="flex gap-2">
                  {#each presenceOptions as opt}
                    <button
                      on:click={() => (presence = opt.value)}
                      style="flex: 1; padding: 8px 4px; border-radius: 10px; font-size: 10px; font-weight: 600; cursor: pointer; transition: all 0.15s; border: 1px solid {presence ===
                      opt.value
                        ? 'rgba(255,255,255,0.2)'
                        : 'rgba(255,255,255,0.07)'}; background: {presence === opt.value
                        ? 'rgba(255,255,255,0.07)'
                        : 'transparent'}; color: {presence === opt.value
                        ? 'rgba(255,255,255,0.8)'
                        : 'rgba(255,255,255,0.3)'};"
                    >
                      {opt.label}
                    </button>
                  {/each}
                </div>
              </div>

              <div>
                <label class="deck-label mb-1.5 block" for="deck-ucapan"
                  >Ucapan <span style="opacity:0.5">(opsional)</span></label
                >
                <textarea
                  id="deck-ucapan"
                  bind:value={ucapan}
                  placeholder="Tulis ucapan & doa..."
                  rows="3"
                  style="width: 100%; padding: 9px 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; color: rgba(255,255,255,0.8); font-size: 13px; outline: none; resize: none;"
                ></textarea>
              </div>

              {#if error}<p style="font-size: 11px; color: #e87b7b;">{error}</p>{/if}

              <button
                on:click={submit}
                disabled={submitting}
                style="width: 100%; padding: 12px; background: rgba(255,255,255,0.9); color: #06060a; border: none; border-radius: 12px; font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; opacity: {submitting
                  ? 0.5
                  : 1};"
              >
                {submitting ? 'Mengirim...' : 'Kirim Konfirmasi'}
              </button>
            </div>
          {/if}
        </div>
      </div>

      {#if responses.length > 0}
        <div class="mt-4" style="animation: deckIn 0.6s ease 0.2s both;">
          <p class="deck-label mb-3">{responses.length} konfirmasi</p>
          <div class="space-y-2">
            {#each responses as r}
              <div
                style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 10px 12px;"
              >
                <div
                  style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;"
                >
                  <span style="font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.65);"
                    >{r.name}</span
                  >
                  <span
                    style="font-size: 10px; font-weight: 600; color: {presenceColor[r.presence] ||
                      'rgba(255,255,255,0.3)'};">{r.presence}</span
                  >
                </div>
                {#if r.message}<p class="deck-small">{r.message}</p>{/if}
                <p style="font-size: 9px; color: rgba(255,255,255,0.15); margin-top: 4px;">
                  {formatRsvpTime(r.createdAt)}
                </p>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</section>

