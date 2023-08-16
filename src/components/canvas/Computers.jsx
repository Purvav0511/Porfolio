import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload, useGLTF } from '@react-three/drei';
import CanvasLoader from '../Loader';

const Computers = ({ isMobile }) => {

  const computer = useGLTF('./desktop_pc/scene.gltf')

  return (
    <mesh>
      <hemisphereLight intensity={0.15} groundColor="black" />
      <pointLight intensity={1} />
      <spotLight 
      position={[-20, 50, 10]}
      angle={0.12}
      penumbra={1}
      intensity={1}
      castShadow
      shadow-mapSize={1024}
      />
      <primitive object={computer.scene}
      scale={isMobile ? 0.5 : 0.75}
      position={isMobile ? [0, -3, -2.2] : [0, -2.25, -1.5]}
      rotation={[-0.01, -0.2, -0.1]}/>
    </mesh>
  )
}


export default Computers;