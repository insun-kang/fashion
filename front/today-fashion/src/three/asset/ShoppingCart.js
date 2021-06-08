import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';

export default function ShoppingCart(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF('./asset/shopping_cart.gltf');
  return (
    <group ref={group} {...props} dispose={null} scale={0.4}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube_010.geometry}
        material={materials['metal']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube_063.geometry}
        material={materials['blue']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube_067.geometry}
        material={materials['metal']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube_069.geometry}
        material={materials['metal']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube_071.geometry}
        material={materials['metal']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube_072.geometry}
        material={materials['blue']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube_073.geometry}
        material={materials['black_shiny']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube_074.geometry}
        material={materials['metal']}
      />
    </group>
  );
}

useGLTF.preload('./asset/shopping_cart.gltf');
