varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

uniform float uTime;
uniform sampler2D uPerlinTexture;

#include ../../includes/rotate2D.glsl

void main(){
    vec3 newPosition = position;

    float perlin = texture(
        uPerlinTexture,
        vec2(0.5, uv.y*0.2 - sin(uTime*0.00175)*0.1)
    ).r;

    float angle = perlin*30.0;
    newPosition.xz = rotate2D(newPosition.xz, angle);

    //* Wind
    vec2 windOffset = vec2(
        texture(uPerlinTexture, vec2(0.25, uTime*0.00105)).r - 0.5,
        texture(uPerlinTexture, vec2(0.75, uTime*0.00105)).r - 0.5
    );

    windOffset *= pow(uv.y, 3.0) * 30.0;
    newPosition.xz += windOffset;

    vec4 modelPositon = modelMatrix * vec4(newPosition, 1.0);

    vec4 viewPosition = viewMatrix * modelPositon;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    vUv = uv;
    vPosition = newPosition.xyz;
    vNormal = normal;
}
