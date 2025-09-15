import React from "react";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";

export function Earth() {
  return (
    <Sphere args={[1, 64, 64]} scale={2.5}>
      <MeshDistortMaterial
        color="#00d4ff"
        attach="material"
        distort={0.2}
        speed={2}
        roughness={0.5}
      />
    </Sphere>
  );
}
