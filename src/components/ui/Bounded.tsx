import React, { ReactNode, useCallback, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { useHelper } from '@react-three/drei';

interface BoundedProps {
  size: { width: number; height: number; depth: number };
  position?: { x: number; y: number; z: number };
  boundaryColor?: string;
  visibleHelper?: boolean;
  children: ReactNode;
}

const Bounded: React.FC<BoundedProps> = ({
  size,
  position = { x: 0, y: 0, z: 0 },
  boundaryColor = 'red',
  visibleHelper = false,
  children,
}) => {
  const { width, height, depth } = size;
  const { x, y, z } = position;
  const boxRef = useRef<THREE.Box3 | null>(null);
  const helperRef = useRef<THREE.BoxHelper | null>(null);
  const positionVec = useMemo(() => new THREE.Vector3(x, y, z), [x, y, z]);

  // Create the Box3 only when size or position changes
  const box3 = useMemo(() => {
    if (isNaN(width) || isNaN(height) || isNaN(depth)) {
      console.warn("Bounded: Invalid size provided (NaN).");
      return new THREE.Box3();
    }

    const newBox = new THREE.Box3().setFromCenterAndSize(
      positionVec,
      new THREE.Vector3(width, height, depth)
    );
    boxRef.current = newBox;
    return newBox;
  }, [width, height, depth, positionVec]);

  // Custom hook to constrain the position within the Box3
  const useBounded = useCallback(() => {
    return (proposedPosition: THREE.Vector3): THREE.Vector3 => {
      if (!boxRef.current) return proposedPosition;
      return boxRef.current.clampPoint(proposedPosition, new THREE.Vector3());
    };
  }, [box3]);

  // Helper
  const wireframe = useMemo(() => {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    return geometry
  }, [width, height, depth]);
  const material = useMemo(() => new THREE.LineBasicMaterial({ color: boundaryColor }), [boundaryColor]);

  return (
    <group position={[x, y, z]} aria-label="Bounded 3D Area">
      {visibleHelper && (
        <lineSegments geometry={wireframe} material={material} />
      )}
      {children}
    </group>
  );
};

export default Bounded;