<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchRsvps, submitRsvp, formatRsvpTime, type Rsvp } from '$lib/rsvp';

  export let invitation: any;

  let name = '';
  let attendance: 'hadir' | 'tidak' | null = null;
  let ucapan = '';
  let submitted = false;
  let submitting = false;
  let error = '';

  let responses: Rsvp[] = [];

  let page = 1;
  const limit = 5;

  $: paged = responses.slice((page - 1) * limit, page * limit);
  $: totalPage = Math.max(1, Math.ceil(responses.length / limit));

  onMount(async () => {
    if (invitation?.slug) {
      responses = await fetchRsvps(invitation.slug);
    }
  });

  async function submit() {
    if (!name.trim()) {
      error = 'Nama tidak boleh kosong.';
      return;
    }
    if (!attendance) {
      error = 'Pilih konfirmasi kehadiran.';
      return;
    }
    error = '';
    submitting = true;
    try {
      const rsvp = await submitRsvp(invitation.slug, {
        name: name.trim(),
        presence: attendance,
        message: ucapan.trim() || undefined
      });
      responses = [rsvp, ...responses];
      page = 1;
      name = '';
      attendance = null;
      ucapan = '';
      submitted = true;
      setTimeout(() => (submitted = false), 3000);
    } catch (e: any) {
      error = e.message ?? 'Gagal mengirim konfirmasi.';
    } finally {
      submitting = false;
    }
  }
</script>

<section class="relative overflow-hidden py-20">
  <img src="/assets/earth/top-branch.svg" alt="" class="absolute top-0" />
  <img src="/assets/earth/branch.svg" alt="" class="absolute -bottom-55 -left-35 rotate-130" />
  <img
    src="/assets/earth/branch.svg"
    alt=""
    class="absolute -right-10 -bottom-15 max-w-none -scale-x-100 -rotate-130"
  />

  <div class="relative z-10 mx-auto max-w-lg space-y-10 px-5">
    <!-- ================= RSVP ================= -->
    <div class="rounded-2xl bg-white p-6 shadow-sm">
      <h2 class="mb-2 text-center font-script text-4xl">Reservation <br /> & <br /> Wishes</h2>

      <p class="mb-10 text-center text-sm text-gray-600">
        Konfirmasi kehadiran Anda sebelum hari acara
      </p>

      <form class="space-y-6">
        <!-- Nama -->
        <div>
          <label class="mb-1 block text-xs tracking-wide text-gray-600" for="name">
            Nama Lengkap
          </label>
          <input
            id="name"
            type="text"
            placeholder="Nama Anda"
            bind:value={name}
            class="w-full rounded-xl border border-gray-200 bg-[#f9f9f6] px-4 py-3 text-sm focus:border-gray-400 focus:outline-none"
          />
        </div>

        <!-- Kehadiran -->
        <div>
          <label class="mb-2 block text-xs tracking-wide text-gray-600" for="confirm">
            Konfirmasi Kehadiran
          </label>

          <div class="flex gap-3">
            <button
              id="confirm"
              type="button"
              class="flex-1 rounded-xl border py-3 text-sm transition
							{attendance === 'hadir'
                ? 'border-gray-400 bg-gray-100'
                : 'border-gray-200 bg-[#f9f9f6] hover:bg-gray-100'}"
              on:click={() => (attendance = 'hadir')}
            >
              Hadir
            </button>

            <button
              type="button"
              class="flex-1 rounded-xl border py-3 text-sm transition
							{attendance === 'tidak'
                ? 'border-gray-400 bg-gray-100'
                : 'border-gray-200 text-gray-500 hover:bg-gray-50'}"
              on:click={() => (attendance = 'tidak')}
            >
              Tidak Hadir
            </button>
          </div>
        </div>

        <!-- Jumlah Tamu -->
        <div>
          <label class="mb-1 block text-xs tracking-wide text-gray-600" for="guest">
            Jumlah Tamu
          </label>
          <select
            id="guest"
            class="w-full rounded-xl border border-gray-200 bg-[#f9f9f6] px-4 py-3 text-sm focus:border-gray-400 focus:outline-none"
          >
            <option>1 Orang</option>
            <option>2 Orang</option>
            <option>3 Orang</option>
          </select>
        </div>

        <!-- Ucapan -->
        <div>
          <label class="mb-1 block text-xs tracking-wide text-gray-600" for="ucapan">
            Ucapan & Doa
          </label>
          <textarea
            rows="3"
            placeholder="Tuliskan doa terbaik Anda"
            bind:value={ucapan}
            class="w-full rounded-xl border border-gray-200 bg-[#f9f9f6] px-4 py-3 text-sm focus:border-gray-400 focus:outline-none"
          ></textarea>
        </div>

        {#if error}<p class="mb-2 text-xs text-red-500">{error}</p>{/if}
        {#if submitted}<p class="mb-2 text-xs text-green-600">
            Terima kasih, konfirmasi terkirim!
          </p>{/if}
        <button
          type="button"
          on:click={submit}
          disabled={submitting}
          class="mt-4 w-full rounded-full border border-gray-300 py-3 text-sm tracking-wide transition hover:bg-gray-100 disabled:opacity-50"
        >
          {submitting ? 'Mengirim...' : 'Kirim Konfirmasi'}
        </button>
      </form>
    </div>

    <!-- ================= UCAPAN ================= -->
    <div class="rounded-2xl bg-white p-6 shadow-sm">
      <h2 class="mb-2 text-center font-script text-4xl">Ucapan & Doa</h2>

      <p class="mb-10 text-center text-sm text-gray-600">
        Doa dan harapan terbaik dari keluarga dan sahabat
      </p>

      <!-- List -->
      <div class="space-y-6" style="max-height: 400px; overflow-y: auto;">
        {#each paged as r (r.id)}
          <div class="border-b border-gray-200 pb-4 last:border-b-0">
            <p class="mb-1 text-sm font-medium text-gray-800">
              {r.name}
            </p>
            <p class="text-sm leading-relaxed text-gray-600">
              {r.message ?? ''}
            </p>
          </div>
        {/each}
      </div>

      <!-- Pagination -->
      <div class="mt-8 flex items-center justify-between text-sm">
        <button
          class="rounded-full border border-gray-300 px-4 py-2 text-gray-600 transition hover:bg-gray-100 disabled:opacity-40"
          disabled={page === 1}
          on:click={() => page--}
        >
          Sebelumnya
        </button>

        <span class="text-gray-500">
          Halaman {page} / {totalPage}
        </span>

        <button
          class="rounded-full border border-gray-300 px-4 py-2 text-gray-600 transition hover:bg-gray-100 disabled:opacity-40"
          disabled={page >= totalPage}
          on:click={() => page++}
        >
          Selanjutnya
        </button>
      </div>
    </div>
  </div>
</section>
