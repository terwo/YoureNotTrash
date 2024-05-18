import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function Player() {
  const playerRef = useRef();

  useFrame(() => {
    // Basic player movement logic (e.g., keyboard controls)
    if (playerRef.current) {
      playerRef.current.position.x += 0.01; // Example: move right
    }
  });

  return (
    <mesh ref={playerRef} position={[0, 0, 0]}>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
}

export default Player;
