<script lang="ts">
  import { getAdaptiveNameStyle } from '$lib/utils/adaptiveName';
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  export let invitation: any;

  const groomName: string = invitation.groom?.name || 'Groom';
  const brideName: string = invitation.bride?.name || 'Bride';
  const coverImage: string = invitation.cover?.imageUrls?.[0] || '';
  const guestName: string = invitation.guestName || 'Tamu Undangan';
  const groomNameStyle = getAdaptiveNameStyle(groomName, { maxRem: 2.0, minRem: 1.05, endAt: 24 });
  const brideNameStyle = getAdaptiveNameStyle(brideName, { maxRem: 2.0, minRem: 1.05, endAt: 24 });

  let show = false;
  onMount(() => {
    show = true;
  });

  const dispatch = createEventDispatcher();
  function open() {
    dispatch('open');
  }
</script>

{#if show}
  <section
    in:fade={{ duration: 800 }}
    class="flex h-svh w-full items-center justify-center overflow-hidden"
    style="background:#0d1b2a;"
  >
    <div class="mx-auto flex h-full w-full max-w-sm flex-col items-center justify-center px-5 py-3">
      <!-- Passport booklet -->
      <div
        in:fly={{ y: 30, delay: 200, duration: 900, easing: cubicOut }}
        class="relative w-full overflow-hidden rounded-sm"
        style="
          background:#12263f;
          border:1px solid rgba(201,168,76,0.35);
          box-shadow:0 0 0 1px rgba(201,168,76,0.12), 0 20px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(201,168,76,0.15);
        "
      >
        <!-- Top security band -->
        <div
          style="height:3px;background:linear-gradient(to right,#c9a84c,#e8d08a,#c9a84c,#8a6a1c,#c9a84c);"
        ></div>

        <!-- Spine fold illusion -->
        <div
          style="position:absolute;left:0;top:3px;bottom:3px;width:8px;background:linear-gradient(to right,#0a1520,#1a3050,#0d1b2a);border-right:1px solid rgba(201,168,76,0.2);"
        ></div>

        <div class="flex flex-col items-center pt-4 pr-5 pb-4 pl-9">
          <!-- Country label -->
          <p
            in:fly={{ y: -8, delay: 400, duration: 600, easing: cubicOut }}
            class="mb-0.5 text-sm tracking-[0.55em] uppercase"
            style="color:rgba(201,168,76,0.55);font-family:var(--font-heading,serif);"
          >
            The Republic of
          </p>
          <p
            in:fly={{ y: -8, delay: 450, duration: 600, easing: cubicOut }}
            class="mb-3 text-sm tracking-[0.5em] uppercase"
            style="color:#c9a84c;font-family:var(--font-heading,serif);letter-spacing:0.4em;"
          >
            Wedding
          </p>

          <!-- Emblem + cover photo side by side -->
          <div class="mb-3 flex w-full items-center gap-3">
            <!-- Emblem -->
            <div
              in:fade={{ delay: 500, duration: 700 }}
              class="flex shrink-0 items-center justify-center"
            >
              <svg width="56" height="56" viewBox="0 0 72 72" fill="none">
                <circle
                  cx="36"
                  cy="36"
                  r="33"
                  stroke="#c9a84c"
                  stroke-width="0.8"
                  stroke-dasharray="3 2"
                  opacity="0.5"
                />
                <circle cx="36" cy="36" r="28" stroke="#c9a84c" stroke-width="0.5" opacity="0.3" />
                <path
                  d="M36 14 L39 26 L52 26 L42 34 L45 46 L36 39 L27 46 L30 34 L20 26 L33 26 Z"
                  fill="none"
                  stroke="#c9a84c"
                  stroke-width="0.9"
                  stroke-linejoin="round"
                  opacity="0.7"
                />
                <path d="M36 28 L39 36 L36 44 L33 36 Z" fill="#c9a84c" opacity="0.5" />
                <path
                  d="M14 36 Q20 30 24 36 Q20 42 14 36"
                  fill="none"
                  stroke="#c9a84c"
                  stroke-width="0.7"
                  opacity="0.4"
                />
                <path
                  d="M58 36 Q52 30 48 36 Q52 42 58 36"
                  fill="none"
                  stroke="#c9a84c"
                  stroke-width="0.7"
                  opacity="0.4"
                />
              </svg>
            </div>

            <!-- Cover photo -->
            {#if coverImage}
              <div
                in:fade={{ delay: 650, duration: 700 }}
                class="flex-1 overflow-hidden"
                style="height:110px;border:1px solid rgba(201,168,76,0.25);"
              >
                <img
                  src={coverImage}
                  alt="Cover"
                  class="h-full w-full object-cover"
                  style="filter:brightness(0.85) sepia(15%);"
                />
              </div>
            {:else}
              <!-- If no photo, center emblem by removing flex gap -->
              <div></div>
            {/if}
          </div>

          <!-- PASSPORT / INVITATION title -->
          <p
            in:fade={{ delay: 600, duration: 600 }}
            class="mb-0.5 text-xs tracking-[0.5em] uppercase"
            style="color:rgba(201,168,76,0.5);font-family:var(--font-heading,serif);"
          >
            Wedding Invitation
          </p>
          <div
            style="width:50px;height:1px;background:linear-gradient(to right,transparent,#c9a84c,transparent);margin:5px auto 10px;"
          ></div>

          <!-- Names -->
          <div
            in:fly={{ y: 12, delay: 700, duration: 700, easing: cubicOut }}
            class="mb-2 text-center"
          >
            <p
              class="mb-1 text-sm tracking-[0.35em] uppercase"
              style="color:rgba(201,168,76,0.45);font-family:var(--font-heading,serif);"
            >
              The Honorable
            </p>
            <p
              class="text-xl"
              style={brideNameStyle + '; color:#e8d4a0;font-family:var(--font-script,cursive);'}
            >
              {brideName}
            </p>
            <p
              class="my-1 text-sm tracking-[0.3em] uppercase"
              style="color:rgba(201,168,76,0.4);font-family:var(--font-heading,serif);"
            >
              &
            </p>
            <p
              class="text-xl"
              style={groomNameStyle + '; color:#e8d4a0;font-family:var(--font-script,cursive);'}
            >
              {groomName}
            </p>
          </div>

          <!-- Guest name field -->
          <div
            in:fade={{ delay: 850, duration: 600 }}
            class="mt-3 w-full pt-3"
            style="border-top:1px solid rgba(201,168,76,0.18);"
          >
            <p
              class="mb-0.5 text-sm tracking-[0.4em] uppercase"
              style="color:rgba(201,168,76,0.4);font-family:var(--font-heading,serif);"
            >
              Issued To
            </p>
            <p
              class="text-sm tracking-wider"
              style="color:#d4c08a;font-family:var(--font-heading,serif);"
            >
              {guestName}
            </p>
          </div>
        </div>

        <!-- Bottom security band -->
        <div
          style="height:3px;background:linear-gradient(to right,#c9a84c,#8a6a1c,#c9a84c,#e8d08a,#c9a84c);"
        ></div>
      </div>

      <!-- MRZ-style machine readable zone -->
      <div
        in:fade={{ delay: 1000, duration: 700 }}
        class="mt-2 w-full overflow-hidden px-3 py-2"
        style="background:#081018;border:1px solid rgba(201,168,76,0.12);"
      >
        <p
          class="text-left text-sm tracking-widest break-all"
          style="color:rgba(201,168,76,0.3);font-family:monospace;line-height:1.7;"
        >
          P&lt;WED{(
            groomName.toUpperCase().replace(/\s/g, '<') +
            '<<' +
            brideName.toUpperCase().replace(/\s/g, '<')
          ).substring(0, 39)}<br />
          {Math.random()
            .toString(36)
            .substring(2, 11)
            .toUpperCase()}WED&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
        </p>
      </div>

      <!-- Open button -->
      <button
        in:fly={{ y: 16, delay: 1100, duration: 700, easing: cubicOut }}
        onclick={open}
        class="mt-4 px-10 py-2.5 text-sm tracking-[0.5em] uppercase transition-all duration-300"
        style="
          border:1px solid rgba(201,168,76,0.5);
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
        Open Invitation
      </button>
    </div>
  </section>
{/if}
