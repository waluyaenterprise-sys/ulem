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
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible = true;
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    if (el) observer.observe(el);
    return () => observer.disconnect();
  });
</script>

<section bind:this={el} class="w-full px-6 py-20" style="background:#f5ede0;">
  <!-- Header -->
  <div
    class="mb-10 text-center"
    style="opacity:{visible ? 1 : 0};transform:translateY({visible
      ? 0
      : -14}px);transition:opacity 700ms ease,transform 700ms ease;"
  >
    <p
      class="text-xs tracking-[0.6em] uppercase"
      style="color:#8b1a1a;font-family:var(--font-heading,serif);"
    >
      — Konfirmasi &amp; Ucapan —
    </p>
    <p class="mt-2 text-2xl" style="color:#2a1010;font-family:var(--font-script,cursive);">
      Reservasi
    </p>
    <div class="mx-auto mt-3 flex items-center gap-2" style="width:160px;">
      <div
        style="flex:1;height:1px;background:linear-gradient(to right,transparent,#6b1414);opacity:0.5;"
      ></div>
      <svg width="7" height="7" viewBox="0 0 7 7">
        <rect
          x="0.5"
          y="0.5"
          width="6"
          height="6"
          transform="rotate(45 3.5 3.5)"
          fill="#6b1414"
          opacity="0.5"
        />
      </svg>
      <div
        style="flex:1;height:1px;background:linear-gradient(to left,transparent,#6b1414);opacity:0.5;"
      ></div>
    </div>
  </div>

  {#if visible}
    <div in:fly={{ y: 20, delay: 150, duration: 700, easing: cubicOut }} class="mx-auto max-w-xs">
      <!-- Form card -->
      <div
        style="background:#faf6ef;border:1px solid #ddb880;box-shadow:0 0 0 4px #f5ede0,0 0 0 5px rgba(107,20,20,0.15),2px 6px 20px rgba(107,20,20,0.08);"
      >
        <!-- Maroon top bar -->
        <div
          style="height:3px;background:linear-gradient(to right,#6b1414,#8b1a1a,#b8962e,#8b1a1a,#6b1414);"
        ></div>

        <div class="px-6 py-6">
          <!-- Name -->
          <div class="mb-4">
            <label
              class="mb-1.5 block text-xs tracking-[0.4em] uppercase"
              style="color:#8b1a1a;font-family:var(--font-heading,serif);"
              for="rsvp-name">Nama</label
            >
            <input
              id="rsvp-name"
              bind:value={name}
              type="text"
              placeholder="Nama lengkap Anda"
              class="w-full border-b px-0 py-2 text-sm transition-colors duration-200 outline-none"
              style="border-color:#ddb880;background:transparent;color:#2a1010;font-family:var(--font-body,sans-serif);"
            />
          </div>

          <!-- Presence -->
          <div class="mb-4">
            <p
              class="mb-2 text-xs tracking-[0.4em] uppercase"
              style="color:#8b1a1a;font-family:var(--font-heading,serif);"
            >
              Kehadiran
            </p>
            <div class="flex gap-2">
              {#each presenceOptions as opt}
                <button
                  onclick={() => (presence = opt.value)}
                  class="flex-1 py-2 text-xs tracking-widest uppercase transition-all duration-200"
                  style="
                    border:1px solid {presence === opt.value ? '#6b1414' : '#ddb880'};
                    background:{presence === opt.value ? 'rgba(107,20,20,0.08)' : 'transparent'};
                    color:{presence === opt.value ? '#6b1414' : '#9a6060'};
                    font-family:var(--font-heading,serif);
                  ">{opt.label}</button
                >
              {/each}
            </div>
          </div>

          <!-- Ucapan -->
          <div class="mb-5">
            <label
              class="mb-1.5 block text-xs tracking-[0.4em] uppercase"
              style="color:#8b1a1a;font-family:var(--font-heading,serif);"
              for="rsvp-ucapan">Ucapan &amp; Doa</label
            >
            <textarea
              id="rsvp-ucapan"
              bind:value={ucapan}
              rows="3"
              placeholder="Tulis ucapan dan doa untuk pengantin..."
              class="w-full resize-none border px-3 py-2 text-sm leading-relaxed transition-colors duration-200 outline-none"
              style="border-color:#ddb880;background:transparent;color:#5a3030;font-family:var(--font-body,sans-serif);"
            ></textarea>
          </div>

          {#if error}
            <p class="mb-3 text-xs" style="color:#8b1a1a;font-family:var(--font-body,sans-serif);">
              {error}
            </p>
          {/if}

          {#if submitted}
            <p
              class="mb-3 text-center text-xs"
              style="color:#6b8a4a;font-family:var(--font-heading,serif);letter-spacing:0.3em;"
            >
              ✓ Terkirim
            </p>
          {/if}

          <button
            onclick={submit}
            disabled={submitting}
            class="w-full py-3 text-xs tracking-[0.45em] uppercase transition-all duration-300"
            style="background:#6b1414;color:#f5ede0;font-family:var(--font-heading,serif);border:1px solid #b8962e;opacity:{submitting
              ? 0.6
              : 1};"
            onmouseenter={(e) => {
              if (!submitting) (e.currentTarget as HTMLElement).style.background = '#8b1a1a';
            }}
            onmouseleave={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#6b1414';
            }}
          >
            {submitting ? 'Mengirim...' : 'Konfirmasi'}
          </button>
        </div>

        <!-- Bottom bar -->
        <div
          style="height:1px;background:linear-gradient(to right,transparent,#b8962e,transparent);opacity:0.5;"
        ></div>
      </div>

      <!-- Responses -->
      {#if responses.length > 0}
        <div class="mt-8">
          <p
            class="mb-4 text-center text-xs tracking-[0.4em] uppercase"
            style="color:#8b1a1a;font-family:var(--font-heading,serif);"
          >
            Ucapan Tamu
          </p>
          <div class="flex flex-col gap-3" style="max-height: 400px; overflow-y: auto;">
            {#each responses as r}
              <div
                class="px-5 py-4"
                style="background:#faf6ef;border-left:2px solid #6b1414;border:1px solid #e8d8c8;"
              >
                <div class="mb-1 flex items-center justify-between">
                  <p
                    class="text-sm font-medium"
                    style="color:#2a1010;font-family:var(--font-heading,serif);"
                  >
                    {r.name}
                  </p>
                  <span
                    class="px-2 py-0.5 text-xs"
                    style="background:{r.presence === 'hadir'
                      ? 'rgba(107,20,20,0.08)'
                      : 'rgba(150,120,80,0.08)'};color:{r.presence === 'hadir'
                      ? '#6b1414'
                      : '#8a6030'};border:1px solid {r.presence === 'hadir'
                      ? 'rgba(107,20,20,0.2)'
                      : 'rgba(150,120,80,0.2)'};font-family:var(--font-heading,serif);"
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
                    style="color:#7a5050;font-family:var(--font-body,sans-serif);"
                  >
                    {r.message}
                  </p>
                {/if}
                <p
                  class="mt-1 text-xs"
                  style="color:#b8962e;opacity:0.7;font-family:var(--font-heading,serif);"
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
