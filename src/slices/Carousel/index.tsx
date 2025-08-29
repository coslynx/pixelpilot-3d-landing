import React, { useState, useRef, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useThree } from '@react-three/fiber';
import { gsap } from 'gsap';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { clamp } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';
import { AnimationConfig, use3DAnimation } from '../../hooks/use3DAnimation';
import { Html } from '@react-three/drei'

interface CarouselItem {
  key: string;
  content: React.ReactNode | JSX.Element;
}

interface CarouselProps {
  items: CarouselItem[];
  autoRotateInterval?: number | null;
  enableControls?: boolean;
  itemWidth: number;
  transitionDuration?: number;
}

const Carousel: React.FC<CarouselProps> = ({
  items,
  autoRotateInterval = null,
  enableControls = true,
  itemWidth,
  transitionDuration = 0.5,
}) => {
  const { scene, camera, size } = useThree();
  const [activeIndex, setActiveIndex] = useState(0);
  const { createTimeline, pause, resume } = use3DAnimation();
  const carouselRef = useRef<THREE.Group>(null);
  const itemRefs = useRef<(THREE.Object3D | null)[]>(items.map(() => null));
  const autoRotateTimeout = useRef<NodeJS.Timeout | null>(null);
  const { width } = size

  const itemPositions = useMemo(() => {
    return items.map((_, index) => index * itemWidth);
  }, [items, itemWidth]);

  const numItems = items.length;

  const clampIndex = useCallback((index: number) => {
    return clamp(index, 0, numItems - 1);
  }, [numItems]);

  const next = useCallback(() => {
    setActiveIndex(prev => clampIndex(prev + 1));
  }, [clampIndex]);

  const previous = useCallback(() => {
    setActiveIndex(prev => clampIndex(prev - 1));
  }, [clampIndex]);

  const startAutoRotate = useCallback(() => {
    if (autoRotateInterval === null) return;

    autoRotateTimeout.current = setTimeout(() => {
      next();
    }, autoRotateInterval);
  }, [autoRotateInterval, next]);

  const stopAutoRotate = useCallback(() => {
    if (autoRotateTimeout.current) {
      clearTimeout(autoRotateTimeout.current);
    }
  }, []);

  useEffect(() => {
    if (autoRotateInterval !== null) {
      startAutoRotate();
    }

    return () => {
      stopAutoRotate();
    };
  }, [autoRotateInterval, startAutoRotate, stopAutoRotate]);

  useEffect(() => {
    if (!carouselRef.current) return;

    const timelineConfig: AnimationConfig = {
      target: carouselRef.current.position,
      properties: {
        x: -activeIndex * itemWidth,
        ease: "power2.inOut",
        duration: transitionDuration
      }
    };

    createTimeline(timelineConfig);
  }, [activeIndex, itemWidth, transitionDuration, createTimeline]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <group ref={carouselRef}>
        {items.map((item, index) => (
          <group key={item.key} position={[itemPositions[index], 0, 0]}>
            <Html>
              {item.content}
            </Html>
          </group>
        ))}
      </group>

      {enableControls && (
        <>
          <button
            onClick={previous}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            Previous
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            Next
          </button>
        </>
      )}
    </div>
  );
};

export default Carousel;