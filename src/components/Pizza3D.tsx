import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, ContactShadows, PerspectiveCamera, Stars, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';

// Create a softly fading circular texture for steam particles
const getParticleTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  return new THREE.CanvasTexture(canvas);
};

const Steam = () => {
  const points = useRef<THREE.Points>(null);
  const count = 50; // Balanced for soft effect

  // Generate texture only once
  const particleTexture = useMemo(() => getParticleTexture(), []);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 3;
      pos[i * 3 + 1] = Math.random() * 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!points.current) return;
    const time = state.clock.getElapsedTime();
    const posAttr = points.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      let y = posAttr.getY(i);
      y += 0.012; // Rise slightly faster
      if (y > 4) y = 0;
      posAttr.setY(i, y);

      const x = posAttr.getX(i);
      posAttr.setX(i, x + Math.sin(time * 0.8 + i) * 0.004);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={points} position={[0, -0.5, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.8}
        map={particleTexture}
        color="#ffffff"
        transparent
        opacity={0.25}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

const CheeseStrings = ({ isPulled }: { isPulled: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  const strands = useMemo(() => {
    return [...Array(12)].map(() => ({
      position: [
        (Math.random() - 0.5) * 0.8,
        0,
        (Math.random() - 0.5) * 0.4
      ] as [number, number, number],
      thickness: 0.005 + Math.random() * 0.015,
      speed: 1 + Math.random() * 2
    }));
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    
    const targetScaleY = isPulled ? 2.5 : 0.01;
    const targetOpacity = isPulled ? 0.9 : 0;
    
    groupRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const strand = strands[i];
      
      mesh.scale.y = THREE.MathUtils.lerp(mesh.scale.y, targetScaleY, 0.08);
      
      if (isPulled) {
        // Dynamic wobbling and thinning
        mesh.rotation.z = Math.sin(time * strand.speed + i) * 0.1;
        mesh.rotation.x = Math.cos(time * strand.speed + i) * 0.1;
        
        // Offset to make it look like it's stretching from the base
        mesh.position.y = -mesh.scale.y * 0.5;
      } else {
        mesh.position.y = 0;
      }
      
      const material = mesh.material as THREE.MeshPhysicalMaterial;
      material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity, 0.1);
      mesh.visible = material.opacity > 0.01;
    });
  });

  return (
    <group ref={groupRef}>
      {strands.map((strand, i) => (
        <mesh key={i} position={strand.position}>
          <cylinderGeometry args={[strand.thickness * 0.3, strand.thickness, 1, 6]} />
          <meshPhysicalMaterial 
            color="#d32f2f" 
            roughness={0.15} 
            emissive="#b71c1c" 
            emissiveIntensity={0.2}
            transmission={0.4}
            thickness={0.2}
            transparent
            opacity={0}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
};

const Topping = ({ type, position, rotation }: { type: 'pepperoni' | 'olive' | 'capsicum' | 'mushroom'; position: [number, number, number]; rotation: [number, number, number] }) => {
  if (type === 'olive') {
    return (
      <mesh position={position} rotation={[rotation[0] + Math.PI / 2, rotation[1], rotation[2]]} castShadow>
        <torusGeometry args={[0.06, 0.03, 12, 24]} />
        <meshPhysicalMaterial color="#111111" roughness={0.1} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
    );
  }
  
  if (type === 'capsicum') {
    return (
      <mesh position={position} rotation={[Math.PI / 2, rotation[1], rotation[2]]} castShadow>
        <torusGeometry args={[0.08, 0.015, 8, 16, Math.PI * 1.2]} />
        <meshPhysicalMaterial color="#4caf50" roughness={0.2} transmission={0.6} thickness={0.05} clearcoat={0.5} />
      </mesh>
    );
  }

  if (type === 'mushroom') {
    return (
      <group position={position} rotation={rotation}>
        <mesh position={[0, -0.01, 0]} castShadow>
           <cylinderGeometry args={[0.03, 0.03, 0.04, 8]} />
           <meshStandardMaterial color="#e0d8c8" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.01, 0]} scale={[1, 0.4, 1]} castShadow>
           <sphereGeometry args={[0.1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
           <meshStandardMaterial color="#c2bba8" roughness={0.9} />
        </mesh>
      </group>
    );
  }

  return (
    <group position={position} rotation={rotation}>
      {/* Base of pepperoni */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.015, 24]} />
        <meshPhysicalMaterial 
          color="#8a1712" 
          roughness={0.3} 
          clearcoat={1}
          clearcoatRoughness={0.2}
          emissive="#3a0402"
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Curled crispy edge */}
      <mesh castShadow receiveShadow position={[0, 0.008, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.21, 0.025, 12, 32]} />
        <meshPhysicalMaterial 
          color="#3a0201" 
          roughness={0.6} 
          clearcoat={0.5}
        />
      </mesh>
    </group>
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
    const types: ('pepperoni' | 'olive' | 'capsicum' | 'mushroom')[] = ['pepperoni', 'olive', 'capsicum', 'mushroom'];
    const count = 6 + Math.floor(Math.random() * 4); // 6-9 toppings per slice
    return [...Array(count)].map(() => {
      const type = types[Math.floor(Math.random() * types.length)];
      const r = (type === 'pepperoni' ? 0.6 : 0.4) + Math.random() * 1.1;
      const a = (Math.random() * 0.9 + 0.05) * angleStep;
      return {
        type,
        r,
        a,
        rotation: [(Math.random() - 0.5) * 0.2, Math.random() * Math.PI, (Math.random() - 0.5) * 0.2] as [number, number, number]
      };
    }).sort((a, b) => (a.type === 'pepperoni' ? -1 : 1)); // render pepperoni first so others go on top
  }, [angleStep]);

  const charSpots = useMemo(() => {
    return [...Array(6)].map(() => {
      const a = angleStep * Math.random();
      const r = 1.9 + (Math.random() - 0.5) * 0.05;
      const size = 0.05 + Math.random() * 0.06;
      return {
        a,
        r,
        size,
        y: 0.22 + Math.random() * 0.08,
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number]
      };
    });
  }, [angleStep]);

  const sauceSpots = useMemo(() => {
    return [...Array(5)].map(() => {
      const a = angleStep * Math.random();
      const r = 0.4 + Math.random() * 1.2;
      const size = 0.1 + Math.random() * 0.15;
      return {
        a,
        r,
        size,
        rot: [0, Math.random() * Math.PI, 0] as [number, number, number]
      };
    });
  }, [angleStep]);

  useFrame(() => {
    if (!groupRef.current) return;
    const targetY = isPulled ? 1.2 : 0;
    const targetZ = isPulled ? 0.8 : 0;
    const targetRotX = isPulled ? -0.25 : 0;
    const targetRotZ = isPulled ? 0.08 : 0;
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
      <group>
        {/* Main Crust - Rustic oven-fired */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[2, 2.05, 0.35, 32, 1, false, 0, angleStep]} />
          <meshPhysicalMaterial color="#cfa276" roughness={0.9} metalness={0.05} />
        </mesh>

        {/* Puffy Outer Crust */}
        <mesh position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, Math.PI / 2 - angleStep]} castShadow>
          <torusGeometry args={[1.9, 0.22, 24, 40, angleStep]} />
          <meshPhysicalMaterial 
            color="#b26824" 
            roughness={0.8} 
            clearcoat={0.2}
            clearcoatRoughness={0.8}
          />
        </mesh>

        {/* Scattered Char/Bake marks on the crust edge */}
        {charSpots.map((spot, i) => (
          <mesh key={`char-${i}`} position={[Math.sin(spot.a) * spot.r, spot.y, Math.cos(spot.a) * spot.r]} rotation={spot.rot}>
            <sphereGeometry args={[spot.size, 8, 8]} />
            <meshStandardMaterial color="#2a0d04" roughness={1} />
          </mesh>
        ))}

        {/* Sauce Layer - Deep rich translucent red */}
        <mesh position={[0, 0.155, 0]} receiveShadow>
          <cylinderGeometry args={[1.78, 1.78, 0.03, 32, 1, false, 0, angleStep]} />
          <meshPhysicalMaterial color="#7a1309" roughness={0.2} clearcoat={0.8} transmission={0.3} thickness={0.1} />
        </mesh>

        {/* Main Sauce Base Layer - Rich, glossy red */}
        <mesh position={[0, 0.175, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.74, 1.74, 0.04, 32, 1, false, 0, angleStep]} />
          <meshPhysicalMaterial 
            color="#d32f2f" 
            roughness={0.2} 
            transmission={0.3} 
            thickness={0.1} 
            clearcoat={0.9} 
            clearcoatRoughness={0.15} 
            emissive="#8a1712" 
            emissiveIntensity={0.15}
          />
        </mesh>
        
        {/* Darker bubbling sauce spots */}
        {sauceSpots.map((spot, i) => (
           <mesh key={`cspot-${i}`} position={[Math.sin(spot.a) * spot.r, 0.19, Math.cos(spot.a) * spot.r]} rotation={spot.rot}>
             <boxGeometry args={[spot.size, 0.02, spot.size]} />
             <meshPhysicalMaterial color="#9c110b" roughness={0.3} clearcoat={0.7} transmission={0.2} />
           </mesh>
        ))}

        {/* Toppings - Dynamic Placements */}
        {toppingsData.map((t, i) => (
          <Topping
            key={i}
            type={t.type}
            position={[Math.sin(t.a) * t.r, 0.21, Math.cos(t.a) * t.r]}
            rotation={t.rotation}
          />
        ))}
      </group>

      {/* Cheese Strings when pulled */}
      <group position={[0, 0.15, 0.1]}>
        <CheeseStrings isPulled={isPulled} />
      </group>
    </group>
  );
};

