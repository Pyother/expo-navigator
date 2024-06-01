import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Renderer, THREE } from 'expo-three';
import { GLView } from 'expo-gl';
import { StyleSheet, View, Dimensions } from 'react-native';
import { PanGestureHandler, PinchGestureHandler, State } from 'react-native-gesture-handler';

export const Map = () => {
    
    const data = useSelector(state => state.data);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const lastDrag = useRef({ x: 0, y: 0 });
    const lastScale = useRef(1);
    const cubeRef = useRef(null);
    const sceneRef = useRef(null); 
    const previousPositionRef = useRef(null); 
    const processedPointsRef = useRef(0); 

    const onContextCreate = async (gl) => {

        const renderer = new Renderer({ gl });
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
        renderer.setClearColor(0xf6f4f5, 1);
        rendererRef.current = renderer;

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
        camera.position.z = 8;
        camera.position.y = 2;
        camera.position.x = 0;
        cameraRef.current = camera;

        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x9089c9 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        cubeRef.current = cube; 
        previousPositionRef.current = cube.position.clone();

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
            gl.endFrameEXP();
        };

        animate();
    };

    useEffect(() => {
        if (cubeRef.current && data && data.length > 0) {
            for (let i = processedPointsRef.current; i < data.length; i++) {
                const point = data[i];
                const currentPosition = new THREE.Vector3(point.x, point.y, 0);
                if (previousPositionRef.current) {
                    createLine(previousPositionRef.current, currentPosition);
                    cubeRef.current.position.copy(currentPosition);
                    previousPositionRef.current = currentPosition.clone();
                }
            }
            processedPointsRef.current = data.length;
        }
    }, [data]);

    const createLine = (start, end) => {
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x364182, linewidth: 5 }); 
        const points = [start, end];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, lineMaterial);
        sceneRef.current.add(line);
    };

    const handlePanGestureEvent = (event) => {
        const { translationX, translationY } = event.nativeEvent;

        const deltaX = translationX - lastDrag.current.x;
        const deltaY = translationY - lastDrag.current.y;

        lastDrag.current.x = translationX;
        lastDrag.current.y = translationY;

        if (cameraRef.current) {
            cameraRef.current.position.x -= deltaX / 100;
            cameraRef.current.position.y += deltaY / 100;
        }
    };

    const handlePinchGestureEvent = (event) => {
        const { scale } = event.nativeEvent;

        const deltaScale = scale / lastScale.current;
        lastScale.current = scale;

        if (cameraRef.current) {
            const newFov = cameraRef.current.fov / deltaScale;
            cameraRef.current.fov = Math.max(30, Math.min(100, newFov)); 
            cameraRef.current.updateProjectionMatrix();
        }
    };

    const onPanGestureStateChange = (event) => {
        if (event.nativeEvent.state === State.END) {
            lastDrag.current.x = 0;
            lastDrag.current.y = 0;
        }
    };

    const onPinchGestureStateChange = (event) => {
        if (event.nativeEvent.state === State.END) {
            lastScale.current = 1;
        }
    };

    return (
        <View style={styles.container}>
            <PanGestureHandler
                onGestureEvent={handlePanGestureEvent}
                onHandlerStateChange={onPanGestureStateChange}
            >
                <PinchGestureHandler
                    onGestureEvent={handlePinchGestureEvent}
                    onHandlerStateChange={onPinchGestureStateChange}
                >
                    <GLView
                        style={{ flex: 1, width: '100%', borderRadius: 5 }}
                        onContextCreate={onContextCreate}
                    />
                </PinchGestureHandler>
            </PanGestureHandler>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 0.75,
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width - 40,
        marginRight: 20,
        marginLeft: 20,
        borderRadius: 5,
        overflow: 'hidden'
    },
});
