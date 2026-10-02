/**
 * Extract prominent colors from an image or video URL using canvas.
 */
export async function extractColors(url: string, type: 'image' | 'video', count: number = 5): Promise<string[]> {
  if (type === 'video') {
    return extractColorsFromVideo(url, count);
  } else {
    return extractColorsFromImage(url, count);
  }
}

async function extractColorsFromImage(imageUrl: string, count: number = 5): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(['#a21caf', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']);
          return;
        }

        canvas.width = 50;
        canvas.height = 50;
        ctx.drawImage(img, 0, 0, 50, 50);

        const imgData = ctx.getImageData(0, 0, 50, 50).data;
        resolve(processImageData(imgData, count));
      } catch (err) {
        console.error('Error during image color extraction:', err);
        resolve(['#a21caf', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']);
      }
    };

    img.onerror = () => {
      resolve(['#a21caf', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']);
    };

    img.src = imageUrl;
  });
}

async function extractColorsFromVideo(videoUrl: string, count: number = 5): Promise<string[]> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.crossOrigin = 'Anonymous';
    video.muted = true;
    video.playsInline = true;
    
    // Set a timeout to prevent hanging if video fails to load/seek
    const timeout = setTimeout(() => {
      resolve(['#1e1b4b', '#4338ca', '#a21caf', '#312e81', '#111827']);
    }, 4000);

    video.onloadeddata = () => {
      video.currentTime = 0.5; // Seek slightly into the video for a good frame
    };

    video.onseeked = () => {
      clearTimeout(timeout);
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(['#1e1b4b', '#4338ca', '#a21caf', '#312e81', '#111827']);
          return;
        }

        canvas.width = 50;
        canvas.height = 50;
        ctx.drawImage(video, 0, 0, 50, 50);

        const imgData = ctx.getImageData(0, 0, 50, 50).data;
        resolve(processImageData(imgData, count));
      } catch (err) {
        console.error('Error during video color extraction:', err);
        resolve(['#1e1b4b', '#4338ca', '#a21caf', '#312e81', '#111827']);
      }
    };

    video.onerror = () => {
      clearTimeout(timeout);
      resolve(['#1e1b4b', '#4338ca', '#a21caf', '#312e81', '#111827']);
    };

    video.load();
  });
}

function processImageData(imgData: Uint8ClampedArray, count: number): string[] {
  const colorMap: { [key: string]: number } = {};

  // Sample every 4th pixel
  for (let i = 0; i < imgData.length; i += 16) {
    const r = imgData[i];
    const g = imgData[i + 1];
    const b = imgData[i + 2];
    const a = imgData[i + 3];

    // Ignore fully transparent or extremely dark/light grayscale pixels to get vibrant colors
    if (a < 200) continue;
    
    // Calculate brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    if (brightness < 30 || brightness > 235) continue;

    // Bucket colors to group similar tones
    const bucketR = Math.round(r / 15) * 15;
    const bucketG = Math.round(g / 15) * 15;
    const bucketB = Math.round(b / 15) * 15;

    const hex = `#${((1 << 24) + (bucketR << 16) + (bucketG << 8) + bucketB).toString(16).slice(1)}`;
    colorMap[hex] = (colorMap[hex] || 0) + 1;
  }

  // Sort colors by frequency
  const sortedColors = Object.entries(colorMap)
    .sort((a, b) => b[1] - a[1])
    .map(([color]) => color);

  if (sortedColors.length >= count) {
    return sortedColors.slice(0, count);
  } else {
    // Fill up with nice fallback variations of the primary color
    const baseColor = sortedColors[0] || '#a21caf';
    const fallbacks = generateFallbacks(baseColor, count - sortedColors.length);
    return [...sortedColors, ...fallbacks];
  }
}

function generateFallbacks(hex: string, count: number): string[] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  const fallbacks: string[] = [];
  for (let i = 1; i <= count; i++) {
    const shift = i * 20;
    const newR = Math.min(255, Math.max(0, r + shift));
    const newG = Math.min(255, Math.max(0, g - shift));
    const newB = Math.min(255, Math.max(0, b + (shift % 30)));
    const newHex = `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`;
    fallbacks.push(newHex);
  }
  return fallbacks;
}
