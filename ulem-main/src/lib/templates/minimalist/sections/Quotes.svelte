<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { tweened } from 'svelte/motion';
  import { formatIndonesianDate } from '$lib/utils/formatDate';

  let mounted = false;
  onMount(() => {
    mounted = true;
  });

  export let invitation: any;

  const groomName: string = (invitation.groom.name || 'GROOM').split(' ')[0];
  const brideName: string = (invitation.bride.name || 'BRIDE').split(' ')[0];
  const quoteUrls: string[] = invitation.quote?.imageUrls || invitation.quote?.images || [];
  const quoteImage = quoteUrls[0] || '';
  const quoteText: string = invitation.quote?.text || 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya.';
  const quoteSource: string = invitation.quote?.source || 'QS. Ar-Rum: 21';
  const eventDate = invitation.events?.[0]?.date
    ? formatIndonesianDate(invitation.events[0].date)
    : null;
  const targetDate = invitation.events?.[0]?.date ? new Date(invitation.events[0].date) : null;

  // Countdown
  let days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0;
  function updateCountdown() {
    if (!targetDate) return;
    const diff = targetDate.getTime() - Date.now();
    if (diff <= 0) {
      days = hours = minutes = seconds = 0;
      return;
    }
    days = Math.floor(diff / 86400000);
    hours = Math.floor((diff % 86400000) / 3600000);
    minutes = Math.floor((diff % 3600000) / 60000);
    seconds = Math.floor((diff % 60000) / 1000);
  }

  // Bottom sheet drag
  const PEEK_HEIGHT = 200; // px visible when collapsed — shows countdown
  let sheetEl: HTMLElement;
  let sheetHeight = 0;
  let expanded = false;

  // translateY: 0 = fully open, positive = partially hidden
  const translateY = tweened(0, { duration: 400, easing: cubicOut });

  let startY = 0;
  let dragDelta = 0;
  let isDragging = false;
  let dragZoneEl: HTMLElement;

  function getCollapsed() {
    return sheetHeight - PEEK_HEIGHT;
  }

  let sectionEl: HTMLElement;
  let sectionInView = false;

  function lockScroll() {
    document.body.style.overflow = 'hidden';
  }
  function unlockScroll() {
    document.body.style.overflow = '';
  }

  function onPointerMove(e: PointerEvent) {
    if (!isDragging) return;
    dragDelta = e.clientY - startY;
    const next = (expanded ? 0 : getCollapsed()) + dragDelta;
    translateY.set(Math.max(0, Math.min(getCollapsed(), next)), { duration: 0 });
  }

  function cleanupDragListeners() {
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
    document.removeEventListener('pointercancel', onPointerCancel);
  }

  function onPointerUp() {
    if (!isDragging) return;
    isDragging = false;
    cleanupDragListeners();
    if (dragDelta < -40) {
      expanded = true;
      translateY.set(0);
      unlockScroll();
    } else if (dragDelta > 40) {
      expanded = false;
      translateY.set(getCollapsed());
      if (sectionInView) lockScroll();
    } else {
      translateY.set(expanded ? 0 : getCollapsed());
    }
  }

  function onPointerCancel() {
    if (!isDragging) return;
    isDragging = false;
    cleanupDragListeners();
    translateY.set(expanded ? 0 : getCollapsed());
  }

  function onPointerDown(e: PointerEvent) {
    // ignore right-click on mouse
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    // when expanded, only respond to touches originating from the drag zone
    if (expanded && !dragZoneEl?.contains(e.target as Node)) return;
    startY = e.clientY;
    dragDelta = 0;
    isDragging = true;
    translateY.set($translateY, { duration: 0 });
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointercancel', onPointerCancel);
  }

  onMount(() => {
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    sheetHeight = sheetEl.offsetHeight;
    translateY.set(getCollapsed(), { duration: 0 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        sectionInView = entry.isIntersecting;
        if (entry.isIntersecting && !expanded) {
          lockScroll();
        } else {
          unlockScroll();
        }
      },
      { threshold: 0.8 }
    );
    observer.observe(sectionEl);

    return () => {
      clearInterval(timer);
      observer.disconnect();
      unlockScroll();
    };
  });
