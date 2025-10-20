// ✅ fileIcons.js — Correct Export for Three.js Texture Use

// You can replace these with actual image URLs or import PNG/SVG files
const iconMap = {
  "image/png": "/icons/png-texture.png",
  "image/jpeg": "/icons/jpg-texture.png",
  "application/pdf": "/icons/pdf-texture.png",
  "default": "/icons/default-texture.png",
};

/**
 * ✅ Returns texture path or fallback
 */
export const getIconTexture = (type) => {
  return iconMap[type] || iconMap["default"];
};

export default iconMap;
