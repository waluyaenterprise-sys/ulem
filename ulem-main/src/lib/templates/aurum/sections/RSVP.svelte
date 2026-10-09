<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
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
    { val: 'hadir' as const, label: 'Hadir' },
    { val: 'mungkin' as const, label: 'Mungkin' },
    { val: 'tidak' as const, label: 'Tidak Hadir' }
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
      setTimeout(() => (submitted = false), 3000);
    } catch (e: any) {
      error = e.message ?? 'Gagal mengirim konfirmasi.';
    } finally {
      submitting = false;
    }
  }

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
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    observer.observe(sectionEl);
    return () => observer.disconnect();
  });
</script>

<section bind:this={sectionEl} class="w-full px-5 py-20" style="background:#040404;">
  {#if visible}
    <!-- Header -->
    <div in:fade={{ duration: 700 }} class="mb-12 text-center">
      <p
        class="text-[9px] tracking-[0.45em] uppercase"
        style="color:#c9a84c;font-family:var(--font-heading,sans-serif);"
      >
        Messages &amp; Prayers
      </p>
      <div style="width:40px;height:1px;background:#c9a84c;margin:12px auto 0;opacity:0.6;"></div>
      <p
        class="mt-3 text-xs"
        style="color:rgba(255,255,255,0.3);font-family:var(--font-body,sans-serif);"
      >
        Konfirmasi Kehadiran
      </p>
    </div>

    <!-- FORM — floating-label style -->
    <div in:fly={{ y: 30, delay: 200, duration: 700, easing: cubicOut }} class="mx-auto max-w-sm">
      <!-- Name field -->
      <div class="input-field mb-8">
        <input id="aur-name" type="text" bind:value={name} placeholder=" " class="peer" />
        <label for="aur-name">Nama Lengkap</label>
        <div class="underline-bar"></div>
      </div>

      <!-- Presence buttons -->
      <div class="mb-8">
        <p
          class="mb-3 text-[9px] tracking-[0.3em] uppercase"
          style="color:rgba(201,168,76,0.6);font-family:var(--font-heading,sans-serif);"
        >
          Kehadiran
        </p>
        <div class="flex gap-2">
          {#each presenceOptions as opt}
            <button
              type="button"
              on:click={() => (presence = opt.val)}
              class="flex-1 py-3 text-[10px] tracking-widest uppercase font-bold transition-all duration-300 active:scale-95"
              style="
                font-family:var(--font-heading,sans-serif);
                border: 2px solid {presence === opt.val ? '#c9a84c' : 'rgba(201,168,76,0.2)'};
                color: {presence === opt.val ? '#c9a84c' : 'rgba(255,255,255,0.3)'};
                background: {presence === opt.val ? 'rgba(201,168,76,0.08)' : 'transparent'};
              ">{opt.label}</button
            >
          {/each}
        </div>
      </div>

      <!-- Ucapan -->
      <div class="input-field mb-8">
        <textarea
          id="aur-ucapan"
          bind:value={ucapan}
          rows="3"
          placeholder=" "
          class="peer resize-none"
        ></textarea>
        <label for="aur-ucapan">Ucapan &amp; Doa</label>
        <div class="underline-bar"></div>
      </div>

      {#if error}
        <p in:fade class="mb-4 text-xs" style="color:rgba(220,80,80,0.8);">{error}</p>
      {/if}

      {#if submitted}
        <div
          in:fade
          class="border py-4 text-center text-xs"
          style="border-color:rgba(201,168,76,0.3);color:rgba(201,168,76,0.7);font-family:var(--font-body,sans-serif);"
        >
          Terima kasih, konfirmasi terkirim.
        </div>
      {:else}
        <button
          type="button"
          on:click={submit}
          class="w-full border py-4 text-[10px] tracking-[0.35em] uppercase transition hover:bg-[#c9a84c] hover:text-black active:scale-[0.98] disabled:opacity-50"
          disabled={submitting}
          style="
            font-family:var(--font-heading,sans-serif);
            border-color:#c9a84c;
            color:#c9a84c;
          ">{submitting ? 'Mengirim...' : 'Kirim'}</button
        >
      {/if}
    </div>

    <!-- Responses -->
    {#if responses.length > 0}
      <div class="mx-auto mt-14 max-w-sm">
        <p
          class="mb-5 text-[9px] tracking-[0.35em] uppercase"
          style="color:rgba(201,168,76,0.5);font-family:var(--font-heading,sans-serif);"
        >
          Konfirmasi Masuk
        </p>

        <div class="space-y-0" style="max-height: 400px; overflow-y: auto;">
          {#each responses as r (r.id)}
            <div
              in:fly={{ y: 16, duration: 400, easing: cubicOut }}
              class="flex items-start gap-4 border-b py-5"
              style="border-color:rgba(201,168,76,0.12);"
            >
              <!-- Initial circle -->
              <div
                class="flex h-8 w-8 shrink-0 items-center justify-center border text-xs font-semibold"
                style="border-color:rgba(201,168,76,0.4);color:#c9a84c;font-family:var(--font-heading,sans-serif);"
              >
                {r.name[0].toUpperCase()}
              </div>

              <div class="min-w-0 flex-1">
                <div class="mb-1 flex items-baseline gap-2">
                  <p
                    class="truncate text-sm font-medium"
                    style="color:rgba(255,255,255,0.85);font-family:var(--font-heading,sans-serif);"
                  >
                    {r.name}
                  </p>
                  <span
                    class="shrink-0 text-[9px] tracking-widest uppercase"
                    style="color:{r.presence === 'hadir'
                      ? 'rgba(100,200,100,0.7)'
                      : r.presence === 'mungkin'
                        ? 'rgba(201,168,76,0.7)'
                        : 'rgba(200,80,80,0.7)'};font-family:var(--font-body,sans-serif);"
                    >{r.presence}</span
                  >
                </div>
                {#if r.message}
                  <p
                    class="text-xs leading-relaxed"
                    style="color:rgba(255,255,255,0.4);font-family:var(--font-body,sans-serif);"
                  >
                    {r.message}
                  </p>
                {/if}
                <p
                  class="mt-1.5 text-[9px]"
                  style="color:rgba(201,168,76,0.35);font-family:var(--font-body,sans-serif);"
                >
                  {formatRsvpTime(r.createdAt)}
                </p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  {/if}
</section>

<style>
  .input-field {
    position: relative;
  }

  .input-field input,
  .input-field textarea {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    padding: 20px 0 8px;
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.85);
    font-family: var(--font-body, sans-serif);
  }

  .input-field label {
    position: absolute;
    left: 0;
    top: 20px;
    font-size: 0.75rem;
    color: rgba(201, 168, 76, 0.5);
    font-family: var(--font-heading, sans-serif);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    pointer-events: none;
    transition:
      top 0.25s,
      font-size 0.25s,
      color 0.25s;
  }

  /* When input has value OR is focused, float label up */
  .input-field input:not(:placeholder-shown) ~ label,
  .input-field textarea:not(:placeholder-shown) ~ label,
  .input-field input:focus ~ label,
  .input-field textarea:focus ~ label {
    top: 2px;
    font-size: 0.6rem;
    color: rgba(201, 168, 76, 0.8);
  }

  .underline-bar {
    height: 1px;
    background: rgba(201, 168, 76, 0.25);
    position: relative;
  }

  .underline-bar::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 1px;
    background: #c9a84c;
    transition: width 0.3s ease;
  }

  .input-field:focus-within .underline-bar::after {
    width: 100%;
  }
</style>
