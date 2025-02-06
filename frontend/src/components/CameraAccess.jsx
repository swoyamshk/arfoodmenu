import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";

const WebXRARViewer = () => {
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    initializeScene();
  }, []);

  const initializeScene = () => {
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, 3);
    cameraRef.current = camera;

    // WebXR Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true; // Enable WebXR
    document.body.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add AR Button
    document.body.appendChild(ARButton.createButton(renderer));

    // Lighting
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Load 3D Model
    const loader = new GLTFLoader();
    loader.load(
      "/pizza.glb", // Replace with your model
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5);model.scale.set(1, 1, 1); // Increase scale to make it bigger
        model.position.set(0, 0, -2); // Position it 2 meters in front
        scene.add(model);
      },
      undefined,
      (error) => console.error("Error loading model:", error)
    );

    const animate = () => {
      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });
    };
    animate();
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-xl font-bold mb-4">WebXR AR 3D Model Viewer</h1>
      <p className="text-gray-600">
        Click "Enter AR" to view the 3D model in your space.
      </p>
    </div>
  );
};

export default WebXRARViewer;
