<script lang="ts">
  // Ganti dengan path gambar kamu di folder `public`
  export let invitation: any;
  const images: string[] = invitation.gallery?.imageUrls || [];
</script>

<section class="bg-[#f9f9f6] py-20">
  <div class="mx-auto max-w-md px-4">
    <!-- Title -->
    <div class="mb-14 text-center">
      <h2 class="font-script text-4xl text-gray-900">Our Gallery</h2>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-2 gap-3">
      <div class="col-span-2 aspect-3/2 overflow-hidden rounded-2xl shadow-md">
        <img
          src={images[0]}
          class="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          alt="gallery"
        />
      </div>

      <div class="aspect-square overflow-hidden rounded-2xl shadow-sm">
        <img
          src={images[1]}
          class="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          alt="gallery"
        />
      </div>

      <div class="aspect-square overflow-hidden rounded-2xl shadow-sm">
        <img
          src={images[2]}
          class="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          alt="gallery"
        />
      </div>

      <div class="col-span-2 aspect-3/2 overflow-hidden rounded-2xl shadow-md">
        <img
          src={images[3]}
          class="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          alt="gallery"
        />
      </div>

      <div class="aspect-square overflow-hidden rounded-2xl shadow-sm">
        <img
          src={images[4]}
          class="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          alt="gallery"
        />
      </div>

      <div class="aspect-square overflow-hidden rounded-2xl shadow-sm">
        <img
          src={images[5]}
          class="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          alt="gallery"
        />
      </div>
    </div>
  </div>
</section>
