import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function Player({ items, handlePickUpItem, handleDropItem, carriedItem, sortingContainers }) {
  const playerRef = useRef();
  const { scene } = useGLTF('/Ghost.glb');
  const [velocity, setVelocity] = useState([0, 0, 0]);
  const speed = 0.1;
  const jumpPower = 1;
  const gravity = -0.05;

  const { camera } = useThree();

  const handleKeyDown = (event) => {
    let newVelocity = [...velocity];
    switch (event.key) {
      case 'ArrowUp':
        newVelocity[2] = -speed;
        break;
      case 'ArrowDown':
        newVelocity[2] = speed;
        break;
      case 'ArrowLeft':
        newVelocity[0] = -speed;
        break;
      case 'ArrowRight':
        newVelocity[0] = speed;
        break;
      case ' ':
        if (playerRef.current.position.y <= 0.5) {
          newVelocity[1] = jumpPower;
        }
        break;
      case 'E': // Key to pick up or drop item
        if (carriedItem) {
          handleDropItem(carriedItem, getClosestContainer(playerRef.current.position));
        } else {
          const nearItem = items.find(item => isNear(playerRef.current, item.position));
          if (nearItem) {
            console.log('Picking up item:', nearItem);
            handlePickUpItem(nearItem);
          }
        }
        break;
      default:
        break;
    }
    setVelocity(newVelocity);
  };

  const handleKeyUp = (event) => {
    let newVelocity = [...velocity];
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
        newVelocity[2] = 0;
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
        newVelocity[0] = 0;
        break;
      default:
        break;
    }
    setVelocity(newVelocity);
  };

  const isNear = (player, itemPosition) => {
    const distance = Math.sqrt(
      (player.position.x - itemPosition[0]) ** 2 +
      (player.position.y - itemPosition[1]) ** 2 +
      (player.position.z - itemPosition[2]) ** 2
    );
    if (distance < 50) {
      console.log('Near item:', itemPosition);
      return true;
    }
    return false;
  };

  const getClosestContainer = (playerPosition) => {
    let closest = null;
    let minDistance = Infinity;
    sortingContainers.forEach(container => {
      const distance = Math.sqrt(
        (playerPosition.x - container.position[0]) ** 2 +
        (playerPosition.y - container.position[1]) ** 2 +
        (playerPosition.z - container.position[2]) ** 2
      );
      if (distance < minDistance) {
        closest = container.type;
        minDistance = distance;
      }
    });
    return closest;
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [items, velocity]);

  useFrame(() => {
    if (playerRef.current) {
      const direction = new THREE.Vector3();
      direction.set(velocity[0], velocity[1], velocity[2]);
      direction.applyQuaternion(camera.quaternion);

      playerRef.current.position.x += direction.x;
      playerRef.current.position.y += direction.y;
      playerRef.current.position.z += direction.z;

      if (playerRef.current.position.y > 0) {
        setVelocity([velocity[0], velocity[1] + gravity, velocity[2]]);
      } else {
        playerRef.current.position.y = 0;
        setVelocity([velocity[0], 0, velocity[2]]);
      }

      if (velocity[0] !== 0 || velocity[2] !== 0) {
        playerRef.current.rotation.y = Math.atan2(direction.x, direction.z);
      }

      if (carriedItem) {
        carriedItem.position = [
          playerRef.current.position.x + direction.x * 1.5,
          playerRef.current.position.y + 1,
          playerRef.current.position.z + direction.z * 1.5,
        ];
        console.log('Carried item position:', carriedItem.position);
      }
    }
  });

  return (
    <primitive ref={playerRef} object={scene} position={[0, 0, 0]} />
  );
}

export default Player;
