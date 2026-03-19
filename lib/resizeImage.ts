/**
 * Resize an image file to a max dimension, returning a new Blob.
 * Uses canvas for client-side resize. Returns original if already small enough.
 */
export async function resizeImage(
  file: File,
  maxDimension = 1536
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);

      if (img.width <= maxDimension && img.height <= maxDimension) {
        resolve(file);
        return;
      }

      const scale = maxDimension / Math.max(img.width, img.height);
      const width = Math.round(img.width * scale);
      const height = Math.round(img.height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : resolve(file)),
        "image/jpeg",
        0.85
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}
