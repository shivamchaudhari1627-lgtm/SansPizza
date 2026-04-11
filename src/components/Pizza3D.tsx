import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PresentationControls, ContactShadows, PerspectiveCamera, Stars, Environment, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const Steam = () => {
  const points = useRef<THREE.Points>(null);
  const count = 60;

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
        <cylinderGeometry args={[0.2, 0.2, 0.02, 16]} />
        <meshPhysicalMaterial 
          color="#8B0000" 
          roughness={0.4} 
          clearcoat={0.3} 
          bumpScale={0.01}
        />
      </mesh>
    );
  }
  if (type === 'olive') {
    return (
      <mesh position={position} rotation={rotation} castShadow>
        <torusGeometry args={[0.08, 0.04, 8, 16]} />
        <meshPhysicalMaterial color="#1a1a1a" roughness={0.1} metalness={0.2} />
      </mesh>
    );
  }
  return (
    <mesh position={position} rotation={rotation} castShadow>
      <boxGeometry args={[0.15, 0.02, 0.05]} />
      <meshPhysicalMaterial color="#228B22" roughness={0.3} clearcoat={0.5} />
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
    return [...Array(4)].map(() => {
      const r = 0.6 + Math.random() * 1.1;
      const a = (Math.random() * 0.8 + 0.1) * angleStep;
      return { 
        type: types[Math.floor(Math.random() * types.length)],
        r, 
        a, 
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number]
      };
    });
  }, [angleStep]);

  useFrame(() => {
    if (!groupRef.current) return;
    const targetY = isPulled ? 0.6 : 0;
    const targetZ = isPulled ? 0.5 : 0;
    const targetRotX = isPulled ? -0.1 : 0;
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.1);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.1);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.1);
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
      {/* Crust Geometry - More detailed PBR */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[2, 2, 0.3, 32, 1, false, 0, angleStep]} />
        <meshPhysicalMaterial
          color="#D2691E"
          roughness={0.8}
          metalness={0.1}
          clearcoat={0.1}
          reflectivity={0.2}
        />
      </mesh>

      {/* Outer Crust Edge (The puffy part) */}
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[1.9, 0.15, 12, 32, angleStep]} />
        <meshPhysicalMaterial color="#8B4513" roughness={0.9} />
      </mesh>

      {/* Sauce Layer */}
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <cylinderGeometry args={[1.8, 1.8, 0.02, 32, 1, false, 0, angleStep]} />
        <meshPhysicalMaterial color="#A52A2A" roughness={0.2} clearcoat={1} />
      </mesh>

      {/* Cheese Layer - Bubbling effect with MeshDistortMaterial */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.75, 1.75, 0.08, 32, 1, false, 0, angleStep]} />
        <meshPhysicalMaterial
          color="#FFD700"
          roughness={0.3}
          metalness={0}
          emissive="#FFA500"
          emissiveIntensity={0.15}
          clearcoat={0.6}
        />
      </mesh>

      {/* Toppings */}
      {toppingsData.map((t, i) => (
        <Topping
          key={i}
          type={t.type}
          position={[Math.cos(t.a) * t.r, 0.22, Math.sin(t.a) * t.r]}
          rotation={t.rotation}
        />
      ))}

      {/* Cheese Strings when pulled */}
      <CheeseStrings isPulled={isPulled} angle={0} />
    </group>
  );
};

const PizzaModel = () => {
  const [pulledSlice, setPulledSlice] = useState<number | null>(null);
  const totalSlices = 8;
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={groupRef}>
      <Steam />
      {[...Array(totalSlices)].map((_, i) => (
        <PizzaSlice
          key={i}
          index={i}
          total={totalSlices}
          isPulled={pulledSlice === i}
          onToggle={() => setPulledSlice(pulledSlice === i ? null : i)}
        />
      ))}

      {/* Center piece */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} />
        <meshPhysicalMaterial color="#8B4513" roughness={0.8} />
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
        camera={{ position: [0, 8, 12], fov: 30 }}
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
        gl={{ 
          antialias: true, 
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
      >
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
          shadow-mapSize={[2048, 2048]}
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
        <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
};

export default Pizza3D;

