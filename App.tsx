import React, { useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import { ArchitecturalGrid } from './components/ArchitecturalGrid';
import { ProjectNode } from './components/ProjectNode';
import { HUD } from './components/HUD';
import { EditModal } from './components/EditModal';
import { Project } from './types';
import { UIProvider } from './context/UIContext';

// Initial Data
const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Kinetic',
    category: 'Product Design',
    role: 'Lead Designer',
    year: '2024',
    description: 'A Credit-based Physio Platform: Incentive Design under Adversarial Conditions.',
    position: [-3, 0, -10],
    tech: ['Figma', 'Behavioral Science', 'Gamification']
  },
  {
    id: '2',
    title: 'Think less Vibe',
    category: 'Engineering',
    role: 'Developer',
    year: '2024',
    description: 'Coding a Furniture Auditing Tool inspired by Dieter Rams: Less, But Better.',
    position: [3, 1, -20],
    tech: ['Python', 'Computer Vision', 'Dieter Rams']
  },
  {
    id: '3',
    title: 'Walley Bank',
    category: 'UI/UX',
    role: 'Product Designer',
    year: '2023',
    description: 'Responsive UI Design for Fintech Service.',
    position: [0, -1, -30],
    tech: ['Figma', 'React', 'Tailwind']
  },
  {
    id: '4',
    title: 'Relish',
    category: 'Web Development',
    role: 'Full Stack',
    year: '2022',
    description: 'Progressive Web App for Dining Recommendation.',
    position: [-2, 2, -40],
    tech: ['PWA', 'React', 'Node.js']
  }
];

// Scene Controller component to handle Camera Movement based on Scroll
const SceneController: React.FC<{ setScrollProgress: (v: number) => void }> = ({ setScrollProgress }) => {
  const scroll = useScroll();
  
  useFrame((state) => {
    const depth = 50; 
    const targetZ = -(scroll.offset * depth);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.1);
    
    // Parallax
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, (state.mouse.x * 2), 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, (state.mouse.y * 2), 0.05);
    
    setScrollProgress(Math.abs(targetZ));
  });

  return null;
};

const App: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleProjectUpdate = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  return (
    <UIProvider>
      <div className="relative w-full h-screen bg-white overflow-hidden">
        
        {/* 2D HUD Layer */}
        <HUD scrollProgress={scrollProgress} totalDepth={50} />

        {/* Edit Modal Layer */}
        {editingProject && (
            <EditModal 
                project={editingProject} 
                isOpen={!!editingProject}
                onClose={() => setEditingProject(null)}
                onSave={handleProjectUpdate}
            />
        )}

        {/* 3D Scene Layer */}
        <Canvas 
          shadows 
          camera={{ position: [0, 0, 5], fov: 60 }} 
          gl={{ antialias: true, toneMapping: THREE.NoToneMapping }} // No tone mapping for stark contrast
        >
          {/* Default to white background for Superstudio look */}
          <color attach="background" args={['#f5f5f5']} />
          
          <Suspense fallback={null}>
            <ScrollControls pages={5} damping={0.2}>
               <SceneController setScrollProgress={setScrollProgress} />
               <ArchitecturalGrid />
               {projects.map(project => (
                 <ProjectNode 
                    key={project.id} 
                    project={project} 
                    onEdit={setEditingProject} 
                 />
               ))}
            </ScrollControls>
          </Suspense>
        </Canvas>
        
        {/* Mobile Disclaimer */}
        <div className="md:hidden fixed inset-0 bg-white z-[60] flex items-center justify-center p-8 text-center">
          <div className="border-4 border-black p-4">
              <h2 className="font-['Rajdhani'] text-2xl text-black mb-2 uppercase font-bold">System Warning</h2>
              <p className="font-mono text-xs text-black">
                  Optimized for Desktop Interfaces.
              </p>
          </div>
        </div>
      </div>
    </UIProvider>
  );
};

export default App;