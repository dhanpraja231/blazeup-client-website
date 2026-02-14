/**
 * Background removal with configurable tolerance, fade, and keep-internal support.
 * Ported from the inline function in credit-card-designer.tsx and extended with
 * parameters originally defined in backgroundslider.html.
 */

/**
 * Remove a solid-coloured background from an image.
 *
 * @param dataUrl     Base-64 data-URL of the source image.
 * @param tolerance   0–0.5  How different a pixel can be from the corner colour and
 *                    still be considered "background". Mapped to 0–127.5 in pixel space.
 * @param fade        0–0.5  Width of the soft-edge zone beyond the hard tolerance.
 *                    Pixels in this zone get partial alpha instead of full transparency.
 * @param keepInternal When true only border-connected background pixels are cleared
 *                     (flood-fill); when false every matching pixel is cleared globally.
 * @returns           A PNG data-URL with the background removed, or null on failure.
 */
export function processImageBackground(
  dataUrl: string,
  tolerance: number = 0.05,
  fade: number = 0.10,
  keepInternal: boolean = true,
): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
        console.log('img loaded');
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
         console.log('no ctx match');  resolve(null); return; }

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const px = imageData.data;
      const w = canvas.width;
      const h = canvas.height;

      // --- Detect reference colour from corners ---
      const corners = [
        [px[0], px[1], px[2]],
        [px[(w - 1) * 4], px[(w - 1) * 4 + 1], px[(w - 1) * 4 + 2]],
        [px[(h - 1) * w * 4], px[(h - 1) * w * 4 + 1], px[(h - 1) * w * 4 + 2]],
        [px[((h - 1) * w + w - 1) * 4], px[((h - 1) * w + w - 1) * 4 + 1], px[((h - 1) * w + w - 1) * 4 + 2]],
      ];

      const tol = 255 * tolerance;
      const ref = corners[0];

      // Corner detection uses a generous fixed tolerance (0.20) so that JPEG
      // compression artefacts on coloured backgrounds don't cause false rejection.
      // The user's tolerance slider controls only the pixel-clearing step below.
      const cornerTol = 255 * Math.max(tolerance, 0.20);

      // All four corners must roughly match for auto-detection to fire
      const allMatch = corners.every(
        (c) =>
          Math.abs(c[0] - ref[0]) <= cornerTol &&
          Math.abs(c[1] - ref[1]) <= cornerTol &&
          Math.abs(c[2] - ref[2]) <= cornerTol,
      );
      if (!allMatch) {
         
        console.log('not all match'); 
        resolve(null);return; }

      const fadePx = 255 * fade;

      // --- Helper: distance of a pixel from the reference colour ---
      const dist = (i: number) =>
        Math.max(
          Math.abs(px[i] - ref[0]),
          Math.abs(px[i + 1] - ref[1]),
          Math.abs(px[i + 2] - ref[2]),
        );

      if (!keepInternal) {
        // ---- Global mode: clear every pixel that matches ----
        for (let i = 0; i < px.length; i += 4) {
          const d = dist(i);
          if (d <= tol) {
            px[i + 3] = 0;
          } else if (fadePx > 0 && d <= tol + fadePx) {
            // Soft edge: partial alpha proportional to distance past the tolerance
            const alpha = Math.round(((d - tol) / fadePx) * 255);
            px[i + 3] = Math.min(px[i + 3], alpha);
          }
        }
      } else {
        // ---- Flood-fill mode: only clear border-connected pixels ----
        const total = w * h;
        const visited = new Uint8Array(total); // 0 = unvisited, 1 = queued/visited

        // Seed queue with all border pixels that match the background
        const queue: number[] = [];
        const tryEnqueue = (x: number, y: number) => {
          const idx = y * w + x;
          if (visited[idx]) return;
          const pi = idx * 4;
          const d = dist(pi);
          if (d <= tol + fadePx) {
            visited[idx] = 1;
            queue.push(idx);
          }
        };

        // Top & bottom rows
        for (let x = 0; x < w; x++) { tryEnqueue(x, 0); tryEnqueue(x, h - 1); }
        // Left & right columns
        for (let y = 0; y < h; y++) { tryEnqueue(0, y); tryEnqueue(w - 1, y); }

        // BFS
        while (queue.length > 0) {
          const idx = queue.pop()!;
          const pi = idx * 4;
          const d = dist(pi);

          if (d <= tol) {
            px[pi + 3] = 0;
          } else if (fadePx > 0 && d <= tol + fadePx) {
            const alpha = Math.round(((d - tol) / fadePx) * 255);
            px[pi + 3] = Math.min(px[pi + 3], alpha);
          }

          // Expand to 4-connected neighbours
          const x = idx % w;
          const y = (idx - x) / w;
          if (x > 0) tryEnqueue(x - 1, y);
          if (x < w - 1) tryEnqueue(x + 1, y);
          if (y > 0) tryEnqueue(x, y - 1);
          if (y < h - 1) tryEnqueue(x, y + 1);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}