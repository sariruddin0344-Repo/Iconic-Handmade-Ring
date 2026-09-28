import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { MetalType, GemType, RingStyle } from '../types';
import { RotateCw, ZoomIn, ZoomOut, Sparkles, Eye, ShieldAlert } from 'lucide-react';

interface ThreeRingViewerProps {
  ringStyle?: RingStyle;
  metal?: MetalType;
  gem?: GemType;
  autoRotate?: boolean;
  engraving?: string;
  interactive?: boolean;
  className?: string;
  showControls?: boolean;
  height?: string;
}

export const ThreeRingViewer: React.FC<ThreeRingViewerProps> = ({
  ringStyle = 'solitaire',
  metal = 'platinum',
  gem = 'diamond',
  autoRotate = true,
  interactive = true,
  className = '',
  showControls = true,
  height = '520px',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const ringGroupRef = useRef<THREE.Group | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Interaction tracking state
  const isDraggingRef = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0.3, y: 0.4 });
  const currentRotation = useRef({ x: 0.3, y: 0.4 });
  const targetZoom = useRef(4.6);
  const currentZoom = useRef(4.6);
  const autoRotateSpeed = useRef(0.005);
  const isHoveredRef = useRef(false);

  const [isRotating, setIsRotating] = useState(autoRotate);
  const [isWireframe, setIsWireframe] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<'standard' | 'macro'>('standard');
  const [webglSupported, setWebglSupported] = useState(true);

  // Generate realistic studio reflection environment texture
  const createStudioEnvironment = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Deep luxury dark background
    ctx.fillStyle = '#0a0a0e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Soft overhead main softbox light (warm white)
    const grad1 = ctx.createLinearGradient(0, 0, 0, 180);
    grad1.addColorStop(0, 'rgba(255, 248, 230, 0.95)');
    grad1.addColorStop(0.5, 'rgba(240, 230, 210, 0.6)');
    grad1.addColorStop(1, 'rgba(10, 10, 14, 0)');
    ctx.fillStyle = grad1;
    ctx.fillRect(250, 0, 524, 180);

    // Left cool rim strip (silver edge)
    const grad2 = ctx.createLinearGradient(0, 150, 200, 350);
    grad2.addColorStop(0, 'rgba(210, 230, 255, 0.8)');
    grad2.addColorStop(1, 'rgba(10, 10, 14, 0)');
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 100, 200, 300);

    // Right warm accent strip (gold specular edge)
    const grad3 = ctx.createLinearGradient(824, 150, 1024, 350);
    grad3.addColorStop(0, 'rgba(255, 215, 120, 0.7)');
    grad3.addColorStop(1, 'rgba(10, 10, 14, 0)');
    ctx.fillStyle = grad3;
    ctx.fillRect(824, 100, 200, 300);

    // Subtle floor bounce glow
    const gradFloor = ctx.createRadialGradient(512, 450, 10, 512, 450, 300);
    gradFloor.addColorStop(0, 'rgba(180, 190, 210, 0.25)');
    gradFloor.addColorStop(1, 'rgba(10, 10, 14, 0)');
    ctx.fillStyle = gradFloor;
    ctx.fillRect(200, 350, 624, 162);

    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    return texture;
  }, []);

  // Material builder helper
  const getMetalMaterial = useCallback(
    (metalType: MetalType, envMap: THREE.Texture | null, wireframe: boolean) => {
      let color = 0xe5e7eb;
      let roughness = 0.14;
      let metalness = 0.96;
      let clearcoat = 0.4;
      let clearcoatRoughness = 0.1;

      switch (metalType) {
        case 'gold':
          color = 0xdeb841; // 18k radiant warm yellow gold
          roughness = 0.15;
          metalness = 0.95;
          break;
        case 'platinum':
          color = 0xf0f3f6; // 950 Platinum brilliant luster
          roughness = 0.1;
          metalness = 0.98;
          break;
        case 'rosegold':
          color = 0xdf9f8b; // Warm rose blush gold
          roughness = 0.16;
          metalness = 0.92;
          break;
        case 'black':
          color = 0x18191d; // Deep satin black titanium / gunmetal
          roughness = 0.25;
          metalness = 0.88;
          clearcoat = 0.2;
          break;
      }

      return new THREE.MeshPhysicalMaterial({
        color,
        roughness,
        metalness,
        clearcoat,
        clearcoatRoughness,
        envMap,
        envMapIntensity: metalType === 'black' ? 1.2 : 2.4,
        wireframe,
      });
    },
    [],
  );

  const getGemMaterial = useCallback(
    (gemType: GemType, envMap: THREE.Texture | null, wireframe: boolean) => {
      let color = 0xffffff;
      let transmission = 0.92;
      let roughness = 0.02;
      let ior = 2.417; // Diamond IOR
      let metalness = 0.05;
      let envMapIntensity = 3.2;

      switch (gemType) {
        case 'diamond':
          color = 0xfbfdff;
          transmission = 0.94;
          roughness = 0.015;
          ior = 2.417;
          break;
        case 'sapphire':
          color = 0x0f3478;
          transmission = 0.78;
          roughness = 0.04;
          ior = 1.77;
          break;
        case 'emerald':
          color = 0x096a3a;
          transmission = 0.72;
          roughness = 0.06;
          ior = 1.58;
          break;
        case 'ruby':
          color = 0x9b0826;
          transmission = 0.78;
          roughness = 0.04;
          ior = 1.76;
          break;
        case 'onyx':
          color = 0x050507;
          transmission = 0.0;
          roughness = 0.08;
          metalness = 0.1;
          ior = 1.5;
          envMapIntensity = 1.6;
          break;
        case 'none':
          color = 0x111115;
          transmission = 0;
          break;
      }

      return new THREE.MeshPhysicalMaterial({
        color,
        transmission,
        opacity: 1,
        transparent: gemType !== 'onyx' && gemType !== 'none',
        roughness,
        ior,
        metalness,
        reflectivity: 0.9,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        envMap,
        envMapIntensity,
        wireframe,
        flatShading: gemType !== 'onyx',
      });
    },
    [],
  );

  // Build Procedural 3D Ring Mesh
  const buildRingModel = useCallback(
    (
      style: RingStyle,
      metalType: MetalType,
      gemType: GemType,
      envMap: THREE.Texture | null,
      wireframe: boolean,
    ) => {
      const group = new THREE.Group();
      const metalMat = getMetalMaterial(metalType, envMap, wireframe);
      const gemMat = getGemMaterial(gemType, envMap, wireframe);

      // Gold accent material for dual-tone details
      const goldAccentMat = getMetalMaterial('gold', envMap, wireframe);

      if (style === 'solitaire') {
        // --- 1. SOLITAIRE RING ---
        // Main Band: Torus with slight oval cross-section
        const bandGeo = new THREE.TorusGeometry(1.35, 0.16, 36, 120);
        const bandMesh = new THREE.Mesh(bandGeo, metalMat);
        bandMesh.rotation.x = Math.PI / 2;
        group.add(bandMesh);

        // Cathedral shoulders (arches leading up to crown)
        const shoulderGeo = new THREE.CylinderGeometry(0.12, 0.18, 0.65, 24);
        const leftShoulder = new THREE.Mesh(shoulderGeo, metalMat);
        leftShoulder.position.set(-0.35, 1.25, 0);
        leftShoulder.rotation.z = -Math.PI / 6;
        group.add(leftShoulder);

        const rightShoulder = new THREE.Mesh(shoulderGeo, metalMat);
        rightShoulder.position.set(0.35, 1.25, 0);
        rightShoulder.rotation.z = Math.PI / 6;
        group.add(rightShoulder);

        // Gemstone Crown Collar (Bezel basket)
        const collarGeo = new THREE.CylinderGeometry(0.58, 0.38, 0.28, 32);
        const collarMesh = new THREE.Mesh(collarGeo, metalMat);
        collarMesh.position.set(0, 1.48, 0);
        group.add(collarMesh);

        // 4 Micro-Prongs
        const prongGeo = new THREE.CylinderGeometry(0.04, 0.048, 0.58, 16);
        const prongAngles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
        prongAngles.forEach((angle) => {
          const prong = new THREE.Mesh(prongGeo, metalMat);
          const px = Math.cos(angle) * 0.44;
          const pz = Math.sin(angle) * 0.44;
          prong.position.set(px, 1.7, pz);
          prong.rotation.x = -pz * 0.2;
          prong.rotation.z = px * 0.2;
          group.add(prong);
        });

        // Faceted Gemstone (Brilliant Cut Polyhedron)
        if (gemType !== 'none') {
          const gemGeo = new THREE.OctahedronGeometry(0.54, 2);
          // Scale slightly on Y for high-jewelry pavilion & table proportion
          gemGeo.scale(1.0, 0.85, 1.0);
          const gemMesh = new THREE.Mesh(gemGeo, gemMat);
          gemMesh.position.set(0, 1.72, 0);
          gemMesh.rotation.y = Math.PI / 8;
          group.add(gemMesh);

          // Subtle diamond inner table light bounce
          const lightGeo = new THREE.DodecahedronGeometry(0.24, 0);
          const innerSpark = new THREE.Mesh(
            lightGeo,
            new THREE.MeshBasicMaterial({
              color: 0xffffff,
              wireframe: true,
              transparent: true,
              opacity: 0.35,
            }),
          );
          innerSpark.position.set(0, 1.72, 0);
          group.add(innerSpark);
        }
      } else if (style === 'signet') {
        // --- 2. THE SOVEREIGN SIGNET ---
        // Substantial tapered band
        const bandGeo = new THREE.TorusGeometry(1.3, 0.22, 32, 100);
        const bandMesh = new THREE.Mesh(bandGeo, metalMat);
        bandMesh.rotation.x = Math.PI / 2;
        group.add(bandMesh);

        // Sculpted crown base
        const crownBaseGeo = new THREE.CylinderGeometry(0.85, 0.5, 0.55, 8);
        const crownBase = new THREE.Mesh(crownBaseGeo, metalMat);
        crownBase.position.set(0, 1.35, 0);
        group.add(crownBase);

        // Signet Seal Face Platform (Octagonal or Oval Shield)
        const sealFaceGeo = new THREE.CylinderGeometry(0.88, 0.82, 0.14, 8);
        const sealFace = new THREE.Mesh(sealFaceGeo, metalMat);
        sealFace.position.set(0, 1.62, 0);
        group.add(sealFace);

        // Inner Inset Tablet (Onyx or Gold Crest)
        if (gemType === 'onyx' || gemType === 'diamond' || gemType === 'sapphire') {
          const inlayGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.08, 8);
          const inlay = new THREE.Mesh(inlayGeo, gemMat);
          inlay.position.set(0, 1.68, 0);
          group.add(inlay);

          // Golden emblem / star monogram in the center
          const crestGeo = new THREE.OctahedronGeometry(0.18, 0);
          const crest = new THREE.Mesh(crestGeo, goldAccentMat);
          crest.position.set(0, 1.74, 0);
          crest.rotation.y = Math.PI / 4;
          crest.scale.set(1.0, 0.25, 1.0);
          group.add(crest);
        } else {
          // Hand-engraved heraldic texture plate
          const plateGeo = new THREE.TorusGeometry(0.45, 0.06, 16, 32);
          const plate = new THREE.Mesh(plateGeo, goldAccentMat);
          plate.rotation.x = Math.PI / 2;
          plate.position.set(0, 1.7, 0);
          group.add(plate);
        }
      } else if (style === 'eternity') {
        // --- 3. THE CELESTIAL ETERNITY BAND ---
        // Channel band
        const bandGeo = new THREE.TorusGeometry(1.35, 0.19, 36, 120);
        const bandMesh = new THREE.Mesh(bandGeo, metalMat);
        bandMesh.rotation.x = Math.PI / 2;
        group.add(bandMesh);

        // 18 micro pave gemstones embedded around the perimeter
        const stoneCount = 18;
        const radius = 1.38;
        for (let i = 0; i < stoneCount; i++) {
          const angle = (i / stoneCount) * Math.PI * 2;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;

          // Gemstone
          const stoneGeo = new THREE.OctahedronGeometry(0.12, 1);
          const stoneMesh = new THREE.Mesh(stoneGeo, gemMat);
          stoneMesh.position.set(x, 0, z);
          stoneMesh.rotation.y = angle;
          stoneMesh.rotation.x = Math.PI / 2;
          group.add(stoneMesh);

          // Micro-prong beads between stones
          const beadGeo = new THREE.SphereGeometry(0.045, 12, 12);
          const beadMesh = new THREE.Mesh(beadGeo, metalMat);
          const beadAngle = angle + (Math.PI * 2) / (stoneCount * 2);
          beadMesh.position.set(Math.cos(beadAngle) * 1.48, 0.12, Math.sin(beadAngle) * 1.48);
          group.add(beadMesh);

          const beadMesh2 = beadMesh.clone();
          beadMesh2.position.y = -0.12;
          group.add(beadMesh2);
        }
      } else {
        // --- 4. THE MOLTEN NAUTILUS WAVE ---
        // Organic undulating torus
        const waveGeo = new THREE.TorusGeometry(1.35, 0.22, 40, 140);
        const pos = waveGeo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const vx = pos.getX(i);
          const vy = pos.getY(i);
          const vz = pos.getZ(i);
          const angle = Math.atan2(vy, vx);
          // Modulate with organic wave
          const waveOffset = Math.sin(angle * 3) * 0.18 + Math.cos(angle * 5) * 0.08;
          pos.setZ(i, vz + waveOffset);
        }
        waveGeo.computeVertexNormals();

        const waveMesh = new THREE.Mesh(waveGeo, metalMat);
        waveMesh.rotation.x = Math.PI / 2;
        group.add(waveMesh);

        // Gold inlay crest line
        const crestGeo = new THREE.TorusGeometry(1.36, 0.05, 16, 120);
        const crestMesh = new THREE.Mesh(crestGeo, goldAccentMat);
        crestMesh.rotation.x = Math.PI / 2;
        group.add(crestMesh);

        // Tension-set accent gem in crest
        if (gemType !== 'none') {
          const accentGeo = new THREE.OctahedronGeometry(0.24, 2);
          const accent = new THREE.Mesh(accentGeo, gemMat);
          accent.position.set(0, 1.42, 0.2);
          group.add(accent);
        }
      }

      return group;
    },
    [getMetalMaterial, getGemMaterial],
  );

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    const width = container.clientWidth || 600;
    const heightPx = container.clientHeight || 520;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(38, width / heightPx, 0.1, 100);
    camera.position.set(0, 1.2, targetZoom.current);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // Environment & Lighting
    const studioEnv = createStudioEnvironment();
    if (studioEnv) {
      scene.environment = studioEnv;
    }

    // 1. Warm Golden Key Light
    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.6);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    // 2. Cool Platinum Fill Light
    const fillLight = new THREE.DirectionalLight(0xdbe6ff, 1.8);
    fillLight.position.set(-5, 3, 3);
    scene.add(fillLight);

    // 3. Sharp Back Rim Light for metallic outline
    const rimLight = new THREE.DirectionalLight(0xffe6aa, 3.0);
    rimLight.position.set(0, -3, -5);
    scene.add(rimLight);

    // 4. Crown Spot Light for gemstone sparkles
    const crownSpot = new THREE.SpotLight(0xffffff, 4.0, 10, Math.PI / 5, 0.3);
    crownSpot.position.set(0, 5, 2);
    crownSpot.target.position.set(0, 1.5, 0);
    scene.add(crownSpot);
    scene.add(crownSpot.target);

    // 5. Subtle ambient base
    const ambient = new THREE.AmbientLight(0x18181f, 1.0);
    scene.add(ambient);

    // Initial Model Build
    const initialRing = buildRingModel(ringStyle, metal, gem, studioEnv, isWireframe);
    scene.add(initialRing);
    ringGroupRef.current = initialRing;

    // WebGL Context Lost / Restored Handler
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };

    const handleContextRestored = () => {
      // Re-initialize scene if needed
    };

    const canvasEl = renderer.domElement;
    canvasEl.addEventListener('webglcontextlost', handleContextLost, false);
    canvasEl.addEventListener('webglcontextrestored', handleContextRestored, false);

    // Animation Loop with smooth inertial damping
    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);

      if (ringGroupRef.current && cameraRef.current) {
        // Auto-rotation if enabled and not currently dragging
        if (isRotating && !isDraggingRef.current) {
          targetRotation.current.y += autoRotateSpeed.current;
        }

        // Smooth Lerp Rotation
        currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.08;
        currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.08;

        ringGroupRef.current.rotation.x = currentRotation.current.x;
        ringGroupRef.current.rotation.y = currentRotation.current.y;

        // Subtle floating breathing motion
        const time = performance.now() * 0.0015;
        ringGroupRef.current.position.y = Math.sin(time) * 0.06;

        // Smooth Lerp Camera Zoom
        currentZoom.current += (targetZoom.current - currentZoom.current) * 0.1;
        cameraRef.current.position.z = currentZoom.current;
        cameraRef.current.lookAt(0, 0.2, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvasEl.removeEventListener('webglcontextlost', handleContextLost);
      canvasEl.removeEventListener('webglcontextrestored', handleContextRestored);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        if (container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
      }
    };
  }, [createStudioEnvironment, buildRingModel]);

  // Re-build mesh whenever style, metal, gem or wireframe changes
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    if (ringGroupRef.current) {
      scene.remove(ringGroupRef.current);
      // Clean up geometries and materials
      ringGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    }

    const envMap = scene.environment;
    const newRing = buildRingModel(ringStyle, metal, gem, envMap, isWireframe);
    scene.add(newRing);
    ringGroupRef.current = newRing;
  }, [ringStyle, metal, gem, isWireframe, buildRingModel]);

  // Mouse & Touch Controls
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    isDraggingRef.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !interactive) return;

    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    targetRotation.current.y += deltaX * 0.008;
    targetRotation.current.x += deltaY * 0.008;

    // Clamp vertical tilt so ring doesn't flip completely upside down
    targetRotation.current.x = Math.max(-1.1, Math.min(1.1, targetRotation.current.x));

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!interactive) return;
    e.preventDefault();
    targetZoom.current = Math.max(3.2, Math.min(6.5, targetZoom.current + e.deltaY * 0.003));
  };

  // Touch Handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!interactive || e.touches.length === 0) return;
    isDraggingRef.current = true;
    previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !interactive || e.touches.length === 0) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - previousMousePosition.current.x;
    const deltaY = touch.clientY - previousMousePosition.current.y;

    targetRotation.current.y += deltaX * 0.01;
    targetRotation.current.x += deltaY * 0.01;
    targetRotation.current.x = Math.max(-1.1, Math.min(1.1, targetRotation.current.x));

    previousMousePosition.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  const toggleZoom = () => {
    if (zoomLevel === 'standard') {
      targetZoom.current = 3.4;
      setZoomLevel('macro');
    } else {
      targetZoom.current = 4.6;
      setZoomLevel('standard');
    }
  };

  const resetView = () => {
    targetRotation.current = { x: 0.3, y: 0.4 };
    targetZoom.current = 4.6;
    setZoomLevel('standard');
  };

  return (
    <div
      className={`relative w-full overflow-hidden select-none ${className}`}
      style={{ height }}
      onMouseEnter={() => (isHoveredRef.current = true)}
      onMouseLeave={() => {
        isHoveredRef.current = false;
        isDraggingRef.current = false;
      }}
    >
      {/* Fallback container if WebGL unavailable */}
      {!webglSupported && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0c0c10] p-6 text-center">
          <ShieldAlert className="w-10 h-10 text-[#d4af37] mb-3" />
          <h4 className="text-sm font-semibold tracking-wider uppercase text-white mb-1">
            3D Studio Preview
          </h4>
          <p className="text-xs text-zinc-400 max-w-xs">
            WebGL hardware acceleration is restricted. Please enable WebGL to inspect the ring in 360°.
          </p>
        </div>
      )}

      {/* 3D Canvas Mount */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      />

      {/* Luxury Ambient Lighting Glow overlay (Subtle vignette) */}
      <div className="pointer-events-none absolute inset-0 bg-radial from-transparent via-black/10 to-[#08080a]/90" />

      {/* Interactive Helper Hint */}
      <div className="pointer-events-none absolute bottom-4 left-6 flex items-center gap-2 text-xs text-zinc-400 font-light tracking-wide">
        <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
        <span>Drag to rotate 360° · Scroll to zoom</span>
      </div>

      {/* Floating HUD Controls */}
      {showControls && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 p-1 bg-black/50 backdrop-blur-md rounded-lg border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setIsRotating((prev) => !prev)}
            title={isRotating ? 'Pause rotation' : 'Resume auto-rotation'}
            className={`p-2 rounded-md transition-all ${
              isRotating
                ? 'text-[#d4af37] bg-white/10'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
          </button>

          <button
            type="button"
            onClick={toggleZoom}
            title={zoomLevel === 'standard' ? 'Macro Zoom (Inspect details)' : 'Standard View'}
            className={`p-2 rounded-md transition-all ${
              zoomLevel === 'macro'
                ? 'text-[#d4af37] bg-white/10'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {zoomLevel === 'macro' ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => setIsWireframe((prev) => !prev)}
            title="Toggle Wireframe Mesh"
            className={`p-2 rounded-md transition-all ${
              isWireframe
                ? 'text-[#d4af37] bg-white/10'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={resetView}
            title="Reset Orientation"
            className="px-2.5 py-1.5 text-[11px] font-medium text-zinc-300 hover:text-white rounded hover:bg-white/5 transition-colors"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};
