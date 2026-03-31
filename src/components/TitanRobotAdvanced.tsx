/**
 * TITAN WAR ROBOT - Professional Combat Mech with Confident Communication
 * 
 * Design: War Robots FRONTIERS body + Robot visor + Animated mouth + Professional gestures
 * Features:
 * - Heavy combat mech with massive armor plating
 * - Dark gray/black military color scheme with glowing accents
 * - VERY wide torso with layered armor
 * - MASSIVE shoulder armor extending far beyond body
 * - Thick, heavily armored limbs
 * - ROBOT FACE: Glowing visor sensor strip (not human eyes) + Animated mouth
 * - ARTICULATED HANDS: Professional, confident gestures with fingers
 * - Titan-like behavior: Powerful, commanding, professional communication
 * - Wide stance, battle-ready appearance
 * - AI-generated robotic voice synthesis
 * - Color-changing LED system synchronized with emotions
 * - Professional animations with confident presence
 */

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Plane } from '@react-three/drei';
import * as THREE from 'three';

interface TitanRobotProps {
  isListening?: boolean;
  emotion?: 'neutral' | 'happy' | 'angry' | 'thinking' | 'speaking';
  onReady?: () => void;
  text?: string; // Text to speak with robotic voice
}

interface RobotMeshProps {
  isListening: boolean;
  emotion: 'neutral' | 'happy' | 'angry' | 'thinking' | 'speaking';
  isSpeaking: boolean;
}

/**
 * Titan War Robot Mesh - Professional Combat Mech with Confident Communication
 */
