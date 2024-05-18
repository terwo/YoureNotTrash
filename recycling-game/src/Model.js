import React from 'react';
import { useGLTF } from '@react-three/drei';

function Model({ path, ...props }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} {...props} />;
}

export default Model;
