// src/Game.js
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Model from './Model';
import Player from './Player';
import IsometricCamera from './IsometricCamera';

const initialItems = [
  { id: 1, type: 'clean_bottle', path: './clean_bottle.gltf', position: [0, 1, 0] },
  { id: 2, type: 'dirty_bottle', path: './dirty_bottle.gltf', position: [2, 1, 0] },
];

function Game() {
  const [items, setItems] = useState(initialItems);
  const [score, setScore] = useState(0);

  // Ensure gltf files exist
  const handleCleanItem = (item) => {
    if (item.type === 'dirty_bottle') {
      setItems(items.map(i => i.id === item.id ? { ...i, type: 'clean_bottle', path: './clean_bottle.gltf' } : i));
    }
  };

  const handleRecycleItem = (item) => {
    if (item.type === 'clean_bottle') {
      setScore(score + 10);
      setItems(items.filter(i => i.id !== item.id));
    }
  };

  return (
    <div>
      <Canvas>
        <IsometricCamera />
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Player />
        {items.map(item => (
          <Model key={item.id} path={item.path} position={item.position} />
        ))}
        {/* <Model path="/clean_bottle.gltf" position={[5, 0, 0]} /> */}
      </Canvas>
      <div>
        <button onClick={() => handleCleanItem(items[1])}>Clean Item</button>
        <button onClick={() => handleRecycleItem(items[0])}>Recycle Item</button>
        <p>Score: {score}</p>
      </div>
    </div>
  );
}

export default Game;
