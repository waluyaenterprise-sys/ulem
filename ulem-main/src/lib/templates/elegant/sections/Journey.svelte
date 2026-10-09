<script lang="ts">
  export let invitation: any;
  const journeyEvents = invitation?.loveStories ?? [];
</script>

<section class="bg-[#f9f9f6] py-20">
  <h2 class="mb-14 text-center font-script text-4xl text-gray-900">Our Story</h2>

  <div class="relative mx-auto w-full px-4">
    <!-- vertical line -->
    <div class="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-gray-300/60"></div>

    {#each journeyEvents as event, i}
      <div class="relative mb-20 flex flex-col items-center text-center">
        <!-- dot -->
        <div class="z-10 mb-6 h-4 w-4 rounded-full bg-[#2e5e4e] opacity-80"></div>

        <!-- image -->
        <div
          class="
						w-full max-w-65
						rounded-2xl bg-white/70 p-2
						shadow-md backdrop-blur
					"
          class:rotate-2={i % 2 === 0}
          class:-rotate-2={i % 2 !== 0}
        >
          <img
            src={event.imageUrl}
            alt="Foto kejadian"
            class="h-auto w-full rounded-xl object-cover"
          />
          <div class="mt-3 text-xs tracking-wide text-gray-600">
            {event.date}
          </div>
        </div>

        <!-- description -->
        <p class="mt-5 max-w-xs font-body text-sm leading-relaxed text-gray-700">
          {event.description}
        </p>
      </div>
    {/each}
  </div>
</section>
