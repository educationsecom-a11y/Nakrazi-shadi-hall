export async function compressImageFileToDataUrl(
  file: File,
  maxWidth = 1280,
  maxBytes = 240000
): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose a valid image file (JPG, PNG, or WebP).');
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to read the selected image file.'));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to decode the selected image.'));
    image.src = dataUrl;
  });

  const scale = img.width > maxWidth ? maxWidth / img.width : 1;
  const targetWidth = Math.max(1, Math.round(img.width * scale));
  const targetHeight = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas image compression is unavailable in this browser.');
  }

  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  let quality = 0.82;
  let output = canvas.toDataURL('image/jpeg', quality);
  while (output.length > maxBytes && quality > 0.35) {
    quality -= 0.12;
    output = canvas.toDataURL('image/jpeg', quality);
  }

  if (output.length > 340000) {
    throw new Error(
      'Image is too large after compression. Please use a smaller image or paste an image URL.'
    );
  }

  return output;
}
