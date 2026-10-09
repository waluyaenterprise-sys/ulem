<script lang="ts">
  import { getAdaptiveNameStyle } from '$lib/utils/adaptiveName';
  export let invitation: any;

  const closingText: string = invitation.closing?.message || '';
  const groomName: string = (invitation.groom?.name || 'Groom').split(' ')[0];
  const brideName: string = (invitation.bride?.name || 'Bride').split(' ')[0];
  const groomNameStyle = getAdaptiveNameStyle(groomName, { maxRem: 2.0, minRem: 1.0, endAt: 18 });
  const brideNameStyle = getAdaptiveNameStyle(brideName, { maxRem: 2.0, minRem: 1.0, endAt: 18 });

  function reveal(node: HTMLElement, { delay = 0 } = {}) {
    node.style.opacity = '0';
    node.style.transform = 'translateY(24px)';
    node.style.transition = `opacity 1s ease ${delay}ms, transform 1s cubic-bezier(0.22,1,0.36,1) ${delay}ms`;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.style.opacity = '1';
          node.style.transform = 'translateY(0)';
          observer.unobserve(node);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(node);
    return { destroy: () => observer.disconnect() };
  }
</script>

<section
  class="relative w-full overflow-hidden px-5 pt-16 pb-0"
  style="background: linear-gradient(180deg, #2C1810 0%, #1A0F08 60%, #0D0603 100%);"
>
  <!-- Subtle gold pattern -->
  <div
    class="pointer-events-none absolute inset-0 opacity-[0.04]"
    style="
      background-image: repeating-linear-gradient(45deg, #C9A227 0px, #C9A227 1px, transparent 1px, transparent 12px);
    "
  ></div>

  <div class="relative z-10 mx-auto max-w-sm text-center">
    <!-- Top ornament -->
    <div use:reveal class="mb-8 flex items-center justify-center gap-3">
      <div class="h-px flex-1 bg-amber-700/30"></div>
      <svg viewBox="0 0 32 32" class="h-6 w-6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" stroke="#C9A227" stroke-width="1" opacity="0.5" />
        <path
          d="M16 6 L17.5 12 L24 12 L19 15.5 L20.5 22 L16 18.5 L11.5 22 L13 15.5 L8 12 L14.5 12 Z"
          fill="#C9A227"
          opacity="0.7"
        />
      </svg>
      <div class="h-px flex-1 bg-amber-700/30"></div>
    </div>

    <!-- Wax seal -->
    <div use:reveal={{ delay: 80 }} class="mb-8 flex justify-center">
      <div
        class="relative flex h-28 w-28 items-center justify-center rounded-full"
        style="transform: rotate(-6deg);
          background: radial-gradient(circle at 30% 30%, #D4423A 0%, #B5281E 40%, #8B1A12 70%, #5C0E08 100%);
          box-shadow: 0 0 0 4px rgba(201,162,39,0.5), 0 0 0 5px rgba(92,10,5,0.3), 0 8px 30px rgba(0,0,0,0.6), inset 0 2px 6px rgba(255,255,255,0.12);"
      >
        <!-- Decorative dots around edge -->
        {#each Array(8) as _, i}
          <div
            class="absolute h-1.5 w-1.5 rounded-full"
            style="top: 50%; left: 50%; transform: rotate({i * 45}deg) translateY(-50px); background: rgba(201,162,39,0.35);"
          ></div>
        {/each}

        <!-- Inner gold ring -->
        <div
          class="absolute inset-3 rounded-full"
          style="border: 1px solid rgba(201,162,39,0.4);"
        ></div>

        <!-- Center emblem -->
        <div class="relative z-10 flex flex-col items-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="rgba(232,200,138,0.9)"
            />
          </svg>
          <span
            class="mt-0.5 font-script text-2xl"
            style="color: rgba(252,230,200,0.9); text-shadow: 0 1px 3px rgba(0,0,0,0.5);"
          >
            {brideName.charAt(0)}&amp;{groomName.charAt(0)}
          </span>
        </div>
      </div>
    </div>

    <!-- Closing message -->
    <div use:reveal={{ delay: 150 }}>
      <p class="font-body text-[9px] tracking-[0.4em] text-amber-400/50 uppercase">Penutup</p>
      <p class="mt-2 font-script text-4xl text-amber-300">Terima Kasih</p>

      <div class="mx-auto mt-3 flex items-center justify-center gap-2">
        <div class="h-px w-10 bg-amber-700/40"></div>
        <div class="h-1 w-1 rotate-45 bg-amber-600/50"></div>
        <div class="h-px w-10 bg-amber-700/40"></div>
      </div>

      <p class="mx-auto mt-5 max-w-xs font-body text-sm leading-relaxed text-amber-200/60 italic">
        {closingText ||
          'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.'}
      </p>
    </div>

    <!-- Names signature -->
    <div use:reveal={{ delay: 260 }} class="mt-8">
      <p class="font-body text-[10px] tracking-[0.3em] text-amber-500/50 uppercase">Mempelai</p>
      <p class="mt-2 font-script text-3xl text-amber-300">
        <span style={brideNameStyle}>{brideName}</span> &amp;
        <span style={groomNameStyle}>{groomName}</span>
      </p>
    </div>

    <!-- Official seal bottom line -->
    <div use:reveal={{ delay: 340 }} class="mt-8 flex items-center justify-center gap-3">
      <div class="h-px flex-1 bg-amber-700/20"></div>
      <div class="h-1 w-1 rotate-45 bg-amber-700/40"></div>
      <div class="h-px w-4 bg-amber-700/20"></div>
      <div class="h-1.5 w-1.5 rotate-45 bg-amber-600/50"></div>
      <div class="h-px w-4 bg-amber-700/20"></div>
      <div class="h-1 w-1 rotate-45 bg-amber-700/40"></div>
      <div class="h-px flex-1 bg-amber-700/20"></div>
    </div>

    <!-- Footer bottom roller shape -->
    <div
      class="mt-8 w-full"
      style="
        height: 32px;
        background: linear-gradient(180deg, #8B6914 0%, #C9A227 40%, #F5D87A 55%, #C9A227 70%, #8B6914 100%);
        border-radius: 9999px 9999px 0 0;
        box-shadow: 0 -4px 16px rgba(0,0,0,0.4), inset 0 1px 3px rgba(255,255,255,0.25);
      "
    ></div>
  </div>
</section>
