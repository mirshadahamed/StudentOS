'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Edges, Grid, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// Helper function to clamp values
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Advanced Procedural Building with growth animation
function SciFiBuilding({ position, targetHeight, color, seed, currentProgress }) {
  const groupRef = useRef();
  const glowRef = useRef();
  const currentScaleY = useRef(0.05); // Start very small

  // Randomize building thickness and details based on seed
  const width = useMemo(() => 0.4 + seed * 0.6, [seed]);
  const depth = useMemo(() => 0.4 + (1 - seed) * 0.6, [seed]);
  const isMainSpire = seed > 0.9;
  
  // Calculate actual target height based on progress
  const actualTargetHeight = useMemo(() => {
    const baseHeight = isMainSpire ? targetHeight * 1.5 : targetHeight;
    // Ensure minimum height of 0.3 so buildings are visible
    return Math.max(baseHeight * currentProgress, 0.3);
  }, [targetHeight, isMainSpire, currentProgress]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Smoothly animate the building height
    const currentY = groupRef.current.scale.y;
    const newY = THREE.MathUtils.lerp(currentY, actualTargetHeight, delta * 3);
    groupRef.current.scale.y = newY;
    groupRef.current.position.y = newY / 2;
    
    // Make the inner neon core pulse
    if (glowRef.current) {
      glowRef.current.intensity = 1.2 + Math.sin(state.clock.elapsedTime * 2.5 + position[0]) * 0.4;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={[1, 0.05, 1]}>
      {/* Outer Shell - Dark Glossy Metal/Glass */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, 1, depth]} />
        <meshPhysicalMaterial 
          color="#0f172a" 
          metalness={0.85} 
          roughness={0.15} 
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive={color}
          emissiveIntensity={0.05}
        />
        {/* Cyberpunk Wireframe Edges */}
        <Edges linewidth={1} threshold={15} color={color} opacity={0.3} transparent />
      </mesh>

      {/* Inner Glowing Data Core - The Neon Strip */}
      <mesh position={[0, 0, depth / 2 + 0.01]}>
        <planeGeometry args={[width * 0.15, 1]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 0, -depth / 2 - 0.01]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[width * 0.15, 1]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>
      
      {/* Side neon strips */}
      <mesh position={[width / 2 + 0.01, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[depth * 0.15, 1]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
      <mesh position={[-width / 2 - 0.01, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[depth * 0.15, 1]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>

      {/* Antenna on top for detail */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.08]} />
        <meshBasicMaterial color={color} />
      </mesh>
      
      {/* Glowing top light */}
      <pointLight ref={glowRef} position={[0, 0.6, 0]} distance={2} intensity={0.5} color={color} />
    </group>
  );
}

// Main WealthCity Component
export default function WealthCity({ currentSavings = 0, goalAmount = 0 }) {
  const safeGoal = goalAmount > 0 ? goalAmount : 1;
  const rawProgress = currentSavings / safeGoal;
  const progress = clamp(rawProgress, 0, 1);
  
  // Minimum progress to show some buildings (14%)
  const displayProgress = Math.max(progress, 0.14);
  
  // Maximum building height
  const maxScale = 10;
  
  // Determine city theme color based on progress
  const themeColor = progress > 0.8 
    ? "#10b981"  // Emerald green - wealthy
    : progress > 0.4 
      ? "#06b6d4" // Cyan - growing
      : "#8b5cf6"; // Purple - starting

  const themeLabel = progress > 0.8
    ? "EMPIRE PEAK"
    : progress > 0.4
      ? "EMPIRE RISING"
      : "EMPIRE SEED";

  // Generate the city grid once
  const buildings = useMemo(() => {
    const b = [];
    // Create a 7x7 grid of buildings
    for (let x = -3; x <= 3; x++) {
      for (let z = -3; z <= 3; z++) {
        // Skip center to create a plaza
        if ((x === 0 && z === 0)) continue;
        
        // Random seed for variety
        const seed = Math.abs(Math.sin(x * 12.3 + z * 45.6));
        
        // Skip some positions to create streets (20% chance)
        if (Math.random() > 0.75 && (Math.abs(x) !== 3 && Math.abs(z) !== 3)) continue;
        
        // Calculate base target height based on position
        const distanceFromCenter = Math.sqrt(x * x + z * z);
        const heightMultiplier = 1 - (distanceFromCenter / 5) * 0.3;
        
        b.push({
          id: `${x}-${z}`,
          position: [x * 1.4, 0, z * 1.4],
          targetHeight: maxScale * heightMultiplier * (0.5 + seed * 0.8),
          seed: seed
        });
      }
    }
    return b;
  }, []);

  return (
    <div className="w-full h-[500px] rounded-[2rem] overflow-hidden bg-[#030712] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
      
      {/* Cinematic UI Overlay */}
      <div className="absolute top-8 left-8 z-10 pointer-events-none">
        <div className="flex items-center gap-3 mb-2">
          <div 
            className="w-3 h-3 rounded-full animate-pulse" 
            style={{ backgroundColor: themeColor, boxShadow: `0 0 10px ${themeColor}` }}
          />
          <p className="text-white/60 font-bold uppercase tracking-[0.3em] text-xs">{themeLabel}</p>
        </div>
        <p className="text-5xl font-black text-white drop-shadow-2xl">LKR {currentSavings.toLocaleString()}</p>
        <p className="text-sm text-neutral-400 mt-2 font-medium">Target: LKR {goalAmount.toLocaleString()}</p>
      </div>

      {/* Progress Percentage Badge */}
      <div className="absolute top-8 right-8 z-10 pointer-events-none">
        <div className="rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">Progress</p>
          <p className="text-right text-lg font-black text-white">{Math.round(progress * 100)}%</p>
        </div>
      </div>

      {/* Bottom Right Info */}
      <div className="absolute bottom-8 right-8 z-10 pointer-events-none text-right">
        <p className="text-white/30 font-bold uppercase tracking-widest text-[10px]">Drag to rotate • 3D City</p>
        <p className="text-xs text-white/20 mt-1">Savings growth builds your empire</p>
      </div>

      {/* The 3D Canvas */}
      <Canvas camera={{ position: [12, 7, 12], fov: 45 }}>
        <color attach="background" args={['#030712']} />
        
        {/* Subtle deep fog to make the city fade into the distance */}
        <fog attach="fog" args={['#030712', 15, 35]} />
        
        <ambientLight intensity={0.25} />
        <directionalLight position={[10, 20, 5]} intensity={1.2} color={themeColor} />
        <spotLight position={[-10, 15, -10]} intensity={1.5} color="#ffffff" angle={0.5} penumbra={1} />
        <pointLight position={[0, 5, 0]} intensity={0.5} color={themeColor} />

        <group position={[0, -2, 0]}>
          {/* Render all the buildings with current progress */}
          {buildings.map((b) => (
            <SciFiBuilding 
              key={b.id} 
              position={b.position} 
              targetHeight={b.targetHeight} 
              color={themeColor} 
              seed={b.seed}
              currentProgress={displayProgress}
            />
          ))}

          {/* Tron-style Digital Grid Floor */}
          <Grid 
            position={[0, 0.01, 0]} 
            args={[25, 25]} 
            cellSize={0.6} 
            cellThickness={1.2} 
            cellColor={themeColor} 
            sectionSize={2.4} 
            sectionThickness={1.8} 
            sectionColor={themeColor} 
            fadeDistance={22} 
            fadeStrength={1.2} 
          />

          <ContactShadows resolution={1024} scale={30} blur={2.5} opacity={0.7} far={12} color="#000000" />
        </group>

        {/* Floating background stars/dust */}
        <Stars radius={60} depth={60} count={2500} factor={4.5} saturation={0} fade speed={0.8} />

        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          autoRotate 
          autoRotateSpeed={0.6} 
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 5}
          zoomSpeed={0.8}
        />
        
        <Environment preset="night" />

        {/* Cinematic Post-Processing - The Glow Effect! */}
        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={0.15} 
            mipmapBlur 
            intensity={1.2} 
            radius={0.8}
          />
        </EffectComposer>
      </Canvas>

      {/* Empty state message */}
      {currentSavings <= 0 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-24 z-[3] flex items-center justify-center">
          <div className="rounded-full border border-white/10 bg-black/60 backdrop-blur-md px-5 py-3 text-center shadow-[0_0_24px_rgba(0,0,0,0.3)]">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/35">Awaiting data</p>
            <p className="mt-1 text-sm text-white/60">Add your savings goal to build your empire</p>
          </div>
        </div>
      )}
    </div>
  );
}