</script>

<section
  bind:this={sectionEl}
  on:pointerdown={onPointerDown}
  class="relative flex h-svh w-full flex-col bg-cover bg-center bg-no-repeat"
  style={`${quoteImage ? `background-image: url(${encodeURI(quoteImage)});` : ''} touch-action: ${expanded ? 'auto' : 'none'}; ${isDragging ? 'user-select: none; cursor: grabbing;' : ''}`}
>
  <!-- OVERLAY -->
  <div class="absolute inset-0 bg-black/40"></div>

  <!-- FULL PAGE: Wedding Of text -->
  <div class="relative z-10 flex flex-1 flex-col items-center justify-center px-8 pb-20 text-white">
    {#if mounted}
      <p in:fade={{ delay: 200, duration: 700 }} class="font-script text-3xl">The Wedding Of</p>

      <h1
        in:fly={{ x: -40, delay: 400, duration: 800, easing: cubicOut }}
        class="mt-5 w-full -translate-x-4 text-left font-jomolhari text-6xl tracking-wide"
      >
        {brideName}
      </h1>

      <p in:fade={{ delay: 600, duration: 600 }} class="w-full text-center font-jomolhari text-4xl">
        &amp;
      </p>

      <h1
        in:fly={{ x: 40, delay: 700, duration: 800, easing: cubicOut }}
        class="w-full translate-x-4 text-right font-jomolhari text-6xl tracking-wide"
      >
        {groomName}
      </h1>

      {#if eventDate}
        <div in:fade={{ delay: 900, duration: 600 }} class="mt-6 h-px w-20 bg-white/50"></div>
        <p
          in:fly={{ y: 10, delay: 1000, duration: 600, easing: cubicOut }}
          class="mt-4 text-sm tracking-widest text-white/80 uppercase"
        >
          {eventDate.dayName}, {eventDate.day}
          {eventDate.monthName}
          {eventDate.year}
        </p>
      {/if}
    {/if}
  </div>

  <!-- BOTTOM SHEET -->
  <div
    bind:this={sheetEl}
    style="transform: translateY({$translateY}px);"
    class="absolute bottom-0 left-0 z-20 min-h-svh w-full rounded-t-3xl bg-white/15 px-8 pt-4 pb-12 text-center text-white backdrop-blur-lg"
  >
    <!-- DRAG ZONE: handle + "Menuju Hari Bahagia" label + countdown numbers -->
    <div bind:this={dragZoneEl} style="touch-action: none;" class="w-full cursor-grab select-none">
      <!-- handle bar -->
      <div class="mx-auto mb-4 flex flex-col items-center pt-2">
        <div class="h-1 w-14 rounded-full bg-[#F0A269]/60"></div>
      </div>

      <!-- COUNTDOWN inside the drag zone -->
      {#if targetDate}
        <p class="mb-4 text-xs tracking-widest text-[#F0A269]/90 uppercase">Menuju Hari Bahagia</p>
        <div class="flex items-end justify-center gap-4">
          {#each [{ v: days, l: 'Hari' }, { v: hours, l: 'Jam' }, { v: minutes, l: 'Menit' }, { v: seconds, l: 'Detik' }] as item}
            <div class="flex flex-col items-center">
              <span class="font-jomolhari text-4xl leading-none font-semibold">
                {String(item.v).padStart(2, '0')}
              </span>
              <span class="mt-1 text-xs text-white/60">{item.l}</span>
            </div>
          {/each}
        </div>
        <div class="my-7 h-px w-full bg-white/20"></div>
      {/if}
    </div>

    <!-- QUOTE (not part of drag zone so text stays selectable when expanded) -->
    <p class="font-jomolhari text-lg leading-relaxed opacity-90">
      “{quoteText}”
    </p>
    <p class="mt-3 font-jomolhari text-sm opacity-50">— {quoteSource}</p>
  </div>
</section>
