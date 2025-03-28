import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"; // Added for Draco compression
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";
import { useParams, useLocation } from "react-router-dom";

const WebXRARViewer = () => {
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const containerRef = useRef(null); // Added to manage DOM element
  const [modelPlaced, setModelPlaced] = useState(false);
  const modelRef = useRef(null);
  const reticleRef = useRef(null);
  const [dishData, setDishData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadProgress, setLoadProgress] = useState(0); // Added for loading feedback
  const isInitializedRef = useRef(false); // Prevent multiple scene initializations

  // Target size for normalization (in meters)
  const TARGET_SIZE = 0.5;

  // Get dish ID from URL params or location state
  const { id } = useParams();
  const location = useLocation();
  const dishFromState = location.state?.dish;

  // API base URL
  const API_BASE_URL = process.env.REACT_APP_BASE_URL; // Update to match your server

  // Function to normalize model size
  const normalizeModelSize = (model) => {
    const boundingBox = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    boundingBox.getSize(size);

    const maxDimension = Math.max(size.x, size.y, size.z);
    const scaleFactor = TARGET_SIZE / maxDimension;

    model.scale.multiplyScalar(scaleFactor);

    console.log(`Model normalized: Original max dimension: ${maxDimension}, Scale factor: ${scaleFactor}`);

    boundingBox.setFromObject(model);
    boundingBox.getSize(size);
    const offsetY = -boundingBox.min.y;
    model.position.y = offsetY;

    return model;
  };

  // Preload the 3D model
  const preloadModel = (arModelFileId) => {
    if (!arModelFileId) return;

    const modelUrl = `${API_BASE_URL}/api/Dish/armodel/${arModelFileId}`;
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/"); // CDN for Draco decoder
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      modelUrl,
      (gltf) => {
        const model = normalizeModelSize(gltf.scene);
        modelRef.current = model;
        setLoadProgress(100);
        console.log("Model loaded successfully:", arModelFileId);
      },
      (xhr) => {
        const progress = Math.round((xhr.loaded / xhr.total) * 100);
        setLoadProgress(progress);
      },
      (err) => {
        console.error(`Error loading model from ${modelUrl}:`, err);
        // Load fallback model
        loader.load(
          "/pizza.glb", // Ensure this file is in your public folder
          (gltf) => {
            const model = normalizeModelSize(gltf.scene);
            modelRef.current = model;
            setLoadProgress(100);
            console.log("Fallback model loaded");
          },
          (xhr) => setLoadProgress(Math.round((xhr.loaded / xhr.total) * 100)),
          (err) => console.error("Fallback model failed to load:", err)
        );
      }
    );
  };

  // Fetch dish data and preload model
  useEffect(() => {
    if (dishFromState) {
      setDishData(dishFromState);
      preloadModel(dishFromState.arModelFileId);
      setLoading(false);
    } else if (id) {
      fetch(`${API_BASE_URL}/api/Dish/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch dish data: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setDishData(data);
          preloadModel(data.arModelFileId);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching dish data:", err);
          setError(err.message);
          setLoading(false);
        });
    } else {
      setError("No dish ID provided");
      setLoading(false);
    }
  }, [id, dishFromState]);

  // Initialize WebXR scene once data and model are ready
  useEffect(() => {
    if (dishData && !loading && loadProgress === 100 && !isInitializedRef.current) {
      initializeScene();
      isInitializedRef.current = true;
    }

    
  }, [dishData, loading, loadProgress]);

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
    try {
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;
      containerRef.current.appendChild(renderer.domElement); // Use containerRef instead of document.body
      rendererRef.current = renderer;
    } catch (err) {
      console.error("Failed to initialize WebGL:", err);
      setError("Unable to initialize WebGL. Your device or browser may not support it.");
      return;
    }

    // AR Button
    const arButton = ARButton.createButton(renderer, {
      requiredFeatures: ["hit-test"],
      optionalFeatures: ["dom-overlay"],
      domOverlay: { root: document.body },
    });

    arButton.style.position = "absolute";
arButton.style.bottom = "80px"; // Adjust this value to move it up
arButton.style.left = "50%";
arButton.style.transform = "translateX(-3%)";

    
    document.body.appendChild(arButton);

    renderer.xr.addEventListener("sessionend", () => {
      console.log("WebXR session ended, navigating back...");
      window.history.back(); // Navigate to the previous page
    });
    

    // Lighting
    const light = new THREE.AmbientLight(0xffffff, 0.8); // Reduced intensity for efficiency
    scene.add(light);

    // Reticle
    const reticle = new THREE.Mesh(
      new THREE.RingGeometry(0.15, 0.2, 32),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.1,
      })
    );
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    reticle.rotation.x = -Math.PI / 2;
    scene.add(reticle);
    reticleRef.current = reticle;

    // Add preloaded model if available
    if (modelRef.current) {
      scene.add(modelRef.current);
    }

    // XR session setup
    renderer.xr.addEventListener("sessionstart", () => {
      const session = renderer.xr.getSession();
      session.addEventListener("select", onSelect);
    });

    const animate = () => {
      renderer.setAnimationLoop((timestamp, frame) => {
        if (frame && !modelPlaced) {
          render(timestamp, frame); // Only run hit-test logic when needed
        } else {
          renderer.render(scene, camera); // Simple render otherwise
        }
      });
    };

    function render(timestamp, frame) {
      const referenceSpace = renderer.xr.getReferenceSpace();
      const session = renderer.xr.getSession();

      if (session && !modelPlaced) {
        session.requestReferenceSpace("viewer").then((viewerReferenceSpace) => {
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

      renderer.render(scene, camera);
    }

    function onSelect() {
      if (reticleRef.current.visible && !modelPlaced) {
        const model = modelRef.current;
        if (model) {
          model.position.setFromMatrixPosition(reticleRef.current.matrix);
          model.quaternion.setFromRotationMatrix(reticleRef.current.matrix);
          scene.add(model);
          setModelPlaced(true);
          reticleRef.current.visible = false;
        }
      }
    }

    animate();

    // Cleanup
    return () => {
      if (rendererRef.current) {
        rendererRef.current.dispose();
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      if (document.querySelector('button[data-ar]')) {
        document.body.removeChild(document.querySelector('button[data-ar]'));
      }
    };
  };

  // Render logic
  if (loading || loadProgress < 100) {
    return (
      <div className="p-4 flex flex-col items-center">
        <h1 className="text-xl font-bold mb-4">Loading Model...</h1>
        <p>{loadProgress}%</p>
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
    <div ref={containerRef} className="p-4 flex flex-col items-center fixed inset-0 overflow-hidden">
      <h1 className="text-xl font-bold mb-4">
        {dishData?.name ? `${dishData.name} in AR` : "WebXR AR 3D Model Viewer"}
      </h1>
      <p className="text-gray-600">
        Point your camera at a flat surface and tap to place the 3D model.
      </p>
      <div className="mt-4 text-sm text-gray-500">
        Models are automatically sized to appear similar regardless of actual dimensions.
      </div>
    </div>
  );
};

export default WebXRARViewer;