import {shaderMaterial, useTexture} from '@react-three/drei';
import * as THREE from 'three';
import vertexShader from '../../../../shaders/space/planets/vertex.glsl';
import fragmentShader from '../../../../shaders/space/planets/fragment.glsl';
import sunVertexShader from '../../../../shaders/space/planets/sunVertex.glsl';
import sunFragmentShader from '../../../../shaders/space/planets/sunFragment.glsl';
import {extend, useFrame} from '@react-three/fiber';
import {useEffect, useRef} from 'react';
const PlanetMaterial = shaderMaterial(
    {
        uLightIntensity: 0.75,
        uLightColor: new THREE.Color(0xffffff),
        uColorHigh: new THREE.Color(0x38bdf8),
        uColorLow: new THREE.Color(0x4ade80),
        uNoiseTexture: new THREE.Texture(),
        uLightPosition: new THREE.Vector3(0, 0, 0),
    },
    vertexShader,
    fragmentShader,
);
const SunPlanetMaterial = shaderMaterial(
    {
        uLightIntensity: 0.75,
        uLightColor: new THREE.Color(0xffffff),
        uColorHigh: new THREE.Color(0x38bdf8),
        uColorLow: new THREE.Color(0x4ade80),
        uNoiseTexture: new THREE.Texture(),
        uLightPosition: new THREE.Vector3(0, 0, 0),
        uTime: 0,
    },
    sunVertexShader,
    sunFragmentShader,
);
extend({PlanetMaterial});
extend({SunPlanetMaterial});
export const Planets = () => {
    return (
        <>
            <Planet
                position={[-40, -10, -15]}
                colorHigh={0x38bdf8}
                colorLow={0x4ade80}
                lightPosition={[3, 0, 0]}
                texture="noiseTexture1"
                size={1.25}
            />
            <Planet
                position={[0, -15, -40]}
                rotation={[0, 0, 0]}
                lightPosition={[3, 0, -2]}
                colorHigh={0xec4899}
                colorLow={0xf9a8d4}
                texture="noiseTexture2"
                rotate={true}
                size={20}
                lightIntensity={1}
                detail={32}
            />
            <Planet
                position={[60, 5, -50]}
                rotation={[-Math.PI * 0.2, 0, 0]}
                colorHigh={new THREE.Color(0.988, 0.827, 0.302)}
                colorLow={new THREE.Color(10.918, 2.345, 1.047)}
                lightPosition={[3, 0, 0]}
                lightIntensity={0}
                texture="stripesTexture"
                size={1}
                isSun={true}
            />
        </>
    );
};

type PlanetProps = {
    position: [number, number, number];
    colorHigh: THREE.ColorRepresentation;
    colorLow: THREE.ColorRepresentation;
    rotation?: [number, number, number];
    lightPosition: [number, number, number];
    size?: number;
    rotate?: boolean;
    texture: 'noiseTexture1' | 'noiseTexture2' | 'stripesTexture';
    detail?: number;
    lightIntensity?: number;
    isSun?: boolean;
};

const Planet = ({
    colorHigh,
    colorLow,
    position,
    rotation,
    texture,
    lightPosition,
    size = 1.5,
    rotate = true,
    detail = 12,
    lightIntensity = 0.75,
    isSun = false,
}: PlanetProps) => {
    const planetRef = useRef<THREE.Mesh>(null);
    const ref = useRef<THREE.ShaderMaterial>(null);
    const uTexture = useTexture(`/textures/noises/${texture}.png`);
    useEffect(() => {
        if (ref.current) {
            ref.current.uniforms.uColorHigh.value = new THREE.Color(colorHigh);
            ref.current.uniforms.uColorLow.value = new THREE.Color(colorLow);
            ref.current.uniforms.uLightPosition.value = new THREE.Vector3(
                ...lightPosition,
            );
            ref.current.uniforms.uNoiseTexture.value = uTexture;
            ref.current.uniforms.uLightIntensity.value = lightIntensity;
        }
    }, [uTexture, colorHigh, colorLow, lightPosition, lightIntensity, ref]);

    useFrame((_, delta) => {
        if (ref.current && isSun) {
            ref.current.uniforms.uTime.value += delta;
        }
        if (rotate && planetRef.current) {
            const speed = 0.02;
            planetRef.current.rotation.y -= delta * speed;
            planetRef.current.rotation.x += delta * speed * 0.5;
        }
    });

    return (
        <>
            <mesh ref={planetRef} position={position} rotation={rotation}>
                <icosahedronGeometry args={[size, detail]} />
                {isSun ? (
                    <sunPlanetMaterial ref={ref} />
                ) : (
                    <planetMaterial ref={ref} />
                )}
            </mesh>
        </>
    );
};
