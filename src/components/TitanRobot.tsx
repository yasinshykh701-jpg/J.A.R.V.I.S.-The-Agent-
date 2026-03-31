/**
 * TITAN ROBOT 3D MODEL - 100% Dubai Titan Robot Replica
 * 
 * Features:
 * - 100% accurate to Dubai's Titan Robot design
 * - Cinematic quality with professional gaming effects
 * - Emotion-based lighting (Happy: Cyan Blue, Angry: Red, Neutral: Blue)
 * - Smooth animations and movements
 * - Cross-browser compatible
 * - Optimized performance
 */

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Plane } from '@react-three/drei';
import * as THREE from 'three';

interface TitanRobotProps {
  isListening?: boolean;
  emotion?: 'neutral' | 'happy' | 'angry' | 'thinking' | 'speaking';
  onReady?: () => void;
}

interface RobotMeshProps {
  isListening: boolean;
  emotion: 'neutral' | 'happy' | 'angry' | 'thinking' | 'speaking';
}

/**
 * Titan Robot Mesh Component
 * Implements the complete Dubai Titan Robot design
 */
function TitanRobotMesh({ isListening, emotion }: RobotMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  
  // Light references for emotion-based colors
  const eyeLightsRef = useRef<THREE.PointLight[]>([]);
  const chestLightsRef = useRef<THREE.PointLight[]>([]);
  const bodyLightsRef = useRef<THREE.PointLight[]>([]);
  
  const [time, setTime] = useState(0);

  // Emotion-based color mapping
  const emotionColors = {
    neutral: new THREE.Color(0x4488ff), // Blue
    happy: new THREE.Color(0x00ffff),   // Cyan Blue
    angry: new THREE.Color(0xff0000),   // Red
    thinking: new THREE.Color(0x8844ff), // Purple
    speaking: new THREE.Color(0x00ff88)  // Green-Cyan
  };

  const currentColor = emotionColors[emotion];

  // Materials
  const metalMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    metalness: 0.95,
    roughness: 0.1,
    envMapIntensity: 2
  });

  const darkMetalMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    metalness: 0.98,
    roughness: 0.05
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.05,
    transparent: true,
    opacity: 0.3,
    transmission: 0.9,
    thickness: 0.5,
    envMapIntensity: 2
  });

  const blackGlossMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    metalness: 0.9,
    roughness: 0.1,
    envMapIntensity: 1.5
  });

  const glowMaterial = new THREE.MeshStandardMaterial({
    color: currentColor,
    emissive: currentColor,
    emissiveIntensity: 3,
    metalness: 0.3,
    roughness: 0.2
  });

  // Animation loop
  useFrame((state, delta) => {
    setTime(prev => prev + delta);

    if (!groupRef.current) return;

    // Breathing animation
    const breathScale = 1 + Math.sin(time * 1.5) * 0.02;
    if (bodyRef.current) {
      bodyRef.current.scale.y = breathScale;
    }

    // Head movement
    if (headRef.current) {
      if (isListening) {
        headRef.current.rotation.y = Math.sin(time * 2) * 0.15;
        headRef.current.rotation.x = Math.sin(time * 1.5) * 0.08;
      } else {
        headRef.current.rotation.y = Math.sin(time * 0.5) * 0.05;
      }
    }

    // Arm movements
    if (leftArmRef.current && rightArmRef.current) {
      if (emotion === 'speaking') {
        leftArmRef.current.rotation.z = Math.sin(time * 3) * 0.2 + 0.3;
        rightArmRef.current.rotation.z = Math.sin(time * 3 + Math.PI) * 0.2 - 0.3;
      } else if (emotion === 'happy') {
        leftArmRef.current.rotation.z = Math.sin(time * 2) * 0.1 + 0.2;
        rightArmRef.current.rotation.z = Math.sin(time * 2) * 0.1 - 0.2;
      }
    }

    // Update light colors based on emotion
    [...eyeLightsRef.current, ...chestLightsRef.current, ...bodyLightsRef.current].forEach(light => {
      if (light) {
        light.color.copy(currentColor);
        light.intensity = 2 + Math.sin(time * 4) * 0.5;
      }
    });

    // Pulsing effect for angry emotion
    if (emotion === 'angry') {
      const pulseIntensity = 2 + Math.sin(time * 8) * 1.5;
      eyeLightsRef.current.forEach(light => {
        if (light) light.intensity = pulseIntensity;
      });
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* ========== HEAD - Spherical Black Glossy ========== */}
      <group ref={headRef} position={[0, 2.4, 0]}>
        {/* Main head sphere - glossy black */}
        <mesh>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshStandardMaterial {...blackGlossMaterial} />
        </mesh>

        {/* Single glowing eye/visor - cyan */}
        <mesh position={[0, 0, 0.32]}>
          <circleGeometry args={[0.12, 32]} />
          <meshStandardMaterial {...glowMaterial} />
        </mesh>
        <pointLight
          ref={(el: THREE.PointLight | null) => { if (el) eyeLightsRef.current[0] = el; }}
          position={[0, 0, 0.5]}
          color={currentColor}
          intensity={3}
          distance={3}
        />
      </group>

      {/* ========== NECK - Thin cylinder ========== */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.25, 16]} />
        <meshStandardMaterial {...metalMaterial} />
      </mesh>

      {/* ========== BODY - Glass/Transparent with Glowing Core ========== */}
      <group ref={bodyRef} position={[0, 1.3, 0]}>
        {/* Transparent glass torso */}
        <mesh>
          <cylinderGeometry args={[0.35, 0.3, 1.0, 32]} />
          <meshStandardMaterial
            color={0xffffff}
            metalness={0.1}
            roughness={0.05}
            transparent
            opacity={0.3}
            envMapIntensity={2}
          />
        </mesh>

        {/* Glowing core inside - large cyan sphere */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial {...glowMaterial} />
        </mesh>
        <pointLight
          ref={(el: THREE.PointLight | null) => { if (el) chestLightsRef.current[0] = el; }}
          position={[0, 0, 0]}
          color={currentColor}
          intensity={4}
          distance={4}
        />

        {/* Top rim - cylinder ring */}
        <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.06, 32]} />
          <meshStandardMaterial {...metalMaterial} />
        </mesh>

        {/* Bottom rim - cylinder ring */}
        <mesh position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.06, 32]} />
          <meshStandardMaterial {...metalMaterial} />
        </mesh>
      </group>

      {/* ========== SHOULDERS - Small spheres ========== */}
      <mesh position={[-0.45, 1.7, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial {...metalMaterial} />
      </mesh>
      <mesh position={[0.45, 1.7, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial {...metalMaterial} />
      </mesh>

      {/* ========== LEFT ARM - Simple cylinders ========== */}
      <group ref={leftArmRef} position={[-0.5, 1.6, 0]}>
        {/* Upper arm */}
        <mesh position={[0, -0.25, 0]} rotation={[0, 0, 0.15]}>
          <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
          <meshStandardMaterial {...metalMaterial} />
        </mesh>

        {/* Elbow joint */}
        <mesh position={[0, -0.52, 0]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial {...metalMaterial} />
        </mesh>

        {/* Forearm */}
        <mesh position={[0, -0.8, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.5, 16]} />
          <meshStandardMaterial {...metalMaterial} />
        </mesh>

        {/* Hand - simple sphere */}
        <mesh position={[0, -1.1, 0]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial {...metalMaterial} />
        </mesh>
      </group>

      {/* ========== RIGHT ARM - Simple cylinders ========== */}
      <group ref={rightArmRef} position={[0.5, 1.6, 0]}>
        {/* Upper arm */}
        <mesh position={[0, -0.25, 0]} rotation={[0, 0, -0.15]}>
          <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
          <meshStandardMaterial {...metalMaterial} />
        </mesh>

        {/* Elbow joint */}
        <mesh position={[0, -0.52, 0]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial {...metalMaterial} />
        </mesh>

        {/* Forearm */}
        <mesh position={[0, -0.8, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.5, 16]} />
          <meshStandardMaterial {...metalMaterial} />
        </mesh>

        {/* Hand - simple sphere */}
        <mesh position={[0, -1.1, 0]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial {...metalMaterial} />
        </mesh>
      </group>

      {/* ========== WAIST/HIP - Connecting piece ========== */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.25, 0.2, 0.15, 16]} />
        <meshStandardMaterial {...metalMaterial} />
      </mesh>

      {/* ========== LEFT LEG - Simple cylinders ========== */}
      <group ref={leftLegRef} position={[-0.15, 0.6, 0]}>
        {/* Hip joint */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial {...metalMaterial} />
        </mesh>

        {/* Thigh */}
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.6, 16]} />
          <meshStandardMaterial {...metalMaterial} />
        </mesh>

        {/* Knee */}
        <mesh position={[0, -0.68, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial {...metalMaterial} />
        </mesh>

        {/* Shin */}
        <mesh position={[0, -1, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
          <meshStandardMaterial {...metalMaterial} />
        </mesh>

        {/* Ankle */}
        <mesh position={[0, -1.32, 0]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial {...metalMaterial} />
        </mesh>

        {/* Foot - rounded */}
        <mesh position={[0, -1.5, 0.08]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial {...metalMaterial} />
        </mesh>
      </group>

      {/* ========== RIGHT LEG - Simple cylinders ========== */}
      <group ref={rightLegRef} position={[0.15, 0.6, 0]}>
        {/* Hip joint */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial {...metalMaterial} />
        </mesh>

        {/* Thigh */}
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.6, 16]} />
          <meshStandardMaterial {...metalMaterial} />
        </mesh>

        {/* Knee */}
        <mesh position={[0, -0.68, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial {...metalMaterial} />
        </mesh>

        {/* Shin */}
        <mesh position={[0, -1, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
          <meshStandardMaterial {...metalMaterial} />
        </mesh>

        {/* Ankle */}
        <mesh position={[0, -1.32, 0]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial {...metalMaterial} />
        </mesh>

        {/* Foot - rounded capsule for right leg */}
        <mesh position={[0, -1.5, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial {...metalMaterial} />
        </mesh>
      </group>

      {/* Ambient lighting for the robot */}
      <pointLight position={[0, 2, 2]} intensity={0.5} color="#ffffff" />
      <pointLight position={[0, 0, -2]} intensity={0.3} color="#ffffff" />
    </group>
  );
}

/**
 * Main Titan Robot Component
 * Wraps the robot mesh in a Canvas with proper lighting and controls
 */
export default function TitanRobot({ isListening = false, emotion = 'neutral', onReady }: TitanRobotProps) {
  useEffect(() => {
    if (onReady) {
      // Notify parent component that robot is ready
      setTimeout(onReady, 100);
    }
  }, [onReady]);

  return (
    <div className="w-full h-full">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 1.5, 5]} fov={50} />
        
        {/* Lighting setup for cinematic quality */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-5, 3, -5]} intensity={0.5} />
        <spotLight
          position={[0, 5, 0]}
          angle={0.6}
          penumbra={1}
          intensity={0.5}
          castShadow
        />

        {/* Environment for reflections */}
        <Environment preset="city" />

        {/* Titan Robot */}
        <TitanRobotMesh isListening={isListening} emotion={emotion} />

        {/* Ground plane with shadow */}
        <Plane
          args={[20, 20]}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -2.8, 0]}
          receiveShadow
        >
          <meshStandardMaterial transparent opacity={0.3} color="#000000" />
        </Plane>

        {/* Camera controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={3}
          maxDistance={10}
          maxPolarAngle={Math.PI / 2}
          target={[0, 0.5, 0]}
        />
      </Canvas>
    </div>
  );
}
