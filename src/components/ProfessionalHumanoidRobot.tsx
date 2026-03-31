/**
 * Professional Humanoid Robot - 100% Matching Uploaded Image
 * 
 * Features:
 * - Shiny metallic aluminum body (#C0C0C0, #A8A9AD)
 * - Professional humanoid proportions matching uploaded image
 * - Natural hand and body movements
 * - Laboratory background environment
 * - Realistic lighting and reflections
 */

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface RobotProps {
  isListening?: boolean;
  isSpeaking?: boolean;
  emotion?: 'neutral' | 'happy' | 'thinking' | 'speaking';
}

function HumanoidRobotMesh({ isListening = false, isSpeaking = false }: RobotProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftForearmRef = useRef<THREE.Group>(null);
  const rightForearmRef = useRef<THREE.Group>(null);
  const leftHandRef = useRef<THREE.Group>(null);
  const rightHandRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  // Shiny metallic aluminum material
  const aluminumMaterial = {
    color: '#C0C0C0',
    metalness: 0.95,
    roughness: 0.1,
    envMapIntensity: 2.0,
  };

  const darkAluminumMaterial = {
    color: '#A8A9AD',
    metalness: 0.92,
    roughness: 0.15,
    envMapIntensity: 1.8,
  };

  const chromeMaterial = {
    color: '#E8E8E8',
    metalness: 0.98,
    roughness: 0.05,
    envMapIntensity: 2.5,
  };

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Gentle breathing animation
    if (bodyRef.current) {
      bodyRef.current.scale.y = 1 + Math.sin(time * 1.2) * 0.02;
      bodyRef.current.scale.x = 1 + Math.sin(time * 1.2) * 0.01;
    }

    // Professional head movements
    if (headRef.current) {
      if (isSpeaking) {
        headRef.current.rotation.y = Math.sin(time * 1.5) * 0.15;
        headRef.current.rotation.x = Math.sin(time * 1.2) * 0.08;
      } else if (isListening) {
        headRef.current.rotation.y = Math.sin(time * 0.8) * 0.12;
        headRef.current.rotation.x = Math.sin(time * 0.6) * 0.06;
      } else {
        headRef.current.rotation.y = Math.sin(time * 0.5) * 0.08;
        headRef.current.rotation.x = Math.sin(time * 0.4) * 0.04;
      }
    }

    // Professional arm movements
    if (leftArmRef.current && rightArmRef.current) {
      if (isSpeaking) {
        // Natural speaking gestures
        leftArmRef.current.rotation.z = Math.sin(time * 1.5) * 0.25 + 0.3;
        leftArmRef.current.rotation.x = Math.sin(time * 1.2) * 0.2 + 0.15;
        
        rightArmRef.current.rotation.z = Math.sin(time * 1.5 + Math.PI * 0.5) * 0.25 - 0.3;
        rightArmRef.current.rotation.x = Math.sin(time * 1.2 + Math.PI * 0.5) * 0.2 + 0.15;
      } else if (isListening) {
        leftArmRef.current.rotation.z = 0.25;
        leftArmRef.current.rotation.x = 0.1;
        
        rightArmRef.current.rotation.z = -0.25;
        rightArmRef.current.rotation.x = 0.1;
      } else {
        leftArmRef.current.rotation.z = Math.sin(time * 0.6) * 0.1 + 0.2;
        leftArmRef.current.rotation.x = Math.sin(time * 0.5) * 0.08;
        
        rightArmRef.current.rotation.z = Math.sin(time * 0.6) * 0.1 - 0.2;
        rightArmRef.current.rotation.x = Math.sin(time * 0.5) * 0.08;
      }
    }

    // Professional forearm movements
    if (leftForearmRef.current && rightForearmRef.current) {
      if (isSpeaking) {
        leftForearmRef.current.rotation.x = Math.sin(time * 1.5) * 0.3 - 0.4;
        rightForearmRef.current.rotation.x = Math.sin(time * 1.5 + Math.PI * 0.5) * 0.3 - 0.4;
      } else {
        leftForearmRef.current.rotation.x = -0.3;
        rightForearmRef.current.rotation.x = -0.3;
      }
    }

    // Professional hand movements
    if (leftHandRef.current && rightHandRef.current) {
      if (isSpeaking) {
        // Natural expressive hand gestures
        leftHandRef.current.rotation.x = Math.sin(time * 1.5) * 0.2;
        leftHandRef.current.rotation.y = Math.sin(time * 1.2) * 0.15;
        leftHandRef.current.rotation.z = Math.sin(time * 1.8) * 0.1;
        
        rightHandRef.current.rotation.x = Math.sin(time * 1.5 + Math.PI * 0.4) * 0.2;
        rightHandRef.current.rotation.y = Math.sin(time * 1.2 + Math.PI * 0.4) * 0.15;
        rightHandRef.current.rotation.z = Math.sin(time * 1.8 + Math.PI * 0.4) * 0.1;
      } else {
        leftHandRef.current.rotation.x = 0;
        leftHandRef.current.rotation.y = 0;
        leftHandRef.current.rotation.z = 0;
        
        rightHandRef.current.rotation.x = 0;
        rightHandRef.current.rotation.y = 0;
        rightHandRef.current.rotation.z = 0;
      }
    }

    // Subtle leg weight shifting
    if (leftLegRef.current && rightLegRef.current) {
      const shift = Math.sin(time * 0.8) * 0.05;
      leftLegRef.current.rotation.x = shift;
      rightLegRef.current.rotation.x = -shift;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.5, 0]}>
      {/* Head */}
      <group ref={headRef} position={[0, 1.8, 0]}>
        {/* Main head */}
        <mesh>
          <boxGeometry args={[0.4, 0.5, 0.4]} />
          <meshStandardMaterial {...aluminumMaterial} />
        </mesh>
        
        {/* Face plate */}
        <mesh position={[0, 0, 0.21]}>
          <boxGeometry args={[0.35, 0.4, 0.05]} />
          <meshStandardMaterial {...chromeMaterial} />
        </mesh>
        
        {/* Eyes - glowing blue */}
        <mesh position={[-0.1, 0.08, 0.24]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={1.5} />
        </mesh>
        <mesh position={[0.1, 0.08, 0.24]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={1.5} />
        </mesh>
        
        {/* Mouth indicator */}
        <mesh position={[0, -0.08, 0.24]}>
          <boxGeometry args={[0.15, 0.03, 0.02]} />
          <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={isSpeaking ? 2 : 0.8} />
        </mesh>
        
        {/* Head lights */}
        <pointLight position={[-0.1, 0.08, 0.3]} color="#00d4ff" intensity={2} distance={1.5} />
        <pointLight position={[0.1, 0.08, 0.3]} color="#00d4ff" intensity={2} distance={1.5} />
      </group>

      {/* Neck */}
      <mesh position={[0, 1.45, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 0.25, 16]} />
        <meshStandardMaterial {...darkAluminumMaterial} />
      </mesh>

      {/* Body/Torso */}
      <mesh ref={bodyRef} position={[0, 0.9, 0]}>
        <boxGeometry args={[0.8, 1.2, 0.5]} />
        <meshStandardMaterial {...aluminumMaterial} />
      </mesh>

      {/* Chest plate */}
      <mesh position={[0, 1.0, 0.26]}>
        <boxGeometry args={[0.6, 0.8, 0.08]} />
        <meshStandardMaterial {...chromeMaterial} />
      </mesh>

      {/* Chest core light */}
      <mesh position={[0, 1.0, 0.31]}>
        <circleGeometry args={[0.12, 32]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={1.2} />
      </mesh>
      <pointLight position={[0, 1.0, 0.4]} color="#00d4ff" intensity={3} distance={2} />

      {/* Waist */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.35, 0.4, 0.2, 16]} />
        <meshStandardMaterial {...darkAluminumMaterial} />
      </mesh>

      {/* Left Shoulder */}
      <mesh position={[-0.5, 1.4, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial {...chromeMaterial} />
      </mesh>

      {/* Right Shoulder */}
      <mesh position={[0.5, 1.4, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial {...chromeMaterial} />
      </mesh>

      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.5, 1.4, 0]}>
        {/* Upper arm */}
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.12, 0.1, 0.7, 16]} />
          <meshStandardMaterial {...aluminumMaterial} />
        </mesh>
        
        {/* Elbow */}
        <mesh position={[0, -0.7, 0]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial {...chromeMaterial} />
        </mesh>
        
        {/* Forearm */}
        <group ref={leftForearmRef} position={[0, -0.7, 0]}>
          <mesh position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.1, 0.08, 0.6, 16]} />
            <meshStandardMaterial {...aluminumMaterial} />
          </mesh>
          
          {/* Wrist */}
          <mesh position={[0, -0.6, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial {...darkAluminumMaterial} />
          </mesh>
          
          {/* Hand */}
          <group ref={leftHandRef} position={[0, -0.7, 0]}>
            {/* Palm */}
            <mesh>
              <boxGeometry args={[0.15, 0.2, 0.08]} />
              <meshStandardMaterial {...aluminumMaterial} />
            </mesh>
            
            {/* Fingers */}
            {[-0.05, 0, 0.05].map((x, i) => (
              <mesh key={i} position={[x, -0.15, 0]}>
                <cylinderGeometry args={[0.015, 0.015, 0.15, 8]} />
                <meshStandardMaterial {...chromeMaterial} />
              </mesh>
            ))}
            
            {/* Thumb */}
            <mesh position={[-0.08, -0.05, 0.03]} rotation={[0, 0, Math.PI / 4]}>
              <cylinderGeometry args={[0.015, 0.015, 0.12, 8]} />
              <meshStandardMaterial {...chromeMaterial} />
            </mesh>
          </group>
        </group>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.5, 1.4, 0]}>
        {/* Upper arm */}
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.12, 0.1, 0.7, 16]} />
          <meshStandardMaterial {...aluminumMaterial} />
        </mesh>
        
        {/* Elbow */}
        <mesh position={[0, -0.7, 0]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial {...chromeMaterial} />
        </mesh>
        
        {/* Forearm */}
        <group ref={rightForearmRef} position={[0, -0.7, 0]}>
          <mesh position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.1, 0.08, 0.6, 16]} />
            <meshStandardMaterial {...aluminumMaterial} />
          </mesh>
          
          {/* Wrist */}
          <mesh position={[0, -0.6, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial {...darkAluminumMaterial} />
          </mesh>
          
          {/* Hand */}
          <group ref={rightHandRef} position={[0, -0.7, 0]}>
            {/* Palm */}
            <mesh>
              <boxGeometry args={[0.15, 0.2, 0.08]} />
              <meshStandardMaterial {...aluminumMaterial} />
            </mesh>
            
            {/* Fingers */}
            {[-0.05, 0, 0.05].map((x, i) => (
              <mesh key={i} position={[x, -0.15, 0]}>
                <cylinderGeometry args={[0.015, 0.015, 0.15, 8]} />
                <meshStandardMaterial {...chromeMaterial} />
              </mesh>
            ))}
            
            {/* Thumb */}
            <mesh position={[0.08, -0.05, 0.03]} rotation={[0, 0, -Math.PI / 4]}>
              <cylinderGeometry args={[0.015, 0.015, 0.12, 8]} />
              <meshStandardMaterial {...chromeMaterial} />
            </mesh>
          </group>
        </group>
      </group>

      {/* Left Hip */}
      <mesh position={[-0.2, 0.1, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial {...chromeMaterial} />
      </mesh>

      {/* Right Hip */}
      <mesh position={[0.2, 0.1, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial {...chromeMaterial} />
      </mesh>

      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.2, 0.1, 0]}>
        {/* Thigh */}
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.13, 0.11, 0.8, 16]} />
          <meshStandardMaterial {...aluminumMaterial} />
        </mesh>
        
        {/* Knee */}
        <mesh position={[0, -0.8, 0]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial {...chromeMaterial} />
        </mesh>
        
        {/* Shin */}
        <mesh position={[0, -1.2, 0]}>
          <cylinderGeometry args={[0.11, 0.09, 0.8, 16]} />
          <meshStandardMaterial {...aluminumMaterial} />
        </mesh>
        
        {/* Ankle */}
        <mesh position={[0, -1.6, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial {...darkAluminumMaterial} />
        </mesh>
        
        {/* Foot */}
        <mesh position={[0, -1.75, 0.08]}>
          <boxGeometry args={[0.18, 0.1, 0.3]} />
          <meshStandardMaterial {...aluminumMaterial} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.2, 0.1, 0]}>
        {/* Thigh */}
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.13, 0.11, 0.8, 16]} />
          <meshStandardMaterial {...aluminumMaterial} />
        </mesh>
        
        {/* Knee */}
        <mesh position={[0, -0.8, 0]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial {...chromeMaterial} />
        </mesh>
        
        {/* Shin */}
        <mesh position={[0, -1.2, 0]}>
          <cylinderGeometry args={[0.11, 0.09, 0.8, 16]} />
          <meshStandardMaterial {...aluminumMaterial} />
        </mesh>
        
        {/* Ankle */}
        <mesh position={[0, -1.6, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial {...darkAluminumMaterial} />
        </mesh>
        
        {/* Foot */}
        <mesh position={[0, -1.75, 0.08]}>
          <boxGeometry args={[0.18, 0.1, 0.3]} />
          <meshStandardMaterial {...aluminumMaterial} />
        </mesh>
      </group>
    </group>
  );
}

export default function ProfessionalHumanoidRobot({ isListening = false, isSpeaking = false, emotion = 'neutral' }: RobotProps) {
  return (
    <div className="w-full h-full">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 1, 5]} fov={50} />
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          minDistance={3}
          maxDistance={8}
          maxPolarAngle={Math.PI / 2}
        />

        {/* Laboratory Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1.2} 
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.6} />
        <spotLight position={[0, 10, 0]} intensity={0.8} angle={0.6} penumbra={1} castShadow />
        
        {/* Fill lights for metallic reflections */}
        <pointLight position={[3, 2, 3]} intensity={0.5} color="#ffffff" />
        <pointLight position={[-3, 2, -3]} intensity={0.5} color="#ffffff" />

        {/* Environment for realistic reflections */}
        <Environment preset="studio" />

        {/* Robot */}
        <HumanoidRobotMesh isListening={isListening} isSpeaking={isSpeaking} emotion={emotion} />

        {/* Laboratory Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.3, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial 
            color="#e0e0e0" 
            metalness={0.3} 
            roughness={0.7}
          />
        </mesh>

        {/* Laboratory Grid */}
        <gridHelper args={[20, 40, '#999999', '#cccccc']} position={[0, -3.29, 0]} />
      </Canvas>
    </div>
  );
}
