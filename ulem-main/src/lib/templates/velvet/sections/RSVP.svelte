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

  const presenceBadge: Record<string, string> = {
    hadir: 'rgba(100,180,100,0.8)',
    mungkin: 'rgba(220,180,60,0.8)',
    tidak: 'rgba(200,80,80,0.8)'
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

<section
  bind:this={sectionEl}
  class="relative w-full overflow-hidden px-5 py-20"
  style="background: linear-gradient(160deg, #1c0f0a 0%, #2d1a0e 50%, #1c0f0a 100%);"
>
  <!-- Warm glow top right -->
  <div
    class="pointer-events-none absolute"
    style="width:400px;height:400px;border-radius:50%;background:radial-gradient(circle, rgba(232,164,90,0.10) 0%, transparent 70%);top:-60px;right:-80px;"
  ></div>

  {#if visible}
    <!-- Header -->
    <div in:fade={{ duration: 700 }} class="mb-10 text-center">
      <p
        class="text-xl tracking-[0.3em] uppercase"
        style="color: rgba(232,164,90,0.85); font-family: var(--font-heading, sans-serif);"
      >
        Messages &amp; Prayers
      </p>
      <div
        class="mx-auto mt-4"
        style="width:50px;height:1px;background:linear-gradient(to right,transparent,rgba(232,164,90,0.6),transparent);"
      ></div>
      <p
        class="mt-3 text-xs"
        style="color: rgba(255,200,140,0.55); font-family: var(--font-body, sans-serif);"
      >
        Konfirmasi Kehadiran
      </p>
    </div>

    <div class="relative z-10 flex flex-col gap-8">
      <!-- FORM GLASS CARD -->
      <div
        in:fly={{ y: 30, delay: 200, duration: 700, easing: cubicOut }}
        class="mx-auto w-full max-w-sm rounded-3xl p-7"
        style="
          background: rgba(255,200,120,0.07);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(232,164,90,0.22);
          box-shadow: 0 8px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,230,170,0.10);
        "
      >
        <!-- Name -->
        <div class="mb-5">
          <label
            for="rsvp-name"
            class="mb-2 block text-[10px] tracking-[0.25em] uppercase"
            style="color:rgba(232,164,90,0.65);font-family:var(--font-heading,sans-serif);"
            >Nama Lengkap</label
          >
          <input
            id="rsvp-name"
            type="text"
            bind:value={name}
            placeholder="Tulis nama Anda"
            class="w-full rounded-xl px-4 py-3 text-sm transition outline-none"
            style="
              font-family:var(--font-body,sans-serif);
              background:rgba(255,200,120,0.08);
              border:1px solid rgba(232,164,90,0.25);
              color:rgba(255,230,180,0.9);
              placeholder-color:rgba(232,164,90,0.4);
            "
          />
        </div>

        <!-- Presence -->
        <div class="mb-6">
          <p
            class="mb-3 block text-[10px] tracking-[0.25em] uppercase"
            style="color:rgba(232,164,90,0.65);font-family:var(--font-heading,sans-serif);"
          >
            Kehadiran
          </p>
          <div class="grid grid-cols-3 gap-2">
            {#each presenceOptions as opt}
              <button
                type="button"
                on:click={() => (presence = opt.val)}
                class="rounded-xl py-2.5 text-xs transition-all active:scale-95"
                style="
                  font-family:var(--font-heading,sans-serif);
                  background: {presence === opt.val
                  ? 'rgba(232,164,90,0.22)'
                  : 'rgba(255,200,120,0.05)'};
                  border: 1px solid {presence === opt.val
                  ? 'rgba(232,164,90,0.6)'
                  : 'rgba(232,164,90,0.18)'};
                  color: {presence === opt.val
                  ? 'rgba(232,164,90,0.95)'
                  : 'rgba(255,200,140,0.55)'};
                ">{opt.label}</button
              >
            {/each}
          </div>
        </div>

        <!-- Ucapan -->
        <div class="mb-6">
          <label
            for="rsvp-ucapan"
            class="mb-2 block text-[10px] tracking-[0.25em] uppercase"
            style="color:rgba(232,164,90,0.65);font-family:var(--font-heading,sans-serif);"
            >Ucapan &amp; Doa</label
          >
          <textarea
            id="rsvp-ucapan"
            bind:value={ucapan}
            rows="3"
            placeholder="Tuliskan doa & ucapan terbaik Anda..."
            class="w-full resize-none rounded-xl px-4 py-3 text-sm transition outline-none"
            style="
              font-family:var(--font-body,sans-serif);
              background:rgba(255,200,120,0.08);
              border:1px solid rgba(232,164,90,0.25);
              color:rgba(255,230,180,0.9);
            "
          ></textarea>
        </div>

        {#if error}
          <p in:fade class="mb-4 text-xs" style="color:rgba(220,80,80,0.85);">{error}</p>
        {/if}

        {#if submitted}
          <div
            in:fade
            class="rounded-xl py-3 text-center text-xs"
            style="background:rgba(232,164,90,0.12);border:1px solid rgba(232,164,90,0.3);color:rgba(232,164,90,0.85);font-family:var(--font-body,sans-serif);"
          >
            Terima kasih, konfirmasi terkirim!
          </div>
        {:else}
          <button
            type="button"
            on:click={submit}
            class="w-full rounded-xl py-3.5 text-xs tracking-[0.2em] uppercase transition hover:opacity-90 active:scale-[0.98]"
            style="
              font-family:var(--font-heading,sans-serif);
              background: linear-gradient(135deg, rgba(232,164,90,0.9), rgba(212,119,74,0.85));
              color: rgba(28,15,10,0.95);
              font-weight: 600;
              box-shadow: 0 4px 20px rgba(232,164,90,0.25);
            ">Kirim</button
          >
        {/if}
      </div>

      <!-- Responses -->
      {#if responses.length > 0}
        <div class="mx-auto w-full max-w-sm space-y-3" style="max-height: 400px; overflow-y: auto;">
          <p
            class="mb-4 text-[10px] tracking-[0.25em] uppercase"
            style="color:rgba(232,164,90,0.6);font-family:var(--font-heading,sans-serif);"
          >
            Konfirmasi Masuk
          </p>
          {#each responses as r (r.id)}
            <div
              in:fly={{ y: 16, duration: 400, easing: cubicOut }}
              class="flex gap-3 rounded-2xl px-5 py-4"
              style="
                background: rgba(255,200,120,0.06);
                border: 1px solid rgba(232,164,90,0.18);
                backdrop-filter: blur(12px);
              "
            >
              <!-- Avatar -->
              <div
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                style="background:rgba(232,164,90,0.18);color:rgba(232,164,90,0.85);font-family:var(--font-heading,sans-serif);"
              >
                {r.name[0].toUpperCase()}
              </div>
              <div class="min-w-0 flex-1">
                <div class="mb-1 flex items-center gap-2">
                  <p
                    class="truncate text-sm font-semibold"
                    style="color:rgba(255,230,180,0.9);font-family:var(--font-heading,sans-serif);"
                  >
                    {r.name}
                  </p>
                  <span
                    class="shrink-0 rounded-full px-2 py-0.5 text-[10px]"
                    style="background:{presenceBadge[r.presence]}22;color:{presenceBadge[
                      r.presence
                    ]};border:1px solid {presenceBadge[
                      r.presence
                    ]}55;font-family:var(--font-body,sans-serif);"
                    >{r.presence === 'hadir'
                      ? 'Hadir'
                      : r.presence === 'mungkin'
                        ? 'Mungkin'
                        : 'Tidak'}</span
                  >
                </div>
                {#if r.message}
                  <p
                    class="text-xs leading-relaxed"
                    style="color:rgba(255,200,140,0.55);font-family:var(--font-body,sans-serif);"
                  >
                    {r.message}
                  </p>
                {/if}
                <p
                  class="mt-1.5 text-[10px]"
                  style="color:rgba(232,164,90,0.4);font-family:var(--font-body,sans-serif);"
                >
                  {formatRsvpTime(r.createdAt)}
                </p>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</section>
