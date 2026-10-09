import { PUBLIC_API_URL } from '$env/static/public';

const MAX_IMAGE_SIZE = 1920;
const IMAGE_QUALITY = 0.82;

export async function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      if (width > MAX_IMAGE_SIZE || height > MAX_IMAGE_SIZE) {
        if (width > height) {
          height = Math.round((height * MAX_IMAGE_SIZE) / width);
          width = MAX_IMAGE_SIZE;
        } else {
          width = Math.round((width * MAX_IMAGE_SIZE) / height);
          height = MAX_IMAGE_SIZE;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Failed to get canvas context'));

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Failed to compress image'));
          resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }));
        },
        'image/jpeg',
        IMAGE_QUALITY
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image'));
    };

    img.src = objectUrl;
  });
}

export async function getPresignedUrl(file: File, folder: string) {
  const res = await fetch(`${PUBLIC_API_URL}/uploads/presign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      folder
    })
  });

  if (!res.ok) {
    throw new Error('Failed to get upload url');
  }

  return res.json();
}

export async function uploadToR2(file: File, uploadUrl: string) {
  await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type
    }
  });
}

export async function uploadImage(file: File, folder: string) {
  const compressed = await compressImage(file);
  const { uploadUrl, fileUrl } = await getPresignedUrl(compressed, folder);

  await uploadToR2(compressed, uploadUrl);

  return fileUrl;
}

export async function uploadAudio(file: File, folder: string = 'song') {
  const { uploadUrl, fileUrl } = await getPresignedUrl(file, folder);

  await uploadToR2(file, uploadUrl);

  return fileUrl;
}

export async function deleteImages(urls: string[]) {
  const validUrls = urls.filter(Boolean);
  if (validUrls.length === 0) return;

  try {
    await fetch(`${PUBLIC_API_URL}/uploads/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls: validUrls })
    });
  } catch {
    // best-effort — don't block UI on cleanup failure
  }
}
