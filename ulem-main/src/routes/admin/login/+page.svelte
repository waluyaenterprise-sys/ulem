<script lang="ts">
  import { apiLogin } from '$lib/auth';

  let username = $state('');
  let password = $state('');
  let error = $state('');
  let loading = $state(false);

  async function handleLogin(e: SubmitEvent) {
    e.preventDefault();
    error = '';
    loading = true;
    try {
      await apiLogin(username, password);
      window.location.href = '/admin';
    } catch (err: any) {
      error = err.message ?? 'Login gagal.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Login — Admin</title>
</svelte:head>

<div
  class="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-4"
>
  <div class="w-full max-w-sm">
    <!-- Logo / Brand -->
    <div class="mb-8 text-center">
      <div
        class="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm"
      >
        <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </div>
      <h1 class="text-2xl font-semibold tracking-tight text-white">Ulem Admin</h1>
      <p class="mt-1 text-sm text-slate-400">Masuk ke dashboard pengelolaan undangan</p>
    </div>

    <!-- Card -->
    <div class="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm">
      <form onsubmit={handleLogin} class="space-y-4">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-300" for="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            bind:value={username}
            placeholder="admin"
            autocomplete="username"
            class="w-full rounded-xl border border-white/10 bg-white/8 px-4 py-2.5 text-sm text-white placeholder-slate-500
                   transition focus:border-white/30 focus:bg-white/10 focus:outline-none"
            required
          />
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-300" for="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            bind:value={password}
            placeholder="••••••••"
            autocomplete="current-password"
            class="w-full rounded-xl border border-white/10 bg-white/8 px-4 py-2.5 text-sm text-white placeholder-slate-500
                   transition focus:border-white/30 focus:bg-white/10 focus:outline-none"
            required
          />
        </div>

        {#if error}
          <div
            class="flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-sm text-red-400"
          >
            <svg class="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            {error}
          </div>
        {/if}

        <button
          type="submit"
          disabled={loading}
          class="mt-2 w-full rounded-xl bg-white py-2.5 text-sm font-semibold
                 text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
    </div>

    <p class="mt-6 text-center text-xs text-slate-600">
      &copy; {new Date().getFullYear()} Ulem &mdash; Wedding Invitation Platform
    </p>
  </div>
</div>
