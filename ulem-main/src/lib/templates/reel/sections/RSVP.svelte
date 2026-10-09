<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { fetchRsvps, submitRsvp, formatRsvpTime, type Rsvp } from '$lib/rsvp';

  export let invitation: any;

  let name = '';
  let presence: 'hadir' | 'mungkin' | 'tidak' | null = null;
  let ucapan = '';
  let submitted = false;
  let submitting = false;
  let error = '';
  let responses: Rsvp[] = [];

  const presenceOptions: { value: 'hadir' | 'mungkin' | 'tidak'; label: string }[] = [
    { value: 'hadir', label: 'Hadir' },
    { value: 'mungkin', label: 'Mungkin' },
    { value: 'tidak', label: 'Tidak Hadir' }
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

  let el: HTMLElement;
  let visible = false;
  onMount(() => {
    if (invitation?.slug) {
      fetchRsvps(invitation.slug).then((data) => {
        responses = data;
      });
    }
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          visible = true;
          obs.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    if (el) obs.observe(el);
    return () => obs.disconnect();
  });

  function s(delayMs: number) {
    return `animation: rsvpFadeIn 0.7s ease ${delayMs}ms both;`;
  }

  const presenceColor: Record<string, string> = {
    hadir: '#c9933a',
    mungkin: '#7a6848',
    tidak: '#5a4e38'
  };
</script>

<section
  bind:this={el}
  class="relative w-full overflow-hidden px-6 py-24"
  style="background:#faf0dc;"
>
  <!-- Film grain -->
  <div
    class="film-grain pointer-events-none absolute inset-0"
    style="opacity:0.18"
    aria-hidden="true"
  ></div>

  {#if visible}
    <!-- Scene header -->
    <div style={s(0)} class="mb-10 text-center">
      <p
        class="text-xs tracking-[0.6em] uppercase"
        style="color:#7a6848;font-family:var(--font-heading,sans-serif);"
      >
        Scene VII
      </p>
      <p
        class="mt-1 text-xl font-bold"
        style="color:#1a1008;font-family:var(--font-heading,sans-serif);letter-spacing:-0.01em;"
      >
        Reserve Your Seat
      </p>
      <p class="mt-1 text-xs" style="color:#7a6848;font-family:var(--font-body,sans-serif);">
        Konfirmasi Kehadiran
      </p>
      <div class="mx-auto mt-3" style="width:40px;height:1px;background:#c9933a;opacity:0.6;"></div>
    </div>

    <!-- RSVP Form — ticket stub style -->
    <div style={s(200)} class="mx-auto max-w-sm">
      <div style="background:#1a1008;border:1px solid rgba(201,147,58,0.25);">
        <!-- Top stripe -->
        <div style="height:3px;background:linear-gradient(to right,#c9933a,#e8c07a,#c9933a);"></div>

        <div class="p-6">
          <!-- Ticket heading -->
          <p
            class="mb-5 text-center text-xs tracking-[0.5em] uppercase"
            style="color:#5a4e38;font-family:var(--font-heading,sans-serif);"
          >
            — Tiket Kehadiran —
          </p>

          <!-- Name -->
          <div class="mb-4">
            <label
              class="mb-1 block text-xs tracking-widest uppercase"
              style="color:#7a6848;font-family:var(--font-heading,sans-serif);"
              for="reel-name">Nama</label
            >
            <input
              id="reel-name"
              type="text"
              bind:value={name}
              placeholder="Nama lengkap"
              class="w-full px-3 py-2 text-sm outline-none"
              style="background:#0d0905;border:1px solid rgba(201,147,58,0.2);color:#c9a96e;font-family:var(--font-body,sans-serif);"
            />
          </div>

          <!-- Presence -->
          <div class="mb-4">
            <p
              class="mb-2 text-xs tracking-widest uppercase"
              style="color:#7a6848;font-family:var(--font-heading,sans-serif);"
            >
              Kehadiran
            </p>
            <div class="flex gap-2">
              {#each presenceOptions as opt}
                <button
                  onclick={() => (presence = opt.value)}
                  class="flex-1 py-2 text-xs tracking-wider uppercase transition-all duration-200"
                  style="font-family:var(--font-heading,sans-serif);border:1px solid rgba(201,147,58,{presence ===
                  opt.value
                    ? '0.8'
                    : '0.2'});background:{presence === opt.value
                    ? 'rgba(201,147,58,0.15)'
                    : 'transparent'};color:{presence === opt.value ? '#c9933a' : '#5a4e38'};"
                  >{opt.label}</button
                >
              {/each}
            </div>
          </div>

          <!-- Message -->
          <div class="mb-5">
            <label
              class="mb-1 block text-xs tracking-widest uppercase"
              style="color:#7a6848;font-family:var(--font-heading,sans-serif);"
              for="reel-ucapan">Ucapan &amp; Doa</label
            >
            <textarea
              id="reel-ucapan"
              bind:value={ucapan}
              rows="3"
              placeholder="Tuliskan doa terbaik Anda..."
              class="w-full resize-none px-3 py-2 text-sm outline-none"
              style="background:#0d0905;border:1px solid rgba(201,147,58,0.2);color:#c9a96e;font-family:var(--font-body,sans-serif);"
            ></textarea>
          </div>

          {#if error}
            <p class="mb-3 text-xs" style="color:#c9933a;font-family:var(--font-body,sans-serif);">
              {error}
            </p>
          {/if}

          {#if submitted}
            <p
              class="mb-3 text-center text-xs tracking-widest uppercase"
              style="color:#c9933a;font-family:var(--font-heading,sans-serif);"
            >
              ✓ Konfirmasi Terkirim
            </p>
          {/if}

          <!-- Submit button -->
          <button
            onclick={submit}
            disabled={submitting}
            class="w-full py-3 text-xs tracking-[0.5em] uppercase transition-all duration-300"
            style="background:{submitting ? 'rgba(201,147,58,0.3)' : '#c9933a'};color:{submitting
              ? '#7a6848'
              : '#0d0905'};font-family:var(--font-heading,sans-serif);border:none;"
            >{submitting ? 'Mengirim...' : 'Konfirmasi'}</button
          >
        </div>

        <!-- Dashed stub divider -->
        <div class="mx-6" style="border-top:1px dashed rgba(201,147,58,0.15);"></div>

        <!-- Stub — count -->
        <div class="flex items-center justify-center gap-2 py-3">
          <span class="text-xs" style="color:#3d3020;font-family:var(--font-heading,sans-serif);">
            {responses.length} tamu telah konfirmasi
          </span>
        </div>
      </div>
    </div>

    <!-- Responses -->
    {#if responses.length > 0}
      <div style="{s(400)}; max-height: 400px; overflow-y: auto;" class="mx-auto mt-8 max-w-sm space-y-3">
        {#each responses as rsvp}
          <div
            in:fly={{ y: 10, duration: 300, easing: cubicOut }}
            class="px-4 py-3"
            style="background:#120c06;border-left:2px solid {presenceColor[rsvp.presence] ??
              '#5a4e38'};"
          >
            <div class="flex items-center justify-between">
              <p
                class="text-sm font-bold"
                style="color:#c9a96e;font-family:var(--font-heading,sans-serif);"
              >
                {rsvp.name}
              </p>
              <span
                class="px-2 py-0.5 text-xs tracking-wider uppercase"
                style="color:{presenceColor[rsvp.presence] ??
                  '#5a4e38'};border:1px solid {presenceColor[rsvp.presence] ??
                  '#5a4e38'};font-family:var(--font-heading,sans-serif);"
                >{rsvp.presence}</span
              >
            </div>
            {#if rsvp.message}
              <p
                class="mt-1 text-xs italic"
                style="color:rgba(201,169,110,0.7);font-family:var(--font-body,sans-serif);"
              >
                {rsvp.message}
              </p>
            {/if}
            <p class="mt-1 text-xs" style="color:#5a4e38;font-family:var(--font-body,sans-serif);">
              {formatRsvpTime(rsvp.createdAt)}
            </p>
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</section>

<style>
  @keyframes rsvpFadeIn {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .film-grain {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
    background-repeat: repeat;
  }
</style>
