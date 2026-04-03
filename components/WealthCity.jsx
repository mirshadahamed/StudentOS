'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Edges, Grid, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// --- ADVANCED PROCEDURAL BUILDING ---
function SciFiBuilding({ position, targetHeight, color, seed }) {
  const groupRef = useRef();
  const glowRef = useRef();

  // Randomize building thickness and details based on seed
  const width = useMemo(() => 0.5 + seed * 0.5, [seed]);
  const depth = useMemo(() => 0.5 + (1 - seed) * 0.5, [seed]);
  const isMainSpire = seed > 0.9; // 10% chance to be a super-spire

  useFrame((state, delta) => {
    // Smoothly grow the building
    const actualTargetHeight = isMainSpire ? targetHeight * 1.5 : targetHeight;
    groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, actualTargetHeight, delta * 3);
    groupRef.current.position.y = groupRef.current.scale.y / 2;

    // Make the inner neon core pulse
    if (glowRef.current) {
      glowRef.current.intensity = 1.5 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Outer Shell (Dark Glossy Metal/Glass) */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, 1, depth]} />
        <meshPhysicalMaterial 
          color="#0f172a" 
          metalness={0.9} 
          roughness={0.1} 
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
        {/* Cyberpunk Wireframe Edges */}
        <Edges linewidth={1} threshold={15} color={color} opacity={0.4} transparent />
      </mesh>

      {/* Inner Glowing Data Core (The Neon Strip) */}
      <mesh position={[0, 0, depth / 2 + 0.01]}>
        <planeGeometry args={[width * 0.2, 1]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0, 0, -depth / 2 - 0.01]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[width * 0.2, 1]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Antenna on top for detail */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.1]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

// --- THE MAIN SCENE ---
export default function WealthCity({ currentSavings, goalAmount }) {
  // Calculate progress (0.1 to 1.0 minimum to keep small buildings visible)
  const progress = Math.min(Math.max(currentSavings / goalAmount, 0.05), 1);
  const maxScale = 12; // Maximum building height
  
  // Determine city theme color based on progress
  const cityColor = progress > 0.8 ? "#10b981" : progress > 0.4 ? "#06b6d4" : "#8b5cf6";

  // Generate the city grid once
  const buildings = useMemo(() => {
    const b = [];
    for (let x = -3; x <= 3; x++) {
      for (let z = -3; z <= 3; z++) {
        // Skip the very center or random spots to create "streets"
        if ((x === 0 && z === 0) || Math.random() > 0.8) continue;
        
        const seed = Math.abs(Math.sin(x * 12.3 + z * 45.6));
        b.push({
          id: `${x}-${z}`,
          position: [x * 1.5, 0, z * 1.5],
          targetHeight: progress * maxScale * seed,
          seed: seed
        });
      }
    }
    return b;
  }, [progress]);

  return (
    <div className="w-full h-[500px] rounded-[2rem] overflow-hidden bg-[#030712] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
      
      {/* Cinematic UI Overlay */}
      <div className="absolute top-8 left-8 z-10 pointer-events-none">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-3 h-3 rounded-full animate-pulse shadow-[0_0_10px_currentColor] text-[${cityColor}]`} style={{ backgroundColor: cityColor }} />
          <p className="text-white/60 font-bold uppercase tracking-[0.3em] text-xs">Empire Core</p>
        </div>
        <p className="text-5xl font-black text-white drop-shadow-2xl">LKR {currentSavings.toLocaleString()}</p>
        <p className="text-sm text-neutral-400 mt-2 font-medium">Target: LKR {goalAmount.toLocaleString()}</p>
      </div>

      <div className="absolute bottom-8 right-8 z-10 pointer-events-none text-right">
        <p className="text-white/30 font-bold uppercase tracking-widest text-[10px]">Drag to rotate</p>
      </div>

      {/* The 3D Canvas */}
      <Canvas camera={{ position: [12, 8, 12], fov: 45 }}>
        <color attach="background" args={['#030712']} />
        
        {/* Subtle deep fog to make the city fade into the distance */}
        <fog attach="fog" args={['#030712', 10, 30]} />
        
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 20, 5]} intensity={1.5} color={cityColor} />
        <spotLight position={[-10, 10, -10]} intensity={2} color="#ffffff" angle={0.5} penumbra={1} />

        <group position={[0, -2, 0]}>
          {/* Render the advanced buildings */}
          {buildings.map((b) => (
            <SciFiBuilding 
              key={b.id} 
              position={b.position} 
              targetHeight={b.targetHeight} 
              color={cityColor} 
              seed={b.seed} 
            />
          ))}

          {/* Tron-style Digital Grid Floor */}
          <Grid 
            position={[0, 0.01, 0]} 
            args={[30, 30]} 
            cellSize={0.5} 
            cellThickness={1} 
            cellColor={cityColor} 
            sectionSize={2.5} 
            sectionThickness={1.5} 
            sectionColor={cityColor} 
            fadeDistance={25} 
            fadeStrength={1} 
          />

          <ContactShadows resolution={1024} scale={30} blur={2} opacity={0.8} far={10} color="#000000" />
        </group>

        {/* Floating background stars/dust */}
        <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate 
          autoRotateSpeed={0.8} 
          maxPolarAngle={Math.PI / 2.2} // Prevents looking totally under the map
          minPolarAngle={Math.PI / 4}
        />
        
        <Environment preset="night" />

        {/* Cinematic Post-Processing (The Glow!) */}
        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={0.2} 
            mipmapBlur 
            intensity={1.5} 
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}