function TitanWarRobotMesh({ isListening, emotion, isSpeaking }: RobotMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftHandRef = useRef<THREE.Group>(null);
  const rightHandRef = useRef<THREE.Group>(null);
  
  // Robot face component refs (visor and mouth only)
  const mouthRef = useRef<THREE.Mesh>(null);
  
  // Light references for LED system
  const ledLightsRef = useRef<THREE.PointLight[]>([]);
  
  const [time, setTime] = useState(0);

  // Emotion-based color mapping for LED accents
  const emotionColors = {
    neutral: new THREE.Color(0x4488ff), // Blue
    happy: new THREE.Color(0x00ffff),   // Cyan
    angry: new THREE.Color(0xff0000),   // Red
    thinking: new THREE.Color(0x8844ff), // Purple
    speaking: new THREE.Color(0x00ff88)  // Green-Cyan
  };

  const currentColor = emotionColors[emotion];

  // Military mech materials - Dark gray/black scheme
  const darkArmorMaterial = new THREE.MeshStandardMaterial({
    color: 0x2a2a2a, // Very dark gray (almost black)
    metalness: 0.9,
    roughness: 0.4,
    envMapIntensity: 1.2
  });

  const mediumArmorMaterial = new THREE.MeshStandardMaterial({
    color: 0x505050, // Medium dark gray
    metalness: 0.85,
    roughness: 0.35,
    envMapIntensity: 1.5
  });

  const lightArmorMaterial = new THREE.MeshStandardMaterial({
    color: 0x707070, // Light gray (for highlights)
    metalness: 0.9,
    roughness: 0.3,
    envMapIntensity: 1.8
  });

  const blackMetalMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a, // Deep black
    metalness: 0.95,
    roughness: 0.45,
    envMapIntensity: 1.0
  });

  const ledMaterial = new THREE.MeshStandardMaterial({
    color: currentColor,
    emissive: currentColor,
    emissiveIntensity: 2.5,
    metalness: 0.3,
    roughness: 0.2
  });

  // Robot mouth material
  const mouthMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    emissive: currentColor,
    emissiveIntensity: isSpeaking ? 2.8 : 1.0,
    metalness: 0.5,
    roughness: 0.3
  });

  // Titan-style animation loop with professional movements
  useFrame((state, delta) => {
    setTime(prev => prev + delta);

    if (!groupRef.current) return;

    // Powerful breathing animation - titan style
    const breathScale = 1 + Math.sin(time * 1.0) * 0.018;
    if (bodyRef.current) {
      bodyRef.current.scale.y = breathScale;
      bodyRef.current.scale.x = 1 + Math.sin(time * 1.0) * 0.008;
    }

    // Professional head movement - confident, commanding
    if (headRef.current) {
      if (isListening) {
        // Alert, scanning - professional assessment
        headRef.current.rotation.y = Math.sin(time * 1.5) * 0.16;
        headRef.current.rotation.x = Math.sin(time * 1.8) * 0.08;
        headRef.current.rotation.z = Math.sin(time * 1.2) * 0.05;
      } else if (isSpeaking) {
        // Speaking - confident, engaging
        headRef.current.rotation.y = Math.sin(time * 2.2) * 0.12;
        headRef.current.rotation.x = Math.sin(time * 2.5) * 0.06;
        headRef.current.rotation.z = Math.sin(time * 2.0) * 0.04;
      } else {
        // Idle - calm, confident presence
        headRef.current.rotation.y = Math.sin(time * 0.6) * 0.08;
        headRef.current.rotation.x = Math.sin(time * 0.4) * 0.04;
        headRef.current.rotation.z = Math.sin(time * 0.5) * 0.03;
      }
    }

    // Mouth animation - speaking with authority
    if (mouthRef.current) {
      if (isSpeaking) {
        // Animated mouth movement when speaking - confident speech
        const mouthOpen = Math.abs(Math.sin(time * 9)) * 0.20 + 0.08;
        mouthRef.current.scale.y = 0.40 + mouthOpen;
        mouthRef.current.scale.x = 1.4 - mouthOpen * 0.4;
      } else {
        // Neutral professional expression
        mouthRef.current.scale.y = 0.25;
        mouthRef.current.scale.x = 1.2;
        mouthRef.current.rotation.z = 0;
      }
    }

    // Professional arm movements - confident gestures
    if (leftArmRef.current && rightArmRef.current) {
      if (isSpeaking) {
        // Professional, confident gestures - titan authority
        leftArmRef.current.rotation.z = Math.sin(time * 2.0) * 0.30 + 0.35;
        leftArmRef.current.rotation.x = Math.sin(time * 1.8) * 0.20 + 0.15;
        leftArmRef.current.rotation.y = Math.sin(time * 1.5) * 0.12;
        
        rightArmRef.current.rotation.z = Math.sin(time * 2.0 + Math.PI * 0.5) * 0.30 - 0.35;
        rightArmRef.current.rotation.x = Math.sin(time * 1.8 + Math.PI * 0.5) * 0.20 + 0.15;
        rightArmRef.current.rotation.y = Math.sin(time * 1.5 + Math.PI * 0.5) * 0.12;
      } else if (isListening) {
        // Alert, professional ready pose
        leftArmRef.current.rotation.z = Math.sin(time * 1.0) * 0.10 + 0.25;
        leftArmRef.current.rotation.x = Math.sin(time * 0.8) * 0.10 + 0.08;
        leftArmRef.current.rotation.y = 0;
        
        rightArmRef.current.rotation.z = Math.sin(time * 1.0) * 0.10 - 0.25;
        rightArmRef.current.rotation.x = Math.sin(time * 0.8) * 0.10 + 0.08;
        rightArmRef.current.rotation.y = 0;
      } else {
        // Idle - confident, powerful stance
        leftArmRef.current.rotation.z = Math.sin(time * 0.6) * 0.08 + 0.18;
        leftArmRef.current.rotation.x = Math.sin(time * 0.5) * 0.06 + 0.05;
        leftArmRef.current.rotation.y = 0;
        
        rightArmRef.current.rotation.z = Math.sin(time * 0.6) * 0.08 - 0.18;
        rightArmRef.current.rotation.x = Math.sin(time * 0.5) * 0.06 + 0.05;
        rightArmRef.current.rotation.y = 0;
      }
    }

    // Professional humanoid hand gestures - natural, purposeful movements
    if (leftHandRef.current && rightHandRef.current) {
      if (isSpeaking) {
        // Natural speaking gestures - hands move in coordinated, expressive patterns
        const gesturePhase = Math.sin(time * 1.5) * 0.5 + 0.5; // 0 to 1 smooth wave
        
        // Left hand - expressive gesturing with natural wrist rotation
        leftHandRef.current.rotation.x = Math.sin(time * 1.5) * 0.3 - 0.1; // Natural forward/back
        leftHandRef.current.rotation.y = Math.sin(time * 1.2) * 0.25; // Side-to-side emphasis
        leftHandRef.current.rotation.z = Math.sin(time * 1.8) * 0.15; // Subtle wrist rotation
        leftHandRef.current.position.y = Math.sin(time * 1.5) * 0.15; // Gentle up/down
        leftHandRef.current.position.x = Math.sin(time * 1.2) * 0.08; // Slight lateral movement
        leftHandRef.current.position.z = Math.sin(time * 1.5) * 0.12 - 0.05; // Forward emphasis
        
        // Right hand - complementary gesturing (slightly offset for natural asymmetry)
        rightHandRef.current.rotation.x = Math.sin(time * 1.5 + Math.PI * 0.4) * 0.3 - 0.1;
        rightHandRef.current.rotation.y = Math.sin(time * 1.2 + Math.PI * 0.4) * 0.25;
        rightHandRef.current.rotation.z = Math.sin(time * 1.8 + Math.PI * 0.4) * 0.15;
        rightHandRef.current.position.y = Math.sin(time * 1.5 + Math.PI * 0.4) * 0.15;
        rightHandRef.current.position.x = Math.sin(time * 1.2 + Math.PI * 0.4) * 0.08;
        rightHandRef.current.position.z = Math.sin(time * 1.5 + Math.PI * 0.4) * 0.12 - 0.05;
        leftHandRef.current.rotation.z = Math.sin(time * 1.8) * 0.15;
        
        rightHandRef.current.rotation.x = Math.sin(time * 2.5 + Math.PI * 0.6) * 0.30 - 0.10;
        rightHandRef.current.rotation.y = Math.sin(time * 2.0 + Math.PI * 0.6) * 0.20;
        rightHandRef.current.rotation.z = Math.sin(time * 1.8 + Math.PI * 0.6) * 0.15;
      } else if (isListening) {
        // Attentive, ready hands - professional stance
        leftHandRef.current.rotation.x = Math.sin(time * 0.8) * 0.10 - 0.05;
        leftHandRef.current.rotation.y = Math.sin(time * 0.6) * 0.08;
        leftHandRef.current.rotation.z = 0;
        
        rightHandRef.current.rotation.x = Math.sin(time * 0.8) * 0.10 - 0.05;
        rightHandRef.current.rotation.y = Math.sin(time * 0.6) * 0.08;
        rightHandRef.current.rotation.z = 0;
      } else {
        // Relaxed but confident hands
        leftHandRef.current.rotation.x = Math.sin(time * 0.5) * 0.08;
        leftHandRef.current.rotation.y = Math.sin(time * 0.4) * 0.06;
        leftHandRef.current.rotation.z = 0;
        
        rightHandRef.current.rotation.x = Math.sin(time * 0.5) * 0.08;
        rightHandRef.current.rotation.y = Math.sin(time * 0.4) * 0.06;
        rightHandRef.current.rotation.z = 0;
      }
    }

    // Color-changing LED animation with professional pulsing
    ledLightsRef.current.forEach((light, index) => {
      if (light) {
        light.color.copy(currentColor);
        // Professional pulsing effect
        const pulsePhase = (time * 2.5 + index * 0.4) % (Math.PI * 2);
        light.intensity = 2.5 + Math.sin(pulsePhase) * 0.8;
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, -2.5, 0]} scale={1.5}>
      {/* ========== HEAD - Titan Robot with Visor and Mouth ========== */}
      <group ref={headRef} position={[0, 2.9, 0]}>
        {/* Main head block - compact and angular */}
        <mesh>
          <boxGeometry args={[0.6, 0.5, 0.55]} />
          <meshStandardMaterial {...darkArmorMaterial} />
        </mesh>

        {/* Front face plate - angular */}
        <mesh position={[0, 0, 0.3]}>
          <boxGeometry args={[0.55, 0.45, 0.12]} />
          <meshStandardMaterial {...mediumArmorMaterial} />
        </mesh>

        {/* ROBOT VISOR - Glowing sensor strip (not human eyes) */}
        <mesh position={[0, 0.10, 0.38]}>
          <boxGeometry args={[0.42, 0.12, 0.04]} />
          <meshStandardMaterial {...ledMaterial} />
        </mesh>
        {/* Visor glow - left */}
        <pointLight
          ref={(el: THREE.PointLight | null) => { if (el) ledLightsRef.current[0] = el; }}
          position={[-0.15, 0.10, 0.42]}
          color={currentColor}
          intensity={3.0}
          distance={1.2}
        />
        {/* Visor glow - right */}
        <pointLight
          ref={(el: THREE.PointLight | null) => { if (el) ledLightsRef.current[1] = el; }}
          position={[0.15, 0.10, 0.42]}
          color={currentColor}
          intensity={3.0}
          distance={1.2}
        />

        {/* MOUTH - Animated for speaking */}
        <mesh ref={mouthRef} position={[0, -0.10, 0.36]}>
          <boxGeometry args={[0.30, 0.08, 0.06]} />
          <meshStandardMaterial {...mouthMaterial} />
        </mesh>
        {/* Mouth glow when speaking */}
        <pointLight
          ref={(el: THREE.PointLight | null) => { if (el) ledLightsRef.current[2] = el; }}
          position={[0, -0.10, 0.42]}
          color={currentColor}
          intensity={isSpeaking ? 3.8 : 1.5}
          distance={1.0}
        />

        {/* Top head armor ridge */}
        <mesh position={[0, 0.28, 0]}>
          <boxGeometry args={[0.6, 0.12, 0.5]} />
          <meshStandardMaterial {...lightArmorMaterial} />
        </mesh>

        {/* Side armor plates - angular */}
        <mesh position={[-0.32, 0, 0.14]} rotation={[0, -0.25, 0]}>
          <boxGeometry args={[0.16, 0.45, 0.38]} />
          <meshStandardMaterial {...mediumArmorMaterial} />
        </mesh>
        <mesh position={[0.32, 0, 0.14]} rotation={[0, 0.25, 0]}>
          <boxGeometry args={[0.16, 0.45, 0.38]} />
          <meshStandardMaterial {...mediumArmorMaterial} />
        </mesh>

        {/* Lower face armor */}
        <mesh position={[0, -0.20, 0.28]}>
          <boxGeometry args={[0.5, 0.18, 0.1]} />
          <meshStandardMaterial {...blackMetalMaterial} />
        </mesh>

        {/* Back head armor */}
        <mesh position={[0, 0, -0.28]}>
          <boxGeometry args={[0.55, 0.45, 0.1]} />
          <meshStandardMaterial {...darkArmorMaterial} />
        </mesh>
      </group>

      {/* ========== NECK - Thick Armored Connection ========== */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.32, 0.38, 0.3, 8]} />
        <meshStandardMaterial {...blackMetalMaterial} />
      </mesh>

      {/* ========== BODY - VERY WIDE, HEAVILY ARMORED ========== */}
      <group ref={bodyRef} position={[0, 1.5, 0]}>
        {/* Main torso core - VERY WIDE */}
        <mesh>
          <boxGeometry args={[2.0, 1.5, 1.0]} />
          <meshStandardMaterial {...darkArmorMaterial} />
        </mesh>

        {/* Front chest armor - layered plates */}
        <mesh position={[0, 0.25, 0.52]}>
          <boxGeometry args={[1.6, 1.1, 0.15]} />
          <meshStandardMaterial {...mediumArmorMaterial} />
        </mesh>

        {/* Central chest armor plate */}
        <mesh position={[0, 0.25, 0.62]}>
          <boxGeometry args={[1.0, 0.8, 0.08]} />
          <meshStandardMaterial {...lightArmorMaterial} />
        </mesh>

        {/* Central LED core - glowing accent */}
        <mesh position={[0, 0.25, 0.7]}>
          <boxGeometry args={[0.5, 0.4, 0.03]} />
          <meshStandardMaterial {...ledMaterial} />
        </mesh>
        <pointLight
          ref={(el: THREE.PointLight | null) => { if (el) ledLightsRef.current[3] = el; }}
          position={[0, 0.25, 0.75]}
          color={currentColor}
          intensity={3.0}
          distance={2.5}
        />

        {/* Side chest armor panels with LEDs */}
        {[-0.7, 0.7].map((x, i) => (
          <group key={i} position={[x, 0.2, 0.45]}>
            <mesh>
              <boxGeometry args={[0.4, 0.9, 0.25]} />
              <meshStandardMaterial {...mediumArmorMaterial} />
            </mesh>
            {/* Side LED strips */}
            <mesh position={[0, 0, 0.14]}>
              <boxGeometry args={[0.3, 0.7, 0.03]} />
              <meshStandardMaterial {...ledMaterial} />
            </mesh>
            <pointLight
              ref={(el: THREE.PointLight | null) => { if (el) ledLightsRef.current[4 + i] = el; }}
              position={[0, 0, 0.18]}
              color={currentColor}
              intensity={2.0}
              distance={1.5}
            />
          </group>
        ))}

        {/* Lower chest/ab armor */}
        <mesh position={[0, -0.45, 0.5]}>
          <boxGeometry args={[1.7, 0.6, 0.18]} />
          <meshStandardMaterial {...mediumArmorMaterial} />
        </mesh>

        {/* Back armor plates */}
        <mesh position={[0, 0.25, -0.52]}>
          <boxGeometry args={[1.8, 1.3, 0.15]} />
          <meshStandardMaterial {...mediumArmorMaterial} />
        </mesh>

        {/* Waist armor ring */}
        <mesh position={[0, -0.85, 0]}>
          <cylinderGeometry args={[0.7, 0.75, 0.3, 8]} />
          <meshStandardMaterial {...darkArmorMaterial} />
        </mesh>
      </group>

      {/* ========== MASSIVE SHOULDER ARMOR - Extends Far Beyond Body ========== */}
      {/* Left shoulder */}
      <group position={[-1.2, 2.3, 0]}>
        {/* Main shoulder joint */}
        <mesh>
          <sphereGeometry args={[0.38, 16, 16]} />
          <meshStandardMaterial {...blackMetalMaterial} />
        </mesh>

        {/* MASSIVE shoulder armor plate - extends far beyond body */}
        <mesh position={[-0.45, 0.18, 0]} rotation={[0, 0, 0.35]}>
          <boxGeometry args={[0.85, 0.95, 0.6]} />
          <meshStandardMaterial {...mediumArmorMaterial} />
        </mesh>

        {/* Upper shoulder armor extension - layered */}
        <mesh position={[-0.65, 0.45, 0]} rotation={[0, 0, 0.45]}>
          <boxGeometry args={[0.6, 0.6, 0.5]} />
          <meshStandardMaterial {...lightArmorMaterial} />
        </mesh>

        {/* Front shoulder armor plate */}
        <mesh position={[-0.5, 0.25, 0.35]} rotation={[0.2, 0, 0.35]}>
          <boxGeometry args={[0.7, 0.8, 0.25]} />
          <meshStandardMaterial {...darkArmorMaterial} />
        </mesh>

        {/* Weapon mounting point */}
        <mesh position={[-0.75, 0.3, 0.2]}>
          <boxGeometry args={[0.25, 0.35, 0.25]} />
          <meshStandardMaterial {...blackMetalMaterial} />
        </mesh>

        {/* Shoulder LED accent */}
        <mesh position={[-0.5, 0.15, 0.32]}>
          <boxGeometry args={[0.5, 0.2, 0.03]} />
          <meshStandardMaterial {...ledMaterial} />
        </mesh>
        <pointLight
          ref={(el: THREE.PointLight | null) => { if (el) ledLightsRef.current[6] = el; }}
          position={[-0.5, 0.15, 0.36]}
          color={currentColor}
          intensity={1.8}
          distance={1.2}
        />
      </group>

      {/* Right shoulder */}
      <group position={[1.2, 2.3, 0]}>
        {/* Main shoulder joint */}
        <mesh>
          <sphereGeometry args={[0.38, 16, 16]} />
          <meshStandardMaterial {...blackMetalMaterial} />
        </mesh>

        {/* MASSIVE shoulder armor plate - extends far beyond body */}
        <mesh position={[0.45, 0.18, 0]} rotation={[0, 0, -0.35]}>
          <boxGeometry args={[0.85, 0.95, 0.6]} />
          <meshStandardMaterial {...mediumArmorMaterial} />
        </mesh>

        {/* Upper shoulder armor extension - layered */}
        <mesh position={[0.65, 0.45, 0]} rotation={[0, 0, -0.45]}>
          <boxGeometry args={[0.6, 0.6, 0.5]} />
          <meshStandardMaterial {...lightArmorMaterial} />
        </mesh>

        {/* Front shoulder armor plate */}
        <mesh position={[0.5, 0.25, 0.35]} rotation={[0.2, 0, -0.35]}>
          <boxGeometry args={[0.7, 0.8, 0.25]} />
          <meshStandardMaterial {...darkArmorMaterial} />
        </mesh>

        {/* Weapon mounting point */}
        <mesh position={[0.75, 0.3, 0.2]}>
          <boxGeometry args={[0.25, 0.35, 0.25]} />
          <meshStandardMaterial {...blackMetalMaterial} />
        </mesh>

        {/* Shoulder LED accent */}
        <mesh position={[0.5, 0.15, 0.32]}>
          <boxGeometry args={[0.5, 0.2, 0.03]} />
          <meshStandardMaterial {...ledMaterial} />
        </mesh>
        <pointLight
          ref={(el: THREE.PointLight | null) => { if (el) ledLightsRef.current[7] = el; }}
          position={[0.5, 0.15, 0.36]}
          color={currentColor}
          intensity={1.8}
          distance={1.2}
        />
      </group>

      {/* ========== LEFT ARM - THICK, HEAVILY ARMORED ========== */}
      <group ref={leftArmRef} position={[-1.25, 2.0, 0]}>
        {/* Upper arm - thick armor */}
        <mesh position={[0, -0.45, 0]}>
          <boxGeometry args={[0.4, 0.8, 0.4]} />
          <meshStandardMaterial {...darkArmorMaterial} />
        </mesh>

        {/* Upper arm outer armor plate */}
        <mesh position={[-0.22, -0.45, 0]}>
          <boxGeometry args={[0.15, 0.75, 0.35]} />
          <meshStandardMaterial {...mediumArmorMaterial} />
        </mesh>

        {/* Elbow joint - large */}
        <mesh position={[0, -0.9, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial {...blackMetalMaterial} />
        </mesh>

        {/* Forearm - thick */}
        <mesh position={[0, -1.3, 0]}>
          <boxGeometry args={[0.37, 0.75, 0.37]} />
          <meshStandardMaterial {...darkArmorMaterial} />
        </mesh>

        {/* Forearm armor plate */}
        <mesh position={[-0.2, -1.3, 0]}>
          <boxGeometry args={[0.12, 0.7, 0.32]} />
          <meshStandardMaterial {...mediumArmorMaterial} />
        </mesh>

        {/* Forearm LED strip */}
        <mesh position={[-0.27, -1.3, 0]}>
          <boxGeometry args={[0.03, 0.6, 0.15]} />
          <meshStandardMaterial {...ledMaterial} />
        </mesh>
        <pointLight
          ref={(el: THREE.PointLight | null) => { if (el) ledLightsRef.current[6] = el; }}
          position={[-0.32, -1.3, 0]}
          color={currentColor}
          intensity={1.8}
          distance={1.2}
        />

        {/* Wrist joint */}
        <mesh position={[0, -1.72, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial {...blackMetalMaterial} />
        </mesh>

        {/* ARTICULATED HAND - Titan-style with fingers */}
        <group ref={leftHandRef} position={[0, -2.0, 0]}>
          {/* Palm - armored */}
          <mesh>
            <boxGeometry args={[0.28, 0.35, 0.18]} />
            <meshStandardMaterial {...mediumArmorMaterial} />
          </mesh>

          {/* Thumb - powerful */}
          <group position={[0.16, -0.12, 0.12]} rotation={[0, 0, 0.4]}>
            {/* Thumb segment 1 */}
            <mesh position={[0, -0.12, 0]}>
              <boxGeometry args={[0.07, 0.22, 0.07]} />
              <meshStandardMaterial {...lightArmorMaterial} />
            </mesh>
            {/* Thumb segment 2 */}
            <mesh position={[0, -0.28, 0]}>
              <boxGeometry args={[0.06, 0.15, 0.06]} />
              <meshStandardMaterial {...darkArmorMaterial} />
            </mesh>
          </group>

          {/* Four fingers - articulated */}
          {[-0.10, -0.03, 0.04, 0.11].map((x, i) => (
            <group key={`left-finger-${i}`} position={[x, -0.22, 0]} rotation={[0, 0, 0]}>
              {/* Finger segment 1 */}
              <mesh position={[0, -0.12, 0]}>
                <boxGeometry args={[0.05, 0.22, 0.05]} />
                <meshStandardMaterial {...lightArmorMaterial} />
              </mesh>
              {/* Finger segment 2 */}
              <mesh position={[0, -0.28, 0]}>
                <boxGeometry args={[0.045, 0.15, 0.045]} />
                <meshStandardMaterial {...mediumArmorMaterial} />
              </mesh>
              {/* Finger segment 3 (tip) */}
              <mesh position={[0, -0.38, 0]}>
                <boxGeometry args={[0.04, 0.1, 0.04]} />
                <meshStandardMaterial {...darkArmorMaterial} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* ========== RIGHT ARM - THICK, HEAVILY ARMORED ========== */}
      <group ref={rightArmRef} position={[1.25, 2.0, 0]}>
        {/* Upper arm - thick armor */}
        <mesh position={[0, -0.45, 0]}>
          <boxGeometry args={[0.4, 0.8, 0.4]} />
          <meshStandardMaterial {...darkArmorMaterial} />
        </mesh>

        {/* Upper arm outer armor plate */}
        <mesh position={[0.22, -0.45, 0]}>
          <boxGeometry args={[0.15, 0.75, 0.35]} />
          <meshStandardMaterial {...mediumArmorMaterial} />
        </mesh>

        {/* Elbow joint - large */}
        <mesh position={[0, -0.9, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial {...blackMetalMaterial} />
        </mesh>

        {/* Forearm - thick */}
        <mesh position={[0, -1.3, 0]}>
          <boxGeometry args={[0.37, 0.75, 0.37]} />
          <meshStandardMaterial {...darkArmorMaterial} />
        </mesh>

        {/* Forearm armor plate */}
        <mesh position={[0.2, -1.3, 0]}>
          <boxGeometry args={[0.12, 0.7, 0.32]} />
          <meshStandardMaterial {...mediumArmorMaterial} />
        </mesh>

        {/* Forearm LED strip */}
        <mesh position={[0.27, -1.3, 0]}>
          <boxGeometry args={[0.03, 0.6, 0.15]} />
          <meshStandardMaterial {...ledMaterial} />
        </mesh>
        <pointLight
          ref={(el: THREE.PointLight | null) => { if (el) ledLightsRef.current[8] = el; }}
          position={[0.32, -1.3, 0]}
          color={currentColor}
          intensity={1.8}
          distance={1.2}
        />

        {/* Wrist joint */}
        <mesh position={[0, -1.72, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial {...blackMetalMaterial} />
        </mesh>

        {/* ARTICULATED HAND - Titan-style with fingers */}
        <group ref={rightHandRef} position={[0, -2.0, 0]}>
          {/* Palm - armored */}
          <mesh>
            <boxGeometry args={[0.28, 0.35, 0.18]} />
            <meshStandardMaterial {...mediumArmorMaterial} />
          </mesh>

          {/* Thumb - powerful */}
          <group position={[-0.16, -0.12, 0.12]} rotation={[0, 0, -0.4]}>
            {/* Thumb segment 1 */}
            <mesh position={[0, -0.12, 0]}>
              <boxGeometry args={[0.07, 0.22, 0.07]} />
              <meshStandardMaterial {...lightArmorMaterial} />
            </mesh>
            {/* Thumb segment 2 */}
            <mesh position={[0, -0.28, 0]}>
              <boxGeometry args={[0.06, 0.15, 0.06]} />
              <meshStandardMaterial {...darkArmorMaterial} />
            </mesh>
          </group>

          {/* Four fingers - articulated */}
          {[-0.11, -0.04, 0.03, 0.10].map((x, i) => (
            <group key={`right-finger-${i}`} position={[x, -0.22, 0]} rotation={[0, 0, 0]}>
              {/* Finger segment 1 */}
              <mesh position={[0, -0.12, 0]}>
                <boxGeometry args={[0.05, 0.22, 0.05]} />
                <meshStandardMaterial {...lightArmorMaterial} />
              </mesh>
              {/* Finger segment 2 */}
              <mesh position={[0, -0.28, 0]}>
                <boxGeometry args={[0.045, 0.15, 0.045]} />
                <meshStandardMaterial {...mediumArmorMaterial} />
              </mesh>
              {/* Finger segment 3 (tip) */}
              <mesh position={[0, -0.38, 0]}>
                <boxGeometry args={[0.04, 0.1, 0.04]} />
                <meshStandardMaterial {...darkArmorMaterial} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* ========== LEGS - VERY THICK, HEAVILY ARMORED ========== */}
      {/* Left leg */}
      <group position={[-0.5, 0.6, 0]}>
        {/* Hip joint - large */}
        <mesh>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial {...blackMetalMaterial} />
        </mesh>

        {/* Thigh - very thick */}
        <mesh position={[0, -0.55, 0]}>
          <boxGeometry args={[0.5, 1.0, 0.5]} />
          <meshStandardMaterial {...darkArmorMaterial} />
        </mesh>

        {/* Thigh outer armor plate */}
        <mesh position={[-0.28, -0.55, 0]}>
          <boxGeometry args={[0.18, 0.95, 0.45]} />
          <meshStandardMaterial {...mediumArmorMaterial} />
        </mesh>

        {/* Thigh front armor */}
        <mesh position={[0, -0.55, 0.28]}>
          <boxGeometry args={[0.45, 0.9, 0.15]} />
          <meshStandardMaterial {...lightArmorMaterial} />
        </mesh>

        {/* Knee joint - large, armored */}
        <mesh position={[0, -1.1, 0]}>
          <sphereGeometry args={[0.28, 16, 16]} />
          <meshStandardMaterial {...blackMetalMaterial} />
        </mesh>

        {/* Knee armor plate */}
        <mesh position={[0, -1.1, 0.25]}>
          <boxGeometry args={[0.4, 0.35, 0.18]} />
          <meshStandardMaterial {...mediumArmorMaterial} />
        </mesh>

        {/* Shin - very thick */}
        <mesh position={[0, -1.6, 0]}>
          <boxGeometry args={[0.48, 0.95, 0.48]} />
          <meshStandardMaterial {...darkArmorMaterial} />
        </mesh>

        {/* Shin outer armor plate */}
        <mesh position={[-0.26, -1.6, 0]}>
          <boxGeometry args={[0.16, 0.9, 0.43]} />
          <meshStandardMaterial {...mediumArmorMaterial} />
        </mesh>

        {/* Shin LED strip */}
        <mesh position={[-0.35, -1.6, 0]}>
          <boxGeometry args={[0.03, 0.8, 0.18]} />
          <meshStandardMaterial {...ledMaterial} />
        </mesh>
        <pointLight
          ref={(el: THREE.PointLight | null) => { if (el) ledLightsRef.current[9] = el; }}
          position={[-0.4, -1.6, 0]}
          color={currentColor}
          intensity={1.8}
          distance={1.2}
        />

        {/* Ankle joint */}
        <mesh position={[0, -2.12, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial {...blackMetalMaterial} />
        </mesh>

        {/* Heavy foot - wide, angular */}
        <mesh position={[0, -2.3, 0.18]}>
          <boxGeometry args={[0.4, 0.25, 0.6]} />
          <meshStandardMaterial {...mediumArmorMaterial} />
        </mesh>

        {/* Foot toe armor */}
        <mesh position={[0, -2.35, 0.5]}>
          <boxGeometry args={[0.38, 0.2, 0.2]} />
          <meshStandardMaterial {...lightArmorMaterial} />
        </mesh>
      </group>

      {/* Right leg */}
      <group position={[0.5, 0.6, 0]}>
        {/* Hip joint - large */}
        <mesh>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial {...blackMetalMaterial} />
        </mesh>

        {/* Thigh - very thick */}
        <mesh position={[0, -0.55, 0]}>
          <boxGeometry args={[0.5, 1.0, 0.5]} />
          <meshStandardMaterial {...darkArmorMaterial} />
        </mesh>

        {/* Thigh outer armor plate */}
        <mesh position={[0.28, -0.55, 0]}>
          <boxGeometry args={[0.18, 0.95, 0.45]} />
          <meshStandardMaterial {...mediumArmorMaterial} />
        </mesh>

        {/* Thigh front armor */}
        <mesh position={[0, -0.55, 0.28]}>
          <boxGeometry args={[0.45, 0.9, 0.15]} />
          <meshStandardMaterial {...lightArmorMaterial} />
        </mesh>

        {/* Knee joint - large, armored */}
        <mesh position={[0, -1.1, 0]}>
          <sphereGeometry args={[0.28, 16, 16]} />
          <meshStandardMaterial {...blackMetalMaterial} />
        </mesh>

        {/* Knee armor plate */}
        <mesh position={[0, -1.1, 0.25]}>
          <boxGeometry args={[0.4, 0.35, 0.18]} />
          <meshStandardMaterial {...mediumArmorMaterial} />
        </mesh>

        {/* Shin - very thick */}
        <mesh position={[0, -1.6, 0]}>
          <boxGeometry args={[0.48, 0.95, 0.48]} />
          <meshStandardMaterial {...darkArmorMaterial} />
        </mesh>

        {/* Shin outer armor plate */}
        <mesh position={[0.26, -1.6, 0]}>
          <boxGeometry args={[0.16, 0.9, 0.43]} />
          <meshStandardMaterial {...mediumArmorMaterial} />
        </mesh>

        {/* Shin LED strip */}
        <mesh position={[0.35, -1.6, 0]}>
          <boxGeometry args={[0.03, 0.8, 0.18]} />
          <meshStandardMaterial {...ledMaterial} />
        </mesh>
        <pointLight
          ref={(el: THREE.PointLight | null) => { if (el) ledLightsRef.current[10] = el; }}
          position={[0.4, -1.6, 0]}
          color={currentColor}
          intensity={1.8}
          distance={1.2}
        />

        {/* Ankle joint */}
        <mesh position={[0, -2.12, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial {...blackMetalMaterial} />
        </mesh>

        {/* Heavy foot - wide, angular */}
        <mesh position={[0, -2.3, 0.18]}>
          <boxGeometry args={[0.4, 0.25, 0.6]} />
          <meshStandardMaterial {...mediumArmorMaterial} />
        </mesh>

        {/* Foot toe armor */}
        <mesh position={[0, -2.35, 0.5]}>
          <boxGeometry args={[0.38, 0.2, 0.2]} />
          <meshStandardMaterial {...lightArmorMaterial} />
        </mesh>
      </group>

      {/* Ambient lighting for overall illumination */}
      <pointLight position={[0, 3, 2]} intensity={0.5} color="#ffffff" />
      <pointLight position={[0, 0, -2]} intensity={0.3} color="#ffffff" />
    </group>
  );
}

/**
 * Main Titan War Robot Component with Voice Support and Expressive Features
 */
export default function TitanRobotAdvanced({ isListening = false, emotion = 'neutral', onReady, text }: TitanRobotProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (onReady) {
      setTimeout(onReady, 100);
    }
  }, [onReady]);

  // AI-generated robotic voice synthesis
  useEffect(() => {
    if (text && emotion === 'speaking') {
      setIsSpeaking(true);
      
      // Use Web Speech API for robotic voice
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Configure robotic voice settings
        utterance.rate = 0.9; // Slightly slower for robotic effect
        utterance.pitch = 0.8; // Lower pitch for robotic sound
        utterance.volume = 1.0;
        
        // Try to find a robotic-sounding voice
        const voices = window.speechSynthesis.getVoices();
        const roboticVoice = voices.find(voice => 
          voice.name.includes('Google') || 
          voice.name.includes('Microsoft') ||
          voice.name.includes('Male')
        );
        if (roboticVoice) {
          utterance.voice = roboticVoice;
        }
        
        utterance.onend = () => {
          setIsSpeaking(false);
        };
        
        window.speechSynthesis.speak(utterance);
      }
      
      // Fallback: just animate for the duration
      const duration = text.length * 50; // Approximate speaking duration
      setTimeout(() => {
        setIsSpeaking(false);
      }, duration);
    }
  }, [text, emotion]);

  return (
    <div className="w-full h-full">
      <Canvas 
        shadows
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#000000', 0);
        }}
        fallback={
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-2">🤖</div>
              <p className="text-muted-foreground">Loading 3D Robot...</p>
            </div>
          </div>
        }
      >
        <PerspectiveCamera makeDefault position={[0, 1.5, 8]} fov={50} />
        
        {/* Military mech lighting - darker, more dramatic */}
        <ambientLight intensity={0.35} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.8} />
        <directionalLight position={[0, 5, -8]} intensity={0.6} />
        <spotLight
          position={[0, 10, 0]}
          angle={0.6}
          penumbra={1}
          intensity={1.0}
          castShadow
        />

        {/* Environment for industrial/military reflections */}
        <Environment preset="warehouse" />

        {/* Heavy Combat Mech */}
        <TitanWarRobotMesh isListening={isListening} emotion={emotion} isSpeaking={isSpeaking || emotion === 'speaking'} />

        {/* Ground plane - dark industrial floor */}
        <Plane
          args={[25, 25]}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -4.8, 0]}
          receiveShadow
        >
          <meshStandardMaterial 
            transparent 
            opacity={0.25} 
            color="#0a0a0a" 
            metalness={0.6}
            roughness={0.4}
          />
        </Plane>

        {/* Camera controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={5}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2}
          target={[0, 0.5, 0]}
        />
      </Canvas>
    </div>
  );
}
