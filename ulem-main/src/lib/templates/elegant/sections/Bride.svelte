<script lang="ts">
  import { getAdaptiveNameStyle } from '$lib/utils/adaptiveName';
  import { onMount } from 'svelte';

  export let invitation: any;

  const brideName = invitation.bride.name || 'BRIDE';
  const brideNameStyle = getAdaptiveNameStyle(brideName, { maxRem: 2.3, minRem: 1.2, endAt: 26 });
  const brideFatherName = invitation.bride.father || 'BRIDE FATHER';
  const brideMotherName = invitation.bride.mother || 'BRIDE MOTHER';
  const brideImage = invitation.bride.imageUrls?.[0] || 'https://example.com/images/bride.jpg';

  let visible = false;
  let el: HTMLElement;

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible = true;
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (el) observer.observe(el);
  });
</script>

<section bind:this={el} class="relative overflow-hidden py-24">
  <!-- BG -->
  <div class="absolute inset-0 flex">
    <div class="flex-1 bg-[#dedbd4]"></div>
    <div class="flex-1 bg-[#e7e4dd]"></div>
  </div>

  <!-- CONTENT -->
  <div
    class="
			relative z-10 flex flex-col items-center
			transition-all duration-1000 ease-out
		"
    class:opacity-100={visible}
    class:opacity-0={!visible}
    class:translate-y-0={visible}
    class:translate-y-12={!visible}
  >
    <img src={brideImage} class="h-105 w-65 rounded-3xl object-cover shadow-md" alt="Bride" />

    <div class="mt-8 text-center transition-opacity delay-200 duration-700">
      <p class="font-script text-3xl text-gray-900" style={brideNameStyle}>
        {brideName}
      </p>
      <p class="mt-3 font-body text-sm leading-relaxed text-gray-700">
        Putri dari Bapak {brideFatherName} <br />
        & Ibu {brideMotherName}
      </p>
      {#if invitation.bride?.notes}
        <p class="mt-2 font-body text-xs italic text-gray-500">{invitation.bride.notes}</p>
      {/if}
    </div>
  </div>
</section>
