import vertexShader from '../../../../shaders/space/nebula/vertex.glsl'
import fragmentShader from '../../../../shaders/space/nebula/fragment.glsl'
import { Cloud, Clouds, shaderMaterial, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { extend, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
const NebulaMaterial =  shaderMaterial(
    {
        uTime: 0,
        uPerlinTexture: new THREE.Texture(),
        uColor: new THREE.Color(0x8A2BE2),
    },
    vertexShader,
    fragmentShader,
)
extend({NebulaMaterial})

export const Nebula = () => {
    const ref = useRef<THREE.ShaderMaterial>(null);
    const texture = useTexture('/textures/noises/nebulaTexture.png');

    useEffect(() => {
        if (ref.current) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            ref.current.uniforms.uPerlinTexture.value = texture;
            ref.current.depthWrite = false;
            ref.current.transparent = true;
            ref.current.blending = THREE.AdditiveBlending;
            ref.current.side = THREE.DoubleSide;
        }
    },[ref,texture])

    useFrame((_,delta) => {
        if (ref.current) {
            ref.current.uniforms.uTime.value += delta;
        }
    })
    return (
        <>
        <mesh position={[-50, -85, -0]} geometry={geometry} rotation={[0, Math.PI*0.25, 0]}>
            <nebulaMaterial ref={ref}
                />
        </mesh>
        <Clouds position={[-60, -90, 0]} material={THREE.MeshBasicMaterial}>
            <Cloud segments={10} volume={15} speed={0.2} color={new THREE.Color(4.956862, 0.447059, 0.713725)} fade={10} opacity={0.3} />
            <Cloud seed={1} scale={1} volume={30} speed={0.1} position={[2,5,0]} color="#8b5cf6" fade={100} opacity={0.1}/>
        </Clouds>
        </>
    );
};

const geometry = new THREE.PlaneGeometry(10, 32, 48, 48);
geometry.rotateX(-Math.PI * 0.5);
