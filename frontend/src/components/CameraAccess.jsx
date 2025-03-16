import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";
import { useParams, useLocation } from "react-router-dom";

const WebXRARViewer = () => {
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const [modelPlaced, setModelPlaced] = useState(false);
  const modelRef = useRef(null);
  const reticleRef = useRef(null);
  const [dishData, setDishData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get dish ID from URL params or location state
  const { id } = useParams();
  const location = useLocation();
  const dishFromState = location.state?.dish;
  
  // Fetch dish data if not provided in location state
  useEffect(() => {
    if (dishFromState) {
      setDishData(dishFromState);
      setLoading(false);
    } else if (id) {
      fetch(`https://192.168.1.6:8080/api/Dish/${id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to fetch dish data: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          setDishData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching dish data:", err);
          setError(err.message);
          setLoading(false);
        });
    } else {
      setError("No dish ID provided");
      setLoading(false);
    }
  }, [id, dishFromState]);

  // Initialize WebXR scene once we have the dish data
  useEffect(() => {
    if (dishData && !loading) {
      initializeScene();
    }
  }, [dishData, loading]);

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

    // Create a custom AR button with specific session configuration
    const arButton = ARButton.createButton(renderer, {
      requiredFeatures: ['hit-test'],  // Request hit-test feature
      optionalFeatures: ['dom-overlay'],
      domOverlay: { root: document.body }
    });
    document.body.appendChild(arButton);

    // Lighting
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create a nearly transparent reticle
    const reticle = new THREE.Mesh(
      new THREE.RingGeometry(0.15, 0.2, 32),
      new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.1  // Very low opacity - almost invisible
      })
    );
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    reticle.rotation.x = -Math.PI / 2; // Rotate to be flat/horizontal
    scene.add(reticle); 
    reticleRef.current = reticle;

    // Load 3D Model using arModelFileId from the dish data
    if (dishData && dishData.arModelFileId) {
      // Construct the URL to fetch the actual 3D model file using the arModelFileId
      const modelUrl = `https://192.168.1.6:8080/api/Files/${dishData.arModelFileId}`;
      
      console.log("Loading 3D model from:", modelUrl);
      
      const loader = new GLTFLoader();
      loader.load(
        modelUrl,
        (gltf) => {
          const model = gltf.scene;
          model.scale.set(0.5, 0.5, 0.5);
          modelRef.current = model; // Store the model for later placement
          console.log("Model loaded successfully:", dishData.arModelFileId);
        },
        (xhr) => {
          console.log(`Model loading: ${(xhr.loaded / xhr.total) * 100}% loaded`);
        },
        (error) => {
          console.error(`Error loading model from ${modelUrl}:`, error);
          // Fallback to a default model if the specific one fails to load
          loader.load(
            '/pizza.glb', // Your fallback model
            (gltf) => {
              const model = gltf.scene;
              model.scale.set(0.5, 0.5, 0.5);
              modelRef.current = model;
              console.log("Fallback model loaded");
            },
            undefined,
            (err) => console.error("Even fallback model failed to load:", err)
          );
        }
      );
    } else {
      console.error("No AR model ID found in dish data");
    }

    // XR session hit test setup
    renderer.xr.addEventListener('sessionstart', () => {
      const session = renderer.xr.getSession();
      session.addEventListener('select', onSelect);
    });
    
    const animate = () => {
      renderer.setAnimationLoop(render);
    };
    
    function render(timestamp, frame) {
      if (frame) {
        const referenceSpace = renderer.xr.getReferenceSpace();
        const session = renderer.xr.getSession();

        if (session && !modelPlaced) {
          // Perform hit test only if model hasn't been placed yet
          session.requestReferenceSpace('viewer').then((viewerReferenceSpace) => {
            session.requestHitTestSource({ space: viewerReferenceSpace }).then((hitTestSource) => {
              session.requestAnimationFrame((time, frame) => {
                const hitTestResults = frame.getHitTestResults(hitTestSource);
                
                if (hitTestResults.length > 0) {
                  const hit = hitTestResults[0];
                  const pose = hit.getPose(referenceSpace);
                  
                  if (pose) {
                    reticleRef.current.visible = true;
                    reticleRef.current.matrix.fromArray(pose.transform.matrix);
                  }
                } else {
                  reticleRef.current.visible = false;
                }
              });
            });
          });
        }
      }
      
      renderer.render(scene, camera);
    }
    
    // Function to handle user tap when in AR
    function onSelect() {
      if (reticleRef.current.visible && !modelPlaced) {
        // Place the model at the reticle's position
        const model = modelRef.current;
        if (model) {
          model.position.setFromMatrixPosition(reticleRef.current.matrix);
          model.quaternion.setFromRotationMatrix(reticleRef.current.matrix);
          scene.add(model);
          setModelPlaced(true);
          reticleRef.current.visible = false; // Hide the reticle after placement
        }
      }
    }

    animate();
    
    // Cleanup function
    return () => {
      if (rendererRef.current) {
        rendererRef.current.dispose();
        document.body.removeChild(rendererRef.current.domElement);
      }
      if (document.querySelector('button[data-ar]')) {
        document.body.removeChild(document.querySelector('button[data-ar]'));
      }
    };
  };

  if (loading) {
    return (
      <div className="p-4 flex flex-col items-center">
        <h1 className="text-xl font-bold mb-4">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 flex flex-col items-center">
        <h1 className="text-xl font-bold mb-4">Error</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-xl font-bold mb-4">
        {dishData?.name ? `${dishData.name} in AR` : "WebXR AR 3D Model Viewer"}
      </h1>
      <p className="text-gray-600">
        Point your camera at a flat surface and tap to place the 3D model.
      </p>
    </div>
  );
};

export default WebXRARViewer; 