/**
 * Cloudinary CDN Configuration & URL Generator
 * Automatically optimizes images with WebP/AVIF format and smart compression (f_auto, q_auto)
 */

export const CLOUD_NAME = (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '').trim();
export const CLOUDINARY_FOLDER = (import.meta.env.VITE_CLOUDINARY_FOLDER || 'wedding-frames').trim();
export const TRANSFORMATIONS = (import.meta.env.VITE_CLOUDINARY_TRANSFORMATIONS || 'f_auto,q_auto').trim();

export const isCloudinaryConfigured = Boolean(
  CLOUD_NAME &&
  CLOUD_NAME !== 'your_cloud_name_here' &&
  CLOUD_NAME !== 'YOUR_CLOUD_NAME'
);

/**
 * Get Cloudinary or Local URL for Hero Scroll Sequence Frames (1 to 160)
 * @param {number} index - 0-indexed frame number (0 to 159)
 * @returns {string} URL to image
 */
export const getFrameUrl = (index) => {
  const frameNumber = String(index + 1).padStart(3, '0');

  if (isCloudinaryConfigured) {
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${TRANSFORMATIONS}/${CLOUDINARY_FOLDER}/ezgif-frame-${frameNumber}.jpg`;
  }

  // Fallback to local files if Cloudinary name is not provided
  return `/frames/ezgif-frame-${frameNumber}.jpg`;
};

/**
 * Get Local Fallback URL for any frame
 * @param {number} index - 0-indexed frame number
 * @returns {string}
 */
export const getLocalFrameUrl = (index) => {
  const frameNumber = String(index + 1).padStart(3, '0');
  return `/frames/ezgif-frame-${frameNumber}.jpg`;
};
