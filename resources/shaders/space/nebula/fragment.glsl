
uniform sampler2D uPerlinTexture;
uniform float uTime;
uniform vec3 uColor;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

#include ../../includes/pointLight.glsl

void main(){
    vec2 smokeUv = vUv;
    smokeUv.x *= 0.5;
    smokeUv.y *= 0.3;
    smokeUv.y -= uTime * 0.01;

    float smoke = texture(uPerlinTexture, smokeUv).r;

    smoke = smoothstep(0.35,1.0,smoke);

    smoke *= smoothstep(0.0,0.2,vUv.x) * smoothstep(1.0,0.8,vUv.x);
    smoke *= smoothstep(0.0,0.2,vUv.y) * smoothstep(1.0,0.8,vUv.y);

    vec3 color = uColor * 0.3;
    vec3 light = pointLight(vec3(0.078, 2.222, 0.651), 1.0, vNormal, vec3(-10.0, 1.0, -6.0), normalize(vPosition - cameraPosition), 20.0, vPosition, 0.1);
    color += light;

    gl_FragColor = vec4(color*2.0, smoke);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
