import { useState, useEffect, useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { useTheme } from '../context/ThemeContext';
import * as THREE from 'three';

/**
 * Configuration options for the use3DAnimation hook.
 */
export interface AnimationConfig {
  /** The target 3D object to animate. */
  target: THREE.Object3D | null;
  /** The properties to animate, such as position, rotation, or scale. */
  properties: Record<string, any>;
  /** The duration of the animation in seconds. */
  duration?: number;
  /** The easing function to use for the animation. */
  easing?: string;
  /** Whether to loop the animation. */
  loop?: boolean;
  /** Called when the animation starts. */
  onStart?: () => void;
  /** Called when the animation updates. */
  onUpdate?: (progress: number) => void;
  /** Called when the animation completes. */
  onComplete?: () => void;
}

/**
 * The return value of the use3DAnimation hook.
 */
export interface Use3DAnimationResult {
  /** A function to start the animation. */
  start: () => void;
  /** A function to pause the animation. */
  pause: () => void;
  /** A function to resume the animation. */
  resume: () => void;
  /** A function to stop the animation. */
  stop: () => void;
  /** A function to seek to a specific time in the animation. */
  seek: (time: number) => void;
  /** A function to reverse the animation. */
  reverse: () => void;
  /** A function to create animation. */
  createTimeline: (config: AnimationConfig) => void;
  /** A boolean indicating whether the animation is currently playing. */
  isPlaying: boolean;
}

/**
 * A custom React hook for managing and controlling 3D animations using GSAP.
 *
 * @param target - The 3D object to animate.
 * @param properties - The properties to animate.
 * @param duration - The duration of the animation in seconds.
 * @param easing - The easing function to use for the animation.
 * @param loop - Whether to loop the animation.
 * @param onStart - Called when the animation starts.
 * @param onUpdate - Called when the animation updates.
 * @param onComplete - Called when the animation completes.
 * @returns An object containing functions to control the animation.
 */
export const use3DAnimation = (): Use3DAnimationResult => {
  const { isDarkMode } = useTheme();
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const start = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.play();
      setIsPlaying(true);
    }
  }, []);

  const pause = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const resume = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.resume();
      setIsPlaying(true);
    }
  }, []);

  const stop = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.pause(0);
      timelineRef.current.kill();
      setIsPlaying(false);
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (timelineRef.current) {
      timelineRef.current.seek(time);
    }
  }, []);

  const reverse = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.reverse();
    }
  }, []);

  const createTimeline = useCallback((config: AnimationConfig) => {
    if (!config.target) {
      console.error('use3DAnimation: Target object is null or undefined.');
      return;
    }

    timelineRef.current = gsap.timeline({
      onStart: () => {
        config.onStart && config.onStart();
        setIsPlaying(true);
      },
      onUpdate: () => {
        const progress = timelineRef.current ? timelineRef.current.progress() : 0;
        config.onUpdate && config.onUpdate(progress);
      },
      onComplete: () => {
        config.onComplete && config.onComplete();
        setIsPlaying(false);
        if(config.loop){
          timelineRef.current?.restart()
        }
      },
      onReverseComplete: () => {
        setIsPlaying(false);
      },
      repeat: config.loop ? -1 : 0,
    });

    timelineRef.current.to(config.target, {
      ...config.properties,
      duration: config.duration || 1,
      ease: config.easing || "power2.out",
    });
  }, []);

  // Dispose of timeline when component unmounts
  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  return {
    start,
    pause,
    resume,
    stop,
    seek,
    reverse,
    createTimeline,
    isPlaying,
  };
};