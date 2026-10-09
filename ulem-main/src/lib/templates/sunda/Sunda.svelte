<script lang="ts">
  import { onMount } from 'svelte';
  import { formatIndonesianDate } from '$lib/utils/formatDate';
  import { fetchRsvps, formatRsvpTime, submitRsvp, type Rsvp, type RsvpPresence } from '$lib/rsvp';
  import Credit from '$lib/Credit.svelte';

  export let invitation: any;

  const groom = invitation.groom ?? {};
  const bride = invitation.bride ?? {};
  const events = invitation.events ?? [];
  const gallery = invitation.gallery?.imageUrls ?? [];
  const stories = invitation.loveStories ?? [];
  const gifts = invitation.gifts ?? [];
  const fullNames = `${groom.name ?? 'Mempelai Pria'} & ${bride.name ?? 'Mempelai Wanita'}`;
  const targetDate = events.find((event: any) => event.date)?.date;

  let wishes: Rsvp[] = [];
  let name = '';
  let presence: RsvpPresence | '' = '';
  let message = '';
  let submitting = false;
  let feedback = '';
  let activeImage = '';
  let countdown = { days: '00', hours: '00', minutes: '00', seconds: '00' };

  function updateCountdown() {
    if (!targetDate) return;
    const remaining = Math.max(0, new Date(targetDate).getTime() - Date.now());
    countdown = {
      days: String(Math.floor(remaining / 86_400_000)).padStart(2, '0'),
      hours: String(Math.floor((remaining / 3_600_000) % 24)).padStart(2, '0'),
      minutes: String(Math.floor((remaining / 60_000) % 60)).padStart(2, '0'),
      seconds: String(Math.floor((remaining / 1_000) % 60)).padStart(2, '0')
    };
  }

  onMount(() => {
    let timer: ReturnType<typeof setInterval>;
    updateCountdown();
    timer = setInterval(updateCountdown, 1000);
    if (invitation.slug) fetchRsvps(invitation.slug).then((items) => (wishes = items));
    return () => clearInterval(timer);
  });

  async function sendRsvp() {
    if (!name.trim() || !presence) {
      feedback = 'Mohon isi nama dan pilih konfirmasi kehadiran.';
      return;
    }
    submitting = true;
    feedback = '';
    try {
      await submitRsvp(invitation.slug, {
        name: name.trim(),
        presence,
        message: message.trim() || undefined
      });
      wishes = await fetchRsvps(invitation.slug);
      name = '';
      presence = '';
      message = '';
      feedback = 'Hatur nuhun. Konfirmasi Anda telah kami terima.';
    } catch (error: any) {
      feedback = error.message ?? 'Konfirmasi belum dapat dikirim.';
    } finally {
      submitting = false;
    }
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      feedback = 'Nomor rekening berhasil disalin.';
    } catch {
      feedback = 'Nomor rekening belum dapat disalin dari perangkat ini.';
    }
  }

  function instagramUrl(value: string) {
    return /^https?:\/\//i.test(value) ? value : `https://instagram.com/${value.replace(/^@/, '')}`;
  }

  function instagramHandle(value: string) {
    const match = value.match(/instagram\.com\/([^/?#]+)/i);
    return `@${(match?.[1] ?? value).replace(/^@/, '').replace(/\/$/, '')}`;
  }
</script>

<svelte:head>
  <title>Undangan Pernikahan Adat Sunda | {fullNames}</title>
  <meta name="theme-color" content="#254237" />
</svelte:head>

<main class="sunda-page">
  {#if invitation.quote?.text}
    <section class="opening paper-section" id="salam">
      <div class="section-inner narrow" in:fade={{ duration: 700 }}>
        <p class="eyebrow">Wilujeng Sumping</p>
        <span class="ornament-mark" aria-hidden="true">❧</span>
        <h2>{invitation.quote.text}</h2>
        {#if invitation.quote.source}<p class="source">{invitation.quote.source}</p>{/if}
        <p class="sundanese">Mugi maparin kabagjaan tur rahayu kanggo urang sadaya.</p>
      </div>
    </section>
  {:else}
    <section class="opening paper-section" id="salam">
      <div class="section-inner narrow" in:fade={{ duration: 700 }}>
        <p class="eyebrow">Wilujeng Sumping</p>
        <span class="ornament-mark" aria-hidden="true">❧</span>
        <h2>Kalayan asmana Gusti Nu Maha Suci, kalayan bingah manah kami ngaturaken uleman.</h2>
        <p class="sundanese">Mugi maparin kabagjaan tur rahayu kanggo urang sadaya.</p>
      </div>
    </section>
  {/if}

  <section class="couple-section paper-section" id="mempelai">
    <div class="section-inner">
      <p class="eyebrow">Dua Hati, Hiji Pangharepan</p>
      <h2 class="section-title">Kulawarga Nu Ngahiji</h2>
      <p class="section-intro">Kalayan asih sareng pangestu kulawarga, kami nyuhunkeun doa restu dina ngamimitian kahirupan anyar.</p>
      <div class="couple-grid">
        {#each [{ person: bride, role: 'Mempelai Wanita', fallback: '/images/default/bride.jpg' }, { person: groom, role: 'Mempelai Pria', fallback: '/images/default/groom.png' }] as item, index}
          <article class="person">
            <div class="portrait-frame">
              <span class="frame-corner corner-tl" aria-hidden="true"></span><span class="frame-corner corner-tr" aria-hidden="true"></span>
              <span class="frame-corner corner-bl" aria-hidden="true"></span><span class="frame-corner corner-br" aria-hidden="true"></span>
              <img src={item.person.imageUrls?.[0] ?? item.fallback} alt="Potret {item.role}" />
              <span class="portrait-caption">{index === 0 ? 'Putri' : 'Putra'} Priangan</span>
            </div>
            <p class="eyebrow role">{item.role}</p>
            <h3>{item.person.name ?? item.role}</h3>
            <p class="parents">{index === 0 ? 'Putri' : 'Putra'} ti Bapak {item.person.father ?? '-'} sareng Ibu {item.person.mother ?? '-'}</p>
            {#if item.person.notes}<p class="parents">{item.person.notes}</p>{/if}
            {#if item.person.socialMedia?.instagram}
              <a class="social-link" href={instagramUrl(item.person.socialMedia.instagram)} target="_blank" rel="noreferrer">{instagramHandle(item.person.socialMedia.instagram)}</a>
            {/if}
          </article>
        {/each}
      </div>
      <div class="couple-join" aria-hidden="true"><span>&amp;</span></div>
    </div>
  </section>

  {#if stories.length}
    <section class="story-section paper-section" id="carita">
      <div class="section-inner narrow">
        <p class="eyebrow">Lalakon Asih</p>
        <h2 class="section-title">Carita Urang</h2>
        <div class="story-list">
          {#each stories as story, index}
            {@const storyDate = story.date ? formatIndonesianDate(story.date) : null}
            <article class="story-entry">
              <div class="story-number">{String(index + 1).padStart(2, '0')}</div>
              <div class="story-paper">
                {#if story.imageUrl}<img src={story.imageUrl} alt={story.title} />{/if}
                <div class="story-copy">
                  {#if storyDate}<p class="eyebrow">{storyDate.day} {storyDate.monthName} {storyDate.year}</p>{/if}
                  <h3>{story.title}</h3>
                  <p>{story.description}</p>
                </div>
              </div>
            </article>
          {/each}
        </div>
      </div>
    </section>
  {/if}

  <section class="event-section" id="acara">
    <div class="section-inner">
      <p class="eyebrow">Mapag Poé Bagja</p>
      <h2 class="section-title">Waktos sareng Tempat</h2>
      <div class="event-grid">
        {#each events as event}
          {@const eventDate = event.date ? formatIndonesianDate(event.date, event.startTime, event.endTime) : null}
          <article class="event-paper">
            <div class="event-rule" aria-hidden="true"></div>
            <p class="event-overline">{event.title}</p>
            {#if eventDate}
              <p class="event-day">{eventDate.dayName}</p>
              <p class="event-date">{eventDate.day} {eventDate.monthName} {eventDate.year}</p>
              <p class="event-time">{eventDate.timeRange}</p>
            {/if}
            <div class="event-divider" aria-hidden="true">✦</div>
            <p class="event-location">{event.location}</p>
            {#if event.locationUrl}<a class="heritage-button" href={event.locationUrl} target="_blank" rel="noreferrer">Tingali Peta <span aria-hidden="true">↗</span></a>{/if}
          </article>
        {/each}
      </div>
    </div>
  </section>

  {#if targetDate}
    <section class="countdown-section" aria-label="Hitung mundur pernikahan">
      <div class="countdown-inner">
        <p class="eyebrow">Ngantosan Poé Nu Mulya</p>
        <h2>Ngitung Waktos</h2>
        <div class="countdown-grid">
          {#each [{ label: 'Dinten', value: countdown.days }, { label: 'Jam', value: countdown.hours }, { label: 'Menit', value: countdown.minutes }, { label: 'Detik', value: countdown.seconds }] as unit}
            <div class="countdown-unit"><strong>{unit.value}</strong><span>{unit.label}</span></div>
          {/each}
        </div>
      </div>
    </section>
  {/if}

  {#if gallery.length}
    <section class="gallery-section paper-section" id="galeri">
      <div class="section-inner">
        <p class="eyebrow">Kumpulan Kenangan</p>
        <h2 class="section-title">Album Pangantén</h2>
        <div class="gallery-grid">
          {#each gallery.slice(0, 9) as image, index}
            <button class="gallery-photo" aria-label="Buka foto {index + 1}" on:click={() => (activeImage = image)}>
              <span class="photo-mat"><img src={image} alt="Kenangan mempelai {index + 1}" /></span>
              <span class="photo-caption">Kenangan {String(index + 1).padStart(2, '0')}</span>
            </button>
          {/each}
        </div>
      </div>
    </section>
  {/if}

  {#if gifts.length}
    <section class="gift-section" id="tanda-kasih">
      <div class="section-inner narrow">
        <p class="eyebrow">Tanda Pangestu</p>
        <h2 class="section-title">Tanda Asih</h2>
        <p class="section-intro">Doa sareng kasumpingan anjeun mangrupikeun pangbagéa anu pangageungna. Upami kersa, tanda asih tiasa dikintunkeun ngalangkungan:</p>
        <div class="gift-grid">
          {#each gifts as gift}
            <article class="gift-paper">
              <span class="gift-seal" aria-hidden="true">S</span>
              {#if gift.type === 'bank' || gift.type === 'eWallet'}
                <p class="eyebrow">{gift.name ?? 'Rekening'}</p>
                <strong class="account-number">{gift.accountNumber}</strong>
                <p>a.n. {gift.accountHolder}</p>
                <button class="heritage-button" on:click={() => copy(gift.accountNumber ?? '')}>Salin Nomor Rekening</button>
              {:else}
                <p class="eyebrow">Kintun Kado</p>
                <h3>{gift.name ?? 'Alamat Pengiriman'}</h3>
                <p class="gift-description">{gift.description}</p>
              {/if}
            </article>
          {/each}
        </div>
      </div>
    </section>
  {/if}

  <section class="rsvp-section paper-section" id="konfirmasi">
    <div class="section-inner narrow">
      <p class="eyebrow">Waleran Uleman</p>
      <h2 class="section-title">Konfirmasi Kehadiran</h2>
      <p class="section-intro">Hatur nuhun parantos maparin waktos kanggo ngawaler uleman ieu.</p>
      <form class="rsvp-form" on:submit|preventDefault={sendRsvp}>
        <label>Nama anjeun<input bind:value={name} placeholder="Tuliskeun nami" autocomplete="name" /></label>
        <fieldset>
          <legend>Konfirmasi hadir</legend>
          <div class="presence-options">
            <button type="button" class:selected={presence === 'hadir'} on:click={() => (presence = 'hadir')}>Hadir</button>
            <button type="button" class:selected={presence === 'mungkin'} on:click={() => (presence = 'mungkin')}>Mungkin</button>
            <button type="button" class:selected={presence === 'tidak'} on:click={() => (presence = 'tidak')}>Berhalangan</button>
          </div>
        </fieldset>
        <label>Ucapan sareng doa<textarea bind:value={message} placeholder="Tuliskeun ucapan" rows="4"></textarea></label>
        <button class="heritage-button submit-button" disabled={submitting}>{submitting ? 'Ngirim...' : 'Kirim Waleran'}</button>
        {#if feedback}<p class="feedback" role="status">{feedback}</p>{/if}
      </form>
      {#if wishes.length}
        <div class="wishes-list">
          {#each wishes.slice(0, 6) as wish}
            <article><div><strong>{wish.name}</strong><span>{formatRsvpTime(wish.createdAt)}</span></div><p>{wish.message || (wish.presence === 'hadir' ? 'Bakal hadir' : wish.presence === 'mungkin' ? 'Nembe dipertimbangkeun' : 'Teu tiasa hadir')}</p></article>
          {/each}
        </div>
      {/if}
    </div>
  </section>

  <footer class="closing-section" id="panutup">
    <div class="landscape" aria-hidden="true">
      <div class="mountain mountain-back"></div><div class="mountain mountain-front"></div>
      <div class="rice-field"></div>
      <div class="sundanese-house"><span class="house-roof"></span><span class="house-body"></span><span class="house-posts"></span></div>
      <span class="hanjuang hanjuang-left"></span><span class="hanjuang hanjuang-right"></span>
    </div>
    <div class="closing-copy">
      <p class="eyebrow">Hatur Nuhun</p>
      <h2>{fullNames}</h2>
      <p>{invitation.closing?.message || 'Hatur nuhun kana doa sareng pangestu. Mugia urang sadaya salawasna dipaparin kabagjaan.'}</p>
    </div>
    <div class="closing-border" aria-hidden="true"></div>
    <Credit />
  </footer>

  <nav class="bottom-nav" aria-label="Navigasi undangan">
    <a href="#salam" aria-label="Pembuka"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5M5.5 9v11h13V9M9 20v-6h6v6" /></svg><span>Buka</span></a>
    <a href="#mempelai" aria-label="Mempelai"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.2"/><circle cx="17" cy="9" r="2.4"/><path d="M2.5 20c.4-4 2.5-6 6.5-6s6.1 2 6.5 6M14 14c3.8-.8 6.3 1.1 7 4.5" /></svg><span>Rerencangan</span></a>
    <a href="#acara" aria-label="Acara"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="16"/><path d="M7.5 3v4M16.5 3v4M3.5 10h17M8 14h2M14 14h2M8 17h2" /></svg><span>Acara</span></a>
    <a href="#galeri" aria-label="Galeri"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16"/><circle cx="9" cy="10" r="2"/><path d="m4 18 5-4 3 2 3-4 5 5" /></svg><span>Galeri</span></a>
    <a href="#konfirmasi" aria-label="RSVP"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h16v13H4zM7 9h10M7 12.5h7M7 16h4" /></svg><span>Waleran</span></a>
  </nav>
</main>

{#if activeImage}
  <div class="lightbox" role="dialog" aria-modal="true" aria-label="Foto galeri">
    <button class="lightbox-backdrop" aria-label="Tutup foto" on:click={() => (activeImage = '')}></button>
    <div class="lightbox-content"><button class="lightbox-close" aria-label="Tutup foto" on:click={() => (activeImage = '')}>×</button><img src={activeImage} alt="Foto mempelai" /></div>
  </div>
{/if}

<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&family=Great+Vibes&display=swap');

  :global(html) { scroll-behavior: smooth; }
  .sunda-page {
    --forest: #254237;
    --forest-deep: #1c352c;
    --wood: #684634;
    --wood-deep: #432f25;
    --paper: #f5eddd;
    --paper-light: #fbf7ed;
    --ink: #392e26;
    --muted: #756655;
    --brick: #994d38;
    --old-gold: #9a7745;
    color: var(--ink);
    background: var(--paper);
    font-family: 'DM Sans', sans-serif;
    overflow: hidden;
    padding-bottom: 4.5rem;
  }
  .paper-section {
    position: relative;
    background-color: var(--paper-light);
    background-image: radial-gradient(rgba(89, 64, 43, .11) .55px, transparent .7px), repeating-linear-gradient(0deg, transparent 0 7px, rgba(108, 82, 57, .018) 7px 8px);
    background-size: 7px 7px, auto;
  }
  .paper-section::before, .event-section::before, .gift-section::before {
    position: absolute; inset: 0; content: ''; pointer-events: none; opacity: .14;
    background: repeating-linear-gradient(45deg, transparent 0 19px, rgba(73, 95, 69, .16) 19px 20px, transparent 20px 39px, rgba(73, 95, 69, .16) 39px 40px);
    mask-image: linear-gradient(90deg, #000, transparent 29%, transparent 71%, #000);
  }
  .section-inner { position: relative; z-index: 1; width: min(100% - 2.5rem, 68rem); margin: 0 auto; padding: 5.5rem 0; text-align: center; }
  .section-inner.narrow { width: min(100% - 2.5rem, 47rem); }
  .eyebrow { margin: 0; color: var(--brick); font: 600 .68rem/1.5 'DM Sans', sans-serif; letter-spacing: .16em; text-transform: uppercase; }
  .section-title, .opening h2 { color: var(--forest); font: 500 clamp(2.1rem, 5vw, 3.5rem)/1.06 'Cormorant Garamond', serif; }
  .section-title { margin: .5rem 0 1.2rem; }
  .section-intro { max-width: 36rem; margin: 0 auto 2.5rem; color: var(--muted); font: 400 1.05rem/1.75 'Cormorant Garamond', serif; }
  .opening { min-height: 72vh; display: grid; place-items: center; text-align: center; }
  .opening .section-inner { padding: 7rem 0; }
  .opening h2 { max-width: 40rem; margin: 1.1rem auto .7rem; font-size: clamp(1.8rem, 4vw, 2.7rem); }
  .ornament-mark { display: block; margin: .7rem auto; color: var(--old-gold); font: 3rem/1 'Cormorant Garamond', serif; }
  .source { color: var(--old-gold); font-size: .72rem; }
  .sundanese { color: var(--forest); font: italic 1.18rem 'Cormorant Garamond', serif; }
  .couple-section { overflow: hidden; }
  .couple-section .section-inner { padding-top: 5rem; }
  .couple-grid { display: grid; grid-template-columns: 1fr; gap: 3rem; max-width: 52rem; margin: 3rem auto 0; }
  .person { text-align: center; }
  .portrait-frame { position: relative; width: min(100%, 20rem); aspect-ratio: 4 / 5; margin: auto; padding: .65rem; background: repeating-linear-gradient(45deg, #94704b 0 3px, #cfb88b 3px 6px, #79553b 6px 8px); box-shadow: 0 12px 24px rgba(61, 43, 31, .18); }
  .portrait-frame::before { position: absolute; inset: .9rem; content: ''; border: 1px solid rgba(248, 238, 213, .8); pointer-events: none; z-index: 1; }
  .portrait-frame img { width: 100%; height: 100%; object-fit: cover; filter: sepia(.12) saturate(.84) contrast(.97); }
  .portrait-caption { position: absolute; left: 50%; bottom: 1.2rem; z-index: 2; transform: translateX(-50%); color: #fff9ea; font: italic 1rem 'Cormorant Garamond', serif; text-shadow: 0 1px 5px #1d2118; white-space: nowrap; }
  .frame-corner { position: absolute; z-index: 2; width: 1.15rem; height: 1.15rem; border-color: #e2c991; }
  .corner-tl { top: .7rem; left: .7rem; border-top: 2px solid; border-left: 2px solid; }
  .corner-tr { top: .7rem; right: .7rem; border-top: 2px solid; border-right: 2px solid; }
  .corner-bl { bottom: .7rem; left: .7rem; border-bottom: 2px solid; border-left: 2px solid; }
  .corner-br { bottom: .7rem; right: .7rem; border-bottom: 2px solid; border-right: 2px solid; }
  .role { margin-top: 1.4rem; }
  .person h3 { margin: .25rem 0; color: var(--wood-deep); font: 500 2.25rem/1.05 'Cormorant Garamond', serif; }
  .parents { max-width: 20rem; margin: .45rem auto; color: var(--muted); font: 1.08rem/1.55 'Cormorant Garamond', serif; }
  .social-link { display: inline-block; margin-top: .6rem; color: var(--forest); font-size: .75rem; }
  .couple-join { position: relative; z-index: 2; width: 3rem; height: 3rem; margin: -2rem auto 0; display: grid; place-items: center; border: 1px solid var(--old-gold); border-radius: 50%; color: var(--old-gold); background: var(--paper-light); font: italic 1.7rem 'Cormorant Garamond', serif; }
  .story-section { background-color: #eee4d1; }
  .story-list { position: relative; margin-top: 3rem; }
  .story-list::before { position: absolute; top: 0; bottom: 0; left: 1rem; width: 1px; content: ''; background: var(--old-gold); }
  .story-entry { position: relative; padding: 0 0 2rem 3.2rem; text-align: left; }
  .story-number { position: absolute; left: 0; top: .4rem; width: 2rem; height: 2rem; display: grid; place-items: center; border: 1px solid var(--forest); border-radius: 50%; color: var(--forest); background: var(--paper); font: 600 .72rem 'DM Sans', sans-serif; }
  .story-paper { display: grid; grid-template-columns: 1fr; background: var(--paper-light); border: 1px solid rgba(104, 70, 52, .4); box-shadow: 4px 5px 0 rgba(104, 70, 52, .08); }
  .story-paper img { width: 100%; max-height: 16rem; object-fit: cover; filter: sepia(.12) saturate(.84); }
  .story-copy { padding: 1.2rem 1.3rem 1.5rem; }
  .story-copy h3 { margin: .3rem 0; color: var(--forest); font: 500 1.8rem 'Cormorant Garamond', serif; }
  .story-copy > p:last-child { margin: 0; color: var(--muted); font: 1.06rem/1.65 'Cormorant Garamond', serif; }
  .event-section { position: relative; background: #e7dfc9; }
  .event-section .section-inner { padding-top: 5.5rem; }
  .event-grid { display: grid; grid-template-columns: 1fr; gap: 1.25rem; max-width: 55rem; margin: 2.5rem auto 0; }
  .event-paper { position: relative; padding: 2.1rem 1.3rem; border: 1px solid rgba(68, 48, 35, .7); outline: 1px solid rgba(154, 119, 69, .62); outline-offset: -7px; background: repeating-linear-gradient(0deg, rgba(107, 82, 58, .025) 0 1px, transparent 1px 8px), #faf5e9; box-shadow: 0 12px 20px rgba(65, 47, 33, .08); }
  .event-rule { width: 5rem; height: .45rem; margin: 0 auto 1.2rem; background: repeating-linear-gradient(90deg, var(--forest) 0 3px, transparent 3px 6px); clip-path: polygon(0 50%, 8% 0, 16% 50%, 24% 0, 32% 50%, 40% 0, 48% 50%, 56% 0, 64% 50%, 72% 0, 80% 50%, 88% 0, 100% 50%, 88% 100%, 80% 50%, 72% 100%, 64% 50%, 56% 100%, 48% 50%, 40% 100%, 32% 50%, 24% 100%, 16% 50%, 8% 100%); }
  .event-overline { color: var(--brick); font: 600 .82rem 'DM Sans', sans-serif; letter-spacing: .14em; text-transform: uppercase; }
  .event-day { margin: 1rem 0 0; color: var(--muted); font: italic 1.4rem 'Cormorant Garamond', serif; }
  .event-date { margin: 0; color: var(--forest); font: 600 1.6rem 'Cormorant Garamond', serif; }
  .event-time { margin: .65rem 0; color: var(--wood); font-size: .82rem; }
  .event-divider { margin: 1.1rem; color: var(--old-gold); }
  .event-location { max-width: 20rem; margin: 0 auto; color: var(--ink); font: 1.08rem/1.5 'Cormorant Garamond', serif; }
  .heritage-button { display: inline-flex; min-height: 2.7rem; align-items: center; justify-content: center; gap: .55rem; margin-top: 1rem; padding: .65rem 1rem; border: 1px solid var(--forest); border-radius: 0; color: var(--paper-light); background: var(--forest); font: 600 .75rem 'DM Sans', sans-serif; letter-spacing: .04em; text-decoration: none; cursor: pointer; transition: background .18s ease, color .18s ease; }
  .heritage-button:hover { color: var(--forest); background: transparent; }
  .countdown-section { position: relative; padding: 4.4rem 1.25rem; color: var(--paper-light); background: var(--forest); text-align: center; }
  .countdown-section::before { position: absolute; inset: .65rem; border: 1px solid rgba(215, 191, 143, .54); content: ''; pointer-events: none; }
  .countdown-inner { position: relative; z-index: 1; }
  .countdown-section .eyebrow { color: #d4bc8c; }
  .countdown-section h2 { margin: .4rem 0 1.6rem; font: 500 2.3rem 'Cormorant Garamond', serif; }
  .countdown-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .55rem; max-width: 36rem; margin: auto; }
  .countdown-unit { min-width: 0; padding: .8rem .25rem; border: 1px solid rgba(226, 209, 172, .45); }
  .countdown-unit strong { display: block; font: 500 clamp(1.55rem, 7vw, 2.4rem)/1 'Cormorant Garamond', serif; }
  .countdown-unit span { display: block; margin-top: .35rem; color: #dac89d; font-size: .62rem; text-transform: uppercase; letter-spacing: .08em; }
  .gallery-section { background-color: #f4eddf; }
  .gallery-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .7rem; margin-top: 2rem; }
  .gallery-photo { min-width: 0; padding: .4rem .4rem .7rem; border: 1px solid rgba(104, 70, 52, .38); color: var(--muted); background: #fffaf0; text-align: left; cursor: zoom-in; box-shadow: 0 4px 8px rgba(62, 47, 34, .08); }
  .gallery-photo:nth-child(3n + 2) { transform: translateY(.55rem) rotate(.35deg); }
  .photo-mat { display: block; aspect-ratio: 1; overflow: hidden; background: #e0d2b5; }
  .photo-mat img { width: 100%; height: 100%; object-fit: cover; filter: sepia(.12) saturate(.83) contrast(.98); transition: transform .4s ease; }
  .gallery-photo:hover img { transform: scale(1.04); }
  .photo-caption { display: block; padding: .48rem .1rem 0; font: italic .95rem 'Cormorant Garamond', serif; }
  .gift-section { position: relative; background-color: #e4dfc9; }
  .gift-section .section-inner { padding-top: 5.3rem; }
  .gift-grid { display: grid; gap: 1rem; text-align: center; }
  .gift-paper { position: relative; min-width: 0; padding: 2rem 1.2rem 1.4rem; border: 1px solid rgba(104, 70, 52, .68); outline: 1px dashed rgba(154, 119, 69, .65); outline-offset: -7px; background: repeating-linear-gradient(45deg, rgba(118, 91, 57, .045) 0 2px, transparent 2px 11px), #f7f0df; color: var(--muted); font: 1rem 'Cormorant Garamond', serif; }
  .gift-seal { position: absolute; top: .8rem; right: .9rem; width: 1.8rem; height: 1.8rem; display: grid; place-items: center; border: 1px solid var(--old-gold); color: var(--brick); font: italic 1.1rem 'Cormorant Garamond', serif; }
  .account-number { display: block; margin: .75rem 0; color: var(--wood-deep); font: 600 1.4rem 'Cormorant Garamond', serif; }
  .gift-description { white-space: pre-line; }
  .rsvp-section { background-color: #f5eddd; }
  .rsvp-form { display: grid; gap: 1.2rem; padding: 1.5rem; border: 1px solid rgba(104, 70, 52, .58); outline: 1px solid rgba(154, 119, 69, .6); outline-offset: -7px; background: rgba(255, 251, 241, .7); text-align: left; }
  .rsvp-form label, .rsvp-form legend { color: var(--forest); font-size: .77rem; font-weight: 600; }
  .rsvp-form input, .rsvp-form textarea { display: block; width: 100%; margin-top: .45rem; padding: .8rem; border: 1px solid rgba(84, 68, 49, .4); border-radius: 0; outline-color: var(--forest); color: var(--ink); background: #fffdf7; font: 400 .9rem 'DM Sans', sans-serif; }
  .rsvp-form input:focus, .rsvp-form textarea:focus { border-color: var(--forest); }
  .rsvp-form fieldset { min-width: 0; margin: 0; padding: 0; border: 0; }
  .rsvp-form legend { margin-bottom: .55rem; }
  .presence-options { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .4rem; }
  .presence-options button { min-height: 2.5rem; padding: .45rem .25rem; border: 1px solid rgba(84, 68, 49, .4); border-radius: 0; color: var(--wood); background: transparent; font: 500 .68rem 'DM Sans', sans-serif; cursor: pointer; }
  .presence-options button.selected { border-color: var(--forest); color: #fffdf7; background: var(--forest); }
  .submit-button { width: 100%; margin: 0; }
  .feedback { margin: 0; color: var(--forest); font-size: .8rem; }
  .wishes-list { margin-top: 2rem; text-align: left; }
  .wishes-list article { padding: .9rem 0; border-bottom: 1px solid rgba(104, 70, 52, .24); }
  .wishes-list article > div { display: flex; justify-content: space-between; gap: 1rem; }
  .wishes-list strong { color: var(--forest); font: 600 1.05rem 'Cormorant Garamond', serif; }
  .wishes-list span { color: var(--muted); font-size: .66rem; }
  .wishes-list p { margin: .25rem 0 0; color: var(--muted); font: 1rem 'Cormorant Garamond', serif; }
  .closing-section { position: relative; min-height: 37rem; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; overflow: hidden; padding: 3rem 1.5rem 6.5rem; color: var(--paper-light); background: linear-gradient(180deg, #d9d2b6 0%, #84917a 47%, #29483b 100%); text-align: center; }
  .landscape { position: absolute; inset: 0; overflow: hidden; }
  .mountain { position: absolute; right: -10%; left: -10%; height: 42%; clip-path: polygon(0 83%, 12% 42%, 19% 57%, 34% 16%, 44% 56%, 54% 29%, 68% 68%, 82% 25%, 100% 79%, 100% 100%, 0 100%); }
  .mountain-back { top: 20%; opacity: .48; background: #647966; }
  .mountain-front { top: 35%; opacity: .7; background: #405f4b; transform: scaleX(-1); }
  .rice-field { position: absolute; right: -5%; bottom: 0; left: -5%; height: 38%; background: repeating-linear-gradient(168deg, transparent 0 19px, rgba(215, 195, 142, .42) 20px 21px, transparent 22px 37px), linear-gradient(180deg, #53694a, #243f34); clip-path: polygon(0 18%, 100% 0, 100% 100%, 0 100%); }
  .sundanese-house { position: absolute; bottom: 20%; left: 50%; width: 10.5rem; height: 6rem; transform: translateX(-50%); filter: drop-shadow(0 5px 6px rgba(25, 38, 30, .4)); }
  .house-roof { position: absolute; top: 0; left: -7%; width: 114%; height: 2.2rem; background: #513a2c; clip-path: polygon(0 100%, 24% 20%, 50% 0, 76% 20%, 100% 100%, 83% 82%, 50% 33%, 17% 82%); }
  .house-body { position: absolute; top: 1.55rem; left: 13%; width: 74%; height: 3.4rem; border: 3px solid #4d3a2a; background: repeating-linear-gradient(90deg, #b38d5c 0 7px, #99764e 7px 9px); }
  .house-posts { position: absolute; top: 4.8rem; left: 22%; width: 56%; height: 1.2rem; border-left: 4px solid #493829; border-right: 4px solid #493829; }
  .hanjuang { position: absolute; bottom: 18%; width: 3rem; height: 7.5rem; border-left: 3px solid #344d35; }
  .hanjuang::before, .hanjuang::after { position: absolute; left: -1px; width: 2rem; height: 1.4rem; content: ''; background: #38563d; clip-path: polygon(0 100%, 100% 0, 72% 100%); transform-origin: left bottom; }
  .hanjuang::before { top: 1.2rem; transform: rotate(-35deg); }
  .hanjuang::after { top: 3rem; transform: rotate(-15deg) scale(.9); }
  .hanjuang-left { left: 13%; transform: rotate(-10deg); }
  .hanjuang-right { right: 13%; transform: scaleX(-1) rotate(-10deg); }
  .closing-copy { position: relative; z-index: 2; width: min(100%, 36rem); margin-bottom: 3rem; text-shadow: 0 2px 12px rgba(22, 34, 27, .55); }
  .closing-copy .eyebrow { color: #e2cf9e; }
  .closing-copy h2 { margin: .5rem 0; font: 500 clamp(2.8rem, 9vw, 5rem)/.95 'Cormorant Garamond', serif; }
  .closing-copy > p:last-child { max-width: 29rem; margin: 1rem auto 0; color: #f8f1e0; font: 1.12rem/1.6 'Cormorant Garamond', serif; }
  .closing-border { position: absolute; z-index: 2; inset: .7rem; border: 1px solid rgba(242, 222, 172, .68); pointer-events: none; }
  :global(.closing-section .credit) { position: absolute; z-index: 3; bottom: 4.85rem; color: rgba(255, 249, 232, .8); }
  .bottom-nav { position: fixed; z-index: 20; right: 0; bottom: 0; left: 0; display: grid; grid-template-columns: repeat(5, 1fr); min-height: 4.25rem; padding: .35rem .35rem max(.35rem, env(safe-area-inset-bottom)); border-top: 1px solid rgba(207, 190, 153, .55); color: #f6efdd; background: var(--forest-deep); box-shadow: 0 -4px 16px rgba(40, 42, 31, .16); }
  .bottom-nav a { display: flex; min-width: 0; flex-direction: column; align-items: center; justify-content: center; gap: .2rem; color: inherit; text-decoration: none; }
  .bottom-nav svg { width: 1.25rem; height: 1.25rem; fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.4; }
  .bottom-nav span { font-size: .58rem; }
  .lightbox { position: fixed; z-index: 50; inset: 0; display: grid; place-items: center; padding: 1.5rem; }
  .lightbox-backdrop { position: absolute; inset: 0; border: 0; background: rgba(24, 31, 26, .88); }
  .lightbox-content { position: relative; z-index: 1; max-width: min(92vw, 56rem); max-height: 88vh; padding: .55rem; border: 1px solid #c9b581; background: var(--paper-light); }
  .lightbox-content img { display: block; max-width: 100%; max-height: calc(88vh - 1.2rem); object-fit: contain; }
  .lightbox-close { position: absolute; top: -.8rem; right: -.8rem; width: 2.25rem; height: 2.25rem; border: 1px solid #e0cfaa; border-radius: 50%; color: #fff; background: var(--forest); font-size: 1.5rem; cursor: pointer; }

  @media (min-width: 700px) {
    .sunda-page { padding-bottom: 0; }
    .couple-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 3rem; }
    .couple-join { margin-top: -1.7rem; }
    .event-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .story-entry { padding-left: 4rem; }
    .story-list::before { left: 1.35rem; }
    .story-number { left: .35rem; }
    .story-paper { grid-template-columns: minmax(0, 10rem) 1fr; align-items: center; }
    .story-paper img { width: 10rem; height: 100%; min-height: 10rem; max-height: 13rem; }
    .story-copy { padding: 1.4rem 1.6rem; }
    .gallery-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.2rem; }
    .gift-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .rsvp-form { padding: 2rem; }
    .bottom-nav { position: absolute; top: 0; right: 2rem; bottom: auto; left: auto; width: 23rem; min-height: 3.6rem; border: 1px solid rgba(207, 190, 153, .55); border-top: 0; }
    .bottom-nav span { font-size: .63rem; }
    :global(.closing-section .credit) { bottom: 1rem; }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(html) { scroll-behavior: auto; }
    *, *::before, *::after { transition-duration: .01ms !important; animation-duration: .01ms !important; }
  }
</style>
