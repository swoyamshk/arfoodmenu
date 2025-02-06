import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';  // Import GLTFLoader

const Food3DModelPage = () => {
  const { id } = useParams();  // Get the food item id from the URL
  const sceneRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    sceneRef.current.appendChild(renderer.domElement);

    // Add your 3D model loading logic here
    const loader = new GLTFLoader();
    const modelPath = `/${id}.glb`;  // Assuming the GLB model filename matches the ID

    loader.load(modelPath, (gltf) => {
      scene.add(gltf.scene);
      gltf.scene.scale.set(0.5, 0.5, 0.5);
      gltf.scene.position.set(0, -1, 0);
    }, undefined, (error) => {
      console.error('Error loading model:', error);
    });

    camera.position.z = 5;

    const animate = function () {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize for responsive canvas
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onWindowResize);

    return () => {
      // Clean up on component unmount
      window.removeEventListener('resize', onWindowResize);
      renderer.dispose();
    };
  }, [id]);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <div ref={sceneRef}></div>
    </div>
  );
};

export default Food3DModelPage;
