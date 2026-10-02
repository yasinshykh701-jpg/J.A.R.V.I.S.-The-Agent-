/**
 * Shared Hulkbuster runtime animation state (gesture / walk / eye beam)
 */

import { useEffect, useState } from 'react';
import {
  speechEvents,
  type EyeBeamColor,
  type HandGesture,
  type WalkDirection,
} from '@/utils/speechEvents';

export type RobotAnimState = {
  gesture: HandGesture;
  walking: boolean;
  walkDir: WalkDirection;
  beamActive: boolean;
  beamColor: EyeBeamColor;
  beamIntensity: number;
};

const DEFAULT: RobotAnimState = {
  gesture: 'idle',
  walking: false,
  walkDir: 'stop',
  beamActive: false,
  beamColor: 'blue',
  beamIntensity: 1,
};

export function useRobotAnimState(isSpeaking: boolean): RobotAnimState {
  const [state, setState] = useState<RobotAnimState>(DEFAULT);

  useEffect(() => {
    const timers: number[] = [];

    const offGesture = speechEvents.on('gesture.trigger', (d) => {
      setState((s) => ({ ...s, gesture: d.gesture || 'explain' }));
    });
    const offWave = speechEvents.on('hand.wave', () => setState((s) => ({ ...s, gesture: 'wave' })));
    const offPoint = speechEvents.on('hand.point', () => setState((s) => ({ ...s, gesture: 'point' })));
    const offPalm = speechEvents.on('hand.open_palm', () => setState((s) => ({ ...s, gesture: 'open_palm' })));
    const offFist = speechEvents.on('hand.fist', () => setState((s) => ({ ...s, gesture: 'fist' })));
    const offThumb = speechEvents.on('hand.thumbs_up', () => setState((s) => ({ ...s, gesture: 'thumbs_up' })));
    const offIdle = speechEvents.on('hand.idle', () => setState((s) => ({ ...s, gesture: 'idle' })));
    const offExplain = speechEvents.on('gesture.explain', () => setState((s) => ({ ...s, gesture: 'explain' })));

    const offWalk = speechEvents.on('body.walk', (d) => {
      const dir = d.direction || 'forward';
      const ms = d.durationMs ?? 2500;
      setState((s) => ({
        ...s,
        walking: dir !== 'stop',
        walkDir: dir,
      }));
      if (dir !== 'stop') {
        const id = window.setTimeout(() => {
          setState((s) => ({ ...s, walking: false, walkDir: 'stop' }));
        }, ms);
        timers.push(id);
      }
    });

    const offBeam = speechEvents.on('eye.beam', (d) => {
      const ms = d.durationMs ?? 1800;
      setState((s) => ({
        ...s,
        beamActive: true,
        beamColor: d.color || 'blue',
        beamIntensity: d.beamIntensity ?? 1.4,
      }));
      const id = window.setTimeout(() => {
        setState((s) => ({ ...s, beamActive: false }));
      }, ms);
      timers.push(id);
    });

    const offStart = speechEvents.on('speech.start', () => {
      setState((s) => ({
        ...s,
        gesture: 'explain',
        beamActive: true,
        beamColor: 'blue',
        beamIntensity: 1.2,
      }));
    });
    const offStop = speechEvents.on('speech.stop', () => {
      setState((s) => ({
        ...s,
        gesture: 'idle',
        beamActive: false,
      }));
    });

    return () => {
      offGesture(); offWave(); offPoint(); offPalm(); offFist(); offThumb();
      offIdle(); offExplain(); offWalk(); offBeam(); offStart(); offStop();
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    if (isSpeaking) {
      setState((s) => (s.gesture === 'idle' ? { ...s, gesture: 'explain', beamActive: true } : s));
    } else {
      setState((s) => ({ ...s, gesture: 'idle', beamActive: false }));
    }
  }, [isSpeaking]);

  return state;
}

export const BEAM_HEX: Record<EyeBeamColor, number> = {
  blue: 0x44aaff,
  red: 0xff2244,
  white: 0xffffff,
};
