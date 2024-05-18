import React, { useRef, useEffect } from 'react';
import { useFrame, extend, useThree } from '@react-three/fiber';
import { OrthographicCamera } from 'three';

extend({ OrthographicCamera });

function IsometricCamera() {
	const cameraRef = useRef();
	const { set, size } = useThree();
  
	useEffect(() => {
	  if (cameraRef.current) {
		set({ camera: cameraRef.current });
	  }
	}, [set]);
  

  useFrame(() => {
	if (cameraRef.current) {
	  cameraRef.current.position.set(10, 10, 10); // Position the camera to get an isometric view
	  cameraRef.current.lookAt(0, 0, 0); // Make the camera look at the center of the scene
	  cameraRef.current.updateProjectionMatrix();
	}
  });

  return (
	<orthographicCamera
	  ref={cameraRef}
	  args={[-10, 10, 10, -10, 0.1, 1000]} // Left, right, top, bottom, near, far
	/>
  );
}

export default IsometricCamera;
