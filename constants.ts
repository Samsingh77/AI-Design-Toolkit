
export const compressImage = async (dataUrl: string, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = dataUrl;
  });
};

export const convertToFormat = async (dataUrl: string, format: 'image/png' | 'image/jpeg'): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL(format));
    };
    img.src = dataUrl;
  });
};

export const smartCrop = async (dataUrl: string, aspectRatio: number): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let targetWidth = img.width;
      let targetHeight = img.height;

      if (img.width / img.height > aspectRatio) {
        targetWidth = img.height * aspectRatio;
      } else {
        targetHeight = img.width / aspectRatio;
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(
        img,
        (img.width - targetWidth) / 2,
        (img.height - targetHeight) / 2,
        targetWidth,
        targetHeight,
        0,
        0,
        targetWidth,
        targetHeight
      );
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = dataUrl;
  });
};

export const extractPalette = async (dataUrl: string): Promise<string[]> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 50; // Small size for performance
      canvas.height = 50;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, 50, 50);
      const imageData = ctx?.getImageData(0, 0, 50, 50).data;
      if (!imageData) return resolve([]);

      const colors = new Map<string, number>();
      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i+1];
        const b = imageData[i+2];
        const alpha = imageData[i+3];
        if (alpha < 128) continue; // Skip semi-transparent
        
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        colors.set(hex, (colors.get(hex) || 0) + 1);
      }

      const sortedColors = Array.from(colors.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(c => c[0]);
      
      resolve(sortedColors);
    };
    img.src = dataUrl;
  });
};

export const applyFilter = async (dataUrl: string, filter: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(dataUrl);
      
      ctx.filter = filter;
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = dataUrl;
  });
};

export const resizeImage = async (dataUrl: string, width: number, height: number): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = dataUrl;
  });
};
