import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Project } from '../types';
import { useUI } from '../context/UIContext';

interface ProjectNodeProps {
  project: Project;
  onEdit: (project: Project) => void;
  isVisible: boolean;
}

export const ProjectNode: React.FC<ProjectNodeProps> = ({ project, onEdit, isVisible }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { viewMode, setCursorData } = useUI();
  
  useFrame(() => {
    if (!meshRef.current) return;
    // Slow, monumental rotation
    meshRef.current.rotation.y += 0.002;
    
    // Scale animation based on visibility
    const targetScale = isVisible ? 1 : 0;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  const handlePointerOver = (e: any) => {
    if (!isVisible) return;
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
    setCursorData({
      visible: true,
      label: `REF_${project.id}`,
      value: project.title.toUpperCase(),
      subtext: `${project.year} // ${project.category.toUpperCase()}`
    });
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
    setCursorData({ visible: false });
  };

  const handleClick = (e: any) => {
    if (!isVisible) return;
    e.stopPropagation();
    onEdit(project);
  };

  const isWireframe = viewMode === 'wireframe';

  // If completely hidden, don't render children to save performance
  if (!isVisible && meshRef.current && meshRef.current.scale.x < 0.01) return null;

  return (
    <group position={new THREE.Vector3(...project.position)}>
      <mesh 
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[3, 4, 0.2]} />
        {isWireframe ? (
             <meshBasicMaterial color="#000000" wireframe />
        ) : (
             <meshBasicMaterial color="#000000" />
        )}
      </mesh>

      {/* The Reflection/Grounding Line - Stark Black */}
      {isVisible && (
        <line>
          <bufferGeometry>
              <float32BufferAttribute 
                  attach="attributes-position" 
                  args={[new Float32Array([0, -2, 0, 0, -project.position[1] - 2, 0]), 3]} 
                  count={2} 
                  itemSize={3}
              />
          </bufferGeometry>
          <lineBasicMaterial color="#000000" transparent opacity={0.5} />
        </line>
      )}

      {/* Hover Annotation (In-Scene) */}
      {(hovered && isVisible && !isWireframe) && (
        <Html 
            transform 
            occlude 
            distanceFactor={8}
            position={[0, 2.5, 0]}
            style={{ pointerEvents: 'none' }}
        >
            <div className="bg-white border-2 border-black p-2 font-['Rajdhani'] min-w-[200px] shadow-[4px_4px_0px_#000000]">
                <h3 className="text-xl font-bold text-black uppercase leading-none">{project.title}</h3>
                <div className="h-px bg-black w-full my-1" />
                <p className="font-mono text-xs text-black">{project.year} // {project.category}</p>
                {project.imageUrl && (
                    <div className="mt-2 w-full h-24 bg-gray-200 overflow-hidden border border-black relative">
                        <img src={project.imageUrl} alt="preview" className="w-full h-full object-cover grayscale contrast-125" />
                    </div>
                )}
                <div className="mt-1 flex justify-between items-center text-[9px] font-mono text-gray-500 uppercase">
                    <span>{project.projectLink ? 'HAS LINK' : ''}</span>
                    <span>CLICK TO EDIT DATA</span>
                </div>
            </div>
        </Html>
      )}
    </group>
  );
};
