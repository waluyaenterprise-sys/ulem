<script lang="ts">
  import { goto } from '$app/navigation';
  import { customerLogin } from '$lib/customerAuth';

  let accessCode = $state('');
  let error = $state('');
  let loading = $state(false);

  async function submit() {
    loading = true;
    error = '';
    try {
      await customerLogin(accessCode.trim());
      await goto('/customer');
    } catch (e: any) {
      error = e.message;
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head><title>Masuk Customer — ulem</title></svelte:head>

<main class="flex min-h-screen items-center justify-center bg-[#f5f1ea] p-6">
  <form onsubmit={(event) => { event.preventDefault(); submit(); }} class="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl shadow-stone-900/10">
    <p class="font-script text-4xl text-[#c9a84c]">ulem</p>
    <h1 class="mt-6 text-2xl font-semibold text-stone-900">Dashboard Customer</h1>
    <p class="mt-2 text-sm leading-relaxed text-stone-500">Masukkan kode akses yang kami kirim setelah pembayaran dikonfirmasi.</p>
    <label for="access-code" class="mt-7 block text-sm font-medium text-stone-700">Kode akses</label>
    <input id="access-code" bind:value={accessCode} autocomplete="one-time-code" placeholder="Contoh: AB12CD34" class="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 font-mono tracking-widest uppercase outline-none transition focus:border-[#c9a84c]" />
    {#if error}<p class="mt-3 text-sm text-red-600">{error}</p>{/if}
    <button disabled={loading || !accessCode.trim()} class="mt-6 w-full rounded-xl bg-stone-900 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:opacity-50">
      {loading ? 'Memeriksa akses…' : 'Masuk ke dashboard'}
    </button>
  </form>
</main>