const PizzaBoard = () => {
  return (
    <group position={[0, -0.2, 0]}>
      {/* Wooden Peel/Plate Base */}
      <mesh receiveShadow castShadow>
        <cylinderGeometry args={[2.5, 2.6, 0.15, 64]} />
        <meshPhysicalMaterial 
          color="#8b5a2b" 
          roughness={0.7} 
          metalness={0.05}
          clearcoat={0.3}
          clearcoatRoughness={0.4}
        />
      </mesh>
      {/* Wood Handle detail */}
      <mesh receiveShadow castShadow position={[0, 0, -3.2]}>
        <boxGeometry args={[0.8, 0.14, 1.5]} />
        <meshPhysicalMaterial 
          color="#8b5a2b" 
          roughness={0.7} 
          clearcoat={0.3}
        />
      </mesh>
    </group>
  );
};

const PizzaModel = () => {
  const [pulledSlice, setPulledSlice] = useState<number | null>(null);
  const totalSlices = 8;
  const groupRef = useRef<THREE.Group>(null);

  // Using OrbitControls for camera-driven auto-rotation and manual 360 spin
  return (
    <group ref={groupRef} rotation={[0, Math.PI / 3.5, 0]}>
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
        shadows={{ type: THREE.PCFShadowMap }}
        dpr={[1, 2]} // Cap DPR for mobile performance
        camera={{ position: [0, 12, 4.5], fov: 35 }}
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

          {/* HDRI Environment & Realistic 3-Point Lighting */}
          <Environment preset="night" environmentIntensity={0.8} />
          <ambientLight intensity={0.2} />
          
          {/* Key Light (Warm, sharp shadows) */}
          <spotLight
            position={[10, 15, 10]}
            angle={0.4}
            penumbra={0.5}
            intensity={2500}
            castShadow
            color="#ffd9b3"
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0001}
          />
          
          {/* Fill Light (Cool, soft) */}
          <directionalLight position={[-10, 8, -5]} intensity={1.5} color="#b3d9ff" />
          
          {/* Rim Light (Bright edge highlight) */}
          <spotLight
            position={[0, 5, -15]}
            angle={0.6}
            penumbra={1}
            intensity={1500}
            color="#ffffff"
          />

          <OrbitControls 
            enablePan={false}
            enableZoom={true}
            enableDamping={true}
            dampingFactor={0.05}
            autoRotate={true}
            autoRotateSpeed={0.8}
            minDistance={6}
            maxDistance={20}
            maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera from going under the board
          />
          
          <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
            <PizzaModel />
          </Float>

          <ContactShadows
            position={[0, -0.1, 0]}
            opacity={0.8}
            scale={15}
            blur={2.5}
            far={4}
            color="#000000"
          />
        </React.Suspense>
      </Canvas>
    </div>
  );
};

export default Pizza3D;

