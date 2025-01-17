uniform float uSize;
uniform float uTime;
uniform float uPixelRatio;

attribute float aRandom;
attribute vec3 aColor;
attribute float aGlowIntensity;

varying vec3 vColor;
varying float vRandom;
varying float vGlowIntensity;

void main(){
    vec4 modelPositon = modelMatrix * vec4(position, 1.0);

    vec4 viewPosition = viewMatrix * modelPositon;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    gl_PointSize = uSize * aRandom * uPixelRatio;
    gl_PointSize = max(gl_PointSize * ( 1.0 / - viewPosition.z ), 2.15); // Size Attenuation

    vColor = aColor;
    vRandom = aRandom;
    vGlowIntensity = aGlowIntensity;
}
