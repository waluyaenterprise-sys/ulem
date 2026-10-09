<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  export let invitation: any;

  const groomName: string = invitation.groom?.name || 'Groom';
  const brideName: string = invitation.bride?.name || 'Bride';
  const coverImages: string[] = invitation.cover?.imageUrls || [];
  const bgImage = coverImages[0] || '';
  const guestName: string = invitation.guestName || 'Tamu Undangan';

  let show = false;
  onMount(() => {
    show = true;
  });

  const dispatch = createEventDispatcher();
  function openInvitation() {
    dispatch('open');
  }
</script>

{#if show}
  <section
    in:fade={{ duration: 600 }}
    class="relative flex min-h-svh w-full overflow-hidden"
    style="background:#000;"
  >
    <!-- LEFT: Photo panel — full bleed, clipped diagonally -->
    <div class=" absolute inset-0">
      {#if bgImage}
        <img
          src={bgImage}
          alt="Cover"
          class="h-full w-full object-cover"
          style="filter:brightness(0.55) contrast(1.1);"
        />
      {:else}
        <div class="h-full w-full" style="background:#111;"></div>
      {/if}
      <!-- Diagonal clip mask via pseudo -->
      <div class="diagonal-overlay"></div>
    </div>

    <!-- RIGHT: Black content panel -->
    <div
      class="relative z-10 flex min-h-svh w-full flex-col items-end justify-center pr-7 pl-[48%]"
    >
      <!-- Gold vertical rule -->
      <div
        in:fly={{ x: 20, delay: 400, duration: 700, easing: cubicOut }}
        class="absolute top-16 bottom-16 left-[46%]"
        style="width:1px;background:linear-gradient(to bottom, transparent, #c9a84c 15%, #c9a84c 85%, transparent);"
      ></div>

      <!-- Content -->
      <div
        in:fly={{ x: 30, delay: 500, duration: 800, easing: cubicOut }}
        class="flex flex-col items-end text-right"
      >
        <!-- Label -->
        <p
          class="mb-5 text-[9px] tracking-[0.4em] uppercase"
          style="color:#c9a84c;font-family:var(--font-heading,sans-serif);"
        >
          The Wedding Of
        </p>

        <!-- Gold thin rule -->
        <div
          style="width:50px;height:1px;background:#c9a84c;margin-bottom:20px;margin-left:auto;opacity:0.7;"
        ></div>

        <!-- Names stacked -->
        <span
          class="block leading-none"
          style="font-family:var(--font-script,serif);font-size:3rem;color:#fff;">{brideName}</span
        >
        <span
          class="my-2 block text-2xl"
          style="font-family:var(--font-script,serif);color:#c9a84c;opacity:0.8;">&amp;</span
        >
        <span
          class="block leading-none"
          style="font-family:var(--font-script,serif);font-size:3rem;color:#fff;">{groomName}</span
        >

        <!-- Divider -->
        <div
          style="width:50px;height:1px;background:#c9a84c;margin-top:20px;margin-left:auto;opacity:0.7;"
        ></div>

        <!-- Guest -->
        <div class="mt-7 flex flex-col items-end gap-1">
          <p
            class="text-[9px] tracking-[0.25em] uppercase"
            style="color:#c9a84c;opacity:0.7;font-family:var(--font-heading,sans-serif);"
          >
            Kepada Yth.
          </p>
          <p
            class="text-sm"
            style="color:rgba(255,255,255,0.85);font-family:var(--font-heading,sans-serif);"
          >
            {guestName}
          </p>
        </div>

        <!-- CTA -->
        <button
          in:fly={{ x: 20, delay: 900, duration: 600, easing: cubicOut }}
          on:click={openInvitation}
          class="mt-10 cursor-pointer border px-8 py-3 text-[10px] tracking-[0.3em] uppercase transition-all duration-300 hover:bg-[#c9a84c] hover:text-black active:scale-95"
          style="
            font-family:var(--font-heading,sans-serif);
            border-color:#c9a84c;
            color:#c9a84c;
          ">Buka Undangan</button
        >
      </div>
    </div>
  </section>
{/if}

<style>
  .diagonal-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.7) 100%);
  }
</style>
