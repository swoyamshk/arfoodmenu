import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const ARjsViewer = () => {
  const sceneRef = useRef(null);
  const modelRef = useRef(null);
  const [status, setStatus] = useState("Initializing...");

  useEffect(() => {
    initializeScene();
    return () => cleanup();
  }, []);

  const initializeScene = () => {
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const loader = new GLTFLoader();
    loader.load(
      "/pizza.glb",
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5);

        // Randomly position the model within a certain range
        const randomX = Math.random() * 2 - 1; // Random value between -1 and 1
        const randomY = Math.random() * 2 - 1; // Random value between -1 and 1
        const randomZ = Math.random() * 2 - 1; // Random value between -1 and 1
        model.position.set(randomX, randomY, randomZ);

        modelRef.current = model;
        setStatus("Model loaded, point camera at marker");
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
        setStatus("Error loading model");
      }
    );

    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const aScene = document.querySelector("a-scene");
    if (aScene) {
      aScene.object3D.add(scene);
    }

    const handleMarkerFound = () => {
      if (modelRef.current && !scene.children.includes(modelRef.current)) {
        scene.add(modelRef.current);
        setStatus("Model placed on marker");
      }
    };

    const handleMarkerLost = () => {
      setStatus("Marker lost, please scan again");
    };

    const markerElement = document.querySelector("a-marker");
    if (markerElement) {
      markerElement.addEventListener("markerFound", handleMarkerFound);
      markerElement.addEventListener("markerLost", handleMarkerLost);
    }

    aScene?.addEventListener("loaded", () => {
      const arComponent = aScene.components["arjs"];
      if (!arComponent) {
        setStatus("AR.js failed to initialize");
      }
    });
  };

  const cleanup = () => {
    const markerElement = document.querySelector("a-marker");
    if (markerElement) {
      markerElement.removeEventListener("markerFound", () => {});
      markerElement.removeEventListener("markerLost", () => {});
    }
    if (sceneRef.current) {
      sceneRef.current = null;
    }
  };

  return (
    <div className="relative">
      <a-scene
        embedded
        arjs="sourceType: webcam; trackingMethod: best; patternRatio: 0.9;"
        vr-mode-ui="enabled: false"
        renderer="antialias: true; alpha: true;"
      >
        <a-marker preset="hiro">
          {/* The 3D model will be added here when marker is detected */}
        </a-marker>
        <a-camera position="0 1.6 0" look-controls="enabled: false"></a-camera>
      </a-scene>
      <div className="p-4 flex flex-col items-center absolute top-0 left-0 w-full z-10">
        <h1 className="text-xl font-bold mb-4 text-white">AR.js Marker Viewer</h1>
        <p className="text-gray-200">Point your camera at a Hiro marker</p>
        <p className="text-blue-300">{status}</p>
      </div>
    </div>
  );
};

export default ARjsViewer;
