"use client";
import React, { useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function ModelViewerPage() {
  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, 5); // Adjusted for better visibility

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lighting setup
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft light
    scene.add(ambientLight);

    // Load .glb file
    const loader = new GLTFLoader();
    loader.load(
      "/pizza.glb", // Path to your GLB file in the public folder
      (gltf) => {
        const model = gltf.scene;
        scene.add(model);
        model.position.set(0, 0, 0); // Adjust position if needed
        model.scale.set(1, 1, 1); // Scale the model appropriately
      },
      (xhr) => console.log((xhr.loaded / xhr.total) * 100 + "% loaded"),
      (error) => console.error("An error occurred while loading the model:", error)
    );

    // OrbitControls for better interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); // Update controls on each frame
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resizing
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup Three.js scene
    return () => {
      renderer.domElement.remove();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return null; // Since Three.js handles the DOM, this component doesn't render JSX
}
