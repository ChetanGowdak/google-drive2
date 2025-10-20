import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { getCardTextureFor } from "./fileIcons3D";
import styled from "styled-components";
import { Float } from "@react-three/drei";


const CardMesh = ({ file }) => {
  const meshRef = useRef();
  const texturePath = getCardTextureFor(file?.data?.contentType);
  const texture = useTexture(texturePath);

  // ✅ Smooth hover tilt
  useFrame(({ mouse }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        mouse.x * 0.3,
        0.1
      );
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        -mouse.y * 0.3,
        0.1
      );
    }
  });

  return (
    <Float speed={4} rotationIntensity={1} floatIntensity={1}> {/* 🎈 Float Wrapper */}
      <mesh ref={meshRef} scale={[3, 3, 3]}>
        <boxGeometry args={[1, 0.7, 0.1]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </Float>
  );
};

const FileCard3D = ({ file }) => (
  <CardWrapper>
    {/* ✅ Entire 3D card is now clickable and opens file */}
    <a href={file.data.fileURL} target="_blank" rel="noopener noreferrer">
      <CanvasWrapper>
        <Canvas camera={{ position: [0, 0, 3] }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[2, 2, 3]} />
          <CardMesh file={file} />
        </Canvas>
      </CanvasWrapper>
    </a>

    {/* ✅ File label below (still clickable via wrapper) */}
    <FileLabel title={file.data.filename}>{file.data.filename}</FileLabel>
  </CardWrapper>
);

export default FileCard3D;

/* ✅ Styled Components */
const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 180px;
  margin: 12px;
  border: 1px solid rgba(204, 204, 204, 0.46); /* ✅ Border like before */
  border-radius: 6px; /* ✅ Soft rounded corners */
  padding: 10px 0 6px 0; /* ✅ Add inner spacing */
  background: var(--bg-secondary); /* ✅ Matches Drive theme */
  transition: 0.2s ease-in-out;
  
  &:hover {
    border-color: rgba(150, 150, 150, 0.7); /* ✅ Slight highlight on hover */
  }
`;


const CanvasWrapper = styled.div`
  width: 160px;
  height: 110px;
  cursor: pointer;
`;

const FileLabel = styled.p`
  margin-top: 6px;
  font-size: 13px;
  max-width: 140px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-primary);
  width: 100%;
  padding-top: 6px; /* spacing */
  border-top: 1px solid rgba(204, 204, 204, 0.6); /* ✅ Divider line */
`;

