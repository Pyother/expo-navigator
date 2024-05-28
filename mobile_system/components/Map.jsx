import React, { useEffect } from 'react';
import { Renderer, THREE } from 'expo-three';
import { GLView } from 'expo-gl';
import { StyleSheet, View } from 'react-native';

export const Map = () => {
    const onContextCreate = async (gl) => {
        // Create a Three.js renderer
        const renderer = new Renderer({ gl });
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
        renderer.setClearColor(0xffffff, 1); 

        // Create a new Three.js scene
        const scene = new THREE.Scene();

        // Create a camera and position it
        const camera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
        camera.position.z = 5;

        // Add an ambient light to the scene
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);

        // Create a cube and add it to the scene
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0xa0e2f2 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            // Rotate the cube
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            // Render the scene
            renderer.render(scene, camera);

            // End the frame
            gl.endFrameEXP();
        };

        animate();
    };

    return (
        <GLView
            style={{ flex: 1, width: '100%' }}
            onContextCreate={onContextCreate}
        />
    );
};

const styles = StyleSheet.create({
    
});
