import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { use3DAnimation } from '../../hooks/use3DAnimation';
import { format } from '../../lib/utils';
import { useMediaQuery } from 'react-responsive';
import { Vector3 } from 'three';
import { ComponentBaseProps } from '../../types';
import { three3DHelpersUtil } from '../../utils/three-helpers';

export interface HeroProps extends ComponentBaseProps {
  modelPath: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  initialCameraPosition?: [number, number, number];
  initialRotation?: [number, number, number];
}

const Hero: React.FC<HeroProps> = ({
  modelPath,
  headline,
  subheadline,
  ctaText,
  ctaLink,
  initialCameraPosition = [0, 1, 5],
  initialRotation = [0, 0, 0],
  className = '',
  style,
  id
}) => {
  const { scene, camera, gl } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const { createTimeline } = use3DAnimation();
  const { nodes, materials } = useGLTF(modelPath) as any;

  useEffect(() => {
      //Ensure that loading process is done
      if (nodes && materials) {
          setLoading(false)
      }
  }, [nodes, materials])

  useEffect(() => {
    // Implement an initial subtle floating animation.

    return () => {
      // Kill all animations on unmount.
    };
  }, [createTimeline]);

  if (error) {
    return (
      <section className="relative h-screen w-full flex items-center justify-center bg-red-100">
        <div className="text-red-700">Error loading 3D model. Please try again later.</div>
      </section>
    );
  }

    const [rotation, setRotation] = useState<Vector3>(new Vector3(initialRotation[0],initialRotation[1],initialRotation[2]))

    useFrame(() => {
      if (!groupRef.current) return;

      setRotation(rotation => new Vector3(rotation.x , rotation.y + 0.01 ,rotation.z))
      groupRef.current.rotation.set(rotation.x,rotation.y,rotation.z)
    })
  return (
    <section id={id} className={`relative h-screen w-full ${className}`} style={style}>
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100 opacity-75">
          <p>Loading 3D model...</p>
        </div>
      )}
      <ThreeScene>
        <OrbitControls minDistance={5} maxDistance={10} enableZoom={false} enablePan={false} enableRotate={true} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <ambientLight intensity={0.5} />
        <group ref={groupRef} position={[0,0,0]}>
          {nodes && Object.keys(nodes).map((key) => {
            const node = nodes[key];

            if (node instanceof THREE.Mesh) {
              return (
                <mesh
                  key={key}
                  geometry={node.geometry}
                  material={materials[node.material.name]}
                  castShadow
                  receiveShadow
                />
              );
            }
            return null;
          })}
        </group>
        
      </ThreeScene>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 text-balance">{headline}</h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8">{subheadline}</p>
        <a
          href={ctaLink}
          className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          aria-label={`Learn more about ${headline}`}
        >
          {ctaText}
        </a>
      </div>
    </section>
  );
};

export default Hero;