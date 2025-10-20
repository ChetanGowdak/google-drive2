import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import FileCard3D from "./FileCard3D";

const RecentDataGrid = ({ recentFiles }) => {
  return (
    <div style={{ width: "100%", height: "360px", overflow: "hidden" }}>
      <Canvas camera={{ position: [0, 2.5, 6], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        {recentFiles?.map((file, index) => (
          <FileCard3D
            key={file.id}
            file={file}
            position={[
              (index % 4) * 2 - 3, // spread 4 tiles per row
              0,
              -Math.floor(index / 4) * 2, // stack in rows
            ]}
          />
        ))}

        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};

export default RecentDataGrid;
