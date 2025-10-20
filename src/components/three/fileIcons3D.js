const textures = {
  image: "/image-3d.webp",            // ✅ served from public/
  pdf: "/pdf-3d.webp",
  default: "/file-3d.webp",
};

export const getCardTextureFor = (contentType = "") => {
  if (contentType.includes("image")) return textures.image;
  if (contentType.includes("pdf")) return textures.pdf;
  return textures.default;
};
