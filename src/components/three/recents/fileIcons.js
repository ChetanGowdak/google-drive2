import * as THREE from "three";

const iconMap = {
  png: "/icons/png.png",
  jpg: "/icons/jpg.png",
  jpeg: "/icons/jpg.png",
  pdf: "/icons/pdf.png",
  docx: "/icons/doc.png",
  default: "/icons/file.png",
};

export const getIconTexture = (filename = "") => {
  const ext = filename.split(".").pop().toLowerCase();
  const iconPath = iconMap[ext] || iconMap.default;
  return new THREE.TextureLoader().load(iconPath);
};
