<script lang="ts">
  import { getAdaptiveNameStyle } from '$lib/utils/adaptiveName';
  export let invitation: any;

  const groomName: string = (invitation.groom.name || 'GROOM').split(' ')[0];
  const brideName: string = (invitation.bride.name || 'BRIDE').split(' ')[0];
  const closingBackground: string = invitation.closing?.imageUrls?.[0] || '';
  const closingMessage: string = invitation.closing?.message || 'Suatu kebahagiaan dan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami.';
  const groomNameStyle = getAdaptiveNameStyle(groomName, { maxRem: 2.3, minRem: 1.1, endAt: 18 });
  const brideNameStyle = getAdaptiveNameStyle(brideName, { maxRem: 2.3, minRem: 1.1, endAt: 18 });

  function reveal(node: HTMLElement) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('is-visible');
          observer.unobserve(node);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);

    return {
      destroy() {
        observer.disconnect();
      }
    };
  }
</script>

<section
  class="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat py-30"
  style={`background-image: url('${closingBackground}');`}
>
  <div class="fade-bg absolute inset-0 z-10 bg-black/60" use:reveal></div>
  <img
    src="/assets/big-fish.svg"
    alt="Whale"
    class="reveal pointer-events-none absolute -top-10 -right-30 z-10 scale-50"
    use:reveal
  />
  <img
    src="/assets/big-fish.svg"
    alt="Whale"
    class="reveal pointer-events-none absolute top-0 -left-20 z-30 w-[70%] max-w-none -scale-x-100 transform"
    use:reveal
  />

  <div
    class="reveal relative z-50 flex flex-col items-center justify-center gap-y-2 px-4 text-center"
    use:reveal
  >
    <h1 class="font-script text-5xl text-white">
      <span style={groomNameStyle}>{groomName}</span> <br /> &amp; <br />
      <span style={brideNameStyle}>{brideName}</span>
    </h1>
    <p class="mt-10 w-11/12 font-jomolhari text-white">
      {closingMessage}
    </p>
  </div>

  <img
    src="/assets/coral.svg"
    alt="Whale"
    class="pointer-events-none absolute bottom-20 left-25 z-10 w-[200%] max-w-none -translate-x-1/2 translate-y-1/2 -rotate-60 transform"
  />
  <img
    src="/assets/coral.svg"
    alt="Whale"
    class=" pointer-events-none absolute right-10 bottom-20 z-10 w-[220%] max-w-none translate-x-1/2 translate-y-1/2 -scale-100 transform"
  />
  <img
    src="/assets/coral.svg"
    alt="Whale"
    class=" pointer-events-none absolute right-40 bottom-20 z-10 w-[220%] max-w-none translate-x-1/2 translate-y-1/2 -scale-100 rotate-80 transform"
  />
</section>
