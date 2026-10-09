<script lang="ts">
  import { submitRsvp } from '$lib/rsvp';

  export let invitation: any;

  let name = '';
  let attendance: 'hadir' | 'tidak' | null = null;
  let ucapan = '';
  let submitted = false;
  let submitting = false;
  let error = '';

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
      await submitRsvp(invitation.slug, {
        name: name.trim(),
        presence: attendance,
        message: ucapan.trim() || undefined
      });
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

<!-- Reservasi Kehadiran -->
<section class="relative bg-[#f0f1ec] py-20">
  <div
    class="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[24px_24px] opacity-30"
  ></div>
  <div class="relative z-10 mx-auto max-w-lg px-5">
    <div class="rounded-2xl bg-white p-6 shadow-sm">
      <h2 class="mb-2 text-center font-script text-4xl">Reservasi Kehadiran</h2>

      <p class="mb-10 text-center text-sm text-gray-600">
        Mohon konfirmasi kehadiran Anda sebelum hari acara
      </p>

      <form class="space-y-6">
        <!-- Nama -->
        <div>
          <label for="res-name" class="mb-1 block text-xs tracking-wide text-gray-600">
            Nama Lengkap
          </label>
          <input
            id="res-name"
            type="text"
            bind:value={name}
            placeholder="Nama Anda"
            class="w-full rounded-xl border border-gray-200 bg-[#f9f9f6] px-4 py-3 text-sm focus:border-gray-400 focus:outline-none"
          />
        </div>

        <!-- Kehadiran -->
        <div>
          <p class="mb-2 block text-xs tracking-wide text-gray-600">Konfirmasi Kehadiran</p>

          <div class="flex gap-3">
            <button
              type="button"
              on:click={() => (attendance = 'hadir')}
              class="flex-1 rounded-xl border py-3 text-sm transition {attendance === 'hadir'
                ? 'border-gray-400 bg-gray-100'
                : 'border-gray-300 bg-[#f9f9f6] hover:bg-gray-100'}"
            >
              Hadir
            </button>

            <button
              type="button"
              on:click={() => (attendance = 'tidak')}
              class="flex-1 rounded-xl border py-3 text-sm transition {attendance === 'tidak'
                ? 'border-gray-400 bg-gray-100'
                : 'border-gray-200 text-gray-500 hover:bg-gray-50'}"
            >
              Tidak Hadir
            </button>
          </div>
        </div>

        <!-- Jumlah Tamu -->
        <div>
          <label for="res-guests" class="mb-1 block text-xs tracking-wide text-gray-600">
            Jumlah Tamu
          </label>
          <select
            id="res-guests"
            class="w-full rounded-xl border border-gray-200 bg-[#f9f9f6] px-4 py-3 text-sm focus:border-gray-400 focus:outline-none"
          >
            <option value="1">1 Orang</option>
            <option value="2">2 Orang</option>
            <option value="3">3 Orang</option>
          </select>
        </div>

        <!-- Ucapan -->
        <div>
          <label for="res-message" class="mb-1 block text-xs tracking-wide text-gray-600">
            Ucapan & Doa
          </label>
          <textarea
            id="res-message"
            bind:value={ucapan}
            rows="3"
            placeholder="Tuliskan doa terbaik Anda"
            class="w-full rounded-xl border border-gray-200 bg-[#f9f9f6] px-4 py-3 text-sm focus:border-gray-400 focus:outline-none"
          ></textarea>
        </div>

        <!-- Submit -->
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
  </div>
</section>
