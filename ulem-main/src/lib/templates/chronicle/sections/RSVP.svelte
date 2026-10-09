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

  const presenceOptions: { value: 'hadir' | 'mungkin' | 'tidak'; label: string; color: string }[] =
    [
      { value: 'hadir', label: 'Hadir', color: '#22c55e' },
      { value: 'mungkin', label: 'Mungkin', color: '#c4754a' },
      { value: 'tidak', label: 'Tidak', color: '#ef4444' }
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
</script>

<section bind:this={el} class="w-full px-6 py-24" style="background:#f0f4ff;">
  <!-- Chapter header -->
  <div
    class="mb-10 flex items-center gap-3"
    style="opacity:{visible ? 1 : 0};transform:translateX({visible
      ? 0
      : -16}px);transition:opacity 600ms ease,transform 600ms ease;"
  >
    <div style="width:3px;height:32px;background:#c4754a;flex-shrink:0;"></div>
    <div>
      <p
        class="text-xs tracking-[0.55em] uppercase"
        style="color:#c4754a;font-family:var(--font-heading,sans-serif);"
      >
        Chapter 07
      </p>
      <p
        class="text-lg font-bold"
        style="color:#0d1829;font-family:var(--font-heading,sans-serif);letter-spacing:-0.02em;"
      >
        Konfirmasi Kehadiran
      </p>
    </div>
    <div class="ml-auto" aria-hidden="true">
      <span
        style="font-size:80px;font-weight:900;color:rgba(196,117,74,0.06);font-family:var(--font-heading,sans-serif);line-height:1;user-select:none;"
        >07</span
      >
    </div>
  </div>

  {#if visible}
    <div in:fly={{ y: 20, delay: 150, duration: 700, easing: cubicOut }}>
      <!-- Form — styled like a registration sheet -->
      <div style="background:#0d1829;border:1px solid rgba(255,255,255,0.06);">
        <!-- Top colored band -->
        <div style="height:3px;background:linear-gradient(to right,#2c3e6b,#c4754a);"></div>

        <div class="flex flex-col gap-5 px-6 py-6">
          <!-- Step 01: Name -->
          <div>
            <div class="mb-2 flex items-center gap-2">
              <span
                class="flex h-5 w-5 items-center justify-center text-xs font-bold"
                style="background:#2c3e6b;color:#fff;font-family:var(--font-heading,sans-serif);"
                >1</span
              >
              <label
                for="rsvp-name"
                class="text-xs tracking-[0.4em] uppercase"
                style="color:#6e80a8;font-family:var(--font-heading,sans-serif);"
                >Nama Lengkap</label
              >
            </div>
            <input
              id="rsvp-name"
              bind:value={name}
              type="text"
              placeholder="Ketik nama Anda..."
              class="w-full border-b px-0 py-2.5 text-sm transition-colors duration-200 outline-none"
              style="border-color:rgba(255,255,255,0.1);background:transparent;color:#f0f4ff;font-family:var(--font-body,sans-serif);"
              onfocus={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = '#2c3e6b';
              }}
              onblur={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
              }}
            />
          </div>

          <!-- Step 02: Presence -->
          <div>
            <div class="mb-3 flex items-center gap-2">
              <span
                class="flex h-5 w-5 items-center justify-center text-xs font-bold"
                style="background:#c4754a;color:#fff;font-family:var(--font-heading,sans-serif);"
                >2</span
              >
              <p
                class="text-xs tracking-[0.4em] uppercase"
                style="color:#d98a6a;font-family:var(--font-heading,sans-serif);"
              >
                Kehadiran
              </p>
            </div>
            <div class="flex flex-col gap-2">
              {#each presenceOptions as opt}
                <button
                  onclick={() => (presence = opt.value)}
                  class="flex items-center gap-3 px-4 py-3 text-left transition-all duration-200"
                  style="
                    background:{presence === opt.value
                    ? `rgba(${opt.color === '#22c55e' ? '34,197,94' : opt.color === '#c4754a' ? '196,117,74' : '239,68,68'},0.1)`
                    : 'rgba(255,255,255,0.03)'};
                    border:1px solid {presence === opt.value
                    ? opt.color
                    : 'rgba(255,255,255,0.06)'};
                  "
                >
                  <!-- Radio indicator -->
                  <div
                    class="flex h-4 w-4 shrink-0 items-center justify-center"
                    style="border:1.5px solid {presence === opt.value
                      ? opt.color
                      : 'rgba(255,255,255,0.2)'};"
                  >
                    {#if presence === opt.value}
                      <div style="width:8px;height:8px;background:{opt.color};"></div>
                    {/if}
                  </div>
                  <span
                    class="text-sm"
                    style="color:{presence === opt.value
                      ? '#f0f4ff'
                      : '#64748b'};font-family:var(--font-body,sans-serif);"
                  >
                    {opt.label}
                  </span>
                  {#if presence === opt.value}
                    <span
                      class="ml-auto text-xs font-bold"
                      style="color:{opt.color};font-family:var(--font-heading,sans-serif);">✓</span
                    >
                  {/if}
                </button>
              {/each}
            </div>
          </div>

          <!-- Step 03: Ucapan -->
          <div>
            <div class="mb-2 flex items-center gap-2">
              <span
                class="flex h-5 w-5 items-center justify-center text-xs font-bold"
                style="background:#2c3e6b;color:#fff;font-family:var(--font-heading,sans-serif);"
                >3</span
              >
              <label
                for="rsvp-ucapan"
                class="text-xs tracking-[0.4em] uppercase"
                style="color:#6e80a8;font-family:var(--font-heading,sans-serif);"
                >Ucapan &amp; Doa</label
              >
            </div>
            <textarea
              id="rsvp-ucapan"
              bind:value={ucapan}
              rows="3"
              placeholder="Tulis ucapan dan doa Anda..."
              class="w-full resize-none border px-3 py-2.5 text-sm leading-relaxed transition-colors duration-200 outline-none"
              style="border-color:rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);color:#94a3b8;font-family:var(--font-body,sans-serif);"
              onfocus={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(44,60,107,0.4)';
              }}
              onblur={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
              }}
            ></textarea>
          </div>

          {#if error}
            <div
              class="flex items-center gap-2 px-3 py-2"
              style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);"
            >
              <span class="text-xs" style="color:#f87171;font-family:var(--font-body,sans-serif);"
                >{error}</span
              >
            </div>
          {/if}

          {#if submitted}
            <div
              class="flex items-center gap-2 px-3 py-2"
              style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.2);"
            >
              <span
                class="text-xs tracking-widest"
                style="color:#4ade80;font-family:var(--font-heading,sans-serif);"
                >✓ Konfirmasi terkirim</span
              >
            </div>
          {/if}

          <!-- Submit -->
          <button
            onclick={submit}
            disabled={submitting}
            class="flex w-full items-center justify-center gap-3 py-3.5 text-xs tracking-[0.45em] uppercase transition-all duration-300"
            style="background:#2c3e6b;color:#fff;font-family:var(--font-heading,sans-serif);opacity:{submitting
              ? 0.6
              : 1};"
            onmouseenter={(e) => {
              if (!submitting) (e.currentTarget as HTMLElement).style.background = '#1e2a50';
            }}
            onmouseleave={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#2c3e6b';
            }}
          >
            {#if submitting}
              <span
                style="width:14px;height:14px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;display:inline-block;animation:spin 0.7s linear infinite;"
              ></span>
            {/if}
            {submitting ? 'Mengirim...' : 'Kirim Konfirmasi'}
          </button>
        </div>
      </div>

      <!-- Responses feed -->
      {#if responses.length > 0}
        <div class="mt-8">
          <div class="mb-4 flex items-center gap-3">
            <div style="flex:1;height:1px;background:#e2e8f0;"></div>
            <span
              class="text-xs tracking-[0.4em] uppercase"
              style="color:#94a3b8;font-family:var(--font-heading,sans-serif);"
            >
              {responses.length} Ucapan
            </span>
            <div style="flex:1;height:1px;background:#e2e8f0;"></div>
          </div>

          <div class="flex flex-col gap-3" style="max-height: 400px; overflow-y: auto;">
            {#each responses as r}
              <div
                class="px-4 py-4"
                style="background:#fff;border:1px solid #e2e8f0;border-left:3px solid {r.presence ===
                'hadir'
                  ? '#22c55e'
                  : r.presence === 'mungkin'
                    ? '#c4754a'
                    : '#ef4444'};"
              >
                <div class="mb-1.5 flex items-center justify-between">
                  <p
                    class="text-sm font-semibold"
                    style="color:#0d1829;font-family:var(--font-heading,sans-serif);"
                  >
                    {r.name}
                  </p>
                  <span
                    class="px-2 py-0.5 text-xs font-medium"
                    style="background:{r.presence === 'hadir'
                      ? 'rgba(34,197,94,0.1)'
                      : r.presence === 'mungkin'
                        ? 'rgba(196,117,74,0.1)'
                        : 'rgba(239,68,68,0.1)'};color:{r.presence === 'hadir'
                      ? '#16a34a'
                      : r.presence === 'mungkin'
                        ? '#b5603a'
                        : '#dc2626'};border:1px solid {r.presence === 'hadir'
                      ? 'rgba(34,197,94,0.2)'
                      : r.presence === 'mungkin'
                        ? 'rgba(196,117,74,0.2)'
                        : 'rgba(239,68,68,0.2)'};font-family:var(--font-heading,sans-serif);"
                  >
                    {r.presence === 'hadir'
                      ? 'Hadir'
                      : r.presence === 'mungkin'
                        ? 'Mungkin'
                        : 'Tidak'}
                  </span>
                </div>
                {#if r.message}
                  <p
                    class="text-xs leading-relaxed"
                    style="color:#475569;font-family:var(--font-body,sans-serif);"
                  >
                    {r.message}
                  </p>
                {/if}
                <p
                  class="mt-1.5 text-xs"
                  style="color:#94a3b8;font-family:var(--font-heading,sans-serif);"
                >
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

<style>
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
