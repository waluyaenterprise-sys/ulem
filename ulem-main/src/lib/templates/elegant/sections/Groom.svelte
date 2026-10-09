<script lang="ts">
  import { getAdaptiveNameStyle } from '$lib/utils/adaptiveName';
  import { onMount } from 'svelte';

  export let invitation: any;

  const groomName = invitation.groom.name || 'GROOM';
  const groomNameStyle = getAdaptiveNameStyle(groomName, { maxRem: 2.3, minRem: 1.2, endAt: 26 });
  const groomFatherName = invitation.groom.father || 'GROOM FATHER';
  const groomMotherName = invitation.groom.mother || 'GROOM MOTHER';
  const groomImage = invitation.groom.imageUrls?.[0] || 'https://example.com/images/groom.jpg';

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
    <div class="flex-1 bg-[#e7e4dd]"></div>
    <div class="flex-1 bg-[#dedbd4]"></div>
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
    <img src={groomImage} class="h-105 w-65 rounded-3xl object-cover shadow-md" alt="Groom" />

    <div class="mt-8 text-center transition-opacity delay-200 duration-700">
      <p class="font-script text-3xl text-gray-900" style={groomNameStyle}>
        {groomName}
      </p>
      <p class="mt-3 font-body text-sm leading-relaxed text-gray-700">
        Putra dari Bapak {groomFatherName} <br />
        & Ibu {groomMotherName}
      </p>
      {#if invitation.groom?.notes}
        <p class="mt-2 font-body text-xs italic text-gray-500">{invitation.groom.notes}</p>
      {/if}
    </div>
  </div>
</section>
