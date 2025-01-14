import vertexShader from '../../../../shaders/space/nebula/vertex.glsl'
import fragmentShader from '../../../../shaders/space/nebula/fragment.glsl'
import { shaderMaterial, useTexture } from '@react-three/drei';
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

        </>
    );
};

const geometry = new THREE.PlaneGeometry(10, 32, 48, 48);
geometry.rotateX(-Math.PI * 0.5);
