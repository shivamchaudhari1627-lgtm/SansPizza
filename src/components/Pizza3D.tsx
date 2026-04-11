import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PresentationControls, ContactShadows, PerspectiveCamera, Stars, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';

const Steam = () => {
  const points = useRef<THREE.Points>(null);
  const count = 30; // Reduced for mobile performance

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 2.5;
      pos[i * 3 + 1] = Math.random() * 3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!points.current) return;
    const time = state.clock.getElapsedTime();
    const posAttr = points.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      let y = posAttr.getY(i);
      y += 0.008;
      if (y > 3) y = 0;
      posAttr.setY(i, y);

      const x = posAttr.getX(i);
      posAttr.setX(i, x + Math.sin(time * 0.5 + i) * 0.003);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
        color="#ffffff"
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

const CheeseStrings = ({ isPulled, angle }: { isPulled: boolean; angle: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (!meshRef.current) return;
    const targetScaleY = isPulled ? 1 : 0.01;
    meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScaleY, 0.1);
    meshRef.current.visible = meshRef.current.scale.y > 0.05;
  });

  return (
    <mesh ref={meshRef} position={[0, 0.1, 0]} rotation={[0, -angle, 0]}>
      <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
      <meshPhysicalMaterial 
        color="#FFD700" 
        roughness={0.2} 
        metalness={0} 
        emissive="#FFA500" 
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

const Topping = ({ type, position, rotation }: { type: 'pepperoni' | 'olive' | 'pepper'; position: [number, number, number]; rotation: [number, number, number] }) => {
  if (type === 'pepperoni') {
    return (
      <mesh position={position} rotation={rotation} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.03, 16]} />
        <meshStandardMaterial 
          color="#e74c3c" 
          roughness={0.3} 
          emissive="#c0392b"
          emissiveIntensity={0.1}
        />
      </mesh>
    );
  }
  if (type === 'olive') {
    return (
      <mesh position={position} rotation={rotation} castShadow>
        <torusGeometry args={[0.07, 0.035, 8, 16]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.3} />
      </mesh>
    );
  }
  return (
    <mesh position={position} rotation={rotation} castShadow>
      <boxGeometry args={[0.12, 0.03, 0.04]} />
      <meshStandardMaterial color="#1b5e20" roughness={0.5} />
    </mesh>
  );
};

const PizzaSlice = ({
  index,
  total,
  isPulled,
  onToggle,
}: {
  index: number;
  total: number;
  isPulled: boolean;
  onToggle: () => void;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const angleStep = (Math.PI * 2) / total;
  const startAngle = index * angleStep;

  const toppingsData = useMemo(() => {
    const types: ('pepperoni' | 'olive' | 'pepper')[] = ['pepperoni', 'olive', 'pepper'];
    return [...Array(5)].map(() => {
      const r = 0.5 + Math.random() * 1.2;
      const a = (Math.random() * 0.8 + 0.1) * angleStep;
      return { 
        type: types[Math.floor(Math.random() * types.length)],
        r, 
        a, 
        rotation: [Math.random() * 0.2 - 0.1, Math.random() * Math.PI, Math.random() * 0.1] as [number, number, number]
      };
    });
  }, [angleStep]);

  useFrame(() => {
    if (!groupRef.current) return;
    const targetY = isPulled ? 0.7 : 0;
    const targetZ = isPulled ? 0.6 : 0;
    const targetRotX = isPulled ? -0.15 : 0;
    const targetRotZ = isPulled ? 0.05 : 0;
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.08);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.08);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.08);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, 0.08);
  });

  return (
    <group
      ref={groupRef}
      rotation={[0, -startAngle, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      {/* Main Crust - Irregular look */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[2, 2.05, 0.35, 32, 1, false, 0, angleStep]} />
        <meshPhysicalMaterial
          color="#ffb347"
          roughness={0.8}
          metalness={0.1}
          reflectivity={0.3}
        />
      </mesh>

      {/* Puffy Outer Crust - Matches the "sculpted" look in the image */}
      <mesh position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[1.92, 0.18, 16, 40, angleStep]} />
        <meshPhysicalMaterial 
          color="#e67e22" 
          roughness={0.7}
          emissive="#d35400"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Sauce Layer - Deep rich red */}
      <mesh position={[0, 0.14, 0]} receiveShadow>
        <cylinderGeometry args={[1.82, 1.82, 0.03, 32, 1, false, 0, angleStep]} />
        <meshPhysicalMaterial color="#c0392b" roughness={0.2} clearcoat={1} />
      </mesh>

      {/* Bubbly Cheese Layer - Simplified for mobile compatibility */}
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.78, 1.78, 0.1, 32, 1, false, 0, angleStep]} />
        <meshStandardMaterial
          color="#f1c40f"
          roughness={0.4}
          metalness={0}
          emissive="#f39c12"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Toppings - Integrated into the cheese */}
      {toppingsData.map((t, i) => (
        <Topping
          key={i}
          type={t.type}
          position={[Math.cos(t.a) * t.r, 0.24, Math.sin(t.a) * t.r]}
          rotation={t.rotation}
        />
      ))}

      {/* Cheese Strings when pulled */}
      <CheeseStrings isPulled={isPulled} angle={0} />
    </group>
  );
};

