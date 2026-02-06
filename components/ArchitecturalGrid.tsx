import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Grid } from '@react-three/drei';
import * as THREE from 'three';
import { useUI } from '../context/UIContext';

export const ArchitecturalGrid: React.FC = () => {
  const gridRef = useRef<THREE.Group>(null);
  const { viewMode } = useUI();

  useFrame((state) => {
    // Subtle breathing, but more rigid for Superstudio
    if (gridRef.current) {
      gridRef.current.position.y = -2;
    }
  });

  const isWireframe = viewMode === 'wireframe';

  // Superstudio Colors: White/Grey background, Black lines
  const sectionColor = isWireframe ? "#00f0ff" : "#000000";
  const cellColor = isWireframe ? "#333333" : "#dddddd";
  const backgroundColor = isWireframe ? "#050505" : "#f5f5f5";

  return (
    <group>
      {/* The Continuous Monument: Infinite Grid */}
      <group ref={gridRef}>
        <Grid 
          infiniteGrid 
          cellSize={1} 
          sectionSize={5} 
          fadeDistance={60} 
          sectionColor={sectionColor} 
          cellColor={cellColor} 
          sectionThickness={1.5}
          cellThickness={0.5}
        />
      </group>

      {/* Atmospheric Fog: White for Superstudio, Black for Wireframe */}
      <fog attach="fog" args={[backgroundColor, 5, 60]} />
      <color attach="background" args={[backgroundColor]} />

      <ambientLight intensity={isWireframe ? 0.5 : 1.5} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={1} 
        castShadow 
        shadow-mapSize={[1024, 1024]} 
      />
    </group>
  );
};
