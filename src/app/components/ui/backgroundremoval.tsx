/**
 * Remove a solid-coloured background from an image.
 * Uses Euclidean distance for better color matching and skips strict corner checks.
 *
 * @param dataUrl      Base-64 data-URL of the source image.
 * @param tolerance    0–0.5  Sensitivity to background color matching.
 * @param fade         0–0.5  Width of the soft-edge zone (anti-aliasing).
 * @param keepInternal If true, uses Flood Fill to protect inner parts of the logo.
 * @returns            A PNG data-URL with the background removed, or null on failure.
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
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(null); return; }

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const px = imageData.data;
      const w = canvas.width;
      const h = canvas.height;

      // 1. Get Reference Color (Top-Left corner only - no strict safety check)
      const ref = [px[0], px[1], px[2]]; 

      // 2. Setup Thresholds (Euclidean 3D Space)
      // Max possible distance in RGB space is sqrt(255^2 * 3) ≈ 441.6
      const maxDist = Math.sqrt(255 * 255 * 3);
      const tolDist = maxDist * tolerance;
      const fadeDist = maxDist * fade;
      const totalLimit = tolDist + fadeDist;

      // Helper: Calculate 3D Euclidean distance of pixel i from reference
      const dist = (i: number) => {
        return Math.sqrt(
          Math.pow(px[i] - ref[0], 2) +
          Math.pow(px[i + 1] - ref[1], 2) +
          Math.pow(px[i + 2] - ref[2], 2)
        );
      };

      // --- STRATEGY SELECTION ---

      if (!keepInternal) {
        // MODE A: GLOBAL REMOVAL (Linear Scan)
        for (let i = 0; i < px.length; i += 4) {
          const d = dist(i);

          if (d <= tolDist) {
            px[i + 3] = 0; // Fully transparent
          } else if (d <= totalLimit) {
            // Soft Edge Blending (Cubic Easing)
            const factor = (d - tolDist) / fadeDist;
            const alpha = Math.floor(255 * Math.pow(factor, 3));
            px[i + 3] = alpha; 
          }
        }
      } else {
        // MODE B: FLOOD FILL (Contiguous Removal)
        const visited = new Uint8Array(w * h); 
        const queue: number[] = [];

        // Seed Function
        const seed = (x: number, y: number) => {
          const idx = y * w + x;
          if (visited[idx]) return;
          
          const i = idx * 4;
          const d = dist(i);

          // If it's within the "fade" zone or closer, it's valid to flood into
          if (d <= totalLimit) {
            queue.push(idx);
            visited[idx] = 1;
          }
        };

        // Seed all borders (Top, Bottom, Left, Right)
        for (let x = 0; x < w; x++) { seed(x, 0); seed(x, h - 1); }
        for (let y = 1; y < h - 1; y++) { seed(0, y); seed(w - 1, y); }

        // BFS Loop
        while (queue.length > 0) {
          const idx = queue.pop()!;
          const i = idx * 4;
          const d = dist(i);

          // Apply Transparency
          if (d <= tolDist) {
            px[i + 3] = 0;
          } else if (d <= totalLimit) {
            const factor = (d - tolDist) / fadeDist;
            const alpha = Math.floor(255 * Math.pow(factor, 3));
            px[i + 3] = alpha;
          }

          // Expand to neighbors
          const x = idx % w;
          const y = (idx - x) / w;

          if (x > 0) seed(x - 1, y);
          if (x < w - 1) seed(x + 1, y);
          if (y > 0) seed(x, y - 1);
          if (y < h - 1) seed(x, y + 1);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}