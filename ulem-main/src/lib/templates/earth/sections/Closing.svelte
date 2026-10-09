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
  style={`
		background-image:
		url('/images/earth/time-background.png'),
		url('${closingBackground}');
		background-size: 170% 170%, cover;
		background-position: center, center;
		background-repeat: no-repeat, no-repeat;
	`}
>
  <div class="fade-bg absolute inset-0 z-10 bg-black/20" use:reveal></div>
  <img
    src="/assets/earth/top-branch.svg"
    alt="Whale"
    class="reveal pointer-events-none absolute top-0"
    use:reveal
  />
  <img
    src="/assets/earth/little-branch.svg"
    alt="Whale"
    class="reveal pointer-events-none absolute -top-30 -left-10 w-[70%] max-w-none rotate-180 transform"
    use:reveal
  />

  <img
    src="/assets/earth/little-branch.svg"
    alt="Whale"
    class="reveal pointer-events-none absolute -top-30 -right-10 w-[70%] max-w-none -scale-x-100 rotate-180 transform"
    use:reveal
  />

  <img
    src="/assets/earth/branch.svg"
    alt="Whale"
    class="reveal pointer-events-none absolute -bottom-75 left-0 rotate-90 transform"
    use:reveal
  />
  <img
    src="/assets/earth/branch.svg"
    alt="Whale"
    class="reveal pointer-events-none absolute right-0 -bottom-75 -scale-x-100 -rotate-90 transform"
    use:reveal
  />

  <div
    class="reveal relative z-50 flex flex-col items-center justify-center gap-y-2 px-4 text-center"
    use:reveal
  >
    <h1 class="font-script text-5xl text-[#0A5D0A]">
      <span style={groomNameStyle}>{groomName}</span> <br /> &amp; <br />
      <span style={brideNameStyle}>{brideName}</span>
    </h1>
    <p class="mt-10 w-11/12 font-jomolhari text-white">
      {closingMessage}
    </p>
  </div>
</section>
