<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
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
  const quote = invitation.quote ?? {};
  const quoteText =
    quote.text ||
    (invitation.theme === 'floral'
      ? 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan-pasangan dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya.'
      : '');
  const fullNames = `${groom.name ?? 'Mempelai'} & ${bride.name ?? 'Mempelai'}`;

  let wishes: Rsvp[] = [];
  let name = '';
  let presence: RsvpPresence | '' = '';
  let message = '';
  let submitting = false;
  let feedback = '';
  let galleryOpen = false;
  let activeImage = '';

  onMount(async () => {
    if (invitation.slug) wishes = await fetchRsvps(invitation.slug);
  });

  function openImage(image: string) {
    activeImage = image;
    galleryOpen = true;
  }
  async function sendRsvp() {
    if (!name.trim() || !presence) {
      feedback = 'Mohon lengkapi nama dan konfirmasi kehadiran.';
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
      feedback = 'Terima kasih, konfirmasi Anda telah kami terima.';
    } catch (error: any) {
      feedback = error.message ?? 'Konfirmasi belum dapat dikirim.';
    } finally {
      submitting = false;
    }
  }
  function copy(text: string) {
    navigator.clipboard?.writeText(text);
  }
  function instagramHandle(value: string) {
    const match = value.match(/instagram\.com\/([^/?#]+)/i);
    return `@${(match?.[1] ?? value).replace(/^@/, '').replace(/\/$/, '')}`;
  }
  function instagramUrl(value: string) {
    return /^https?:\/\//i.test(value) ? value : `https://instagram.com/${value.replace(/^@/, '')}`;
  }
</script>

<main class="floral-main">
  {#if quoteText}
    <section class="quote section padded">
      <div class="quote-side quote-side-left" in:fly={{ x: -110, duration: 900 }}>
        <img src="/images/floral/floral-side.png" alt="" />
      </div>
      <div class="quote-side quote-side-right" in:fly={{ x: 110, duration: 900 }}>
        <img src="/images/floral/floral-side.png" alt="" />
      </div>
      <div class="quote-inner" in:fly={{ y: 54, delay: 260, duration: 850 }}>
        <p class="quote-welcome">A little note of love</p>
        <p class="arabic">“</p>
        <blockquote>{quoteText}</blockquote>
        {#if quote.source || invitation.theme === 'floral'}<cite
            >{quote.source || 'QS. Ar-Rum: 21'}</cite
          >{/if}
      </div>
    </section>
  {/if}

  <section class="couple section padded">
    <p class="kicker">The Bride & Groom</p>
    <h2>Mempelai</h2>
    <div class="couple-stack">
      <article class="person bride-person">
        <div class="botanical-frame">
          <img class="frame-side frame-side-left" src="/images/floral/floral-side.png" alt="" />
          <img class="frame-side frame-side-right" src="/images/floral/floral-side.png" alt="" />
          <img class="frame-bottom" src="/images/floral/floral-top.png" alt="" />
          <img class="frame-accent accent-top" src="/images/watercolor/flower-1.png" alt="" />
          <div class="portrait">
            <img src={bride.imageUrls?.[0] ?? '/images/default/bride.jpg'} alt={bride.name ?? 'Mempelai wanita'} />
          </div>
        </div>
        <p class="person-role">Mempelai Wanita</p>
        <h3>{bride.name ?? 'Mempelai Wanita'}</h3>
        <p class="person-parent">Putri dari Bapak {bride.father ?? '-'} &amp; Ibu {bride.mother ?? '-'}</p>
        {#if bride.notes}<p class="person-sibling">{bride.notes}</p>{/if}
        {#if bride.socialMedia?.instagram}<a class="instagram" href={instagramUrl(bride.socialMedia.instagram)} target="_blank" rel="noreferrer" aria-label="Instagram {bride.name}"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg>{instagramHandle(bride.socialMedia.instagram)}</a>{/if}
      </article>
      <div class="couple-divider"><span>&amp;</span></div>
      <article class="person groom-person">
        <div class="botanical-frame">
          <img class="frame-side frame-side-left" src="/images/floral/floral-side.png" alt="" />
          <img class="frame-side frame-side-right" src="/images/floral/floral-side.png" alt="" />
          <img class="frame-bottom" src="/images/floral/floral-top.png" alt="" />
          <img class="frame-accent accent-top" src="/images/watercolor/flower-1.png" alt="" />
          <div class="portrait">
            <img src={groom.imageUrls?.[0] ?? '/images/default/groom.png'} alt={groom.name ?? 'Mempelai pria'} />
          </div>
        </div>
        <p class="person-role">Mempelai Pria</p>
        <h3>{groom.name ?? 'Mempelai Pria'}</h3>
        <p class="person-parent">Putra dari Bapak {groom.father ?? '-'} &amp; Ibu {groom.mother ?? '-'}</p>
        {#if groom.notes}<p class="person-sibling">{groom.notes}</p>{/if}
        {#if groom.socialMedia?.instagram}<a class="instagram" href={instagramUrl(groom.socialMedia.instagram)} target="_blank" rel="noreferrer" aria-label="Instagram {groom.name}"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg>{instagramHandle(groom.socialMedia.instagram)}</a>{/if}
      </article>
    </div>
  </section>

  <section class="events section padded">
    <img class="event-flower event-flower-left" src="/images/floral/blue-sagee.png" alt="" />
    <img class="event-flower event-flower-right" src="/images/floral/blue-sagee.png" alt="" />
    <p class="kicker">Save The Date</p>
    <h2>Rangkaian Acara</h2>
    <div class="event-list">
      {#each events as event}
        {@const eventDate = event.date ? formatIndonesianDate(event.date, event.startTime, event.endTime) : null}
        <article class="event-detail">
          <h3>{event.title}</h3>
          {#if eventDate}
            <p class="event-date">{eventDate.dayName}, {eventDate.day} {eventDate.monthName} {eventDate.year}</p>
            <p class="event-time">{eventDate.timeRange}</p>
          {/if}
          <p class="event-location">{event.location}</p>
          {#if event.locationUrl}<a
              class="outline-button"
              href={event.locationUrl}
              target="_blank"
              rel="noreferrer">Lihat Lokasi</a
            >{/if}
        </article>
      {/each}
    </div>
  </section>

  {#if stories.length}
    <section class="story section padded">
      <img class="story-flower story-flower-top" src="/images/watercolor/loose1.png" alt="" />
      <img class="story-flower story-flower-bottom" src="/images/floral/blue-sagee.png" alt="" />
      <div class="story-heading">
        <p class="kicker">Our Journey</p>
        <h2>Love Story</h2>
        <p>Perjalanan sederhana yang membawa kami pada hari bahagia ini.</p>
      </div>
      <div class="story-list">
        {#each stories as story, i}
          {@const storyDate = story.date ? formatIndonesianDate(story.date) : null}
          <article class="story-card">
            <div class="story-rail">
              <span class:rail-hidden={i === 0}></span><i></i><span class:rail-hidden={i === stories.length - 1}></span>
            </div>
            <div class="story-paper">
              <div class="story-photo">
                {#if story.imageUrl}<img src={story.imageUrl} alt={story.title} />{:else}<div class="story-photo-placeholder"></div>{/if}
                <div class="story-photo-label"><h3>{story.title}</h3>{#if storyDate}<p>{storyDate.day} {storyDate.monthName} {storyDate.year}</p>{/if}</div>
              </div>
              <p class="story-description">{story.description}</p>
              <img class="story-card-flower" class:story-card-flower-left={i % 2 !== 0} src="/images/watercolor/loose3.png" alt="" />
            </div>
          </article>
        {/each}
        <div class="story-ending"><span></span><p>...dan seterusnya bersama.</p></div>
      </div>
    </section>
  {/if}

  {#if gallery.length}
    <section class="gallery section padded">
      <img class="gallery-flower gallery-flower-left" src="/images/floral/floral-side.png" alt="" />
      <img class="gallery-flower gallery-flower-right" src="/images/floral/floral-side.png" alt="" />
      <p class="kicker">Captured Moments</p>
      <h2>Gallery</h2>
      <div class="gallery-grid">
        {#each gallery.slice(0, 9) as image, index}<button
            aria-label="Buka foto {index + 1}"
            on:click={() => openImage(image)}><img src={image} alt="Momen {index + 1}" /></button
          >{/each}
      </div>
    </section>
  {/if}

  {#if gifts.length}
    <section class="gifts section padded">
      <img class="gift-flower" src="/images/watercolor/loose2.png" alt="" />
      <p class="kicker">Wedding Gift</p>
      <h2>Tanda Kasih</h2>
      <p class="section-description">
        Kehadiran dan doa restu Anda sudah menjadi hadiah terindah. Namun bila berkenan memberikan
        tanda kasih, dapat melalui:
      </p>
      <div class="gift-list">
        {#each gifts as gift, index}
          <article class="gift-card" style="transform: rotate({index % 2 === 0 ? '1deg' : '-1deg'})">
            <div class="gift-stitch"></div>
            <div class="gift-seal">gift</div>
            {#if gift.type === 'bank' || gift.type === 'eWallet'}
              <div class="gift-card-content">
                <p class="gift-transfer-label">Transfer ke</p>
                <p class="bank-name">{gift.name}</p>
                <strong>{gift.accountNumber}</strong>
                <p>a.n. {gift.accountHolder}</p>
                <button class="gift-copy" on:click={() => copy(gift.accountNumber ?? '')}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 16H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2m-6 12h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2Z" />
                  </svg>
                  Salin
                </button>
              </div>
            {:else}
              <div class="gift-card-content physical-gift">
                <p class="gift-transfer-label">Kirim Kado</p>
                <p>{gift.name ?? 'Alamat Pengiriman'}</p>
                <p class="gift-description">{gift.description}</p>
              </div>
            {/if}
          </article>{/each}
      </div>
    </section>
  {/if}

  <section class="rsvp section padded">
    <p class="kicker">RSVP</p>
    <h2>Konfirmasi Kehadiran</h2>
    <p class="section-description">
      Mohon konfirmasi kehadiran Anda untuk membantu kami mempersiapkan hari istimewa ini.
    </p>
    <form on:submit|preventDefault={sendRsvp}>
      <input bind:value={name} placeholder="Nama Anda" aria-label="Nama Anda" />
      <div class="presence">
        <button
          type="button"
          class:chosen={presence === 'hadir'}
          on:click={() => (presence = 'hadir')}>Hadir</button
        ><button
          type="button"
          class:chosen={presence === 'mungkin'}
          on:click={() => (presence = 'mungkin')}>Mungkin</button
        ><button
          type="button"
          class:chosen={presence === 'tidak'}
          on:click={() => (presence = 'tidak')}>Berhalangan</button
        >
      </div>
      <textarea bind:value={message} placeholder="Tulis ucapan dan doa" rows="4"></textarea><button
        class="submit"
        disabled={submitting}>{submitting ? 'Mengirim...' : 'Kirim Konfirmasi'}</button
      >
      {#if feedback}<p class="feedback">{feedback}</p>{/if}
    </form>
    {#if wishes.length}<div class="wishes">
        {#each wishes.slice(0, 6) as wish}<article>
            <strong>{wish.name}</strong><span>{formatRsvpTime(wish.createdAt)}</span>
            <p>
              {wish.message ||
                (wish.presence === 'hadir'
                  ? 'Akan hadir'
                  : wish.presence === 'mungkin'
                    ? 'Masih mempertimbangkan kehadiran'
                    : 'Berhalangan hadir')}
            </p>
          </article>{/each}
      </div>{/if}
  </section>

  <section class="closing section">
    <img class="hanging" src="/images/floral/floral-top-new.png" alt="" />
    <div>
      <p class="kicker">Thank You</p>
      <h2>{fullNames}</h2>
      <p>
        {invitation.closing?.message ||
          'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.'}
      </p>
    </div>
    <img class="floral-bottom" src="/images/floral/floral-top.png" alt="" />
  </section>
  <Credit />
</main>

{#if galleryOpen}
  <div class="lightbox" role="dialog" aria-modal="true" aria-label="Foto galeri">
    <button class="backdrop" aria-label="Tutup foto" on:click={() => (galleryOpen = false)}
    ></button>
    <div class="lightbox-content">
      <button class="close" aria-label="Tutup foto" on:click={() => (galleryOpen = false)}>×</button
      >
      <img src={activeImage} alt="Foto galeri" />
    </div>
  </div>
{/if}

<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Great+Vibes&family=Montserrat:wght@400;500;600&display=swap');
  .floral-main {
    --olive: #706d41;
    --ink: #55544a;
    --pink: #c98d9b;
    --cream: #fffef9;
    --blush: #d8baa7;
    --rose: #d39ca7;
    --rose-deep: #b6747d;
    --gold: #d1b07a;
    --sage: #b7c1a9;
    --ivory: #fffdf9;
    --shadow-soft: rgba(103, 92, 72, 0.14);
    color: var(--ink);
    background:
      radial-gradient(circle at top, rgba(255, 255, 255, 0.99) 0%, rgba(253, 250, 246, 0.97) 26%, rgba(244, 239, 231, 0.98) 100%);
    font-family: Montserrat, sans-serif;
    overflow: hidden;
    letter-spacing: 0.01em;
    position: relative;
  }
  .floral-main::before,
  .floral-main::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }
  .floral-main::before {
    background:
      radial-gradient(circle at 18% 9%, rgba(219, 188, 165, 0.22), transparent 12%),
      radial-gradient(circle at 84% 10%, rgba(191, 170, 146, 0.15), transparent 16%),
      radial-gradient(circle at 50% 70%, rgba(198, 174, 155, 0.14), transparent 22%);
  }
  .floral-main::after {
    background-image: linear-gradient(90deg, rgba(160, 138, 108, 0.025) 1px, transparent 1px);
    background-size: 52px 100%;
    opacity: 0.7;
  }
  .section {
    position: relative;
    text-align: center;
    isolation: isolate;
    z-index: 1;
  }
  .section::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background:
      radial-gradient(circle at 20% 12%, rgba(217, 186, 165, 0.18), transparent 15%),
      radial-gradient(circle at 78% 8%, rgba(178, 145, 116, 0.14), transparent 18%),
      radial-gradient(circle at 50% 82%, rgba(202, 176, 155, 0.18), transparent 25%);
  }
  .padded {
    padding: 5rem 1.4rem;
  }
  .section > * {
    position: relative;
    z-index: 1;
  }
  h2,
  h3 {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 500;
  }
  h2 {
    margin: 0.35rem 0 2.1rem;
    color: var(--olive);
    font-size: clamp(2.25rem, 5vw, 3.2rem);
    line-height: 1;
    letter-spacing: 0.04em;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
  }
  h3 {
    color: var(--olive);
    font-size: clamp(1.5rem, 3vw, 2rem);
    margin: 0.6rem 0;
    letter-spacing: 0.03em;
  }
  .kicker {
    margin: 0;
    color: #a48671;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
  }
  .section-description {
    max-width: 31rem;
    margin: -1.2rem auto 2rem;
    color: #77746b;
    font:
      italic 1.05rem/1.7 'Cormorant Garamond',
      serif;
  }
  .closing {
    box-sizing: border-box;
    min-height: 100svh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 9rem 1.5rem 8rem;
    background: linear-gradient(120deg, #fffffc, #f9f7ef);
  }
  .closing::after {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0.26;
    background-image: radial-gradient(#c8c1a7 0.7px, transparent 0.8px);
    background-size: 11px 11px;
    pointer-events: none;
  }
  .hanging {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 50%;
    width: min(110%, 560px);
    transform: translateX(-50%);
  }
  .floral-bottom {
    position: absolute;
    z-index: 1;
    bottom: 0;
    left: 50%;
    width: min(128%, 630px);
    transform: translateX(-50%);
  }
  .closing > div {
    position: relative;
    z-index: 2;
    max-width: 28rem;
  }
  .closing h2 {
    font-family: 'Great Vibes', cursive;
    font-size: clamp(3rem, 12vw, 5rem);
    line-height: 0.98;
    margin: 1.2rem 0 0.8rem;
  }
  .closing p:last-child {
    font:
      italic 1.08rem/1.7 'Cormorant Garamond',
      serif;
  }
  .quote {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    min-height: 100svh;
    overflow: hidden;
    background: linear-gradient(180deg, rgba(250,248,244,0.96), rgba(245,239,232,0.9));
  }
  .quote::before {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0.38;
    background-image: linear-gradient(90deg, rgba(222, 211, 188, 0.2) 1px, transparent 1px);
    background-size: 5px 100%;
    pointer-events: none;
  }
  .quote-inner {
    position: relative;
    z-index: 1;
    max-width: 20rem;
    padding: 2rem 1.5rem 1.5rem;
    background: linear-gradient(145deg, rgba(255,255,255,0.82), rgba(249,241,233,0.6));
    border: 1px solid rgba(164, 132, 104, 0.2);
    border-radius: 1.75rem;
    box-shadow: 0 24px 44px rgba(177, 136, 112, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(1px);
    transform: perspective(1200px) rotateX(1deg);
  }
  .quote-inner::before,
  .quote-inner::after {
    content: '';
    position: absolute;
    width: 82px;
    height: 82px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(231,193,170,0.3) 32%, transparent 70%);
    filter: blur(2px);
    opacity: 0.72;
  }
  .quote-inner::before {
    top: -14px;
    left: -16px;
  }
  .quote-inner::after {
    right: -12px;
    bottom: -10px;
  }
  .quote-welcome {
    margin: 0 0 0.65rem;
    color: #c58f9c;
    font:
      1.7rem 'Great Vibes',
      cursive;
  }
  .arabic {
    margin: 0;
    color: #d7a4ae;
    font:
      5rem/0.5 Georgia,
      serif;
  }
  blockquote {
    margin: 1rem auto;
    color: #646258;
    font:
      italic 1.5rem/1.55 'Cormorant Garamond',
      serif;
  }
  cite {
    color: #a48671;
    font-size: 11px;
    font-style: normal;
  }
  .quote-side {
    position: absolute;
    z-index: 1;
    top: 0;
    width: 42%;
    height: 100svh;
    max-width: none;
    opacity: 0.9;
  }
  .quote-side img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 16px 24px rgba(157, 123, 102, 0.12)) saturate(1.18) contrast(1.08);
  }
  .quote-side-left {
    left: -42px;
  }
  .quote-side-left img {
    object-position: left center;
  }
  .quote-side-right {
    right: -42px;
  }
  .quote-side-right img {
    object-position: left center;
    transform: scaleX(-1);
  }
  /* Creamy's profile and gallery sections use py-16; Floral keeps the same page rhythm. */
  .couple,
  .gallery {
    padding-top: 4rem;
    padding-bottom: 4rem;
  }
  .person {
    min-width: 0;
  }
  .couple {
    overflow: hidden;
    background:
      linear-gradient(180deg, rgba(214, 219, 206, 0.96) 0%, rgba(210, 217, 201, 0.98) 100%);
  }
  .couple-stack {
    display: flex;
    max-width: 390px;
    margin: auto;
    flex-direction: column;
    gap: 3rem;
    perspective: 1200px;
  }
  .person {
    position: relative;
    z-index: 1;
  }
  .botanical-frame {
    position: relative;
    height: 470px;
    overflow: hidden;
    background:
      radial-gradient(circle at 50% 14%, rgba(255, 255, 255, 0.85), transparent 28%),
      linear-gradient(180deg, #dfe5d1 0%, #d7ddca 46%, #ccd5c4 100%);
    border: 1px solid rgba(111, 103, 76, 0.08);
    border-radius: 22px 22px 42px 42px;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.28), 0 28px 36px rgba(91, 93, 71, 0.14);
    transform: translateZ(0);
  }
  .botanical-frame::before {
    content: '';
    position: absolute;
    inset: 9% 12% auto 12%;
    height: 70%;
    border-radius: 140px 140px 18px 18px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.02));
    pointer-events: none;
  }
  .botanical-frame::after {
    content: '';
    position: absolute;
    inset: auto 15% 5% 15%;
    height: 24%;
    border-radius: 50%;
    background: radial-gradient(ellipse at center, rgba(158, 129, 90, 0.28), rgba(158, 129, 90, 0) 68%);
    filter: blur(16px);
    pointer-events: none;
  }
  .frame-side {
    position: absolute;
    z-index: 3;
    bottom: 8%;
    width: 46%;
    height: 69%;
    object-fit: contain;
    filter: drop-shadow(0 18px 18px rgba(92, 104, 73, 0.16)) saturate(1.14) contrast(1.08);
  }
  .frame-side-left {
    left: -4%;
  }
  .frame-side-right {
    right: -4%;
    transform: scaleX(-1);
  }
  .frame-bottom {
    position: absolute;
    z-index: 4;
    bottom: 3%;
    left: 6%;
    width: 88%;
    filter: drop-shadow(0 14px 18px rgba(93, 110, 59, 0.16)) saturate(1.12);
  }
  .frame-accent {
    position: absolute;
    z-index: 5;
    width: 31%;
    object-fit: contain;
    filter: drop-shadow(0 12px 18px rgba(129, 90, 74, 0.18)) saturate(1.16) contrast(1.08);
  }
  .accent-top {
    top: 10%;
    left: 13%;
  }
  .portrait {
    position: absolute;
    z-index: 2;
    top: 15%;
    left: 50%;
    width: 57%;
    height: 68%;
    margin: 0;
    padding: 0;
    transform: translateX(-50%);
    border: 1px solid rgba(121, 109, 90, 0.08);
    border-radius: 130px 130px 24px 24px;
    background: linear-gradient(180deg, rgba(255,255,255,0.15), rgba(255,255,255,0.02));
    box-shadow: 0 18px 28px rgba(80, 83, 61, 0.16), 0 0 0 5px rgba(255,255,255,0.18);
    overflow: hidden;
  }
  .portrait img {
    width: 100%;
    height: 100%;
    border-radius: 130px 130px 20px 20px;
    object-fit: cover;
    filter: saturate(1.08) contrast(1.06) brightness(1.02);
    transform: scale(1.02);
  }
  .person-role {
    margin: 1.35rem 0 0 !important;
    color: #a48671;
    font: 600 10px Montserrat, sans-serif !important;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }
  .person h3 {
    margin-top: 0.45rem;
  }
  .person p:not(.person-role) {
    margin: 0.3rem auto;
    max-width: 15rem;
    font:
      italic 1rem/1.45 'Cormorant Garamond',
      serif;
  }
  .person-sibling {
    color: #77754e;
  }
  .person .instagram {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    margin-top: 0.45rem;
    color: #7f7b50;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .instagram svg {
    width: 14px;
    height: 14px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
  }
  .couple-divider {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1px;
    margin: 0.4rem 0;
    background: rgba(112, 109, 65, 0.25);
  }
  .couple-divider span {
    padding: 0 1rem;
    color: #bd919b;
    background: #d1d5ca;
    font: 2.5rem 'Great Vibes', cursive;
  }
  .events {
    background: linear-gradient(180deg, rgba(255,255,255,0.7), rgba(250,246,240,0.96));
    overflow: hidden;
  }
  .event-flower {
    position: absolute;
    z-index: 0;
    width: 210px;
    opacity: 0.88;
    filter: drop-shadow(0 18px 20px rgba(156, 123, 100, 0.12));
  }
  .event-flower-left {
    bottom: -22px;
    left: -58px;
    width: 250px;
  }
  .event-flower-right {
    right: -58px;
    bottom: -22px;
    width: 250px;
    transform: scaleX(-1);
  }
  .event-detail,
  .story-card,
  .gift-card,
  .rsvp-card,
  .closing-box {
    background: linear-gradient(180deg, rgba(255,255,255,0.78), rgba(246,239,232,0.68));
    border: 1px solid rgba(178, 147, 124, 0.18);
    box-shadow: 0 20px 36px rgba(144, 116, 99, 0.08), inset 0 1px 0 rgba(255,255,255,0.9);
    backdrop-filter: blur(1px);
  }
  @media (min-width: 768px) {
    .couple-stack {
      max-width: 960px;
      flex-direction: row;
      align-items: flex-start;
      justify-content: center;
      gap: 2rem;
    }
    .person {
      flex: 1 1 0;
      max-width: 370px;
    }
    .couple-divider {
      align-self: center;
      width: 1px;
      height: 240px;
      margin: 0 0.5rem;
      background: rgba(112, 109, 65, 0.25);
    }
    .couple-divider span {
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      display: block;
      background: transparent;
      padding: 0;
    }
    .event-list,
    .gift-list {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1.25rem;
    }
  }
  .event-list,
  .gift-list {
    display: grid;
    max-width: 600px;
    margin: auto;
    gap: 0;
  }
  .gift-card {
    position: relative;
    border-radius: 4px;
    padding: 1.25rem;
    background: #efe8dc;
    box-shadow: 0 2px 4px rgba(76, 72, 48, 0.08), 0 10px 20px rgba(76, 72, 48, 0.05);
    overflow: hidden;
  }
  .gift-stitch {
    position: absolute;
    inset: 7px;
    border: 1.5px dashed rgba(119, 112, 72, 0.42);
    border-radius: 2px;
    pointer-events: none;
  }
  .gift-seal {
    position: absolute;
    top: 0.75rem;
    left: 0.9rem;
    display: flex;
    width: 2.7rem;
    height: 2.7rem;
    align-items: center;
    justify-content: center;
    border: 2px dashed rgba(119, 112, 72, 0.34);
    border-radius: 50%;
    color: rgba(119, 112, 72, 0.62);
    font: 0.7rem 'Great Vibes', cursive;
    transform: rotate(-12deg);
  }
  .gift-card-content {
    position: relative;
    z-index: 1;
    padding: 2.2rem 0.5rem 0.4rem;
    text-align: center;
  }
  .gift-transfer-label {
    margin: 0 0 0.65rem !important;
    color: #8f8b68;
    font: 600 0.62rem Montserrat, sans-serif !important;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }
  .gift-copy {
    display: inline-flex !important;
    align-items: center;
    gap: 0.35rem;
    margin-top: 0.9rem !important;
    border: 0 !important;
    padding: 0.5rem 0.95rem !important;
    color: #fff !important;
    background: #77754e !important;
    box-shadow: 0 3px 7px rgba(119, 117, 78, 0.25);
    text-transform: none !important;
  }
  .gift-copy svg {
    width: 0.85rem;
    height: 0.85rem;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.8;
  }
  .physical-gift {
    padding-top: 1.35rem;
  }
  .gift-description {
    white-space: pre-line;
  }
  .event-detail {
    position: relative;
    z-index: 1;
    padding: 2.1rem 1rem;
  }
  .event-detail + .event-detail {
    border-top: 1px solid rgba(132, 126, 83, 0.28);
  }
  .event-detail h3 {
    margin: 0.4rem 0;
    font-size: 2rem;
  }
  .event-detail p {
    margin: 0.3rem 0;
    font:
      1rem/1.5 'Cormorant Garamond',
      serif;
  }
  .bank-name {
    color: #ae8790;
    font:
      600 10px Montserrat,
      sans-serif !important;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }
  .event-date {
    color: var(--olive);
    font-size: 1.35rem !important;
  }
  .event-location {
    max-width: 16rem;
    margin: 0.85rem auto 0 !important;
  }
  .event-time {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.7rem;
    color: #77754e;
    font: 500 10px Montserrat, sans-serif;
    letter-spacing: 0.13em;
  }
  .event-time::before,
  .event-time::after {
    width: 42px;
    height: 1px;
    background: currentColor;
    content: '';
  }
  .outline-button,
  .gift-card button {
    display: inline-block;
    margin-top: 1rem;
    border: 1px solid #aaa473;
    border-radius: 999px;
    padding: 0.55rem 0.9rem;
    color: var(--olive);
    background: transparent;
    font:
      600 9px Montserrat,
      sans-serif;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .story {
    overflow: hidden;
    background: #fbfaf5;
  }
  .story-flower {
    position: absolute;
    z-index: 0;
    width: 210px;
    opacity: 0.82;
  }
  .story-flower-top {
    top: -18px;
    left: -22px;
    width: 125px;
    transform: rotate(-12deg);
  }
  .story-flower-bottom {
    right: -72px;
    bottom: -40px;
    transform: scaleX(-1) rotate(-14deg);
  }
  .story-heading {
    position: relative;
    z-index: 1;
    margin-bottom: 3rem;
  }
  .story-heading h2 {
    margin-bottom: 0.75rem;
  }
  .story-heading > p:last-child {
    max-width: 17rem;
    margin: auto;
    color: #77746b;
    font:
      italic 1.05rem/1.5 'Cormorant Garamond',
      serif;
  }
  .story-list {
    position: relative;
    z-index: 1;
    max-width: 400px;
    margin: auto;
    text-align: left;
  }
  .story-card {
    display: flex;
    min-height: 320px;
  }
  .story-rail {
    display: flex;
    width: 42px;
    flex: 0 0 42px;
    flex-direction: column;
    align-items: center;
  }
  .story-rail > span {
    width: 1px;
    flex: 1;
    background: #c9c5a1;
  }
  .story-rail > .rail-hidden {
    visibility: hidden;
  }
  .story-rail i {
    display: flex;
    width: 10px;
    height: 10px;
    flex: 0 0 10px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #a79f69;
    box-shadow: 0 0 0 4px rgba(167, 159, 105, 0.18);
  }
  .story-paper {
    position: relative;
    min-width: 0;
    flex: 1;
    margin: 0 0 1.8rem 0.1rem;
    overflow: visible;
    border: 1px solid #e2dccb;
    background: #fffefb;
    box-shadow: 0 8px 22px rgba(104, 97, 57, 0.07);
  }
  .story-photo {
    position: relative;
    height: 210px;
    overflow: hidden;
    background: #e7e3d8;
  }
  .story-photo > img,
  .story-photo-placeholder {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .story-photo > img {
    transition: transform 0.8s ease;
  }
  .story-paper:hover .story-photo > img {
    transform: scale(1.04);
  }
  .story-photo::after {
    position: absolute;
    inset: 35% 0 0;
    background: linear-gradient(transparent, rgba(39, 42, 31, 0.72));
    content: '';
  }
  .story-photo-label {
    position: absolute;
    z-index: 2;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 0.85rem 1rem;
    color: #fff;
  }
  .story-photo-label h3 {
    margin: 0;
    color: inherit;
    font-size: 1.65rem;
  }
  .story-photo-label p {
    margin: 0.2rem 0 0;
    font: 500 9px Montserrat, sans-serif;
    letter-spacing: 0.13em;
  }
  .story-description {
    margin: 0;
    padding: 1rem;
    color: #6b6961;
    font: 1rem/1.55 'Cormorant Garamond', serif;
  }
  .story-card-flower {
    position: absolute;
    z-index: 4;
    top: -24px;
    right: -19px;
    width: 48px;
    transform: rotate(12deg);
  }
  .story-card-flower-left {
    right: auto;
    left: -19px;
    transform: scaleX(-1) rotate(12deg);
  }
  .story-ending {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding-left: 7px;
    color: #8d896d;
  }
  .story-ending span {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #d4c7a1;
    box-shadow: 0 0 0 5px rgba(212, 199, 161, 0.25);
  }
  .story-ending p {
    margin: 0;
    font: italic 1rem 'Cormorant Garamond', serif;
  }
  .gallery {
    position: relative;
    overflow: hidden;
    background: #f9f6ee;
  }
  .gallery-flower {
    position: absolute;
    z-index: 0;
    width: 125px;
    opacity: 0.68;
  }
  .gallery-flower-left {
    top: 3%;
    left: -42px;
    transform: rotate(-10deg);
  }
  .gallery-flower-right {
    right: -42px;
    bottom: 2%;
    transform: scaleX(-1) rotate(-10deg);
  }
  .gallery > .kicker,
  .gallery > h2,
  .gallery-grid {
    position: relative;
    z-index: 1;
  }
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 7px;
    max-width: 600px;
    margin: auto;
  }
  .gallery-grid button {
    padding: 0;
    border: 0;
    overflow: hidden;
    background: #ddd;
    aspect-ratio: 1;
    cursor: pointer;
  }
  .gallery-grid button:nth-child(1),
  .gallery-grid button:nth-child(5) {
    grid-row: span 2;
    aspect-ratio: auto;
  }
  .gallery-grid img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.35s;
  }
  .gallery-grid button:hover img {
    transform: scale(1.06);
  }
  .gifts {
    overflow: hidden;
    background: #f8f4ed;
  }
  .gift-flower {
    position: absolute;
    right: -28px;
    top: 8px;
    z-index: 0;
    width: 150px;
    opacity: 0.38;
    transform: rotate(8deg);
  }
  .gift-card strong {
    display: block;
    margin: 0.45rem 0;
    color: var(--olive);
    font:
      1.45rem 'Cormorant Garamond',
      serif;
    letter-spacing: 0.06em;
  }
  .gift-card p {
    margin: 0.2rem;
    font:
      italic 1rem 'Cormorant Garamond',
      serif;
  }
  .rsvp {
    background: #f6f1e8;
  }
  form {
    display: flex;
    max-width: 430px;
    margin: auto;
    flex-direction: column;
    gap: 0.75rem;
  }
  input,
  textarea {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #d8cdb6;
    padding: 0.9rem;
    color: var(--ink);
    background: #fffefa;
    font:
      13px Montserrat,
      sans-serif;
    outline: none;
  }
  input:focus,
  textarea:focus {
    border-color: #9b9565;
  }
  textarea {
    resize: vertical;
  }
  .presence {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }
  .presence button {
    border: 1px solid #d8cdb6;
    padding: 0.65rem 0.25rem;
    background: #fffefa;
    color: #77746b;
    font:
      10px Montserrat,
      sans-serif;
    cursor: pointer;
  }
  .presence .chosen {
    border-color: #777543;
    color: #fff;
    background: #777543;
  }
  .submit {
    border: 0;
    padding: 0.9rem;
    background: #777543;
    color: #fff;
    font:
      500 11px Montserrat,
      sans-serif;
    cursor: pointer;
  }
  .submit:disabled {
    opacity: 0.65;
  }
  .feedback {
    margin: 0;
    font-size: 11px;
    color: #7d7951;
  }
  .wishes {
    max-width: 430px;
    margin: 2.5rem auto 0;
    text-align: left;
  }
  .wishes article {
    padding: 0.85rem 0;
    border-bottom: 1px solid #ded4bd;
  }
  .wishes strong {
    color: var(--olive);
    font:
      600 11px Montserrat,
      sans-serif;
  }
  .wishes span {
    float: right;
    color: #a89f91;
    font-size: 9px;
  }
  .wishes p {
    margin: 0.4rem 0 0;
    font:
      italic 1rem 'Cormorant Garamond',
      serif;
  }
  .closing {
    min-height: 560px;
  }
  .closing h2 {
    margin: 1rem 0;
  }
  .lightbox {
    position: fixed;
    z-index: 70;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    background: rgba(37, 36, 28, 0.88);
  }
  .backdrop {
    position: absolute;
    inset: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
  }
  .lightbox-content {
    position: relative;
    z-index: 1;
  }
  .lightbox img {
    display: block;
    max-width: 100%;
    max-height: 88dvh;
    object-fit: contain;
  }
  .lightbox .close {
    position: absolute;
    top: -42px;
    right: 0;
    border: 0;
    background: transparent;
    color: #fff;
    font-size: 2.5rem;
    cursor: pointer;
  }
  @media (min-width: 640px) {
    .padded {
      padding: 6rem 2rem;
    }
    .event-list,
    .gift-list {
      grid-template-columns: repeat(2, 1fr);
    }
    .story-photo {
      height: 240px;
    }
    .botanical-frame {
      height: 520px;
    }
  }
</style>
