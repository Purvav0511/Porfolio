import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Preload, useGLTF } from '@react-three/drei'
import CanvasLoader from '../Loader'

const Earth = () => {

  const earth= useGLTF('./planet/scene.gltf')
  return (
    <primitive 
    object={earth.scene}
    sclae={3.5}
    position-y={0}
    rotation-y={0}/>
  )
}

const EarthCanvas = () => {
  return(
    <Canvas
      shadows
      frameloop='demand'
      gl={{ preserveDrawingBuffer: true }}
      camera={{
        fov: 40,
        near: 0.05,
        far:400,
        position: [-1, 3, 6]
       }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls 
        autoRotate
        enableZoom={false}
        maxPolarAngle={ Math.PI / 2 }
        minPolarAngle={ Math.PI / 2 }/>

        <Earth />
      </Suspense>
    </Canvas>
  )
}

export default EarthCanvas