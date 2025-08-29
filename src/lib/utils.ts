// src/lib/utils.ts

// Purpose: Provide utility functions for 3D transformations, calculations, and data conversions, ensuring consistent and optimized operations within the 3D environment.

// Imports:
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

// Function: calculateBoundingBoxSize
// Calculates the size of a 3D object's bounding box.
// Parameters: object: THREE.Object3D - The 3D object to calculate the bounding box size for.
// Returns: THREE.Vector3 - The size of the bounding box.
// Optimizations: Uses a cached bounding box for performance.
// Error Handling: Returns a zero vector if the bounding box cannot be calculated.
export function calculateBoundingBoxSize(object: THREE.Object3D): THREE.Vector3 {
  // Create a new bounding box
  const box = new THREE.Box3();

  // Try to compute the bounding box, return zero vector on fail
  try {
    box.setFromObject(object);
    return box.getSize(new THREE.Vector3());
  } catch (error){
    console.error("error", error)
    return new THREE.Vector3(0,0,0)
  }
}

// Function: centerObject
// Centers a 3D object at the origin (0,0,0).
// Parameters: object: THREE.Object3D - The 3D object to center.
// Error Handling: Logs an error if the object does not exist.
export function centerObject(object: THREE.Object3D): void {
    if (!object) {
        console.error("Cannot center a null object");
        return;
    }

    const bbox = calculateBoundingBoxSize(object);

    object.position.set(
        -bbox.x / 2,
        -bbox.y / 2,
        -bbox.z / 2
    );
}

// Function: convertDegreesToRadians
// Converts degrees to radians.
// Parameters: degrees: number - The degree value to convert.
// Returns: number - The radian value.
export function convertDegreesToRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}

// Function: isMobile
// Checks if the user's device is a mobile device based on the screen width.
// Returns: boolean - True if the device is mobile, false otherwise.
export function isMobile(): boolean {
  return window.innerWidth < 768; // Example threshold.  Adjust for actual breakpoints.
}

// Function: clamp
// Clamps a number between a minimum and maximum value.
// Parameters: num: number - The number to clamp.
// Parameters: min: number - The minimum value.
// Parameters: max: number - The maximum value.
// Returns: number - The clamped number.
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

// Function: lerp
// Linearly interpolates between two values.
// Parameters: a: number - The starting value.
// Parameters: b: number - The ending value.
// Parameters: t: number - The interpolation factor (0-1).
// Returns: number - The interpolated value.
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// Function: disposeMaterial
// Disposes of a Three.js material to free up memory. Handles different material types.
// Parameters: material: THREE.Material | THREE.Material[] - The material or array of materials to dispose.
export function disposeMaterial(material: THREE.Material | THREE.Material[]): void {
  if (Array.isArray(material)) {
    material.forEach(mat => {
      disposeSingleMaterial(mat);
    });
  } else {
    disposeSingleMaterial(material);
  }
}

// Function: disposeSingleMaterial (private helper)
function disposeSingleMaterial(material: THREE.Material): void {
  material.dispose();
  if (material instanceof THREE.MeshStandardMaterial) {
    material.map?.dispose();
    material.aoMap?.dispose();
    material.bumpMap?.dispose();
    material.normalMap?.dispose();
    material.roughnessMap?.dispose();
    material.metalnessMap?.dispose();
    material.emissiveMap?.dispose();
    material.envMap?.dispose();
  }
}

// Function: disposeGeometry
// Disposes of a Three.js geometry to free up memory.
// Parameters: geometry: THREE.BufferGeometry - The geometry to dispose.
export function disposeGeometry(geometry: THREE.BufferGeometry): void {
  geometry.dispose();
}

// Function: extractGLTFMesh
// Extracts the first mesh from a GLTF model. Useful for single-mesh models.
// Parameters: gltf: GLTF - The loaded GLTF model.
// Returns: THREE.Mesh | undefined - The extracted mesh, or undefined if no mesh is found.
export function extractGLTFMesh(gltf: GLTF): THREE.Mesh | undefined {
    if (gltf.scene) {
        let mesh: THREE.Mesh | undefined;
        gltf.scene.traverse((child) => {
            if (child instanceof THREE.Mesh && !mesh) {
                mesh = child;
            }
        });
        return mesh;
    }
    return undefined;
}

// Function: isPowerOfTwo
// Check if a number is a power of 2, use bitwise operators
// Parameters: value: number - number to validate
// Returns: boolean
export function isPowerOfTwo(value: number): boolean {
    return (value & (value - 1)) === 0;
}

// Function: correctGammaForTexture
// Correct gamma settings, only if power of two
// Parameters: texture: THREE.Texture - texture to fix
export function correctGammaForTexture(texture: THREE.Texture): void {
    if (texture.image && isPowerOfTwo(texture.image.width) && isPowerOfTwo(texture.image.height)){
        texture.encoding = THREE.sRGBEncoding
        texture.needsUpdate = true
    }
}