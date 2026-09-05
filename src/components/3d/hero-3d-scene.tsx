'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Sparkles, Eye, Maximize2, ShieldCheck, Zap } from 'lucide-react';

export function Hero3DScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [neonMode, setNeonMode] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activePreset, setActivePreset] = useState<'kettlebell' | 'dumbbell'>('dumbbell');

  // References for three.js objects to allow dynamic updates
  const sceneRef = useRef<THREE.Scene | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const rimLightRef = useRef<THREE.PointLight | null>(null);
  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 4.5);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x34d399, 1.4);
    fillLight.position.set(-4, -2, -2);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x10b981, 4, 10);
    rimLight.position.set(0, -1, 2);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    // 5. Build 3D Sports Model Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Materials
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0xd8d8d8,
      metalness: 0.92,
      roughness: 0.18,
    });

    const rubberMaterial = new THREE.MeshStandardMaterial({
      color: 0x181e1a,
      roughness: 0.75,
      metalness: 0.15,
    });

    const accentMaterial = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.3,
      metalness: 0.4,
      emissive: 0x059669,
      emissiveIntensity: 0.6,
    });

    // Helper to build Dumbbell
    function createDumbbell() {
      const dumbbell = new THREE.Group();

      // Steel Bar
      const barGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.6, 32);
      barGeo.rotateZ(Math.PI / 2);
      const barMesh = new THREE.Mesh(barGeo, metalMaterial);
      barMesh.castShadow = true;
      dumbbell.add(barMesh);

      // Grip Knurling rings
      for (let i = -0.5; i <= 0.5; i += 0.25) {
        const ringGeo = new THREE.TorusGeometry(0.085, 0.008, 16, 32);
        ringGeo.rotateY(Math.PI / 2);
        const ring = new THREE.Mesh(ringGeo, accentMaterial);
        ring.position.x = i;
        dumbbell.add(ring);
      }

      // Left & Right Weights (Hexagonal Plates)
      const plateSides = [-1, 1];
      plateSides.forEach((side) => {
        // Inner collar
        const collarGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.08, 24);
        collarGeo.rotateZ(Math.PI / 2);
        const collar = new THREE.Mesh(collarGeo, metalMaterial);
        collar.position.x = side * 0.75;
        collar.castShadow = true;
        dumbbell.add(collar);

        // Big Hex Plate 1
        const plateGeo1 = new THREE.CylinderGeometry(0.65, 0.65, 0.25, 6);
        plateGeo1.rotateZ(Math.PI / 2);
        const plate1 = new THREE.Mesh(plateGeo1, rubberMaterial);
        plate1.position.x = side * 0.95;
        plate1.castShadow = true;
        plate1.receiveShadow = true;
        dumbbell.add(plate1);

        // Accent Ring on plate
        const plateRingGeo = new THREE.TorusGeometry(0.55, 0.02, 16, 6);
        plateRingGeo.rotateY(Math.PI / 2);
        const plateRing = new THREE.Mesh(plateRingGeo, accentMaterial);
        plateRing.position.x = side * 1.08;
        dumbbell.add(plateRing);

        // Outer Plate 2
        const plateGeo2 = new THREE.CylinderGeometry(0.55, 0.55, 0.2, 6);
        plateGeo2.rotateZ(Math.PI / 2);
        const plate2 = new THREE.Mesh(plateGeo2, rubberMaterial);
        plate2.position.x = side * 1.2;
        plate2.castShadow = true;
        dumbbell.add(plate2);

        // End Cap
        const capGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.05, 24);
        capGeo.rotateZ(Math.PI / 2);
        const cap = new THREE.Mesh(capGeo, accentMaterial);
        cap.position.x = side * 1.32;
        dumbbell.add(cap);
      });

      return dumbbell;
    }

    // Helper to build Kettlebell
    function createKettlebell() {
      const kb = new THREE.Group();

      // Main Ball Body
      const bodyGeo = new THREE.SphereGeometry(0.85, 32, 32);
      bodyGeo.scale(1, 1.08, 1);
      const body = new THREE.Mesh(bodyGeo, rubberMaterial);
      body.castShadow = true;
      body.position.y = -0.2;
      kb.add(body);

      // Flat Base
      const baseGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.05, 32);
      const base = new THREE.Mesh(baseGeo, rubberMaterial);
      base.position.y = -1.05;
      kb.add(base);

      // Handle (Torus Half)
      const handleGeo = new THREE.TorusGeometry(0.48, 0.09, 24, 32, Math.PI);
      const handle = new THREE.Mesh(handleGeo, metalMaterial);
      handle.position.y = 0.75;
      handle.castShadow = true;
      kb.add(handle);

      // Handle uprights
      const upright1 = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.3, 24), metalMaterial);
      upright1.position.set(-0.48, 0.6, 0);
      kb.add(upright1);
      const upright2 = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.3, 24), metalMaterial);
      upright2.position.set(0.48, 0.6, 0);
      kb.add(upright2);

      // Glowing Emblem Band
      const bandGeo = new THREE.TorusGeometry(0.86, 0.025, 16, 48);
      bandGeo.rotateX(Math.PI / 2);
      const band = new THREE.Mesh(bandGeo, accentMaterial);
      band.position.y = -0.2;
      kb.add(band);

      return kb;
    }

    let activeMesh = createDumbbell();
    modelGroup.add(activeMesh);

    // 6. Floating Neon Ring / Studio Floor Stage
    const stageGeo = new THREE.CylinderGeometry(1.9, 2.1, 0.08, 48);
    const stageMat = new THREE.MeshStandardMaterial({
      color: 0x0e1410,
      roughness: 0.2,
      metalness: 0.8,
    });
    const stage = new THREE.Mesh(stageGeo, stageMat);
    stage.position.y = -1.35;
    stage.receiveShadow = true;
    scene.add(stage);

    // Neon Halo Ring around stage
    const haloGeo = new THREE.RingGeometry(1.95, 2.05, 64);
    haloGeo.rotateX(-Math.PI / 2);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      side: THREE.DoubleSide,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.y = -1.3;
    scene.add(halo);

    // 7. Ambient Floating Particles
    const particlesCount = 70;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 6;
      particlePositions[i + 1] = (Math.random() - 0.5) * 4 + 0.5;
      particlePositions[i + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.035,
      transparent: true,
      opacity: 0.75,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    setIsLoaded(true);

    // 8. Mouse Drag / Interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      modelGroup.rotation.y += deltaX * 0.008;
      modelGroup.rotation.x = Math.max(-0.4, Math.min(0.4, modelGroup.rotation.x + deltaY * 0.006));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.style.touchAction = 'none';
    domElement.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // 9. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (autoRotateRef.current && !isDragging) {
        modelGroup.rotation.y += 0.009;
        // Subtle floating bobbing effect
        modelGroup.position.y = Math.sin(elapsed * 1.6) * 0.08;
      }

      // Rotate particles slowly
      particleSystem.rotation.y = elapsed * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // 10. Resize handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Preset switcher handler
  const handleSwitchPreset = (preset: 'kettlebell' | 'dumbbell') => {
    setActivePreset(preset);
    if (!modelGroupRef.current || !sceneRef.current) return;

    // Clear old children from modelGroup
    while (modelGroupRef.current.children.length > 0) {
      const obj = modelGroupRef.current.children[0];
      modelGroupRef.current.remove(obj);
    }

    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0xd8d8d8,
      metalness: 0.92,
      roughness: 0.18,
    });

    const rubberMaterial = new THREE.MeshStandardMaterial({
      color: 0x181e1a,
      roughness: 0.75,
      metalness: 0.15,
    });

    const accentMaterial = new THREE.MeshStandardMaterial({
      color: neonMode ? 0x10b981 : 0x0284c7,
      roughness: 0.3,
      metalness: 0.4,
      emissive: neonMode ? 0x059669 : 0x0369a1,
      emissiveIntensity: 0.6,
    });

    if (preset === 'dumbbell') {
      const dumbbell = new THREE.Group();
      const barGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.6, 32);
      barGeo.rotateZ(Math.PI / 2);
      dumbbell.add(new THREE.Mesh(barGeo, metalMaterial));

      [-1, 1].forEach((side) => {
        const collar = new THREE.Mesh(
          new THREE.CylinderGeometry(0.14, 0.14, 0.08, 24).rotateZ(Math.PI / 2),
          metalMaterial
        );
        collar.position.x = side * 0.75;
        dumbbell.add(collar);

        const plate1 = new THREE.Mesh(
          new THREE.CylinderGeometry(0.65, 0.65, 0.25, 6).rotateZ(Math.PI / 2),
          rubberMaterial
        );
        plate1.position.x = side * 0.95;
        dumbbell.add(plate1);

        const plateRing = new THREE.Mesh(
          new THREE.TorusGeometry(0.55, 0.02, 16, 6).rotateY(Math.PI / 2),
          accentMaterial
        );
        plateRing.position.x = side * 1.08;
        dumbbell.add(plateRing);

        const plate2 = new THREE.Mesh(
          new THREE.CylinderGeometry(0.55, 0.55, 0.2, 6).rotateZ(Math.PI / 2),
          rubberMaterial
        );
        plate2.position.x = side * 1.2;
        dumbbell.add(plate2);
      });
      modelGroupRef.current.add(dumbbell);
    } else {
      const kb = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.SphereGeometry(0.85, 32, 32).scale(1, 1.08, 1),
        rubberMaterial
      );
      body.position.y = -0.2;
      kb.add(body);

      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.05, 32), rubberMaterial);
      base.position.y = -1.05;
      kb.add(base);

      const handle = new THREE.Mesh(
        new THREE.TorusGeometry(0.48, 0.09, 24, 32, Math.PI),
        metalMaterial
      );
      handle.position.y = 0.75;
      kb.add(handle);

      const upright1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.09, 0.3, 24),
        metalMaterial
      );
      upright1.position.set(-0.48, 0.6, 0);
      kb.add(upright1);
      const upright2 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.09, 0.3, 24),
        metalMaterial
      );
      upright2.position.set(0.48, 0.6, 0);
      kb.add(upright2);

      const band = new THREE.Mesh(
        new THREE.TorusGeometry(0.86, 0.025, 16, 48).rotateX(Math.PI / 2),
        accentMaterial
      );
      band.position.y = -0.2;
      kb.add(band);

      modelGroupRef.current.add(kb);
    }
  };

  return (
    <div className="relative h-full w-full select-none overflow-hidden rounded-[24px]">
      {/* Three.js Canvas Container */}
      <div
        ref={containerRef}
        className="h-full min-h-[380px] w-full cursor-grab active:cursor-grabbing sm:min-h-[460px] lg:min-h-[520px]"
        title="Kéo chuột hoặc vuốt để xoay thiết bị 3D 360°"
      />

      {/* Floating 3D Badge Overlay */}
      <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full border border-emerald-400/30 bg-black/60 px-3.5 py-1.5 backdrop-blur-md">
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
        </span>
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-300">
          3D Interactive Studio
        </span>
      </div>

      {/* Drag instruction helper badge */}
      <div className="pointer-events-none absolute bottom-4 left-4 hidden items-center gap-2 rounded-xl border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-white/70 backdrop-blur-md sm:flex">
        <RotateCw className="size-3.5 animate-spin text-emerald-400" />
        <span>Kéo để xoay 360° · Trải nghiệm đa chiều</span>
      </div>

      {/* Floating Interactive Controls */}
      <div className="absolute right-4 top-4 flex flex-col gap-2">
        {/* Preset Switcher */}
        <div className="flex rounded-xl border border-white/15 bg-black/60 p-1 backdrop-blur-md">
          <button
            type="button"
            onClick={() => handleSwitchPreset('dumbbell')}
            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
              activePreset === 'dumbbell'
                ? 'bg-emerald-400 text-ink shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Tạ Đơn
          </button>
          <button
            type="button"
            onClick={() => handleSwitchPreset('kettlebell')}
            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
              activePreset === 'kettlebell'
                ? 'bg-emerald-400 text-ink shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Tạ Bình
          </button>
        </div>

        {/* Auto Rotate Toggle */}
        <button
          type="button"
          onClick={() => setAutoRotate(!autoRotate)}
          className={`flex items-center justify-center gap-1.5 rounded-xl border border-white/15 p-2 text-xs font-semibold backdrop-blur-md transition ${
            autoRotate
              ? 'bg-white/20 text-white'
              : 'bg-black/60 text-white/60 hover:text-white'
          }`}
          title={autoRotate ? 'Dừng tự xoay' : 'Bật tự xoay'}
        >
          <RotateCw className={`size-3.5 ${autoRotate ? 'text-emerald-400' : ''}`} />
          <span className="hidden sm:inline">{autoRotate ? 'Đang xoay' : 'Dừng'}</span>
        </button>
      </div>

      {/* Tech Specifications Floating Cards */}
      <div className="pointer-events-none absolute bottom-4 right-4 hidden max-w-xs flex-col gap-2 lg:flex">
        <div className="rounded-2xl border border-white/15 bg-black/65 p-3.5 text-white backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <ShieldCheck className="size-4" />
            <span>Thép Hợp Kim Mạ Chrome + Cao Su Đúc</span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-white/70">
            Chống gỉ sét, giảm chấn bảo vệ sàn nhà, khắc laser thương hiệu DCTD Pro Series.
          </p>
        </div>
      </div>
    </div>
  );
}
