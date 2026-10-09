<script lang="ts">
  import Credit from '$lib/Credit.svelte';
  import { getAdaptiveNameStyle } from '$lib/utils/adaptiveName';

  export let invitation: any;
  const brideName = (invitation.bride.name || 'BRIDE').split(' ')[0];
  const groomName = (invitation.groom.name || 'GROOM').split(' ')[0];
  const groomNameStyle = getAdaptiveNameStyle(groomName, { maxRem: 2.0, minRem: 1.0, endAt: 18 });
  const brideNameStyle = getAdaptiveNameStyle(brideName, { maxRem: 2.0, minRem: 1.0, endAt: 18 });
  const closingMessage: string = invitation.closing?.message || 'Atas kehadiran dan doa restunya, kami ucapkan terima kasih.';
</script>

<section class="bg-[#f0f1ec] py-28">
  <div class="mx-auto max-w-md px-6 text-center">
    <p class="mb-6 text-sm leading-relaxed text-gray-600">
      Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila Bapak / Ibu / Saudara / i
      berkenan hadir dan memberikan doa restu.
    </p>

    <p class="mb-10 text-sm text-gray-500 italic">
      {closingMessage}
    </p>

    <!-- Nama Mempelai -->
    <div class="font-script text-3xl tracking-wide text-gray-900">
      <p style={groomNameStyle}>{groomName}</p>
      <p class="my-1">&amp;</p>
      <p style={brideNameStyle}>{brideName}</p>
    </div>

    <!-- Divider -->
    <div class="mx-auto my-10 h-px w-24 bg-gray-300"></div>

    <!-- Footer -->
    <div class="mt-8">
      <Credit />
    </div>
  </div>
</section>