const PizzaBoard = () => {
  return (
    <mesh position={[0, -0.2, 0]} receiveShadow>
      <cylinderGeometry args={[2.5, 2.5, 0.15, 64]} />
      <meshPhysicalMaterial 
        color="#3d2b1f" 
        roughness={0.6} 
        metalness={0.1}
        clearcoat={0.2}
      />
    </mesh>
  );
};

const PizzaModel = () => {
  const [pulledSlice, setPulledSlice] = useState<number | null>(null);
  const totalSlices = 8;
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      <Steam />
      <PizzaBoard />
      {[...Array(totalSlices)].map((_, i) => (
        <PizzaSlice
          key={i}
          index={i}
          total={totalSlices}
          isPulled={pulledSlice === i}
          onToggle={() => setPulledSlice(pulledSlice === i ? null : i)}
        />
      ))}

      {/* Center piece - The "hub" of the pizza */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
        <meshPhysicalMaterial color="#8b4513" roughness={0.8} />
      </mesh>
    </group>
  );
};

const Pizza3D = () => {
  return (
    <div className="w-full h-[500px] md:h-[700px] relative group overflow-hidden rounded-3xl bg-[#0a0500] border-4 border-[#DAA520]/30 shadow-2xl">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-white/5 font-serif text-9xl font-black uppercase tracking-tighter select-none">Sanskriti</span>
      </div>
      
      <div className="absolute top-6 left-6 z-10 bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-white/10 text-white text-xs pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
        <p className="font-bold mb-2 text-[#DAA520] tracking-widest uppercase">Ultra-Realistic 3D</p>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#DAA520] rounded-full"></div> Drag to rotate</li>
          <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#DAA520] rounded-full"></div> Scroll to zoom</li>
          <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#DAA520] rounded-full"></div> Click a slice to pull</li>
        </ul>
      </div>

      <Canvas 
        shadows
        dpr={[1, 2]} // Cap DPR for mobile performance
        camera={{ position: [0, 8, 12], fov: 30 }}
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
        gl={{ 
          antialias: true, 
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          powerPreference: "high-performance"
        }}
      >
        <React.Suspense fallback={
          <Html center>
            <div className="flex flex-col items-center justify-center w-64 bg-[#0a0500]/90 p-6 rounded-2xl backdrop-blur-md border border-[#DAA520]/30 shadow-2xl">
              <div className="w-12 h-12 border-4 border-[#DAA520] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-[#DAA520] font-bold animate-pulse text-center">Baking 3D Experience...</p>
            </div>
          </Html>
        }>
          <color attach="background" args={['#0a0500']} />

          {/* Realistic Lighting */}
          <ambientLight intensity={0.5} />
          <spotLight
            position={[15, 20, 15]}
            angle={0.25}
            penumbra={1}
            intensity={1500}
            castShadow
            color="#ffcc88"
            shadow-mapSize={[512, 512]} // Reduced for mobile
          />
          <directionalLight position={[-10, 10, 5]} intensity={1.5} color="#ffffff" />
          <pointLight position={[-5, 5, -5]} intensity={300} color="#ff4400" />
          <pointLight position={[0, 4, 0]} intensity={100} color="#ffffff" />

          <PresentationControls
            global={false}
            snap
            speed={1.2}
            zoom={1}
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 2, Math.PI / 2]}
          >
            <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
              <PizzaModel />
            </Float>
          </PresentationControls>

          <ContactShadows
            position={[0, -0.1, 0]}
            opacity={0.8}
            scale={15}
            blur={2.5}
            far={4}
            color="#000000"
          />

          <Environment preset="city" />
        </React.Suspense>
      </Canvas>
    </div>
  );
};

export default Pizza3D;

