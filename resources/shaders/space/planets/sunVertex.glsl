varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
varying float vStrength;

uniform float uTime;

float cnoise(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
}


void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    float noise = cnoise(vec3(uv, uTime * 0.001));

    modelPosition.y += (noise) * 0.4;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;


    gl_Position = projectionPosition;

    vNormal = modelNormal.xyz;
    vPosition = modelPosition.xyz;
    vUv = uv;
}
