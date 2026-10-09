<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { isLoggedIn, logout as authLogout } from '$lib/auth';

  let { children } = $props();

  let sidebarOpen = $state(true);
  let mobileOpen = $state(false);

  const navItems = [
    {
      group: 'Template',
      items: [
        {
          href: '/admin/templates',
          label: 'Input Template',
          icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />`
        },
        {
          href: '/admin/template-rules',
          label: 'Template Rules',
          icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />`
        }
      ]
    },
    {
      group: 'Lagu',
      items: [
        {
          href: '/admin/songs',
          label: 'Manajemen Lagu',
          icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />`
        }
      ]
    },
    {
      group: 'Undangan',
      items: [
        {
          href: '/admin',
          label: 'Input Data Pengantin',
          icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />`
        },
        {
          href: '/admin/list',
          label: 'List Data Pengantin',
          icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />`
        }
      ]
    }
  ];

  function isActive(href: string) {
    if (href === '/admin') return $page.url.pathname === '/admin';
    return $page.url.pathname.startsWith(href);
  }

  function logout() {
    authLogout();
    window.location.href = '/admin/login';
  }

  let isLoginPage = $derived(($page.url.pathname as string).includes('/login'));

  onMount(() => {
    if (!isLoggedIn() && !$page.url.pathname.includes('/login')) {
      window.location.href = '/admin/login';
    }
  });
</script>

{#if isLoginPage}
  {@render children()}
{:else}
  <!-- Mobile overlay -->
  {#if mobileOpen}
    <button
      class="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm lg:hidden"
      onclick={() => (mobileOpen = false)}
      aria-label="Close sidebar"
    ></button>
  {/if}

  <div class="flex h-screen overflow-hidden bg-slate-50">
    <!-- Sidebar -->
    <aside
      class="
      {sidebarOpen ? 'w-64' : 'w-16'}
      {mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      fixed z-30 flex h-full shrink-0 flex-col bg-slate-900 text-white
      transition-all duration-300 lg:relative
    "
    >
      <!-- Brand -->
      <div class="flex h-16 shrink-0 items-center gap-3 border-b border-white/10 px-4">
        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10">
          <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
        {#if sidebarOpen}
          <span class="text-sm font-semibold tracking-tight whitespace-nowrap">Ulem Admin</span>
        {/if}
        <button
          class="ml-auto hidden text-slate-400 transition hover:text-white lg:flex"
          onclick={() => (sidebarOpen = !sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {#if sidebarOpen}
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            {:else}
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            {/if}
          </svg>
        </button>
      </div>

      <!-- Nav -->
      <nav class="flex-1 space-y-4 overflow-y-auto px-2 py-4">
        {#each navItems as group}
          <div>
            {#if sidebarOpen}
              <p class="mb-1 px-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                {group.group}
              </p>
            {:else}
              <div class="mx-2 mb-2 h-px bg-white/10"></div>
            {/if}
            {#each group.items as item}
              <a
                href={item.href}
                onclick={() => (mobileOpen = false)}
                class="
                flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all
                {isActive(item.href)
                  ? 'bg-white/15 text-white'
                  : 'text-slate-400 hover:bg-white/8 hover:text-white'}
              "
              >
                <svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {@html item.icon}
                </svg>
                {#if sidebarOpen}
                  <span class="whitespace-nowrap">{item.label}</span>
                {/if}
              </a>
            {/each}
          </div>
        {/each}
      </nav>

      <!-- Logout -->
      <div class="shrink-0 border-t border-white/10 p-3">
        <button
          onclick={logout}
          class="
          flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium
          text-slate-400 transition-all hover:bg-red-400/8 hover:text-red-400
        "
        >
          <svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          {#if sidebarOpen}
            <span>Keluar</span>
          {/if}
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
      <!-- Top bar -->
      <header
        class="flex h-16 shrink-0 items-center gap-4 border-b border-gray-200 bg-white px-4 lg:px-6"
      >
        <!-- Mobile menu toggle -->
        <button
          class="text-gray-500 transition hover:text-gray-700 lg:hidden"
          onclick={() => (mobileOpen = !mobileOpen)}
          aria-label="Open sidebar"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <!-- Breadcrumb -->
        <div class="flex items-center gap-1 text-sm text-gray-500">
          <span class="font-medium text-gray-900">Admin</span>
          {#if $page.url.pathname !== '/admin'}
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span>
              {#if $page.url.pathname.startsWith('/admin/templates')}Templates
              {:else if $page.url.pathname.startsWith('/admin/list')}List Pengantin
              {:else if $page.url.pathname.startsWith('/admin/login')}Login
              {:else}{$page.url.pathname.split('/').pop()}{/if}
            </span>
          {/if}
        </div>

        <div class="ml-auto flex items-center gap-3">
          <div class="hidden text-sm text-gray-500 sm:block">
            <span class="font-medium text-gray-700">Admin</span>
          </div>
          <div
            class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white"
          >
            A
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto">
        <div class="p-4 lg:p-6">
          {@render children()}
        </div>
      </main>
    </div>
  </div>
{/if}
