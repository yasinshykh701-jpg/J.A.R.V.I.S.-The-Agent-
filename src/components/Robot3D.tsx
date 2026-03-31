import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Plane, Capsule, Sphere, Cylinder, Box } from '@react-three/drei';
import * as THREE from 'three';

interface RobotProps {
  isAnimating?: boolean;
  isSpeaking?: boolean;
  expression?: 'neutral' | 'happy' | 'thinking' | 'excited' | 'listening';
  gesture?: 'none' | 'wave' | 'point' | 'thumbsup' | 'explain';
}

function RobotModel({ isAnimating, isSpeaking, expression = 'neutral', gesture = 'none' }: RobotProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftHandRef = useRef<THREE.Group>(null);
  const rightHandRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const foreheadLightRef = useRef<THREE.Mesh>(null);
  const leftCheekLightRef = useRef<THREE.Mesh>(null);
  const rightCheekLightRef = useRef<THREE.Mesh>(null);
  const [time, setTime] = useState(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    setTime(prev => prev + delta);

    // Idle breathing animation
    const breathingOffset = Math.sin(time * 1.5) * 0.03;
    groupRef.current.position.y = -1 + breathingOffset;

    // Head movement
    if (headRef.current) {
      if (isSpeaking) {
        headRef.current.rotation.y = Math.sin(time * 6) * 0.1;
        headRef.current.rotation.x = Math.sin(time * 4) * 0.05;
      } else {
        headRef.current.rotation.y = Math.sin(time * 0.5) * 0.05;
        headRef.current.rotation.x = Math.sin(time * 0.3) * 0.03;
      }
    }

    // Enhanced Eye animations with expressions
    if (leftEyeRef.current && rightEyeRef.current) {
      const leftEyeMaterial = leftEyeRef.current.material as THREE.MeshStandardMaterial;
      const rightEyeMaterial = rightEyeRef.current.material as THREE.MeshStandardMaterial;
      
      // Expression-based eye behavior
      switch (expression) {
        case 'happy':
          leftEyeMaterial.emissiveIntensity = 6 + Math.sin(time * 3) * 1;
          rightEyeMaterial.emissiveIntensity = 6 + Math.sin(time * 3) * 1;
          leftEyeMaterial.color.setHex(0x00ff88); // Green-cyan for happy
          rightEyeMaterial.color.setHex(0x00ff88);
          leftEyeMaterial.emissive.setHex(0x00ff88);
          rightEyeMaterial.emissive.setHex(0x00ff88);
          // Squint eyes for smile
          leftEyeRef.current.scale.set(1, 0.7, 1);
          rightEyeRef.current.scale.set(1, 0.7, 1);
          break;
        case 'thinking':
          leftEyeMaterial.emissiveIntensity = 3 + Math.sin(time * 2) * 0.5;
          rightEyeMaterial.emissiveIntensity = 3 + Math.sin(time * 2) * 0.5;
          leftEyeMaterial.color.setHex(0xffaa00); // Orange for thinking
          rightEyeMaterial.color.setHex(0xffaa00);
          leftEyeMaterial.emissive.setHex(0xffaa00);
          rightEyeMaterial.emissive.setHex(0xffaa00);
          leftEyeRef.current.scale.set(0.8, 1, 1);
          rightEyeRef.current.scale.set(0.8, 1, 1);
          break;
        case 'excited':
          leftEyeMaterial.emissiveIntensity = 8 + Math.sin(time * 8) * 2;
          rightEyeMaterial.emissiveIntensity = 8 + Math.sin(time * 8) * 2;
          leftEyeMaterial.color.setHex(0xff00ff); // Magenta for excited
          rightEyeMaterial.color.setHex(0xff00ff);
          leftEyeMaterial.emissive.setHex(0xff00ff);
          rightEyeMaterial.emissive.setHex(0xff00ff);
          leftEyeRef.current.scale.set(1.2, 1.2, 1);
          rightEyeRef.current.scale.set(1.2, 1.2, 1);
          break;
        case 'listening':
          leftEyeMaterial.emissiveIntensity = 5 + Math.sin(time * 4) * 1;
          rightEyeMaterial.emissiveIntensity = 5 + Math.sin(time * 4) * 1;
          leftEyeMaterial.color.setHex(0x00ddff); // Cyan for listening
          rightEyeMaterial.color.setHex(0x00ddff);
          leftEyeMaterial.emissive.setHex(0x00ddff);
          rightEyeMaterial.emissive.setHex(0x00ddff);
          leftEyeRef.current.scale.set(1.1, 1.1, 1);
          rightEyeRef.current.scale.set(1.1, 1.1, 1);
          break;
        default: // neutral
          leftEyeMaterial.emissiveIntensity = 4 + Math.sin(time * 2) * 0.5;
          rightEyeMaterial.emissiveIntensity = 4 + Math.sin(time * 2) * 0.5;
          leftEyeMaterial.color.setHex(0x0099ff); // Blue for neutral
          rightEyeMaterial.color.setHex(0x0099ff);
          leftEyeMaterial.emissive.setHex(0x0099ff);
          rightEyeMaterial.emissive.setHex(0x0099ff);
          leftEyeRef.current.scale.set(1, 1, 1);
          rightEyeRef.current.scale.set(1, 1, 1);
      }
      
      // Blinking animation
      if (Math.sin(time * 3) > 0.95) {
        leftEyeRef.current.scale.y = 0.1;
        rightEyeRef.current.scale.y = 0.1;
      }
    }

    // Enhanced Mouth animation with expressions
    if (mouthRef.current) {
      const mouthMaterial = mouthRef.current.material as THREE.MeshStandardMaterial;
      
      if (isSpeaking) {
        const scaleY = 1 + Math.sin(time * 15) * 1.5;
        const scaleX = 1 + Math.cos(time * 10) * 0.2;
        mouthRef.current.scale.set(scaleX, scaleY, 1);
        mouthMaterial.emissiveIntensity = 3 + Math.sin(time * 20) * 2;
      } else {
        // Expression-based mouth shape
        switch (expression) {
          case 'happy':
            mouthRef.current.scale.set(1.3, 0.8, 1); // Wide smile
            mouthMaterial.emissiveIntensity = 2;
            break;
          case 'thinking':
            mouthRef.current.scale.set(0.7, 0.7, 1); // Small mouth
            mouthMaterial.emissiveIntensity = 1;
            break;
          case 'excited':
            mouthRef.current.scale.set(1.2, 1.2, 1); // Open mouth
            mouthMaterial.emissiveIntensity = 3;
            break;
          default:
            mouthRef.current.scale.set(1, 1, 1);
            mouthMaterial.emissiveIntensity = 1.5;
        }
      }
    }

    // Facial expression lights (forehead, cheeks)
    if (foreheadLightRef.current && leftCheekLightRef.current && rightCheekLightRef.current) {
      const foreheadMaterial = foreheadLightRef.current.material as THREE.MeshStandardMaterial;
      const leftCheekMaterial = leftCheekLightRef.current.material as THREE.MeshStandardMaterial;
      const rightCheekMaterial = rightCheekLightRef.current.material as THREE.MeshStandardMaterial;
      
      switch (expression) {
        case 'happy':
          foreheadMaterial.emissiveIntensity = 2;
          leftCheekMaterial.emissiveIntensity = 4 + Math.sin(time * 4) * 1;
          rightCheekMaterial.emissiveIntensity = 4 + Math.sin(time * 4) * 1;
          foreheadMaterial.color.setHex(0x00ff88);
          leftCheekMaterial.color.setHex(0x00ff88);
          rightCheekMaterial.color.setHex(0x00ff88);
          break;
        case 'thinking':
          foreheadMaterial.emissiveIntensity = 5 + Math.sin(time * 3) * 1.5;
          leftCheekMaterial.emissiveIntensity = 1;
          rightCheekMaterial.emissiveIntensity = 1;
          foreheadMaterial.color.setHex(0xffaa00);
          break;
        case 'excited':
          foreheadMaterial.emissiveIntensity = 6 + Math.sin(time * 10) * 2;
          leftCheekMaterial.emissiveIntensity = 6 + Math.sin(time * 10) * 2;
          rightCheekMaterial.emissiveIntensity = 6 + Math.sin(time * 10) * 2;
          foreheadMaterial.color.setHex(0xff00ff);
          leftCheekMaterial.color.setHex(0xff00ff);
          rightCheekMaterial.color.setHex(0xff00ff);
          break;
        default:
          foreheadMaterial.emissiveIntensity = 2 + Math.sin(time * 2) * 0.5;
          leftCheekMaterial.emissiveIntensity = 2 + Math.sin(time * 2) * 0.5;
          rightCheekMaterial.emissiveIntensity = 2 + Math.sin(time * 2) * 0.5;
          foreheadMaterial.color.setHex(0x0099ff);
          leftCheekMaterial.color.setHex(0x0099ff);
          rightCheekMaterial.color.setHex(0x0099ff);
      }
    }

    // Hand gesture animations
    if (leftHandRef.current && rightHandRef.current) {
      switch (gesture) {
        case 'wave':
          // Wave gesture - right hand
          rightArmRef.current!.rotation.x = -Math.PI / 3;
          rightArmRef.current!.rotation.z = Math.PI / 6;
          rightHandRef.current.rotation.z = Math.sin(time * 8) * 0.5;
          break;
        case 'point':
          // Point gesture - right hand
          rightArmRef.current!.rotation.x = -Math.PI / 4;
          rightArmRef.current!.rotation.z = Math.PI / 8;
          rightHandRef.current.rotation.x = -Math.PI / 6;
          break;
        case 'thumbsup':
          // Thumbs up - right hand
          rightArmRef.current!.rotation.x = -Math.PI / 3;
          rightArmRef.current!.rotation.z = Math.PI / 4;
          rightHandRef.current.rotation.y = Math.PI / 2;
          break;
        case 'explain':
          // Explaining gesture - both hands
          leftArmRef.current!.rotation.x = -Math.PI / 4 + Math.sin(time * 3) * 0.2;
          leftArmRef.current!.rotation.z = -Math.PI / 6;
          rightArmRef.current!.rotation.x = -Math.PI / 4 + Math.sin(time * 3 + Math.PI) * 0.2;
          rightArmRef.current!.rotation.z = Math.PI / 6;
          break;
        default:
          // Idle arm movement
          if (!isAnimating) {
            leftArmRef.current!.rotation.x = Math.sin(time * 1.5) * 0.05;
            leftArmRef.current!.rotation.z = 0;
            rightArmRef.current!.rotation.x = Math.sin(time * 1.5 + 0.2) * 0.05;
            rightArmRef.current!.rotation.z = 0;
          }
      }
    }

    // Arm movements for listening/speaking
    if (leftArmRef.current && gesture === 'none') {
      if (isAnimating) {
        leftArmRef.current.rotation.x = -Math.PI / 4 + Math.sin(time * 5) * 0.2;
      } else {
        leftArmRef.current.rotation.x = Math.sin(time * 1.5) * 0.05;
      }
    }
    
    if (rightArmRef.current && gesture === 'none') {
      if (isAnimating) {
        rightArmRef.current.rotation.x = -Math.PI / 4 + Math.sin(time * 5 + 0.5) * 0.2;
      } else {
        rightArmRef.current.rotation.x = Math.sin(time * 1.5 + 0.2) * 0.05;
      }
    }

    // Torso chest light pulsing
    if (groupRef.current && groupRef.current.children[2]) {
      const torsoGroup = groupRef.current.children[2] as THREE.Group;
      const chestLight = torsoGroup.children[1] as THREE.Mesh;
      if (chestLight && chestLight.material) {
        const chestMaterial = chestLight.material as THREE.MeshStandardMaterial;
        if (isAnimating || isSpeaking) {
          chestMaterial.emissiveIntensity = 2 + Math.sin(time * 10) * 1.5;
        } else {
          chestMaterial.emissiveIntensity = 1 + Math.sin(time * 2) * 0.5;
        }
      }
    }
  });

  // Dubai Titan Robot materials - 100% matching reference images
  const chromeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#d8d8e0", // Bright chrome silver like Dubai Titan Robot
    metalness: 0.95,
    roughness: 0.08,
    envMapIntensity: 2.5,
  }), []);

  const darkVisorMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#1a1a22", // Very dark for large visor face
    metalness: 0.9,
    roughness: 0.15,
  }), []);

  const darkMetalMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#3a3a42", // Dark gray for joints and details
    metalness: 0.85,
    roughness: 0.25,
  }), []);

  const blueGlowMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#0099ff", // Blue accent lights
    emissive: "#0099ff",
    emissiveIntensity: 4,
    toneMapped: false,
  }), []);

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Head - Enhanced face with prominent eyes and details */}
      <group ref={headRef} position={[0, 1.75, 0]}>
        {/* Main Helmet Shell - Rounded like Dubai Titan */}
        <Sphere args={[0.38, 32, 32]} material={chromeMaterial} />
        
        {/* Large Dark Visor Face - More defined and prominent */}
        <Sphere position={[0, 0.02, 0.34]} args={[0.36, 32, 32]} material={darkVisorMaterial} scale={[1, 0.9, 0.35]} />
        
        {/* Face Frame - Adds definition to face area */}
        <Sphere position={[0, 0.02, 0.36]} args={[0.38, 32, 32]} material={chromeMaterial} scale={[0.95, 0.85, 0.1]} />
        
        {/* LEFT EYE - Large and prominent with details */}
        <group position={[-0.13, 0.08, 0.38]}>
          {/* Eye socket/frame */}
          <Sphere args={[0.065, 24, 24]} material={darkMetalMaterial} />
          
          {/* Main eye glow - color-changing */}
          <Sphere 
            ref={leftEyeRef}
            args={[0.055, 24, 24]} 
            material={blueGlowMaterial}
            position={[0, 0, 0.01]}
          />
          
          {/* Eye highlight/pupil */}
          <Sphere 
            args={[0.025, 16, 16]} 
            material={new THREE.MeshStandardMaterial({
              color: "#ffffff",
              emissive: "#ffffff",
              emissiveIntensity: 8,
              toneMapped: false,
            })}
            position={[0.01, 0.01, 0.02]}
          />
          
          {/* Eye outer glow ring */}
          <Sphere 
            args={[0.07, 24, 24]} 
            material={new THREE.MeshStandardMaterial({
              color: "#0099ff",
              emissive: "#0099ff",
              emissiveIntensity: 2,
              transparent: true,
              opacity: 0.3,
              toneMapped: false,
            })}
          />
        </group>
        
        {/* RIGHT EYE - Large and prominent with details */}
        <group position={[0.13, 0.08, 0.38]}>
          {/* Eye socket/frame */}
          <Sphere args={[0.065, 24, 24]} material={darkMetalMaterial} />
          
          {/* Main eye glow - color-changing */}
          <Sphere 
            ref={rightEyeRef}
            args={[0.055, 24, 24]} 
            material={blueGlowMaterial}
            position={[0, 0, 0.01]}
          />
          
          {/* Eye highlight/pupil */}
          <Sphere 
            args={[0.025, 16, 16]} 
            material={new THREE.MeshStandardMaterial({
              color: "#ffffff",
              emissive: "#ffffff",
              emissiveIntensity: 8,
              toneMapped: false,
            })}
            position={[-0.01, 0.01, 0.02]}
          />
          
          {/* Eye outer glow ring */}
          <Sphere 
            args={[0.07, 24, 24]} 
            material={new THREE.MeshStandardMaterial({
              color: "#0099ff",
              emissive: "#0099ff",
              emissiveIntensity: 2,
              transparent: true,
              opacity: 0.3,
              toneMapped: false,
            })}
          />
        </group>
        
        {/* Eyebrow-like elements for expression */}
        <Sphere position={[-0.13, 0.16, 0.37]} args={[0.04, 16, 16]} material={chromeMaterial} scale={[2, 0.4, 0.5]} />
        <Sphere position={[0.13, 0.16, 0.37]} args={[0.04, 16, 16]} material={chromeMaterial} scale={[2, 0.4, 0.5]} />
        
        {/* Forehead Light - Large and prominent */}
        <Sphere 
          ref={foreheadLightRef}
          position={[0, 0.2, 0.36]} 
          args={[0.035, 20, 20]} 
          material={new THREE.MeshStandardMaterial({
            color: "#0099ff",
            emissive: "#0099ff",
            emissiveIntensity: 3,
            toneMapped: false,
          })} 
        />
        
        {/* Forehead light glow ring */}
        <Sphere 
          position={[0, 0.2, 0.36]} 
          args={[0.045, 20, 20]} 
          material={new THREE.MeshStandardMaterial({
            color: "#0099ff",
            emissive: "#0099ff",
            emissiveIntensity: 1.5,
            transparent: true,
            opacity: 0.2,
            toneMapped: false,
          })} 
        />
        
        {/* Left Cheek Light - Prominent */}
        <Sphere 
          ref={leftCheekLightRef}
          position={[-0.24, -0.03, 0.34]} 
          args={[0.03, 20, 20]} 
          material={new THREE.MeshStandardMaterial({
            color: "#0099ff",
            emissive: "#0099ff",
            emissiveIntensity: 3,
            toneMapped: false,
          })} 
        />
        
        {/* Right Cheek Light - Prominent */}
        <Sphere 
          ref={rightCheekLightRef}
          position={[0.24, -0.03, 0.34]} 
          args={[0.03, 20, 20]} 
          material={new THREE.MeshStandardMaterial({
            color: "#0099ff",
            emissive: "#0099ff",
            emissiveIntensity: 3,
            toneMapped: false,
          })} 
        />
        
        {/* Nose bridge detail */}
        <Sphere position={[0, 0.05, 0.39]} args={[0.025, 16, 16]} material={chromeMaterial} scale={[0.6, 1.2, 0.8]} />
        
        {/* MOUTH AREA - Enhanced and more visible */}
        <group position={[0, -0.12, 0.36]}>
          {/* Mouth frame */}
          <Sphere args={[0.18, 20, 20]} material={darkMetalMaterial} scale={[1.6, 0.7, 0.4]} />
          
          {/* Mouth glow - animated */}
          <Plane 
            ref={mouthRef} 
            position={[0, 0, 0.02]} 
            args={[0.24, 0.06]} 
            material={blueGlowMaterial} 
          />
          
          {/* Mouth detail lines */}
          <Plane 
            position={[-0.08, 0, 0.025]} 
            args={[0.06, 0.02]} 
            material={new THREE.MeshStandardMaterial({
              color: "#0099ff",
              emissive: "#0099ff",
              emissiveIntensity: 2,
              toneMapped: false,
            })} 
          />
          <Plane 
            position={[0.08, 0, 0.025]} 
            args={[0.06, 0.02]} 
            material={new THREE.MeshStandardMaterial({
              color: "#0099ff",
              emissive: "#0099ff",
              emissiveIntensity: 2,
              toneMapped: false,
            })} 
          />
        </group>
        
        {/* Chin detail */}
        <Sphere position={[0, -0.22, 0.35]} args={[0.08, 16, 16]} material={chromeMaterial} scale={[1.2, 0.6, 0.7]} />
        
        {/* Helmet Side Curves - Enhanced */}
        <Sphere position={[-0.32, 0.02, 0]} args={[0.16, 24, 24]} material={chromeMaterial} scale={[0.6, 1, 1]} />
        <Sphere position={[0.32, 0.02, 0]} args={[0.16, 24, 24]} material={chromeMaterial} scale={[0.6, 1, 1]} />
        
        {/* Side face lights */}
        <Sphere position={[-0.3, 0.08, 0.25]} args={[0.02, 16, 16]} material={new THREE.MeshStandardMaterial({
          color: "#0099ff",
          emissive: "#0099ff",
          emissiveIntensity: 2,
          toneMapped: false,
        })} />
        <Sphere position={[0.3, 0.08, 0.25]} args={[0.02, 16, 16]} material={new THREE.MeshStandardMaterial({
          color: "#0099ff",
          emissive: "#0099ff",
          emissiveIntensity: 2,
          toneMapped: false,
        })} />
        
        {/* Back of Helmet - Rounded */}
        <Sphere position={[0, 0.02, -0.32]} args={[0.3, 24, 24]} material={chromeMaterial} scale={[1, 0.9, 0.5]} />
      </group>

      {/* Neck - Thick rounded connection like Dubai Titan */}
      <Cylinder position={[0, 1.42, 0]} args={[0.18, 0.22, 0.28, 24]} material={darkMetalMaterial} />
      <Sphere position={[0, 1.42, 0]} args={[0.2, 20, 20]} material={chromeMaterial} scale={[1, 0.7, 1]} />

      {/* Torso - Bulky rounded chest like Dubai Titan Robot */}
      <group position={[0, 0.75, 0]}>
        {/* Main Chest - Large rounded bulky design */}
        <Sphere args={[0.5, 32, 32]} material={chromeMaterial} scale={[1.3, 1.5, 1]} />
        
        {/* Chest Center Detail - Blue glow */}
        <Sphere position={[0, 0.15, 0.48]} args={[0.12, 24, 24]} material={blueGlowMaterial} />
        
        {/* Upper Chest Curves */}
        <Sphere position={[0, 0.45, 0.35]} args={[0.35, 24, 24]} material={chromeMaterial} scale={[1.5, 0.5, 0.8]} />
        
        {/* Lower Torso - Rounded */}
        <Sphere position={[0, -0.5, 0]} args={[0.42, 24, 24]} material={darkMetalMaterial} scale={[1.2, 0.8, 1]} />
        
        {/* Side Chest Curves */}
        <Sphere position={[-0.45, 0.1, 0.2]} args={[0.25, 20, 20]} material={chromeMaterial} scale={[0.7, 1.2, 0.9]} />
        <Sphere position={[0.45, 0.1, 0.2]} args={[0.25, 20, 20]} material={chromeMaterial} scale={[0.7, 1.2, 0.9]} />
      </group>

      {/* Shoulder Armor - Large rounded pads like Dubai Titan */}
      <group position={[-0.7, 1.15, 0]}>
        <Sphere args={[0.22, 28, 28]} material={chromeMaterial} />
        <Sphere position={[0, 0.15, 0]} args={[0.28, 24, 24]} material={chromeMaterial} scale={[1, 0.6, 1]} />
        <Sphere position={[-0.15, 0.05, 0]} args={[0.25, 24, 24]} material={chromeMaterial} scale={[0.8, 1, 1]} />
      </group>
      
      <group position={[0.7, 1.15, 0]}>
        <Sphere args={[0.22, 28, 28]} material={chromeMaterial} />
        <Sphere position={[0, 0.15, 0]} args={[0.28, 24, 24]} material={chromeMaterial} scale={[1, 0.6, 1]} />
        <Sphere position={[0.15, 0.05, 0]} args={[0.25, 24, 24]} material={chromeMaterial} scale={[0.8, 1, 1]} />
      </group>

      {/* Left Arm - Thick rounded design with hand gestures */}
      <group ref={leftArmRef} position={[-0.7, 1.15, 0]}>
        {/* Upper Arm - Thick rounded */}
        <Capsule position={[0, -0.35, 0]} args={[0.13, 0.5, 20, 24]} material={chromeMaterial} />
        <Sphere position={[0, -0.35, 0]} args={[0.15, 20, 20]} material={chromeMaterial} scale={[0.9, 1.5, 0.9]} />
        
        {/* Elbow Joint - Large rounded */}
        <Sphere position={[0, -0.65, 0]} args={[0.14, 24, 24]} material={darkMetalMaterial} />
        
        {/* Forearm - Thick rounded */}
        <Capsule position={[0, -1.05, 0]} args={[0.12, 0.6, 20, 24]} material={chromeMaterial} />
        <Sphere position={[0, -1.05, 0]} args={[0.14, 20, 20]} material={chromeMaterial} scale={[0.85, 1.8, 0.85]} />
        
        {/* Hand - Rounded with gesture capability */}
        <group ref={leftHandRef} position={[0, -1.42, 0]}>
          <Sphere args={[0.13, 20, 20]} material={darkMetalMaterial} scale={[1, 1.2, 0.8]} />
          {/* Finger indicators */}
          <Sphere position={[0, -0.15, 0.08]} args={[0.03, 12, 12]} material={chromeMaterial} />
          <Sphere position={[-0.05, -0.15, 0.06]} args={[0.03, 12, 12]} material={chromeMaterial} />
          <Sphere position={[0.05, -0.15, 0.06]} args={[0.03, 12, 12]} material={chromeMaterial} />
        </group>
      </group>

      {/* Right Arm - Thick rounded design with hand gestures */}
      <group ref={rightArmRef} position={[0.7, 1.15, 0]}>
        {/* Upper Arm - Thick rounded */}
        <Capsule position={[0, -0.35, 0]} args={[0.13, 0.5, 20, 24]} material={chromeMaterial} />
        <Sphere position={[0, -0.35, 0]} args={[0.15, 20, 20]} material={chromeMaterial} scale={[0.9, 1.5, 0.9]} />
        
        {/* Elbow Joint - Large rounded */}
        <Sphere position={[0, -0.65, 0]} args={[0.14, 24, 24]} material={darkMetalMaterial} />
        
        {/* Forearm - Thick rounded */}
        <Capsule position={[0, -1.05, 0]} args={[0.12, 0.6, 20, 24]} material={chromeMaterial} />
        <Sphere position={[0, -1.05, 0]} args={[0.14, 20, 20]} material={chromeMaterial} scale={[0.85, 1.8, 0.85]} />
        
        {/* Hand - Rounded with gesture capability */}
        <group ref={rightHandRef} position={[0, -1.42, 0]}>
          <Sphere args={[0.13, 20, 20]} material={darkMetalMaterial} scale={[1, 1.2, 0.8]} />
          {/* Finger indicators */}
          <Sphere position={[0, -0.15, 0.08]} args={[0.03, 12, 12]} material={chromeMaterial} />
          <Sphere position={[-0.05, -0.15, 0.06]} args={[0.03, 12, 12]} material={chromeMaterial} />
          <Sphere position={[0.05, -0.15, 0.06]} args={[0.03, 12, 12]} material={chromeMaterial} />
        </group>
      </group>

      {/* Pelvis - Rounded connection like Dubai Titan */}
      <Sphere position={[0, 0.08, 0]} args={[0.38, 24, 24]} material={chromeMaterial} scale={[1.3, 0.7, 1]} />
      <Sphere position={[0, 0.08, 0.2]} args={[0.32, 20, 20]} material={darkMetalMaterial} scale={[1.2, 0.6, 0.6]} />

      {/* Left Leg - Thick rounded design like Dubai Titan */}
      <group position={[-0.22, -0.1, 0]}>
        {/* Hip Joint - Large rounded */}
        <Sphere position={[0, 0, 0]} args={[0.15, 24, 24]} material={darkMetalMaterial} />
        
        {/* Upper Leg - Thick rounded */}
        <Capsule position={[0, -0.5, 0]} args={[0.16, 0.8, 20, 28]} material={chromeMaterial} />
        <Sphere position={[0, -0.5, 0]} args={[0.18, 24, 24]} material={chromeMaterial} scale={[0.9, 1.8, 0.9]} />
        
        {/* Knee Joint - Large rounded */}
        <Sphere position={[0, -0.95, 0]} args={[0.16, 24, 24]} material={darkMetalMaterial} />
        
        {/* Lower Leg - Thick rounded */}
        <Capsule position={[0, -1.4, 0]} args={[0.15, 0.7, 20, 28]} material={chromeMaterial} />
        <Sphere position={[0, -1.4, 0]} args={[0.17, 24, 24]} material={chromeMaterial} scale={[0.85, 1.6, 0.85]} />
        
        {/* Foot - Large rounded */}
        <Sphere position={[0, -1.82, 0.12]} args={[0.18, 24, 24]} material={darkMetalMaterial} scale={[1.2, 0.7, 2]} />
      </group>

      {/* Right Leg - Thick rounded design like Dubai Titan */}
      <group position={[0.22, -0.1, 0]}>
        {/* Hip Joint - Large rounded */}
        <Sphere position={[0, 0, 0]} args={[0.15, 24, 24]} material={darkMetalMaterial} />
        
        {/* Upper Leg - Thick rounded */}
        <Capsule position={[0, -0.5, 0]} args={[0.16, 0.8, 20, 28]} material={chromeMaterial} />
        <Sphere position={[0, -0.5, 0]} args={[0.18, 24, 24]} material={chromeMaterial} scale={[0.9, 1.8, 0.9]} />
        
        {/* Knee Joint - Large rounded */}
        <Sphere position={[0, -0.95, 0]} args={[0.16, 24, 24]} material={darkMetalMaterial} />
        
        {/* Lower Leg - Thick rounded */}
        <Capsule position={[0, -1.4, 0]} args={[0.15, 0.7, 20, 28]} material={chromeMaterial} />
        <Sphere position={[0, -1.4, 0]} args={[0.17, 24, 24]} material={chromeMaterial} scale={[0.85, 1.6, 0.85]} />
        
        {/* Foot - Large rounded */}
        <Sphere position={[0, -1.82, 0.12]} args={[0.18, 24, 24]} material={darkMetalMaterial} scale={[1.2, 0.7, 2]} />
      </group>
    </group>
  );
}

interface Robot3DProps {
  isListening?: boolean;
  isSpeaking?: boolean;
  audioLevel?: number;
  className?: string;
}

export default function Robot3D({ isListening = false, isSpeaking = false, audioLevel = 0, className = '' }: Robot3DProps) {
  return (
    <div className={`w-full h-full ${className}`} style={{ minHeight: '300px' }}>
      <Canvas shadows gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 1.5, 4.5]} fov={50} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.6}
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={2}
          castShadow
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <directionalLight position={[0, 5, 5]} intensity={1} castShadow />

        {/* Environment for Realistic Reflections */}
        <Environment preset="studio" />
        
        {/* Robot */}
        <RobotModel isAnimating={isListening} isSpeaking={isSpeaking} />
        
        {/* Ground with Shadow */}
        <ContactShadows 
          position={[0, -2.6, 0]} 
          opacity={0.4} 
          scale={10} 
          blur={2} 
          far={4.5} 
        />
      </Canvas>
    </div>
  );
}
