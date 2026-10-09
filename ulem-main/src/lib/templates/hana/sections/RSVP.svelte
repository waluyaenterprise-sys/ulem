<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
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
      { value: 'hadir', label: 'Hadir', color: '#8fa89c' },
      { value: 'mungkin', label: 'Mungkin', color: '#c4a97e' },
      { value: 'tidak', label: 'Tidak Hadir', color: '#c4908c' }
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

<section bind:this={el} class="w-full px-6 py-20" style="background:#f7f4f0;">
  <!-- Header -->
  <div
    class="mb-10 text-center"
    style="opacity:{visible ? 1 : 0};transform:translateY({visible
      ? 0
      : -14}px);transition:opacity 700ms ease,transform 700ms ease;"
  >
    <p
      class="text-xs tracking-[0.5em] uppercase"
      style="color:#b8a99a;font-family:var(--font-heading,serif);"
    >
      Konfirmasi & Ucapan
    </p>
    <p class="mt-2 text-2xl" style="color:#4a3f35;font-family:var(--font-script,cursive);">RSVP</p>
    <div class="mx-auto mt-3 flex items-center gap-2" style="width:140px;">
      <div
        style="flex:1;height:1px;background:linear-gradient(to right,transparent,#8fa89c 60%);"
      ></div>
      <svg width="6" height="6" viewBox="0 0 6 6"
        ><rect
          x="0.5"
          y="0.5"
          width="5"
          height="5"
          transform="rotate(45 3 3)"
          fill="none"
          stroke="#8fa89c"
          stroke-width="0.8"
        /></svg
      >
      <div
        style="flex:1;height:1px;background:linear-gradient(to left,transparent,#8fa89c 60%);"
      ></div>
    </div>
  </div>

  <!-- Form -->
  {#if visible}
    <div in:fly={{ y: 20, delay: 150, duration: 700, easing: cubicOut }} class="mx-auto max-w-xs">
      <div
        style="background:#fff;border:1px solid #ede7e0;box-shadow:0 4px 20px rgba(180,150,130,0.07);"
      >
        <!-- Top accent -->
        <div
          style="height:2px;background:linear-gradient(to right,#d4a0a0,#e8c4b8,#8fa89c);opacity:0.6;"
        ></div>

        <div class="px-6 py-6">
          <!-- Name -->
          <div class="mb-4">
            <label
              class="mb-1.5 block text-xs tracking-[0.4em] uppercase"
              style="color:#b8a99a;font-family:var(--font-heading,serif);"
              for="rsvp-name">Nama</label
            >
            <input
              id="rsvp-name"
              bind:value={name}
              type="text"
              placeholder="Nama lengkap Anda"
              class="w-full border-b px-0 py-2 text-sm transition-colors duration-200 outline-none focus:border-b-[#d4a0a0]"
              style="border-color:#e8ddd5;background:transparent;color:#4a3f35;font-family:var(--font-body,sans-serif);"
            />
          </div>

          <!-- Presence options -->
          <div class="mb-4">
            <p
              class="mb-2 text-xs tracking-[0.4em] uppercase"
              style="color:#b8a99a;font-family:var(--font-heading,serif);"
            >
              Kehadiran
            </p>
            <div class="flex gap-2">
              {#each presenceOptions as opt}
                <button
                  onclick={() => (presence = opt.value)}
                  class="flex-1 py-2 text-xs tracking-widest uppercase transition-all duration-200"
                  style="
                    border:1px solid {presence === opt.value ? opt.color : '#e8ddd5'};
                    background:{presence === opt.value ? opt.color + '18' : 'transparent'};
                    color:{presence === opt.value ? opt.color : '#9a8a7e'};
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
              style="color:#b8a99a;font-family:var(--font-heading,serif);"
              for="rsvp-ucapan">Ucapan & Doa</label
            >
            <textarea
              id="rsvp-ucapan"
              bind:value={ucapan}
              rows="3"
              placeholder="Tulis ucapan dan doa untuk pengantin..."
              class="w-full resize-none border px-3 py-2 text-sm leading-relaxed transition-colors duration-200 outline-none focus:border-[#d4a0a0]"
              style="border-color:#e8ddd5;background:transparent;color:#6b5d52;font-family:var(--font-body,sans-serif);"
            ></textarea>
          </div>

          {#if error}
            <p class="mb-3 text-xs" style="color:#c4908c;font-family:var(--font-body,sans-serif);">
              {error}
            </p>
          {/if}

          <button
            onclick={submit}
            class="w-full py-3 text-xs tracking-[0.45em] uppercase transition-all duration-300"
            style="border:1px solid #d4a0a0;color:#d4a0a0;background:transparent;font-family:var(--font-heading,serif);"
            onmouseenter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(212,160,160,0.08)';
            }}
            onmouseleave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}>Kirim</button
          >

          {#if submitted}
            <p
              in:fade={{ duration: 400 }}
              class="mt-3 text-center text-xs tracking-widest"
              style="color:#8fa89c;font-family:var(--font-heading,serif);"
            >
              Terima kasih atas ucapan Anda ♡
            </p>
          {/if}
        </div>
      </div>

      <!-- Responses list -->
      {#if responses.length > 0}
        <div class="mt-8">
          <p
            class="mb-4 text-xs tracking-[0.4em] uppercase"
            style="color:#b8a99a;font-family:var(--font-heading,serif);"
          >
            Ucapan ({responses.length})
          </p>
          <div class="flex flex-col gap-3" style="max-height: 400px; overflow-y: auto;">
            {#each responses as r (r.id)}
              <div
                in:fly={{ y: 10, duration: 400, easing: cubicOut }}
                style="background:#fff;border:1px solid #ede7e0;padding:14px 16px;box-shadow:0 2px 8px rgba(180,150,130,0.05);"
              >
                <div class="mb-1 flex items-center justify-between gap-2">
                  <p
                    class="text-sm font-medium"
                    style="color:#4a3f35;font-family:var(--font-heading,serif);"
                  >
                    {r.name}
                  </p>
                  <span
                    class="text-xs tracking-widest"
                    style="color:{r.presence === 'hadir'
                      ? '#8fa89c'
                      : r.presence === 'mungkin'
                        ? '#c4a97e'
                        : '#c4908c'};font-family:var(--font-heading,serif);"
                    >{r.presence === 'hadir'
                      ? 'Hadir'
                      : r.presence === 'mungkin'
                        ? 'Mungkin'
                        : 'Tidak Hadir'}</span
                  >
                </div>
                {#if r.message}
                  <p
                    class="text-xs leading-relaxed italic"
                    style="color:#9a8a7e;font-family:var(--font-body,sans-serif);"
                  >
                    "{r.message}"
                  </p>
                {/if}
                <p
                  class="mt-1.5 text-xs"
                  style="color:#c4b8ae;font-family:var(--font-body,sans-serif);"
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
