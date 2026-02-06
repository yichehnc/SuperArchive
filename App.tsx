import React, { useState, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import { ArchitecturalGrid } from './components/ArchitecturalGrid';
import { ProjectNode } from './components/ProjectNode';
import { HUD } from './components/HUD';
import { EditModal } from './components/EditModal';
import { Project } from './types';
import { UIProvider } from './context/UIContext';

// Categories: media, UX UI, architecture, technology
const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Kinetic',
    category: 'UX UI',
    role: 'Lead Designer',
    year: '2024',
    description: 'A Credit-based Physio Platform: Incentive Design under Adversarial Conditions.',
    position: [-3, 0, -10],
    tech: ['Figma', 'Behavioral Science', 'Gamification']
  },
  {
    id: '2',
    title: 'Think less Vibe',
    category: 'Technology',
    role: 'Developer',
    year: '2024',
    description: 'Coding a Furniture Auditing Tool inspired by Dieter Rams: Less, But Better.',
    position: [3, 1, -20],
    tech: ['Python', 'Computer Vision', 'Dieter Rams']
  },
  {
    id: '3',
    title: 'Walley Bank',
    category: 'UX UI',
    role: 'Product Designer',
    year: '2023',
    description: 'Responsive UI Design for Fintech Service.',
    position: [0, -1, -30],
    tech: ['Figma', 'React', 'Tailwind']
  },
  {
    id: '4',
    title: 'Relish',
    category: 'Media',
    role: 'Full Stack',
    year: '2022',
    description: 'Progressive Web App for Dining Recommendation.',
    position: [-2, 2, -40],
    tech: ['PWA', 'React', 'Node.js']
  },
  {
    id: '5',
    title: 'Void Structure',
    category: 'Architecture',
    role: 'Architect',
    year: '2023',
    description: 'Procedural generation of housing units showing permanences and correspondences.',
    position: [2, -2, -50],
    tech: ['Unreal Engine', 'Rhino', 'Grasshopper']
  }
];

// Scene Controller component to handle Camera Movement based on Scroll
const SceneController: React.FC<{ setScrollProgress: (v: number) => void }> = ({ setScrollProgress }) => {
  const scroll = useScroll();
  
  useFrame((state) => {
    const depth = 60; 
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
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const handleProjectUpdate = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  // Filter logic
  const visibleProjects = useMemo(() => {
    if (activeCategory === 'ALL') return projects;
    return projects.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
  }, [projects, activeCategory]);

  return (
    <UIProvider>
      <div className="relative w-full h-screen bg-white overflow-hidden">
        
        {/* 2D HUD Layer with Category Control */}
        <HUD 
          scrollProgress={scrollProgress} 
          totalDepth={60} 
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

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
          gl={{ antialias: true, toneMapping: THREE.NoToneMapping }} 
        >
          {/* Default to white background for Superstudio look */}
          <color attach="background" args={['#f5f5f5']} />
          
          <Suspense fallback={null}>
            <ScrollControls pages={6} damping={0.2}>
               <SceneController setScrollProgress={setScrollProgress} />
               <ArchitecturalGrid />
               {projects.map(project => {
                 const isVisible = activeCategory === 'ALL' || project.category.toLowerCase() === activeCategory.toLowerCase();
                 return (
                   <ProjectNode 
                      key={project.id} 
                      project={project} 
                      onEdit={setEditingProject}
                      isVisible={isVisible}
                   />
                 );
               })}
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
