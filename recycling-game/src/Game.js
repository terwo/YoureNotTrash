import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Model from './Model';
import Player from './Player';
import './App.css';

const initialItems = [
  { id: 1, type: 'clean_bottle', path: '/clean_bottle.gltf', position: [1, 1, 0] },
  { id: 2, type: 'dirty_bottle', path: '/dirty_bottle.gltf', position: [10, 1, -3] },
];

const sortingContainers = [
  { id: 1, type: 'garbage', position: [5, 0, 5], color: 'red' },
  { id: 2, type: 'recycling', position: [-5, 0, 5], color: 'blue' },
  { id: 3, type: 'compost', position: [0, 0, -5], color: 'green' },
];

function Game() {
  const [items, setItems] = useState(initialItems);
  const [score, setScore] = useState(0);
  const [carriedItem, setCarriedItem] = useState(null);

  const handlePickUpItem = (item) => {
    setCarriedItem(item);
  };

  const handleDropItem = (item, containerType) => {
    if (item && containerType) {
      if ((item.type === 'clean_bottle' && containerType === 'recycling') || 
          (item.type === 'dirty_bottle' && containerType === 'garbage') || 
          (item.type === 'compost' && containerType === 'compost')) {
        setScore(score + 10);
        setItems(items.filter(i => i.id !== item.id));
        setCarriedItem(null);
      } else {
        setCarriedItem(null);
      }
    }
  };

  return (
    <div>
      <Canvas camera={{ fov: 80, position: [50, 45, -40] }}>
        <color attach="background" args={['#aaf0c9']} />
        <OrbitControls enableRotate={false} />
        <ambientLight intensity={2} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <Model path="/recycling_depot_2.gltf" scale={0.1} position={[0, 0, 0]} />
          <Player 
            items={items} 
            handlePickUpItem={handlePickUpItem} 
            handleDropItem={handleDropItem} 
            carriedItem={carriedItem} 
            sortingContainers={sortingContainers}
          />
          {items.map(item => (
            <Model key={item.id} scale={10} path={item.path} position={item.position} />
          ))}
          {sortingContainers.map(container => (
            <mesh key={container.id} position={container.position}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color={container.color} />
            </mesh>
          ))}
        </Suspense>
      </Canvas>
      <div className="score">Score: {score}</div>
    </div>
  );
}

export default Game;
