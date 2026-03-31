import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';

interface Robot3DProps {
  isSpeaking: boolean;
}

// @ts-ignore - React Three Fiber types
export default function Robot3D({ isSpeaking }: Robot3DProps) {
  const headRef = useRef<Mesh>(null);
  const bodyRef = useRef<Mesh>(null);
  const leftArmRef = useRef<Group>(null);
  const rightArmRef = useRef<Group>(null);
  const leftEyeRef = useRef<Mesh>(null);
  const rightEyeRef = useRef<Mesh>(null);
  const mouthRef = useRef<Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Idle animation - gentle bobbing
    if (bodyRef.current && !isSpeaking) {
      bodyRef.current.position.y = Math.sin(time * 2) * 0.05;
    }

    // Speaking animation - friendly movements
    if (isSpeaking) {
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(time * 6) * 0.12;
        headRef.current.rotation.z = Math.sin(time * 4) * 0.05;
      }
      // Eyes blink and glow
      if (leftEyeRef.current && rightEyeRef.current) {
        const blink = Math.abs(Math.sin(time * 8));
        leftEyeRef.current.scale.y = 0.8 + blink * 0.2;
        rightEyeRef.current.scale.y = 0.8 + blink * 0.2;
      }
      // Mouth opens when speaking
      if (mouthRef.current) {
        mouthRef.current.scale.x = 1 + Math.abs(Math.sin(time * 10)) * 0.3;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.z = Math.sin(time * 3) * 0.2 + 0.2;
        leftArmRef.current.rotation.x = Math.sin(time * 2.5) * 0.15;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.z = Math.sin(time * 3) * 0.2 - 0.2;
        rightArmRef.current.rotation.x = Math.sin(time * 2.5) * 0.15;
      }
      if (bodyRef.current) {
        bodyRef.current.position.y = Math.sin(time * 6) * 0.04;
      }
    } else {
      // Reset to idle position
      if (leftArmRef.current) {
        leftArmRef.current.rotation.z = 0.2;
        leftArmRef.current.rotation.x = 0;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.z = -0.2;
        rightArmRef.current.rotation.x = 0;
      }
      if (leftEyeRef.current && rightEyeRef.current) {
        leftEyeRef.current.scale.y = 1;
        rightEyeRef.current.scale.y = 1;
      }
      if (mouthRef.current) {
        mouthRef.current.scale.x = 1;
      }
    }
  });

  return (
    // @ts-ignore
    <group position={[0, -0.5, 0]}>
      {/* ========== HEAD - Super cute round head ========== */}
      {/* @ts-ignore */}
      <mesh ref={headRef} position={[0, 2.2, 0]}>
        {/* @ts-ignore */}
        <sphereGeometry args={[0.55, 32, 32]} />
        {/* @ts-ignore */}
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.2} 
          roughness={0.5}
        />
        
        {/* Left eye - BIGGER friendly eye */}
        {/* @ts-ignore */}
        <mesh ref={leftEyeRef} position={[-0.2, 0.15, 0.48]}>
          {/* @ts-ignore */}
          <sphereGeometry args={[0.15, 24, 24]} />
          {/* @ts-ignore */}
          <meshStandardMaterial 
            color="#00d4ff" 
            emissive="#00d4ff" 
            emissiveIntensity={isSpeaking ? 2.5 : 2}
          />
        </mesh>
        
        {/* Left eye pupil - sparkle effect */}
        {/* @ts-ignore */}
        <mesh position={[-0.2, 0.15, 0.56]}>
          {/* @ts-ignore */}
          <sphereGeometry args={[0.06, 20, 20]} />
          {/* @ts-ignore */}
          <meshStandardMaterial color="#000000" />
        </mesh>
        
        {/* Left eye highlight - cute sparkle */}
        {/* @ts-ignore */}
        <mesh position={[-0.16, 0.19, 0.58]}>
          {/* @ts-ignore */}
          <sphereGeometry args={[0.03, 16, 16]} />
          {/* @ts-ignore */}
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#ffffff" 
            emissiveIntensity={3}
          />
        </mesh>

        {/* Right eye - BIGGER friendly eye */}
        {/* @ts-ignore */}
        <mesh ref={rightEyeRef} position={[0.2, 0.15, 0.48]}>
          {/* @ts-ignore */}
          <sphereGeometry args={[0.15, 24, 24]} />
          {/* @ts-ignore */}
          <meshStandardMaterial 
            color="#00d4ff" 
            emissive="#00d4ff" 
            emissiveIntensity={isSpeaking ? 2.5 : 2}
          />
        </mesh>
        
        {/* Right eye pupil - sparkle effect */}
        {/* @ts-ignore */}
        <mesh position={[0.2, 0.15, 0.56]}>
          {/* @ts-ignore */}
          <sphereGeometry args={[0.06, 20, 20]} />
          {/* @ts-ignore */}
          <meshStandardMaterial color="#000000" />
        </mesh>
        
        {/* Right eye highlight - cute sparkle */}
        {/* @ts-ignore */}
        <mesh position={[0.24, 0.19, 0.58]}>
          {/* @ts-ignore */}
          <sphereGeometry args={[0.03, 16, 16]} />
          {/* @ts-ignore */}
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#ffffff" 
            emissiveIntensity={3}
          />
        </mesh>

        {/* Cute rosy cheeks - left */}
        {/* @ts-ignore */}
        <mesh position={[-0.35, 0, 0.42]}>
          {/* @ts-ignore */}
          <sphereGeometry args={[0.08, 20, 20]} />
          {/* @ts-ignore */}
          <meshStandardMaterial 
            color="#ffb3d9" 
            emissive="#ffb3d9" 
            emissiveIntensity={0.5}
            transparent={true}
            opacity={0.6}
          />
        </mesh>

        {/* Cute rosy cheeks - right */}
        {/* @ts-ignore */}
        <mesh position={[0.35, 0, 0.42]}>
          {/* @ts-ignore */}
          <sphereGeometry args={[0.08, 20, 20]} />
          {/* @ts-ignore */}
          <meshStandardMaterial 
            color="#ffb3d9" 
            emissive="#ffb3d9" 
            emissiveIntensity={0.5}
            transparent={true}
            opacity={0.6}
          />
        </mesh>

        {/* BIG HAPPY smile mouth - wider and more curved */}
        {/* @ts-ignore */}
        <mesh ref={mouthRef} position={[0, -0.12, 0.5]} rotation={[0, 0, 0]}>
          {/* @ts-ignore */}
          <torusGeometry args={[0.2, 0.04, 16, 32, Math.PI]} />
          {/* @ts-ignore */}
          <meshStandardMaterial 
            color={isSpeaking ? "#ff6600" : "#333333"}
            emissive={isSpeaking ? "#ff6600" : "#000000"}
            emissiveIntensity={isSpeaking ? 2 : 0}
          />
        </mesh>

        {/* Antenna - cute robot feature with bouncy tip */}
        {/* @ts-ignore */}
        <mesh position={[0, 0.6, 0]}>
          {/* @ts-ignore */}
          <cylinderGeometry args={[0.025, 0.025, 0.25, 16]} />
          {/* @ts-ignore */}
          <meshStandardMaterial color="#e0e0e0" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* @ts-ignore */}
        <mesh position={[0, 0.78, 0]}>
          {/* @ts-ignore */}
          <sphereGeometry args={[0.08, 20, 20]} />
          {/* @ts-ignore */}
          <meshStandardMaterial 
            color="#00d4ff" 
            emissive="#00d4ff" 
            emissiveIntensity={isSpeaking ? 3 : 2}
          />
        </mesh>
      </mesh>

      {/* ========== NECK - Short cute connector ========== */}
      {/* @ts-ignore */}
      <mesh position={[0, 1.82, 0]}>
        {/* @ts-ignore */}
        <cylinderGeometry args={[0.18, 0.2, 0.22, 24]} />
        {/* @ts-ignore */}
        <meshStandardMaterial color="#f8f8f8" metalness={0.2} roughness={0.5} />
      </mesh>

      {/* ========== BODY - Rounder cuter body ========== */}
      {/* @ts-ignore */}
      <mesh ref={bodyRef} position={[0, 1.15, 0]}>
        {/* @ts-ignore */}
        <capsuleGeometry args={[0.45, 0.85, 24, 32]} />
        {/* @ts-ignore */}
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.2} 
          roughness={0.5}
        />
      </mesh>

      {/* Chest panel - cute detail */}
      {/* @ts-ignore */}
      <mesh position={[0, 1.15, 0.47]}>
        {/* @ts-ignore */}
        <boxGeometry args={[0.38, 0.55, 0.02]} />
        {/* @ts-ignore */}
        <meshStandardMaterial color="#f0f0f0" metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Glowing heart/core - BIGGER friendly feature */}
      {/* @ts-ignore */}
      <mesh position={[0, 1.15, 0.49]}>
        {/* @ts-ignore */}
        <sphereGeometry args={[0.1, 24, 24]} />
        {/* @ts-ignore */}
        <meshStandardMaterial 
          color="#00d4ff" 
          emissive="#00d4ff" 
          emissiveIntensity={isSpeaking ? 3 : 2}
        />
      </mesh>

      {/* ========== LEFT ARM - Cute rounded arm ========== */}
      {/* @ts-ignore */}
      <group ref={leftArmRef} position={[-0.55, 1.45, 0]} rotation={[0, 0, 0.2]}>
        {/* Shoulder joint */}
        {/* @ts-ignore */}
        <mesh position={[0, 0, 0]}>
          {/* @ts-ignore */}
          <sphereGeometry args={[0.16, 24, 24]} />
          {/* @ts-ignore */}
          <meshStandardMaterial color="#f8f8f8" metalness={0.2} roughness={0.5} />
        </mesh>
        
        {/* Upper arm */}
        {/* @ts-ignore */}
        <mesh position={[0, -0.35, 0]}>
          {/* @ts-ignore */}
          <capsuleGeometry args={[0.09, 0.5, 20, 24]} />
          {/* @ts-ignore */}
          <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.5} />
        </mesh>
        
        {/* Elbow */}
        {/* @ts-ignore */}
        <mesh position={[0, -0.65, 0]}>
          {/* @ts-ignore */}
          <sphereGeometry args={[0.11, 20, 20]} />
          {/* @ts-ignore */}
          <meshStandardMaterial color="#f8f8f8" metalness={0.2} roughness={0.5} />
        </mesh>
        
        {/* Forearm */}
        {/* @ts-ignore */}
        <mesh position={[0, -0.95, 0]}>
          {/* @ts-ignore */}
          <capsuleGeometry args={[0.08, 0.4, 20, 24]} />
          {/* @ts-ignore */}
          <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.5} />
        </mesh>
        
        {/* Hand - rounded and cute */}
        {/* @ts-ignore */}
        <mesh position={[0, -1.25, 0]}>
          {/* @ts-ignore */}
          <sphereGeometry args={[0.13, 24, 24]} />
          {/* @ts-ignore */}
          <meshStandardMaterial color="#f8f8f8" metalness={0.2} roughness={0.5} />
        </mesh>
      </group>

      {/* ========== RIGHT ARM - Cute rounded arm ========== */}
      {/* @ts-ignore */}
      <group ref={rightArmRef} position={[0.55, 1.45, 0]} rotation={[0, 0, -0.2]}>
        {/* Shoulder joint */}
        {/* @ts-ignore */}
        <mesh position={[0, 0, 0]}>
          {/* @ts-ignore */}
          <sphereGeometry args={[0.16, 24, 24]} />
          {/* @ts-ignore */}
          <meshStandardMaterial color="#f8f8f8" metalness={0.2} roughness={0.5} />
        </mesh>
        
        {/* Upper arm */}
        {/* @ts-ignore */}
        <mesh position={[0, -0.35, 0]}>
          {/* @ts-ignore */}
          <capsuleGeometry args={[0.09, 0.5, 20, 24]} />
          {/* @ts-ignore */}
          <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.5} />
        </mesh>
        
        {/* Elbow */}
        {/* @ts-ignore */}
        <mesh position={[0, -0.65, 0]}>
          {/* @ts-ignore */}
          <sphereGeometry args={[0.11, 20, 20]} />
          {/* @ts-ignore */}
          <meshStandardMaterial color="#f8f8f8" metalness={0.2} roughness={0.5} />
        </mesh>
        
        {/* Forearm */}
        {/* @ts-ignore */}
        <mesh position={[0, -0.95, 0]}>
          {/* @ts-ignore */}
          <capsuleGeometry args={[0.08, 0.4, 20, 24]} />
          {/* @ts-ignore */}
          <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.5} />
        </mesh>
        
        {/* Hand - rounded and cute */}
        {/* @ts-ignore */}
        <mesh position={[0, -1.25, 0]}>
          {/* @ts-ignore */}
          <sphereGeometry args={[0.13, 24, 24]} />
          {/* @ts-ignore */}
          <meshStandardMaterial color="#f8f8f8" metalness={0.2} roughness={0.5} />
        </mesh>
      </group>

      {/* ========== WAIST - Cute connector ========== */}
      {/* @ts-ignore */}
      <mesh position={[0, 0.65, 0]}>
        {/* @ts-ignore */}
        <cylinderGeometry args={[0.28, 0.32, 0.22, 24]} />
        {/* @ts-ignore */}
        <meshStandardMaterial color="#f8f8f8" metalness={0.2} roughness={0.5} />
      </mesh>

      {/* ========== LEFT LEG - Cute rounded leg ========== */}
      {/* @ts-ignore */}
      <group position={[-0.2, 0.55, 0]}>
        {/* Thigh */}
        {/* @ts-ignore */}
        <mesh position={[0, -0.35, 0]}>
          {/* @ts-ignore */}
          <capsuleGeometry args={[0.1, 0.5, 20, 24]} />
          {/* @ts-ignore */}
          <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.5} />
        </mesh>
        
        {/* Knee */}
        {/* @ts-ignore */}
        <mesh position={[0, -0.65, 0]}>
          {/* @ts-ignore */}
          <sphereGeometry args={[0.12, 20, 20]} />
          {/* @ts-ignore */}
          <meshStandardMaterial color="#f8f8f8" metalness={0.2} roughness={0.5} />
        </mesh>
        
        {/* Shin */}
        {/* @ts-ignore */}
        <mesh position={[0, -0.95, 0]}>
          {/* @ts-ignore */}
          <capsuleGeometry args={[0.09, 0.4, 20, 24]} />
          {/* @ts-ignore */}
          <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.5} />
        </mesh>
        
        {/* Foot - rounded and cute */}
        {/* @ts-ignore */}
        <mesh position={[0, -1.25, 0.1]}>
          {/* @ts-ignore */}
          <boxGeometry args={[0.16, 0.12, 0.28]} />
          {/* @ts-ignore */}
          <meshStandardMaterial color="#f8f8f8" metalness={0.2} roughness={0.5} />
        </mesh>
      </group>

      {/* ========== RIGHT LEG - Cute rounded leg ========== */}
      {/* @ts-ignore */}
      <group position={[0.2, 0.55, 0]}>
        {/* Thigh */}
        {/* @ts-ignore */}
        <mesh position={[0, -0.35, 0]}>
          {/* @ts-ignore */}
          <capsuleGeometry args={[0.1, 0.5, 20, 24]} />
          {/* @ts-ignore */}
          <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.5} />
        </mesh>
        
        {/* Knee */}
        {/* @ts-ignore */}
        <mesh position={[0, -0.65, 0]}>
          {/* @ts-ignore */}
          <sphereGeometry args={[0.12, 20, 20]} />
          {/* @ts-ignore */}
          <meshStandardMaterial color="#f8f8f8" metalness={0.2} roughness={0.5} />
        </mesh>
        
        {/* Shin */}
        {/* @ts-ignore */}
        <mesh position={[0, -0.95, 0]}>
          {/* @ts-ignore */}
          <capsuleGeometry args={[0.09, 0.4, 20, 24]} />
          {/* @ts-ignore */}
          <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.5} />
        </mesh>
        
        {/* Foot - rounded and cute */}
        {/* @ts-ignore */}
        <mesh position={[0, -1.25, 0.1]}>
          {/* @ts-ignore */}
          <boxGeometry args={[0.16, 0.12, 0.28]} />
          {/* @ts-ignore */}
          <meshStandardMaterial color="#f8f8f8" metalness={0.2} roughness={0.5} />
        </mesh>
      </group>

      {/* Enhanced lighting for cute happy look */}
      {/* @ts-ignore */}
      <pointLight position={[0, 2.2, 1.5]} intensity={isSpeaking ? 2 : 1.5} color="#00d4ff" distance={3} />
      {/* @ts-ignore */}
      <pointLight position={[0, 1.15, 1.2]} intensity={isSpeaking ? 1.5 : 1} color="#00d4ff" distance={2.5} />
      {/* @ts-ignore */}
      <ambientLight intensity={0.6} />
    </group>
  );
}
