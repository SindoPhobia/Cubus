import * as THREE from 'three';

export const ORIGIN_CAMERA_LOOK_AT = new THREE.Vector3(0, 7.5, 0);
export const DESTINATION_CAMERA_LOOK_AT = new THREE.Vector3(0, 0, 2.5);
export const FINISHED_CAMERA_LOOK_AT = new THREE.Vector3(0, 0, 0);

export const DESTINATION_CAMERA_POSITION = new THREE.Vector3(0, 9.5, 8.3);
export const ORIGIN_CAMERA_POSITION = new THREE.Vector3(
    0,
    DESTINATION_CAMERA_POSITION.y * 1.25,
    -DESTINATION_CAMERA_POSITION.z * 2,
);
export const FINISHED_CAMERA_POSITION = new THREE.Vector3(0, 10, 0);

export const CAMERA_ANIMATION_DURATION = 2500;
