<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchRsvps, submitRsvp, formatRsvpTime, type Rsvp } from '$lib/rsvp';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  export let invitation: any;

  let name = '';
  let presence: 'hadir' | 'mungkin' | 'tidak' | null = null;
  let ucapan = '';
  let submitted = false;
  let submitting = false;
  let error = '';

  let responses: Rsvp[] = [];

  const presenceOptions = [
    { value: 'hadir' as const, label: 'Will Board', sub: 'Hadir' },
    { value: 'mungkin' as const, label: 'Standby', sub: 'Mungkin' },
    { value: 'tidak' as const, label: 'No Show', sub: 'Tidak Hadir' }
  ];

  const presenceColor = {
    hadir: 'rgba(107,140,107,0.9)',
    mungkin: 'rgba(201,168,76,0.9)',
    tidak: 'rgba(180,90,90,0.8)'
  };

  async function submit() {
    if (!name.trim()) {
      error = 'Nama tidak boleh kosong.';
      return;
    }
    if (!presence) {
      error = 'Pilih status kehadiran.';
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

  let visible = false;
  let sectionEl: HTMLElement;
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
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    if (sectionEl) observer.observe(sectionEl);
    return () => observer.disconnect();
  });
</script>

<section bind:this={sectionEl} class="w-full px-5 py-16" style="background:#081018;">
  {#if visible}
    <!-- Section header -->
    <div in:fade={{ duration: 600 }} class="mb-10 text-center">
      <p
        class="text-xs tracking-[0.25em] uppercase"
        style="color:rgba(201,168,76,0.5);font-family:var(--font-heading,serif);"
      >
        Check-In Counter
      </p>
      <p
        class="mt-2 text-sm tracking-[0.1em] uppercase"
        style="color:#c9a84c;font-family:var(--font-heading,serif);"
      >
        RSVP
      </p>
      <div style="width:40px;height:1px;background:rgba(201,168,76,0.4);margin:10px auto 0;"></div>
    </div>

    <!-- Check-in form card -->
    <div
      in:fly={{ y: 30, delay: 200, duration: 700, easing: cubicOut }}
      class="mx-auto mb-8"
      style="max-width:360px;"
    >
      <div style="background:#0f2035;border:1px solid rgba(201,168,76,0.22);">
        <!-- Top band -->
        <div style="height:3px;background:linear-gradient(to right,#c9a84c,#e8d08a,#c9a84c);"></div>

        <!-- Form header -->
        <div
          class="flex items-center gap-3 px-5 py-4"
          style="border-bottom:1px solid rgba(201,168,76,0.12);"
        >
          <svg width="22" height="16" viewBox="0 0 22 16">
            <rect
              x="1"
              y="1"
              width="20"
              height="14"
              rx="2"
              fill="none"
              stroke="#c9a84c"
              stroke-width="0.8"
              opacity="0.4"
            />
            <line x1="4" y1="6" x2="18" y2="6" stroke="#c9a84c" stroke-width="0.5" opacity="0.3" />
            <line
              x1="4"
              y1="10"
              x2="13"
              y2="10"
              stroke="#c9a84c"
              stroke-width="0.5"
              opacity="0.3"
            />
          </svg>
          <p
            class="text-xs tracking-[0.18em] uppercase"
            style="color:rgba(201,168,76,0.5);font-family:var(--font-heading,serif);"
          >
            Passenger Manifest
          </p>
        </div>

        <div class="flex flex-col gap-5 px-5 py-5">
          <!-- Name field -->
          <div>
            <label
              for="rsvp-name"
              class="mb-2 block text-sm tracking-[0.15em] uppercase"
              style="color:rgba(201,168,76,0.4);font-family:var(--font-heading,serif);"
            >
              Full Name / Nama Lengkap
            </label>
            <div style="border-bottom:1px solid rgba(201,168,76,0.3);padding-bottom:6px;">
              <input
                id="rsvp-name"
                type="text"
                bind:value={name}
                placeholder="Enter your name"
                class="w-full bg-transparent text-sm outline-none"
                style="color:rgba(228,216,180,0.9);font-family:var(--font-heading,serif);caret-color:#c9a84c;"
              />
            </div>
          </div>

          <!-- Presence selection -->
          <div>
            <p
              class="mb-3 text-sm tracking-[0.15em] uppercase"
              style="color:rgba(201,168,76,0.4);font-family:var(--font-heading,serif);"
            >
              Passenger Status / Kehadiran
            </p>
            <div class="flex gap-2">
              {#each presenceOptions as opt}
                <button
                  type="button"
                  onclick={() => (presence = opt.value)}
                  class="flex-1 px-1 py-2 text-center transition-all duration-200"
                  style="
                    border:1px solid {presence === opt.value
                    ? 'rgba(201,168,76,0.5)'
                    : 'rgba(201,168,76,0.15)'};
                    background:{presence === opt.value ? 'rgba(201,168,76,0.1)' : 'transparent'};
                  "
                >
                  <p
                    class="text-sm leading-tight tracking-[0.1em]"
                    style="color:{presence === opt.value
                      ? '#c9a84c'
                      : 'rgba(201,168,76,0.35)'};font-family:var(--font-heading,serif);"
                  >
                    {opt.label}
                  </p>
                  <p
                    class="mt-0.5 text-sm"
                    style="color:rgba(201,168,76,0.25);font-family:var(--font-heading,serif);"
                  >
                    {opt.sub}
                  </p>
                </button>
              {/each}
            </div>
          </div>

          <!-- Message field -->
          <div>
            <label
              for="rsvp-msg"
              class="mb-2 block text-sm tracking-[0.15em] uppercase"
              style="color:rgba(201,168,76,0.4);font-family:var(--font-heading,serif);"
            >
              Message / Ucapan (Optional)
            </label>
            <div style="border:1px solid rgba(201,168,76,0.2);background:rgba(0,0,0,0.2);">
              <textarea
                id="rsvp-msg"
                bind:value={ucapan}
                rows="3"
                placeholder="Leave your prayers and wishes..."
                class="w-full resize-none bg-transparent p-3 text-xs outline-none"
                style="color:rgba(228,216,180,0.8);font-family:var(--font-heading,serif);caret-color:#c9a84c;"
              ></textarea>
            </div>
          </div>

          <!-- Error -->
          {#if error}
            <p
              class="text-xs"
              style="color:rgba(180,90,90,0.8);font-family:var(--font-heading,serif);"
            >
              ⚠ {error}
            </p>
          {/if}

          <!-- Submit button -->
          {#if submitted}
            <div
              in:fade={{ duration: 400 }}
              class="py-3 text-center"
              style="border:1px solid rgba(107,140,107,0.4);background:rgba(107,140,107,0.08);"
            >
              <p
                class="text-xs tracking-wider"
                style="color:rgba(107,140,107,0.9);font-family:var(--font-heading,serif);"
              >
                ✓ Check-In Confirmed
              </p>
            </div>
          {:else}
            <button
              type="button"
              onclick={submit}
              class="w-full py-3 text-sm tracking-[0.2em] uppercase transition-all duration-300"
              style="
                border:1px solid rgba(201,168,76,0.4);
                color:#c9a84c;
                font-family:var(--font-heading,serif);
                background:transparent;
              "
              onmouseenter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.1)';
              }}
              onmouseleave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              Confirm Check-In
            </button>
          {/if}
        </div>

        <!-- Bottom band -->
        <div
          style="height:2px;background:linear-gradient(to right,transparent,rgba(201,168,76,0.3),transparent);"
        ></div>
      </div>
    </div>

    <!-- Response manifest list -->
    {#if responses.length > 0}
      <div in:fade={{ duration: 500 }} class="mx-auto" style="max-width:360px;">
        <p
          class="mb-4 text-center text-xs tracking-[0.1em] uppercase"
          style="color:rgba(201,168,76,0.4);font-family:var(--font-heading,serif);"
        >
          Passenger List — {responses.length} registered
        </p>
        <div style="border:1px solid rgba(201,168,76,0.15); max-height: 400px; overflow-y: auto;">
          <!-- List header -->
          <div
            class="grid px-4 py-2"
            style="grid-template-columns:1fr auto;border-bottom:1px solid rgba(201,168,76,0.12);"
          >
            <p
              class="text-sm tracking-[0.15em] uppercase"
              style="color:rgba(201,168,76,0.3);font-family:var(--font-heading,serif);"
            >
              Name
            </p>
            <p
              class="text-sm tracking-[0.15em] uppercase"
              style="color:rgba(201,168,76,0.3);font-family:var(--font-heading,serif);"
            >
              Status
            </p>
          </div>
          {#each responses as r, i}
            <div
              class="grid gap-1 px-4 py-3"
              style="border-bottom:{i < responses.length - 1
                ? '1px solid rgba(201,168,76,0.08)'
                : 'none'};grid-template-columns:1fr auto;"
            >
              <div>
                <p
                  class="text-xs"
                  style="color:rgba(228,216,180,0.85);font-family:var(--font-heading,serif);"
                >
                  {r.name}
                </p>
                {#if r.message}
                  <p
                    class="mt-0.5 text-sm leading-snug italic"
                    style="color:rgba(228,216,180,0.45);font-family:var(--font-heading,serif);"
                  >
                    "{r.message}"
                  </p>
                {/if}
                <p class="mt-1 text-sm" style="color:rgba(201,168,76,0.25);font-family:monospace;">
                  {formatRsvpTime(r.createdAt)}
                </p>
              </div>
              <div class="flex items-start pt-0.5">
                <span
                  class="px-1.5 py-0.5 text-sm tracking-[0.1em] uppercase"
                  style="border:1px solid {presenceColor[r.presence]};color:{presenceColor[
                    r.presence
                  ]};font-family:var(--font-heading,serif);"
                >
                  {presenceOptions.find((p) => p.value === r.presence)?.label}
                </span>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  {/if}
</section>
