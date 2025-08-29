import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../../context/ThemeContext';
import { use3DAnimation } from '../../hooks/use3DAnimation';
import { three3DHelpersUtil } from '../../utils/three-helpers';
import { Section } from '@react-email/components';
import './ScrollExperience.module.css';

gsap.registerPlugin(ScrollTrigger);

interface TimelineConfig {
  start: string;
  end: string;
  target: any;
  props: gsap.TweenVars;
}

interface SceneConfig {
  lights: {
    ambientIntensity: number;
    directionalIntensity: number;
    directionalPosition: [number, number, number];
  };
  cameraPosition: [number, number, number];
  type: string;
}

interface ScrollExperienceProps {
  sceneConfig: SceneConfig;
  animations: TimelineConfig[];
}

const ScrollExperience: React.FC<ScrollExperienceProps> = ({ sceneConfig, animations }) => {
  const { isDarkMode } = useTheme();
  const { scene, gl, camera } = useThree();
  const modelRef = useRef<THREE.Group>(null);
  const { createTimeline } = use3DAnimation();

  useEffect(() => {
    if (!ScrollTrigger || !scene) return;

    ScrollTrigger.defaults({
      horizontal: false,
      markers: false,
      start: "top top",
      end: "bottom bottom",
      scroller: window,
    });

    animations.forEach((anim, index) => {
      if (anim.target && anim.props) {
        createTimeline({
          target: anim.target,
          properties: anim.props,
          duration: 1,
          easing: "power2.inOut",
          onUpdate: () => {
          }
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [scene, animations, createTimeline]);

  return (
    <group>
      {/* Implement the 3D scene using R3F components here */}
    </group>
  );
};

export default ScrollExperience;