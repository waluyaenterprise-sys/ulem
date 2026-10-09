<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  export let invitation: any;

  const stories: any[] = invitation?.loveStories || [];

  // Stamp rotation per index so they look naturally placed
  const stampRotations = [-6, 4, -3, 7, -5, 3, -8, 5];

  let visible = false;
  let sectionEl: HTMLElement;
  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible = true;
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    if (sectionEl) observer.observe(sectionEl);
    return () => observer.disconnect();
  });
</script>

<section bind:this={sectionEl} class="w-full px-5 py-16" style="background:#0d1b2a;">
  {#if visible}
    <!-- Section header -->
    <div in:fade={{ duration: 600 }} class="mb-12 text-center">
      <p
        class="text-xs tracking-[0.55em] uppercase"
        style="color:rgba(201,168,76,0.5);font-family:var(--font-heading,serif);"
      >
        Travel Journal
      </p>
      <p
        class="mt-2 text-sm tracking-[0.45em] uppercase"
        style="color:#c9a84c;font-family:var(--font-heading,serif);"
      >
        Our Story
      </p>
      <div style="width:40px;height:1px;background:rgba(201,168,76,0.4);margin:10px auto 0;"></div>
    </div>

    <!-- Stories list -->
    <div class="mx-auto flex flex-col gap-10" style="max-width:360px;">
      {#each stories as story, i}
        {@const rot = stampRotations[i % stampRotations.length]}
        <div
          in:fly={{ y: 30, delay: 150 + i * 180, duration: 700, easing: cubicOut }}
          class="relative"
        >
          <!-- Country stamp decoration -->
          <div
            class="absolute z-10 flex flex-col items-center justify-center"
            style="
              width:74px;height:74px;
              top:-12px;
              {i % 2 === 0 ? 'right:-8px;' : 'left:-8px;'}
              transform:rotate({rot}deg);
            "
          >
            <svg width="74" height="74" viewBox="0 0 74 74" class="absolute inset-0">
              <rect
                x="2"
                y="2"
                width="70"
                height="70"
                rx="3"
                fill="none"
                stroke="#c9a84c"
                stroke-width="1"
                stroke-dasharray="3 2"
                opacity="0.65"
              />
              <rect
                x="6"
                y="6"
                width="62"
                height="62"
                rx="2"
                fill="none"
                stroke="#c9a84c"
                stroke-width="0.5"
                opacity="0.4"
              />
            </svg>
            <p
              class="relative text-center text-sm leading-tight tracking-[0.2em] uppercase"
              style="color:rgba(201,168,76,0.85);font-family:var(--font-heading,serif);max-width:56px;"
            >
              {story.date
                ? new Date(story.date)
                    .toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                    .toUpperCase()
                : 'OUR STORY'}
            </p>
            <p
              class="relative mt-0.5 text-xs font-bold"
              style="color:rgba(201,168,76,0.4);font-family:var(--font-heading,serif);"
            >
              ✦
            </p>
          </div>

          <!-- Story card -->
          <div
            class="overflow-hidden"
            style="background:#0f2035;border:1px solid rgba(201,168,76,0.2);"
          >
            <!-- Photo -->
            {#if story.imageUrl || story.image}
              <div style="height:160px;overflow:hidden;">
                <img
                  src={story.imageUrl || story.image}
                  alt={story.title}
                  class="h-full w-full object-cover"
                  style="filter:brightness(0.8) sepia(15%);"
                />
              </div>
            {/if}

            <!-- Content -->
            <div class="p-4">
              <!-- Entry number + title -->
              <div class="mb-2 flex items-start gap-3">
                <span
                  class="mt-0.5 text-sm tracking-[0.2em] tabular-nums"
                  style="color:rgba(201,168,76,0.35);font-family:monospace;"
                >
                  {String(i + 1).padStart(2, '0')}.
                </span>
                <div>
                  <p
                    class="text-sm leading-snug"
                    style="color:#e8d4a0;font-family:var(--font-heading,serif);"
                  >
                    {story.title}
                  </p>
                  {#if story.date}
                    <p
                      class="mt-0.5 text-xs tracking-[0.2em]"
              style="color:rgba(201,168,76,0.7);font-family:var(--font-heading,serif);"
                    >
                      {new Date(story.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  {/if}
                </div>
              </div>

              <p
                class="pl-6 text-xs leading-relaxed"
                style="color:rgba(228,216,180,0.6);font-family:var(--font-heading,serif);"
              >
                {story.description}
              </p>
            </div>

            <!-- Bottom stamp bar -->
            <div
              class="flex items-center gap-2 px-4 py-2"
              style="border-top:1px solid rgba(201,168,76,0.1);"
            >
              <div style="flex:1;height:1px;background:rgba(201,168,76,0.1);"></div>
              <p
                class="text-sm tracking-[0.35em] uppercase"
                style="color:rgba(201,168,76,0.25);font-family:var(--font-heading,serif);"
              >
                Chapter {String(i + 1).padStart(2, '0')}
              </p>
              <div style="flex:1;height:1px;background:rgba(201,168,76,0.1);"></div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</section>
