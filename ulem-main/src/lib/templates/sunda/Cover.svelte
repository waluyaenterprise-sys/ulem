<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { formatIndonesianDate } from '$lib/utils/formatDate';

  export let invitation: any;

  const dispatch = createEventDispatcher();
  const groom = invitation.groom ?? {};
  const bride = invitation.bride ?? {};
  const firstEvent = (invitation.events ?? []).find((event: any) => event.date);
  const date = firstEvent ? formatIndonesianDate(firstEvent.date) : null;
  const coverImage = bride.imageUrls?.[0] ?? invitation.gallery?.imageUrls?.[0] ?? '/images/default/bride.jpg';
  const guestName = invitation.guestName || 'Tamu Undangan';
</script>

<svelte:head>
  <title>Undangan Pernikahan Adat Sunda</title>
</svelte:head>

<section class="sunda-cover" in:fade={{ duration: 650 }}>
  <div class="woven-edge woven-left" aria-hidden="true"></div>
  <div class="woven-edge woven-right" aria-hidden="true"></div>
  <div class="cover-sky" aria-hidden="true">
    <div class="far-hills"></div><div class="near-hills"></div>
    <div class="cover-house"><span></span><i></i></div>
    <span class="leaf leaf-left"></span><span class="leaf leaf-right"></span>
  </div>
  <div class="invitation-card">
    <div class="card-border" aria-hidden="true"></div>
    <div class="card-pattern" aria-hidden="true"></div>
    <div class="card-content">
      <p class="place-label">Priangan · Jawa Barat</p>
      <svg class="kujang-mark" viewBox="0 0 42 54" aria-hidden="true">
        <path d="M21 51V29c-8 0-15-5-15-13 0-5 3-9 8-11-1 5 1 8 5 10 1-7 5-11 12-13-2 7-1 12 4 17 2 3 2 7 0 10-2 3-6 5-11 5v20" />
        <path d="M17 50h8M14 18c2 3 5 5 9 5" />
      </svg>
      <p class="card-title">Undangan Pernikahan</p>
      <p class="greeting">Wilujeng Sumping</p>
      <div class="couple-portrait">
        <img src={coverImage} alt="Potret pengantin" />
        <span class="portrait-frame" aria-hidden="true"></span>
      </div>
      <h1>{groom.name ?? 'Mempelai Pria'}<span>&amp;</span>{bride.name ?? 'Mempelai Wanita'}</h1>
      {#if date}
        <p class="wedding-date">{date.dayName}<span>{date.day} {date.monthName} {date.year}</span></p>
      {/if}
      <div class="card-rule" aria-hidden="true"><i></i><b>✦</b><i></i></div>
      <div class="recipient"><span>Ka nu dipihormat</span><strong>{guestName}</strong></div>
      <button class="open-button" on:click={() => dispatch('open')}>Buka Uleman <span aria-hidden="true">↓</span></button>
    </div>
    <span class="bamboo-knot knot-top" aria-hidden="true">✥</span>
    <span class="bamboo-knot knot-bottom" aria-hidden="true">✥</span>
  </div>
  <p class="cover-footer">Kalayan pangestu sareng doa, urang patepang dina dinten bagja</p>
</section>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
  .sunda-cover { position: relative; min-height: 100svh; display: grid; place-items: center; overflow: hidden; padding: 2.5rem 1.2rem 4.5rem; color: #352d23; background: #344d3d; isolation: isolate; }
  .sunda-cover::before { position: absolute; inset: 0; z-index: -2; content: ''; background: linear-gradient(180deg, #d9d0ad 0%, #b3b393 32%, #63775d 60%, #344d3d 100%); }
  .sunda-cover::after { position: absolute; inset: 0; z-index: -1; content: ''; opacity: .2; background-image: radial-gradient(rgba(66, 48, 33, .4) .55px, transparent .75px); background-size: 6px 6px; pointer-events: none; }
  .cover-sky { position: absolute; z-index: -1; inset: 0; overflow: hidden; }
  .far-hills, .near-hills { position: absolute; right: -8%; bottom: 0; left: -8%; height: 58%; clip-path: polygon(0 80%, 11% 58%, 24% 65%, 41% 20%, 52% 61%, 68% 34%, 83% 67%, 100% 43%, 100% 100%, 0 100%); }
  .far-hills { background: #73846a; opacity: .62; }
  .near-hills { height: 38%; background: #405b45; opacity: .8; transform: scaleX(-1); }
  .cover-house { position: absolute; left: 50%; bottom: 15%; width: 6rem; height: 3.4rem; transform: translateX(-50%); opacity: .72; }
  .cover-house::before { position: absolute; top: 0; left: -10%; width: 120%; height: 1.6rem; content: ''; background: #4d392b; clip-path: polygon(0 100%, 28% 23%, 50% 0, 72% 23%, 100% 100%, 82% 82%, 50% 38%, 18% 82%); }
  .cover-house span { position: absolute; top: 1.1rem; left: 10%; width: 80%; height: 1.8rem; border: 2px solid #4d392b; background: #b09262; }
  .cover-house i { position: absolute; bottom: 0; left: 44%; width: 12%; height: 1.2rem; background: #4d392b; }
  .leaf { position: absolute; bottom: 12%; width: 3rem; height: 10rem; border-left: 2px solid rgba(37, 66, 50, .7); }
  .leaf::before, .leaf::after { position: absolute; left: -1px; width: 2.6rem; height: 1.6rem; content: ''; background: #33533c; clip-path: polygon(0 100%, 100% 0, 73% 100%); transform-origin: left bottom; }
  .leaf::before { top: 1.5rem; transform: rotate(-33deg); }
  .leaf::after { top: 3.5rem; transform: rotate(-12deg) scale(.82); }
  .leaf-left { left: 7%; transform: rotate(-5deg); }
  .leaf-right { right: 7%; transform: scaleX(-1) rotate(-5deg); }
  .woven-edge { position: absolute; top: 0; bottom: 0; width: 2rem; opacity: .52; background: repeating-linear-gradient(0deg, transparent 0 8px, #d6c49b 8px 10px, transparent 10px 18px), repeating-linear-gradient(90deg, transparent 0 8px, rgba(69, 50, 35, .72) 8px 10px, transparent 10px 18px); }
  .woven-left { left: 0; }.woven-right { right: 0; }
  .invitation-card { position: relative; width: min(100%, 29rem); padding: .85rem; border: 1px solid #c6a76d; background: #f4eddb; box-shadow: 0 18px 40px rgba(24, 36, 27, .32); }
  .card-border { position: absolute; inset: .45rem; border: 1px solid rgba(100, 69, 42, .7); pointer-events: none; }
  .card-pattern { position: absolute; inset: .85rem; opacity: .14; background: radial-gradient(ellipse at center, transparent 0 26%, #765a3b 27% 29%, transparent 30%), radial-gradient(ellipse at center, transparent 0 26%, #765a3b 27% 29%, transparent 30%); background-size: 2rem 2rem; background-position: 0 0, 1rem 1rem; mask-image: linear-gradient(90deg, #000, transparent 18%, transparent 82%, #000); pointer-events: none; }
  .card-content { position: relative; display: flex; flex-direction: column; align-items: center; padding: 1.5rem .8rem 1.4rem; text-align: center; }
  .place-label { margin: 0; color: #746044; font: 500 .61rem 'DM Sans', sans-serif; letter-spacing: .19em; text-transform: uppercase; }
  .kujang-mark { display: block; width: 1.35rem; height: 1.75rem; margin: .35rem auto; fill: rgba(142, 109, 61, .12); stroke: #8e6d3d; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.5; }
  .card-title { margin: .2rem 0; color: #38503e; font: 600 .8rem 'DM Sans', sans-serif; letter-spacing: .14em; text-transform: uppercase; }
  .greeting { margin: .25rem 0 1rem; color: #7c503b; font: italic 1.1rem 'Cormorant Garamond', serif; }
  .couple-portrait { position: relative; width: min(58%, 11rem); aspect-ratio: 4 / 4.5; padding: .4rem; background: repeating-linear-gradient(45deg, #967343 0 3px, #d3bd8b 3px 6px, #755638 6px 8px); }
  .couple-portrait img { width: 100%; height: 100%; object-fit: cover; filter: sepia(.14) saturate(.84); }
  .portrait-frame { position: absolute; inset: .72rem; border: 1px solid rgba(250, 238, 203, .9); pointer-events: none; }
  h1 { display: flex; flex-direction: column; gap: .06rem; max-width: 100%; margin: .85rem 0 .4rem; color: #3d3328; font: 500 clamp(2rem, 8vw, 2.8rem)/.95 'Cormorant Garamond', serif; }
  h1 span { color: #9b6947; font-size: 1.5rem; font-style: italic; }
  .wedding-date { margin: .35rem 0 0; color: #6f593e; font: italic 1rem 'Cormorant Garamond', serif; }
  .wedding-date span { display: block; margin-top: .16rem; color: #3b4c3d; font-size: 1.15rem; font-style: normal; }
  .card-rule { display: flex; align-items: center; gap: .55rem; margin-top: .85rem; color: #947449; }
  .card-rule i { width: 2rem; height: 1px; background: #a38a5e; }
  .card-rule b { font-size: .65rem; font-weight: 400; }
  .recipient { display: grid; gap: .2rem; margin-top: .7rem; color: #756553; font: italic .85rem 'Cormorant Garamond', serif; }
  .recipient strong { color: #3f3429; font: 600 .76rem 'DM Sans', sans-serif; }
  .open-button { display: inline-flex; align-items: center; gap: .6rem; min-height: 2.65rem; margin-top: 1rem; padding: .6rem 1.15rem; border: 1px solid #254237; border-radius: 0; color: #f9f0df; background: #254237; font: 500 .72rem 'DM Sans', sans-serif; letter-spacing: .05em; cursor: pointer; }
  .open-button:hover { color: #254237; background: transparent; }
  .bamboo-knot { position: absolute; z-index: 2; left: 50%; transform: translateX(-50%); color: #a0834f; background: #f4eddb; font-size: .8rem; }
  .knot-top { top: .42rem; }.knot-bottom { bottom: .42rem; }
  .cover-footer { position: absolute; bottom: 1rem; left: 1rem; right: 1rem; margin: 0; color: #f6f0de; font: italic 1rem 'Cormorant Garamond', serif; text-align: center; text-shadow: 0 1px 4px #273a2e; }
  @media (min-width: 700px) { .sunda-cover { padding-top: 4rem; padding-bottom: 5rem; }.invitation-card { padding: 1rem; }.card-content { padding: 1.6rem 1rem; }.couple-portrait { width: min(55%, 12rem); } }
  @media (max-height: 700px) { .sunda-cover { min-height: 44rem; }.card-content { padding-top: .8rem; padding-bottom: .8rem; }.couple-portrait { width: 7.5rem; }.greeting { margin-bottom: .5rem; }.cover-footer { bottom: .45rem; } }
</style>
