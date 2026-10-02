/**
 * J.A.R.V.I.S  —  Iron Man Mark 44 Hulkbuster
 *
 * Features:
 *  ✓ Eyes ALWAYS flash blue — permanent pulse, brighter when speaking
 *  ✓ Mouth opens/closes when speaking (jaw animation)
 *  ✓ Both arms gesture when speaking, return to rest otherwise
 *  ✓ Head nods gently, face always forward
 *  ✓ Legs stay down, properly fitted
 *  ✓ Green body = thinking | Purple = speaking | Cyan = neutral
 *  ✓ FBX real model with position-based fallback bone detection
 *  ✓ Fallback procedural robot with all same features
 */

import {
  Suspense, useRef, useEffect, useState,
  Component, type ReactNode,
} from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useProgress } from '@react-three/drei';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import * as THREE from 'three';
import { speechEvents } from '@/utils/speechEvents';
import { useRobotAnimState, BEAM_HEX, type RobotAnimState } from '@/hooks/useRobotAnimState';
import type { HandGesture } from '@/utils/speechEvents';

/* ─── Types ──────────────────────────────────────────────────── */

export interface TitanRobotProps {
  isListening?: boolean;
  isSpeaking?:  boolean;
  /** 0–1 mouth openness from TTS / audio analyser; optional (auto from speechEvents) */
  speechIntensity?: number;
  emotion?: 'neutral' | 'happy' | 'angry' | 'thinking' | 'speaking';
  onReady?: () => void;
}
type Emotion = NonNullable<TitanRobotProps['emotion']>;

/* Body glow colours */
const BODY_CLR: Record<Emotion, number> = {
  neutral:  0x00c8ff,
  happy:    0x00ffcc,
  angry:    0xff2200,
  thinking: 0x00ff44,   // GREEN
  speaking: 0x8822ff,   // PURPLE
};

/* Eye / visor — ALWAYS BLUE, never changes */
const EYE_BLUE  = 0x44aaff;
const EYE_BLUE2 = 0x88ccff;   // inner fill

const lp = (a: number, b: number, t: number) => a + (b - a) * t;

type AS = 'idle' | 'listening' | 'speaking' | 'thinking' | 'angry' | 'happy';
const getAS = (e: Emotion, l: boolean, s: boolean): AS => {
  if (s || e === 'speaking') return 'speaking';
  if (l)                     return 'listening';
  if (e === 'thinking')      return 'thinking';
  if (e === 'angry')         return 'angry';
  if (e === 'happy')         return 'happy';
  return 'idle';
};

/* ─── HUD Loader ─────────────────────────────────────────────── */

function HUDLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{
        display:'flex', flexDirection:'column', alignItems:'center', gap:12,
        fontFamily:"'Orbitron',monospace", userSelect:'none',
      }}>
        <div style={{ position:'relative', width:64, height:64,
          display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ position:'absolute', inset:0, borderRadius:'50%',
            border:'1.5px solid rgba(255,255,255,0.85)' }} />
          <span style={{ color:'#fff', fontSize:9, fontWeight:700, letterSpacing:'0.22em' }}>JARVIS</span>
        </div>
        <div style={{ width:140, height:2, background:'rgba(0,200,255,0.15)',
          borderRadius:2, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${progress}%`,
            background:'linear-gradient(90deg,#00c8ff,#0050ff)', transition:'width 0.3s' }} />
        </div>
        <span style={{ color:'rgba(0,200,255,0.6)', fontSize:7,
          letterSpacing:'0.3em', textTransform:'uppercase' }}>
          {Math.round(progress)}%
        </span>
      </div>
    </Html>
  );
}

const TARGET_H = 3.35;
/** Extra framing margin so head + feet stay fully visible */
const FIT_PAD = 0.62;

/* ─── FBX Model ──────────────────────────────────────────────── */

function HulkbusterFBX({ emotion, isListening, isSpeaking, speechIntensity = 0, anim }:
  { emotion: Emotion; isListening: boolean; isSpeaking: boolean; speechIntensity?: number; anim: RobotAnimState }) {

  const fbx    = useLoader(FBXLoader, '/hulkbuster.fbx');
  const root   = useRef<THREE.Group>(new THREE.Group());
  const fbxRef = useRef<THREE.Group | null>(null);
  const fitted = useRef(false);
  const midY   = useRef(0);
  const tr     = useRef(0);
  const mouthOpen = useRef(0);
  const synthMouth = useRef<THREE.Mesh | null>(null);

  const headR  = useRef<THREE.Object3D | null>(null);
  const lArmR  = useRef<THREE.Object3D | null>(null);
  const rArmR  = useRef<THREE.Object3D | null>(null);
  const lForR  = useRef<THREE.Object3D | null>(null);
  const rForR  = useRef<THREE.Object3D | null>(null);
  const jawR   = useRef<THREE.Object3D | null>(null);  // mouth / jaw
  const lLegR  = useRef<THREE.Object3D | null>(null);
  const rLegR  = useRef<THREE.Object3D | null>(null);
  const lHandR = useRef<THREE.Object3D | null>(null);
  const rHandR = useRef<THREE.Object3D | null>(null);
  const beamL  = useRef<THREE.Mesh | null>(null);
  const beamR  = useRef<THREE.Mesh | null>(null);
  const walkPhase = useRef(0);

  const h0  = useRef(new THREE.Euler());
  const la0 = useRef(new THREE.Euler());
  const ra0 = useRef(new THREE.Euler());
  const j0  = useRef(new THREE.Euler());
  const lLeg0 = useRef(new THREE.Euler());
  const rLeg0 = useRef(new THREE.Euler());

  /* Eye light — ALWAYS ON blue, never dims to zero */
  const eyeL  = useRef(new THREE.PointLight(EYE_BLUE, 2.0, 2.5));
  /* Body accent light */
  const bodyL = useRef(new THREE.PointLight(0x00c8ff,  1.8, 9));

  const { camera, scene } = useThree();

  useEffect(() => {
    scene.add(root.current, eyeL.current, bodyL.current);
    return () => { scene.remove(root.current, eyeL.current, bodyL.current); };
  }, [scene]);

  useEffect(() => {
    if (!fbx || fitted.current) return;
    fitted.current = true;
    fbxRef.current = fbx;

    fbx.traverse(child => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = child.receiveShadow = true;
      const up = (m: THREE.Material): THREE.Material => {
        const ph = m as THREE.MeshPhongMaterial;
        const s  = new THREE.MeshStandardMaterial({
          map: ph.map ?? null, normalMap: ph.normalMap ?? null,
          color: ph.color ?? new THREE.Color(0xbbccdd),
          metalness: 0.80, roughness: 0.22, envMapIntensity: 2.5,
        });
        if (/eye|visor|glow|arc|reactor|emit|lens/i.test(child.name)) {
          s.emissive = new THREE.Color(EYE_BLUE2);
          s.emissiveIntensity = 2.5;
        }
        return s;
      };
      if (Array.isArray(child.material)) child.material = child.material.map(up);
      else child.material = up(child.material);
    });

    root.current.add(fbx);

    /* Auto-fit — full body on screen */
    const b0  = new THREE.Box3().setFromObject(fbx);
    const s0  = b0.getSize(new THREE.Vector3());
    const scl = TARGET_H / Math.max(s0.x, s0.y, s0.z, 0.001);
    root.current.scale.setScalar(scl);
    root.current.position.set(0, 0, 0);
    root.current.updateMatrixWorld(true);

    const bW = new THREE.Box3().setFromObject(root.current);
    const cW = bW.getCenter(new THREE.Vector3());
    root.current.position.set(-cW.x, -bW.min.y, -cW.z);
    root.current.updateMatrixWorld(true);

    const bF = new THREE.Box3().setFromObject(root.current);
    midY.current = (bF.min.y + bF.max.y) * 0.5;
    const modelH = bF.max.y - bF.min.y;

    const cam     = camera as THREE.PerspectiveCamera;
    const halfFov = THREE.MathUtils.degToRad(cam.fov / 2);
    const dist    = (modelH * FIT_PAD) / Math.tan(halfFov);
    cam.position.set(0, midY.current, dist);
    cam.lookAt(0, midY.current, 0);
    cam.near = 0.05; cam.far = dist * 10;
    cam.updateProjectionMatrix();

    /* Eye light at head top */
    eyeL.current.position.set(0, bF.max.y * 0.92, dist * 0.12);
    bodyL.current.position.set(0, midY.current, dist * 0.18);

    /* Bone extraction — Human* + Mixamo + loose names */
    const byName = (re: RegExp) => {
      let r: THREE.Object3D | null = null;
      fbx.traverse(n => { if (!r && re.test(n.name)) r = n; });
      return r;
    };

    headR.current = byName(/humanhead|^head$|mixamorig.*head$|helmet|skull/i);
    jawR.current  = byName(/^jaw$|humanjaw|mixamorig.*jaw|mandible|chin|mouth|yjaw|cjaw/i);
    lArmR.current = byName(/humanlupperarm|mixamorig.*leftarm$|left.*upper.*arm|l_arm\b|leftupperarm/i);
    rArmR.current = byName(/humanrupperarm|mixamorig.*rightarm$|right.*upper.*arm|r_arm\b|rightupperarm/i);
    lForR.current = byName(/humanlforearm|mixamorig.*leftforearm$|left.*fore|leftforearm/i);
    rForR.current = byName(/humanrforearm|mixamorig.*rightforearm$|right.*fore|rightforearm/i);
    lHandR.current = byName(/humanlhand|left.*hand|l_hand|lefthand/i);
    rHandR.current = byName(/humanrhand|right.*hand|r_hand|righthand|hands$/i);
    lLegR.current = byName(/humanlupleg|humanlthigh|left.*upleg|left.*thigh|l_leg|leftleg|bone007|bone009/i);
    rLegR.current = byName(/humanrupleg|humanrthigh|right.*upleg|right.*thigh|r_leg|rightleg|bone011|bone013/i);

    /* Position-based fallback for arms */
    if (!lArmR.current || !rArmR.current) {
      root.current.updateMatrixWorld(true);
      const wp = new THREE.Vector3();
      type C = { node: THREE.Object3D; wx: number; wy: number };
      const cands: C[] = [];
      fbx.traverse(n => {
        if (!(n instanceof THREE.Bone) && n.type !== 'Bone') return;
        n.getWorldPosition(wp);
        if (wp.y > midY.current * 0.55 && Math.abs(wp.x) > Math.max(0.15, bF.max.x * 0.12))
          cands.push({ node: n, wx: wp.x, wy: wp.y });
      });
      cands.sort((a, b) => a.wx - b.wx);
      if (!lArmR.current && cands.length > 0) lArmR.current = cands[0].node;
      if (!rArmR.current && cands.length > 1) rArmR.current = cands[cands.length - 1].node;
    }

    /* Synthetic mouth aperture under helmet if jaw bone missing / weak */
    if (headR.current && !synthMouth.current) {
      const mouth = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.06, 0.04),
        new THREE.MeshStandardMaterial({
          color: 0x05080c,
          emissive: new THREE.Color(0x1144aa),
          emissiveIntensity: 0.6,
          metalness: 0.2,
          roughness: 0.5,
        }),
      );
      mouth.position.set(0, -0.12, 0.22);
      mouth.scale.set(1, 0.15, 1);
      headR.current.add(mouth);
      synthMouth.current = mouth;
    }

    /* Eye beam cylinders (hidden until eye.beam / speech) */
    if (headR.current && !beamL.current) {
      const mkBeam = (x: number) => {
        const geo = new THREE.CylinderGeometry(0.012, 0.045, 2.4, 10);
        const mat = new THREE.MeshBasicMaterial({
          color: EYE_BLUE,
          transparent: true,
          opacity: 0,
          depthWrite: false,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.x = Math.PI / 2;
        mesh.position.set(x, 0.06, 1.25);
        headR.current!.add(mesh);
        return mesh;
      };
      beamL.current = mkBeam(-0.08);
      beamR.current = mkBeam(0.08);
    }

    const copyRotation = (target: THREE.Euler, source: { rotation: THREE.Euler } | null) => {
      if (source) target.copy(source.rotation);
    };
    copyRotation(h0.current, headR.current);
    copyRotation(la0.current, lArmR.current);
    copyRotation(ra0.current, rArmR.current);
    copyRotation(j0.current, jawR.current);
    copyRotation(lLeg0.current, lLegR.current);
    copyRotation(rLeg0.current, rLegR.current);

  }, [fbx, emotion, camera]);

  useFrame((_, dt) => {
    tr.current += dt;
    const t  = tr.current;
    const as = getAS(emotion, isListening, isSpeaking);

    /* Target mouth openness: TTS intensity + rhythmic flutter while speaking */
    const targetOpen = as === 'speaking'
      ? Math.min(1, Math.max(speechIntensity, 0.2) * 0.75
          + Math.abs(Math.sin(t * 11.0)) * 0.22
          + Math.abs(Math.sin(t * 18.0 + 0.6)) * 0.08)
      : 0;
    mouthOpen.current = lp(mouthOpen.current, targetOpen, 0.28);

    /* Breathing on fbx child — keeps root position frozen */
    if (fbxRef.current) {
      const bs = 1 + Math.sin(t * (as === 'speaking' ? 1.6 : 0.7)) * (as === 'speaking' ? 0.007 : 0.003);
      fbxRef.current.scale.setScalar(bs);
    }

    /* Root Y rotation only */
    root.current.rotation.y = lp(root.current.rotation.y,
      as === 'speaking' ? Math.sin(t * 0.65) * 0.035 : Math.sin(t * 0.20) * 0.018, 0.03);

    /* HEAD */
    if (headR.current) {
      const rx0 = h0.current.x, ry0 = h0.current.y;
      if (as === 'speaking') {
        headR.current.rotation.x = lp(headR.current.rotation.x, rx0 + Math.sin(t * 2.5) * 0.06, 0.08);
        headR.current.rotation.y = lp(headR.current.rotation.y, ry0 + Math.sin(t * 1.2) * 0.05, 0.06);
        headR.current.rotation.z = lp(headR.current.rotation.z, 0, 0.06);
      } else if (as === 'listening') {
        headR.current.rotation.x = lp(headR.current.rotation.x, rx0 + 0.03, 0.04);
        headR.current.rotation.y = lp(headR.current.rotation.y, ry0 + Math.sin(t * 0.9) * 0.04, 0.04);
        headR.current.rotation.z = lp(headR.current.rotation.z, 0, 0.04);
      } else {
        headR.current.rotation.x = lp(headR.current.rotation.x, rx0, 0.02);
        headR.current.rotation.y = lp(headR.current.rotation.y, ry0, 0.02);
        headR.current.rotation.z = lp(headR.current.rotation.z, 0, 0.02);
      }
    }

    /* JAW — mouth opens/closes synced to speech intensity */
    if (jawR.current) {
      const jawOpen = j0.current.x + mouthOpen.current * 0.42;
      jawR.current.rotation.x = lp(jawR.current.rotation.x, jawOpen, 0.28);
    }
    if (synthMouth.current) {
      const sy = 0.12 + mouthOpen.current * 1.6;
      synthMouth.current.scale.y = lp(synthMouth.current.scale.y, sy, 0.3);
      const mat = synthMouth.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.4 + mouthOpen.current * 2.2;
    }

    /* ARMS — gesture-driven hand movement */
    const g = anim.gesture as HandGesture;
    const applyGesture = (
      arm: THREE.Object3D | null,
      fore: THREE.Object3D | null,
      hand: THREE.Object3D | null,
      side: 1 | -1,
      bz: number,
      primary: boolean,
    ) => {
      if (!arm) return;
      const speakingMotion = as === 'speaking' && (g === 'idle' || g === 'explain');

      if (g === 'wave' && primary) {
        arm.rotation.z = lp(arm.rotation.z, bz + side * 0.85, 0.12);
        arm.rotation.x = lp(arm.rotation.x, -0.18 + Math.sin(t * 8.5) * 0.22, 0.16);
        arm.rotation.y = lp(arm.rotation.y, side * 0.14, 0.1);
        if (fore) fore.rotation.x = lp(fore.rotation.x, -0.25 + Math.sin(t * 8.5) * 0.28, 0.16);
        if (hand) hand.rotation.z = lp(hand.rotation.z, Math.sin(t * 9.5) * 0.32, 0.16);
      } else if (g === 'point' && primary) {
        arm.rotation.z = lp(arm.rotation.z, bz + side * 0.45, 0.12);
        arm.rotation.x = lp(arm.rotation.x, -0.8, 0.12);
        arm.rotation.y = lp(arm.rotation.y, side * 0.08, 0.1);
        if (fore) { fore.rotation.x = lp(fore.rotation.x, -0.12, 0.12); fore.rotation.y = lp(fore.rotation.y, 0, 0.1); }
        if (hand) hand.rotation.x = lp(hand.rotation.x, -0.16, 0.12);
      } else if (g === 'open_palm' && primary) {
        arm.rotation.z = lp(arm.rotation.z, bz + side * 0.55, 0.12);
        arm.rotation.x = lp(arm.rotation.x, -0.42, 0.12);
        if (fore) fore.rotation.x = lp(fore.rotation.x, -0.18, 0.12);
        if (hand) { hand.rotation.x = lp(hand.rotation.x, 0.12, 0.12); hand.rotation.z = lp(hand.rotation.z, 0, 0.1); }
      } else if (g === 'fist' && primary) {
        arm.rotation.z = lp(arm.rotation.z, bz + side * 0.32, 0.12);
        arm.rotation.x = lp(arm.rotation.x, -0.58, 0.12);
        if (fore) fore.rotation.x = lp(fore.rotation.x, -0.82, 0.14);
        if (hand) hand.rotation.x = lp(hand.rotation.x, 0.32, 0.12);
      } else if (g === 'thumbs_up' && primary) {
        arm.rotation.z = lp(arm.rotation.z, bz + side * 0.7, 0.12);
        arm.rotation.x = lp(arm.rotation.x, -0.28, 0.12);
        arm.rotation.y = lp(arm.rotation.y, side * -0.2, 0.12);
        if (fore) fore.rotation.x = lp(fore.rotation.x, -0.7, 0.12);
        if (hand) hand.rotation.z = lp(hand.rotation.z, side * 0.7, 0.14);
      } else if (speakingMotion) {
        const cycle = (t * 0.8 + (primary ? 0 : 1.15)) % (Math.PI * 2);
        const lift = Math.sin(cycle) * 0.12 + 0.2;
        const sway = Math.sin(t * 1.6 + (primary ? 0 : 1.2)) * 0.16;

        arm.rotation.z = lp(arm.rotation.z, bz + side * lift, 0.1);
        arm.rotation.x = lp(arm.rotation.x, -0.12 + sway, 0.1);
        arm.rotation.y = lp(arm.rotation.y, Math.sin(t * 1.0) * 0.12 * side, 0.08);

        if (fore) {
          fore.rotation.x = lp(fore.rotation.x, -0.2 + Math.sin(t * 2.4 + (primary ? 0 : 0.8)) * 0.18, 0.11);
          fore.rotation.y = lp(fore.rotation.y, side * Math.sin(t * 1.8 + (primary ? 0 : 0.9)) * 0.12, 0.1);
          fore.rotation.z = lp(fore.rotation.z, Math.sin(t * 1.5) * 0.08, 0.08);
        }
        if (hand) hand.rotation.z = lp(hand.rotation.z, Math.sin(t * 2.9) * 0.12 * side, 0.09);
      } else if (as === 'listening') {
        arm.rotation.z = lp(arm.rotation.z, 0, 0.05);
        arm.rotation.x = lp(arm.rotation.x, 0.02, 0.04);
        arm.rotation.y = lp(arm.rotation.y, 0, 0.04);
        if (fore) {
          fore.rotation.x = lp(fore.rotation.x, 0.02, 0.04);
          fore.rotation.y = lp(fore.rotation.y, 0, 0.04);
          fore.rotation.z = lp(fore.rotation.z, 0, 0.04);
        }
        if (hand) {
          hand.rotation.x = lp(hand.rotation.x, 0, 0.04);
          hand.rotation.y = lp(hand.rotation.y, 0, 0.04);
          hand.rotation.z = lp(hand.rotation.z, 0, 0.04);
        }
      } else {
        arm.rotation.z = lp(arm.rotation.z, 0, 0.04);
        arm.rotation.x = lp(arm.rotation.x, 0.02, 0.04);
        arm.rotation.y = lp(arm.rotation.y, 0, 0.04);
        if (fore) {
          fore.rotation.x = lp(fore.rotation.x, 0.02, 0.04);
          fore.rotation.y = lp(fore.rotation.y, 0, 0.04);
          fore.rotation.z = lp(fore.rotation.z, 0, 0.04);
        }
        if (hand) {
          hand.rotation.x = lp(hand.rotation.x, 0, 0.04);
          hand.rotation.y = lp(hand.rotation.y, 0, 0.04);
          hand.rotation.z = lp(hand.rotation.z, 0, 0.04);
        }
      }
    };

    applyGesture(rArmR.current, rForR.current, rHandR.current, -1, ra0.current.z, true);
    applyGesture(lArmR.current, lForR.current, lHandR.current, +1, la0.current.z, g === 'explain' || as === 'speaking');

    /* WALK — cinematic Rajinikanth-inspired stride with foot plant pause */
    if (anim.walking) {
      const walkSpeed = anim.walkDir === 'forward' || anim.walkDir === 'backward' ? 5.2 : 6.8;
      walkPhase.current += dt * walkSpeed;
      
      /* Foot plant pause - 0.1s delay before each step for dramatic effect */
      const stepPhase = (walkPhase.current % (Math.PI * 2));
      const inPause = stepPhase > Math.PI * 1.8 || stepPhase < Math.PI * 0.2;
      const pauseFactor = inPause ? Math.cos(stepPhase) * 0.4 : 0;
      const footPlantPause = inPause ? 0.85 : 1.0;
      
      /* Smooth leg swing with calibrated stride */
      const legSwing = (Math.sin(stepPhase) * 0.52 - pauseFactor * 0.2) * (anim.walkDir === 'backward' ? -1 : 1);
      const armSwing = (Math.sin(stepPhase + Math.PI) * 0.48 - pauseFactor * 0.15);
      
      /* Calibrated stride length for smooth walking */
      const strideLength = anim.walkDir === 'forward' ? 0.038 : (anim.walkDir === 'backward' ? -0.038 : 0);
      const lateralMove = anim.walkDir === 'left' ? Math.sin(stepPhase) * 0.025 : (anim.walkDir === 'right' ? -Math.sin(stepPhase) * 0.025 : 0);
      
      if (lLegR.current) lLegR.current.rotation.x = lp(lLegR.current.rotation.x, legSwing * footPlantPause, 0.12);
      if (rLegR.current) rLegR.current.rotation.x = lp(rLegR.current.rotation.x, -legSwing * footPlantPause, 0.12);
      
      /* Root movement with calibrated stride */
      if (anim.walkDir === 'forward') {
        root.current.position.z = lp(root.current.position.z, strideLength * Math.sin(stepPhase) * 10, 0.06);
      } else if (anim.walkDir === 'backward') {
        root.current.position.z = lp(root.current.position.z, -strideLength * Math.sin(stepPhase) * 10, 0.06);
      } else if (anim.walkDir === 'left' || anim.walkDir === 'right') {
        root.current.position.z = lp(root.current.position.z, 0, 0.04);
        root.current.position.x = lp(root.current.position.x, lateralMove * 6, 0.05);
      }
      
      /* Body bob - smooth vertical motion */
      const bodyBob = Math.abs(Math.sin(stepPhase * 2)) * 0.055;
      root.current.position.y = lp(root.current.position.y, bodyBob, 0.10);
      
      /* Rajinikanth-inspired head tilt & chest forward */
      if (anim.walkDir === 'forward') {
        root.current.rotation.x = lp(root.current.rotation.x, 0.22, 0.03); /* Chest forward 15-20° */
        root.current.rotation.y = lp(root.current.rotation.y, 
          Math.sin(stepPhase) * 0.015 + Math.sin(t * 0.5) * 0.02, 0.025);
      } else if (anim.walkDir === 'backward') {
        root.current.rotation.x = lp(root.current.rotation.x, -0.18, 0.03);
        root.current.rotation.y = lp(root.current.rotation.y, 
          Math.sin(stepPhase) * 0.012, 0.02);
      }
      
      /* Head tilt with charisma */
      if (headR.current) {
        const headTilt = Math.sin(stepPhase + Math.PI) * 0.025 + Math.sin(t * 0.8) * 0.012;
        headR.current.rotation.z = lp(headR.current.rotation.z, headTilt, 0.04);
        headR.current.rotation.x = lp(headR.current.rotation.x, 0.05, 0.03);
      }
      
      /* Synchronized arm swing opposite to legs */
      const armSideMultiplier = anim.walkDir === 'left' ? -1 : (anim.walkDir === 'right' ? 1 : 1);
      if (lArmR.current) {
        lArmR.current.rotation.x = lp(lArmR.current.rotation.x, armSwing * 0.8 + 0.15, 0.09);
        lArmR.current.rotation.y = lp(lArmR.current.rotation.y, 
          Math.sin(stepPhase + Math.PI) * 0.12 * armSideMultiplier, 0.07);
      }
      if (rArmR.current) {
        rArmR.current.rotation.x = lp(rArmR.current.rotation.x, -armSwing * 0.8 + 0.15, 0.09);
        rArmR.current.rotation.y = lp(rArmR.current.rotation.y, 
          Math.sin(stepPhase) * 0.12 * armSideMultiplier, 0.07);
      }
    } else {
      /* Return to idle with smooth interpolation */
      if (lLegR.current) lLegR.current.rotation.x = lp(lLegR.current.rotation.x, lLeg0.current.x, 0.06);
      if (rLegR.current) rLegR.current.rotation.x = lp(rLegR.current.rotation.x, rLeg0.current.x, 0.06);
      root.current.position.y = lp(root.current.position.y, 0, 0.06);
      root.current.position.z = lp(root.current.position.z, 0, 0.04);
      root.current.position.x = lp(root.current.position.x, 0, 0.04);
      root.current.rotation.x = lp(root.current.rotation.x, 0, 0.04);
      root.current.rotation.y = lp(root.current.rotation.y, 0, 0.03);
    }

    /* EYE BEAMS */
    const beamOn = anim.beamActive || as === 'speaking';
    const beamColor = BEAM_HEX[anim.beamColor] ?? EYE_BLUE;
    for (const beam of [beamL.current, beamR.current]) {
      if (!beam) continue;
      const mat = beam.material as THREE.MeshBasicMaterial;
      mat.color.setHex(beamColor);
      mat.opacity = lp(mat.opacity, beamOn ? 0.35 + anim.beamIntensity * 0.25 : 0, 0.12);
      beam.scale.y = lp(beam.scale.y, beamOn ? 1 + Math.sin(t * 14) * 0.08 : 0.2, 0.1);
    }

    /* ── EYE LIGHT — ALWAYS BLUE / beam color when active ── */
    eyeL.current.color.setHex(beamOn ? beamColor : EYE_BLUE);
    const eyeBase  = 2.0;
    const eyePulse = beamOn
      ? eyeBase + 3.5 + Math.sin(t * 11.0) * 2.2 * anim.beamIntensity
      : as === 'listening'
        ? eyeBase + 1.0 + Math.sin(t * 2.5) * 0.6
        : eyeBase + Math.sin(t * 1.4) * 0.8;
    eyeL.current.intensity = lp(eyeL.current.intensity, eyePulse, 0.08);

    /* BODY LIGHT */
    bodyL.current.color.setHex(BODY_CLR[emotion]);
    bodyL.current.intensity = lp(bodyL.current.intensity,
      as === 'speaking' ? 4.5 + Math.sin(t * 6.5) * 1.5
      : as === 'thinking' ? 3.5 + Math.sin(t * 1.2) * 0.8
      : as === 'angry'    ? 5.5 + Math.sin(t * 9.0) * 2.0
      : 1.8 + Math.sin(t * 1.8) * 0.4, 0.05);
  });

  return null;
}

/* ─── Procedural Fallback Robot ──────────────────────────────── */

function FallbackRobot({ emotion, isListening, isSpeaking, speechIntensity = 0, anim }:
  { emotion: Emotion; isListening: boolean; isSpeaking: boolean; speechIntensity?: number; anim: RobotAnimState }) {

  type FP = {
    head: THREE.Group; jaw: THREE.Mesh;
    lArm: THREE.Group; rArm: THREE.Group;
    lFore: THREE.Group; rFore: THREE.Group;
    lLeg: THREE.Group; rLeg: THREE.Group;
    glow: THREE.MeshStandardMaterial;
    visorMat: THREE.MeshStandardMaterial;
    eyeL: THREE.PointLight; bodyL: THREE.PointLight;
  };

  const root = useRef<THREE.Group>(new THREE.Group());
  const fp   = useRef<FP | null>(null);
  const tr   = useRef(0);
  const { scene, camera } = useThree();

  useEffect(() => {
    const g   = root.current;
    g.clear();

    const acc = new THREE.Color(BODY_CLR[emotion]);
    const MET = new THREE.MeshPhysicalMaterial({ color:0xb5c8d8, metalness:0.88, roughness:0.18, clearcoat:1, clearcoatRoughness:0.10, envMapIntensity:2.4 });
    const DRK = new THREE.MeshPhysicalMaterial({ color:0x141820, metalness:0.94, roughness:0.38, clearcoat:0.4, envMapIntensity:1.4 });
    const GLW = new THREE.MeshStandardMaterial({ color:acc, emissive:acc, emissiveIntensity:3.5 });
    /* Visor material — blue emissive, always bright */
    const VIS = new THREE.MeshStandardMaterial({
      color: new THREE.Color(EYE_BLUE),
      emissive: new THREE.Color(EYE_BLUE2),
      emissiveIntensity: 4.0,
      metalness: 0.05,
      roughness: 0.05,
    });

    const B = (p:THREE.Object3D,m:THREE.Material,w:number,h:number,d:number,x=0,y=0,z=0) => {
      const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);
      mesh.position.set(x,y,z); mesh.castShadow=true; p.add(mesh); return mesh;
    };
    const S = (p:THREE.Object3D,m:THREE.Material,r:number,x=0,y=0,z=0) => {
      const mesh=new THREE.Mesh(new THREE.SphereGeometry(r,18,18),m);
      mesh.position.set(x,y,z); mesh.castShadow=true; p.add(mesh); return mesh;
    };
    const C = (p:THREE.Object3D,m:THREE.Material,rt:number,rb:number,h:number,x=0,y=0,z=0) => {
      const mesh=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,12),m);
      mesh.position.set(x,y,z); mesh.castShadow=true; p.add(mesh); return mesh;
    };
    const T = (p:THREE.Object3D,m:THREE.Material,r:number,t2:number,x=0,y=0,z=0) => {
      const mesh=new THREE.Mesh(new THREE.TorusGeometry(r,t2,8,36),m);
      mesh.position.set(x,y,z); mesh.rotation.x=Math.PI/2; p.add(mesh); return mesh;
    };
    const PL = (p:THREE.Object3D,c:number,x:number,y:number,z:number,i=2) => {
      const l=new THREE.PointLight(c,i,3.5); l.position.set(x,y,z); p.add(l);
    };

    /* LEGS */
    const lLeg=new THREE.Group(); lLeg.position.set(-0.38,0.30,0);
    const rLeg=new THREE.Group(); rLeg.position.set( 0.38,0.30,0);
    [lLeg,rLeg].forEach((leg,li)=>{
      const s=li===0?-1:1;
      S(leg,DRK,0.20); B(leg,DRK,0.40,0.82,0.40,0,-0.46,0);
      B(leg,MET,0.12,0.76,0.32,s*0.22,-0.46,0.10);
      S(leg,DRK,0.19,0,-0.90,0); B(leg,MET,0.30,0.22,0.10,0,-0.90,0.23);
      B(leg,DRK,0.36,0.78,0.36,0,-1.30,0); B(leg,MET,0.30,0.72,0.08,0,-1.30,0.21);
      B(leg,GLW,0.024,0.60,0.018,0,-1.30,0.27); PL(leg,BODY_CLR[emotion],0,-1.30,0.36,1.1);
      S(leg,DRK,0.15,0,-1.72,0); B(leg,MET,0.34,0.20,0.52,0,-1.87,0.12);
      g.add(leg);
    });

    /* WAIST */
    C(g,DRK,0.50,0.55,0.18,0,0.30,0); T(g,GLW,0.58,0.016,0,0.30,0); PL(g,BODY_CLR[emotion],0,0.30,0.62,1.3);

    /* TORSO */
    const torso=new THREE.Group(); torso.position.set(0,0.88,0);
    B(torso,DRK,1.44,1.28,0.76); B(torso,MET,1.18,0.92,0.08,0,0.18,0.40);
    B(torso,GLW,0.025,0.48,0.018,-0.22,0.15,0.46); B(torso,GLW,0.025,0.48,0.018,0.22,0.15,0.46);
    T(torso,GLW,0.092,0.020,0,0.20,0.46);
    const arc=new THREE.Mesh(new THREE.CircleGeometry(0.065,20),GLW); arc.position.set(0,0.20,0.47); torso.add(arc);
    PL(torso,BODY_CLR[emotion],0,0.20,0.60,4.5);
    [-0.72,0.72].forEach((x,i)=>{
      const pn=new THREE.Group(); pn.position.set(x,0.12,0.17);
      B(pn,MET,0.19,0.96,0.52); B(pn,GLW,0.020,0.74,0.020,i===0?-0.09:0.09,0,0.28);
      torso.add(pn);
    });
    B(torso,MET,1.12,0.28,0.07,0,-0.54,0.38); B(torso,GLW,1.08,0.020,0.016,0,-0.46,0.44);
    g.add(torso);

    /* PAULDRONS */
    [-1,1].forEach(s=>{
      const p=new THREE.Group(); p.position.set(s*0.92,1.55,0.04);
      S(p,DRK,0.24);
      const m1=new THREE.Mesh(new THREE.BoxGeometry(0.58,0.64,0.48),MET); m1.position.set(s*0.27,0.14,0); m1.rotation.z=s*-0.34; m1.castShadow=true;
      const m2=new THREE.Mesh(new THREE.BoxGeometry(0.34,0.42,0.42),MET); m2.position.set(s*0.46,0.26,0); m2.rotation.z=s*-0.48; m2.castShadow=true;
      p.add(m1,m2); T(p,GLW,0.11,0.018,s*0.22,0.14,0.26); PL(p,BODY_CLR[emotion],s*0.22,0.14,0.36,1.6); g.add(p);
    });

    /* ARMS */
    const lArm=new THREE.Group(); lArm.position.set(-0.92,1.53,0);
    const rArm=new THREE.Group(); rArm.position.set( 0.92,1.53,0);
    const lFore=new THREE.Group(); lFore.position.set(0,-0.72,0);
    const rFore=new THREE.Group(); rFore.position.set(0,-0.72,0);
    [lArm,rArm].forEach((a,ai)=>{
      const s=ai===0?-1:1;
      B(a,DRK,0.30,0.60,0.30,0,-0.33,0); B(a,MET,0.10,0.55,0.24,s*0.16,-0.33,0.08); B(a,GLW,0.018,0.48,0.055,s*0.22,-0.33,0.06);
      S(a,DRK,0.17,0,-0.72,0);
      const fore=ai===0?lFore:rFore; fore.position.set(0,-0.72,0);
      B(fore,DRK,0.26,0.56,0.26,0,-0.30,0); B(fore,MET,0.08,0.50,0.18,s*0.14,-0.30,0.08); B(fore,GLW,0.018,0.44,0.048,s*0.19,-0.30,0.06);
      S(fore,DRK,0.13,0,-0.64,0); B(fore,MET,0.22,0.28,0.16,0,-0.82,0.04);
      const palm=new THREE.Mesh(new THREE.CircleGeometry(0.055,18),GLW); palm.position.set(0,-0.82,0.13); fore.add(palm);
      PL(fore,BODY_CLR[emotion],0,-0.82,0.20,2.0);
      [-0.078,-0.026,0.026,0.078].forEach(fx=>{
        const fg=new THREE.Group(); fg.position.set(fx,-0.96,0.04);
        B(fg,MET,0.038,0.12,0.038,0,-0.06,0); B(fg,DRK,0.032,0.08,0.032,0,-0.14,0); B(fg,MET,0.026,0.06,0.026,0,-0.20,0);
        fore.add(fg);
      });
      a.add(fore); g.add(a);
    });

    /* NECK */
    C(g,DRK,0.16,0.21,0.30,0,2.16,0);

    /* HEAD */
    const head=new THREE.Group(); head.position.set(0,2.32,0);
    B(head,DRK,0.64,0.62,0.62);
    S(head,MET,0.36,0,0.24,0);
    B(head,DRK,0.51,0.22,0.08,0,0.07,0.31);

    /* VISOR — thick glowing blue */
    const visorMesh=new THREE.Mesh(new THREE.BoxGeometry(0.52,0.21,0.05),VIS);
    visorMesh.position.set(0,0.09,0.36); head.add(visorMesh);

    /* Inner visor glow disc */
    const visorGlow=new THREE.Mesh(new THREE.PlaneGeometry(0.50,0.19),
      new THREE.MeshBasicMaterial({ color:EYE_BLUE, transparent:true, opacity:0.35, depthWrite:false }));
    visorGlow.position.set(0,0.09,0.395); head.add(visorGlow);

    /* JAW — separate group so it can rotate open */
    const jaw=new THREE.Mesh(new THREE.BoxGeometry(0.46,0.17,0.17),DRK);
    jaw.position.set(0,-0.23,0.24);
    head.add(jaw);

    /* Side vents */
    [-0.36,0.36].forEach(x=>B(head,DRK,0.06,0.22,0.15,x,-0.03,0.11));
    g.add(head);

    /* Eye + body lights */
    const eyeL =new THREE.PointLight(EYE_BLUE, 2.0, 2.5); eyeL.position.set(0,2.38,0.58);
    const bodyL=new THREE.PointLight(BODY_CLR[emotion], 1.8, 9); bodyL.position.set(0,1.25,1.5);
    g.add(eyeL,bodyL);

    fp.current = { head, jaw, lArm, rArm, lFore, rFore, lLeg, rLeg, glow:GLW, visorMat:VIS, eyeL, bodyL };
    scene.add(g);

    /* Fit full procedural robot in frame */
    g.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(g);
    const size = box.getSize(new THREE.Vector3());
    const mid = (box.min.y + box.max.y) * 0.5;
    const cam = camera as THREE.PerspectiveCamera;
    const halfFov = THREE.MathUtils.degToRad(cam.fov / 2);
    const dist = (Math.max(size.y, size.x) * FIT_PAD) / Math.tan(halfFov);
    cam.position.set(0, mid, dist);
    cam.lookAt(0, mid, 0);
    cam.near = 0.05; cam.far = dist * 10;
    cam.updateProjectionMatrix();

    return ()=>{ scene.remove(g); g.clear(); };
  }, [scene, camera, emotion]);

  useFrame((_,dt)=>{
    tr.current+=dt;
    const t  = tr.current;
    const g  = root.current;
    const p  = fp.current;
    if (!p) return;

    const as = getAS(emotion, isListening, isSpeaking);
    const mouthOpen = as==='speaking'
      ? Math.min(1, Math.max(speechIntensity, 0.2) * 0.75
          + Math.abs(Math.sin(t * 11.0)) * 0.22
          + Math.abs(Math.sin(t * 18.0 + 0.6)) * 0.08)
      : 0;

    /* Glow body pulse */
    p.glow.emissiveIntensity = (as==='speaking'?4.5:as==='thinking'?4.0:as==='angry'?5.5:3.0)
      + Math.sin(t*(as==='speaking'?7:as==='angry'?10:1.8))*0.6;

    /* Root sway */
    g.rotation.y=lp(g.rotation.y,
      as==='speaking'?Math.sin(t*0.6)*0.030:Math.sin(t*0.18)*0.015, 0.03);

    /* HEAD */
    if(as==='speaking'){
      p.head.rotation.x=lp(p.head.rotation.x,Math.sin(t*2.4)*0.055,0.08);
      p.head.rotation.y=lp(p.head.rotation.y,Math.sin(t*1.2)*0.045,0.06);
      p.head.rotation.z=lp(p.head.rotation.z,0,0.06);
    }else if(as==='listening'){
      p.head.rotation.x=lp(p.head.rotation.x,0.03,0.04);
      p.head.rotation.y=lp(p.head.rotation.y,Math.sin(t*0.8)*0.035,0.04);
      p.head.rotation.z=lp(p.head.rotation.z,0,0.04);
    }else{
      p.head.rotation.x=lp(p.head.rotation.x,0,0.02);
      p.head.rotation.y=lp(p.head.rotation.y,0,0.02);
      p.head.rotation.z=lp(p.head.rotation.z,0,0.02);
    }

    /* JAW — mouth opens/closes synced to speech */
    p.jaw.rotation.x = lp(p.jaw.rotation.x, mouthOpen * 0.42, 0.28);

    /* VISOR emissive — never zero */
    p.visorMat.emissiveIntensity = as==='speaking'
      ? 5.0 + Math.sin(t * 9.0) * 2.0
      : 3.5 + Math.sin(t * 1.4) * 0.8;

    /* ARMS */
    const aa=(arm:THREE.Group,fore:THREE.Group,side:1|-1,ph:number,primary=false)=>{
      const g = anim.gesture;
      if(g==='wave' && primary){
        arm.rotation.z=lp(arm.rotation.z,side*0.8,0.14);
        arm.rotation.x=lp(arm.rotation.x,-0.18+Math.sin(t*8.5)*0.2,0.16);
        fore.rotation.x=lp(fore.rotation.x,-0.26+Math.sin(t*8.5)*0.24,0.16);
      }else if(g==='point' && primary){
        arm.rotation.z=lp(arm.rotation.z,side*0.4,0.12);
        arm.rotation.x=lp(arm.rotation.x,-0.75,0.12);
        fore.rotation.x=lp(fore.rotation.x,-0.1,0.12);
      }else if(g==='thumbs_up' && primary){
        arm.rotation.z=lp(arm.rotation.z,side*0.65,0.12);
        arm.rotation.x=lp(arm.rotation.x,-0.28,0.12);
        fore.rotation.x=lp(fore.rotation.x,-0.7,0.12);
      }else if(g==='fist' && primary){
        arm.rotation.z=lp(arm.rotation.z,side*0.3,0.12);
        arm.rotation.x=lp(arm.rotation.x,-0.52,0.12);
        fore.rotation.x=lp(fore.rotation.x,-0.8,0.14);
      }else if(g==='open_palm' && primary){
        arm.rotation.z=lp(arm.rotation.z,side*0.5,0.12);
        arm.rotation.x=lp(arm.rotation.x,-0.4,0.12);
        fore.rotation.x=lp(fore.rotation.x,-0.15,0.12);
      }else if(as==='speaking' || g==='explain'){
        const cy=(t*0.8+ph)%(Math.PI*2);
        const lift=Math.sin(cy)*0.12+0.18;
        arm.rotation.z=lp(arm.rotation.z,side*lift,0.08);
        arm.rotation.x=lp(arm.rotation.x,-0.10+Math.sin(t*1.35+ph)*0.14,0.08);
        arm.rotation.y=lp(arm.rotation.y,Math.sin(t*1.0+ph)*0.08,0.06);
        fore.rotation.x=lp(fore.rotation.x,-0.18+Math.sin(t*2.3+ph)*0.14,0.10);
        fore.rotation.y=lp(fore.rotation.y,side*Math.sin(t*1.7+ph)*0.08,0.08);
        fore.rotation.z=lp(fore.rotation.z,Math.sin(t*1.6+ph)*0.06,0.07);
      }else if(as==='listening'){
        arm.rotation.z=lp(arm.rotation.z,0,0.04);
        arm.rotation.x=lp(arm.rotation.x,0.02,0.03);
        arm.rotation.y=lp(arm.rotation.y,0,0.03);
        fore.rotation.x=lp(fore.rotation.x,0.02,0.03); fore.rotation.y=lp(fore.rotation.y,0,0.03); fore.rotation.z=lp(fore.rotation.z,0,0.03);
      }else{
        arm.rotation.z=lp(arm.rotation.z,0,0.025); arm.rotation.x=lp(arm.rotation.x,0.02,0.025); arm.rotation.y=lp(arm.rotation.y,0,0.025);
        fore.rotation.x=lp(fore.rotation.x,0.02,0.025); fore.rotation.y=lp(fore.rotation.y,0,0.025); fore.rotation.z=lp(fore.rotation.z,0,0.025);
      }
    };
    aa(p.rArm,p.rFore,-1,Math.PI*0.4,true);
    aa(p.lArm,p.lFore,+1,0,as==='speaking');

    /* LEGS - return to idle (walk handled by HulkbusterFBX when FBX is available) */
    p.lLeg.rotation.x=lp(p.lLeg.rotation.x,0,0.05);
    p.rLeg.rotation.x=lp(p.rLeg.rotation.x,0,0.05);

    /* EYE LIGHT — ALWAYS BLUE, NEVER OFF */
    const beamOn = anim.beamActive || as==='speaking';
    p.eyeL.color.setHex(beamOn ? BEAM_HEX[anim.beamColor] : EYE_BLUE);
    p.eyeL.intensity=lp(p.eyeL.intensity,
      beamOn ? 5.5+Math.sin(t*9.0)*2.0*anim.beamIntensity
      : as==='listening' ? 2.8+Math.sin(t*2.5)*0.5
      : 2.0+Math.sin(t*1.4)*0.8,
      0.07);

    /* BODY LIGHT */
    p.bodyL.color.setHex(BODY_CLR[emotion]);
    p.bodyL.intensity=lp(p.bodyL.intensity,
      as==='speaking'?4.5+Math.sin(t*6)*1.5:
      as==='thinking'?3.5+Math.sin(t*1.2)*0.8:
      as==='angry'?5.5+Math.sin(t*9)*2:
      1.8+Math.sin(t*1.6)*0.3,0.05);
  });
  return null;
}

/* ─── Light rig ──────────────────────────────────────────────── */

function LightRig({ emotion }: { emotion: Emotion }) {
  const tr = useRef(0);
  const kp = useRef(new THREE.PointLight(0x00c8ff, 2.2, 9));
  const fp = useRef(new THREE.PointLight(0x4488ff, 0.9, 8));
  const spotlight = useRef(new THREE.SpotLight(0xffffff, 3.5, 25, 0.6, 0.5, 1));
  const { scene } = useThree();
  useEffect(()=>{
    const d1=new THREE.DirectionalLight(0xffffff,1.9); d1.position.set(-4,8,5); d1.castShadow=true; d1.shadow.mapSize.set(2048,2048); d1.shadow.camera.near=0.5; d1.shadow.camera.far=50; d1.shadow.camera.left=d1.shadow.camera.bottom=-8; d1.shadow.camera.right=d1.shadow.camera.top=8;
    const d2=new THREE.DirectionalLight(0xffffff,0.5); d2.position.set(5,4,-3);
    const d3=new THREE.DirectionalLight(0x6090ff,0.7); d3.position.set(0,6,-8);
    const d4=new THREE.DirectionalLight(0xffcc88,0.13); d4.position.set(0,-3,2);
    const ab=new THREE.AmbientLight(0xffffff,0.18);
    
    /* Cinematic spotlight tracking robot position */
    spotlight.current.position.set(0, 8, 3);
    spotlight.current.target.position.set(0, 1.5, 0);
    spotlight.current.castShadow = true;
    spotlight.current.shadow.mapSize.set(1024, 1024);
    
    kp.current.position.set(0,1.4,3); fp.current.position.set(-3,3,-2);
    const all=[d1,d2,d3,d4,ab,kp.current,fp.current,spotlight.current];
    all.forEach(l=>scene.add(l));
    return ()=>{all.forEach(l=>scene.remove(l));};
  },[scene]);
  useFrame((_,dt)=>{
    tr.current+=dt;
    kp.current.color.setHex(BODY_CLR[emotion]);
    kp.current.intensity=1.9+Math.sin(tr.current*2.0)*0.35;
    
    /* Spotlight pulsing for dramatic effect */
    spotlight.current.intensity = 3.5 + Math.sin(tr.current * 1.5) * 0.8;
    spotlight.current.color.setHex(emotion === 'speaking' ? 0xffccaa : 0xffffff);
  });
  return null;
}

/* ─── Shadow plane ───────────────────────────────────────────── */

function ShadowPlane() {
  const { scene } = useThree();
  useEffect(()=>{
    const m=new THREE.Mesh(new THREE.PlaneGeometry(14,14),new THREE.ShadowMaterial({opacity:0.38,color:0x000820}));
    m.rotation.x=-Math.PI/2; m.position.y=-0.04; m.receiveShadow=true;
    scene.add(m);
    return()=>{scene.remove(m);};
  },[scene]);
  return null;
}

/* ─── Error boundary ─────────────────────────────────────────── */

class RobotEB extends Component<{children:ReactNode;fallback:ReactNode},{err:boolean}>{
  state={err:false};
  static getDerivedStateFromError(){return{err:true};}
  render(){return this.state.err?this.props.fallback:this.props.children;}
}

/* ─── Export ─────────────────────────────────────────────────── */

export default function TitanRobotAdvanced({
  isListening=false, isSpeaking=false, speechIntensity: speechIntensityProp,
  emotion='neutral', onReady,
}:TitanRobotProps){
  const [liveIntensity, setLiveIntensity] = useState(0);
  const speaking = isSpeaking || emotion === 'speaking';
  const speechIntensity = speechIntensityProp ?? liveIntensity;
  const anim = useRobotAnimState(speaking);

  useEffect(()=>{ onReady?.(); }, [onReady]);

  useEffect(() => {
    const offIntensity = speechEvents.on('speech.intensity', (d) => {
      setLiveIntensity(typeof d.intensity === 'number' ? d.intensity : 0);
    });
    const offStart = speechEvents.on('speech.start', () => setLiveIntensity(0.45));
    const offStop = speechEvents.on('speech.stop', () => setLiveIntensity(0));
    return () => { offIntensity(); offStart(); offStop(); };
  }, []);

  useEffect(() => {
    if (!speaking) setLiveIntensity(0);
  }, [speaking]);

  return(
    <div style={{width:'100%',height:'100%',background:'transparent',overflow:'hidden'}}>
      <RobotEB fallback={
        <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',color:'#fbbf24',fontFamily:'Orbitron,monospace',fontSize:12,letterSpacing:'0.2em'}}>
          HULKBUSTER STANDBY
        </div>
      }>
      <Canvas
        shadows="soft"
        gl={{antialias:true,toneMapping:THREE.ACESFilmicToneMapping,toneMappingExposure:1.20,
          outputColorSpace:THREE.SRGBColorSpace,powerPreference:'high-performance'}}
        camera={{fov:40,near:0.05,far:200,position:[0,1.55,8.2]}}
        dpr={[1,typeof window!=='undefined'?Math.min(window.devicePixelRatio,2):2]}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <LightRig emotion={emotion}/>
        <RobotEB fallback={null}>
          <Environment preset="city"/>
        </RobotEB>
        <ShadowPlane/>
        <Suspense fallback={<HUDLoader/>}>
          <RobotEB fallback={
            <FallbackRobot emotion={emotion} isListening={isListening} isSpeaking={speaking} speechIntensity={speechIntensity} anim={anim}/>
          }>
            <HulkbusterFBX emotion={emotion} isListening={isListening} isSpeaking={speaking} speechIntensity={speechIntensity} anim={anim}/>
          </RobotEB>
        </Suspense>
        <OrbitControls
          makeDefault
          enablePan={false} enableZoom={true}
          minDistance={3.2} maxDistance={18}
          maxPolarAngle={Math.PI/1.65}
          minPolarAngle={Math.PI/6}
          target={[0,1.55,0]}
        />
      </Canvas>
      </RobotEB>
    </div>
  );
}
