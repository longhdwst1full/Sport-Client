'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  RotateCw,
  Box,
  Layers,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Maximize2,
  RefreshCw,
  Sliders,
} from 'lucide-react';

type ColorPreset = {
  id: string;
  name: string;
  colorHex: number;
  bgHex: string;
};

const COLOR_PRESETS: ColorPreset[] = [
  { id: 'black', name: 'Stealth Black', colorHex: 0x181e1a, bgHex: '#181e1a' },
  { id: 'emerald', name: 'Cyber Emerald', colorHex: 0x059669, bgHex: '#059669' },
  { id: 'cyan', name: 'Decathlon Blue', colorHex: 0x0284c7, bgHex: '#0284c7' },
  { id: 'chrome', name: 'Titanium Silver', colorHex: 0xe2e8f0, bgHex: '#94a3b8' },
];

export function Product3DViewer({ productName = 'Thiết bị thể thao DCTD' }: { productName?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [wireframe, setWireframe] = useState(false);
  const [exploded, setExploded] = useState(false);
  const [activeColor, setActiveColor] = useState('black');
  const [autoRotate, setAutoRotate] = useState(true);

  // References for three.js manipulation
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const leftPlatesRef = useRef<THREE.Group | null>(null);
  const rightPlatesRef = useRef<THREE.Group | null>(null);
  const materialsRef = useRef<{
    metal: THREE.MeshStandardMaterial;
    body: THREE.MeshStandardMaterial;
    accent: THREE.MeshStandardMaterial;
  } | null>(null);

  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 1.2, 4.2);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // 4. Lighting - Premium Studio lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
    mainLight.position.set(5, 6, 4);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0x34d399, 1.8);
    rimLight.position.set(-5, 2, -3);
    scene.add(rimLight);

    const bottomGlow = new THREE.PointLight(0x10b981, 2.5, 8);
    bottomGlow.position.set(0, -1.2, 1);
    scene.add(bottomGlow);

    // 5. Materials
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.95,
      roughness: 0.15,
    });

    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e2420,
      roughness: 0.65,
      metalness: 0.25,
    });

    const accentMaterial = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.25,
      metalness: 0.5,
      emissive: 0x059669,
      emissiveIntensity: 0.4,
    });

    materialsRef.current = {
      metal: metalMaterial,
      body: bodyMaterial,
      accent: accentMaterial,
    };

    // 6. Assembly Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Center Handle Bar
    const barGeo = new THREE.CylinderGeometry(0.075, 0.075, 2.4, 32);
    barGeo.rotateZ(Math.PI / 2);
    const bar = new THREE.Mesh(barGeo, metalMaterial);
    bar.castShadow = true;
    modelGroup.add(bar);

    // Diamond Knurl grip rings
    for (let i = -0.45; i <= 0.45; i += 0.15) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.078, 0.006, 16, 24).rotateY(Math.PI / 2),
        accentMaterial
      );
      ring.position.x = i;
      modelGroup.add(ring);
    }

    // Left Plates Group
    const leftPlates = new THREE.Group();
    modelGroup.add(leftPlates);
    leftPlatesRef.current = leftPlates;

    // Right Plates Group
    const rightPlates = new THREE.Group();
    modelGroup.add(rightPlates);
    rightPlatesRef.current = rightPlates;

    // Function to populate plates
    function buildPlateSide(group: THREE.Group, sideMultiplier: number) {
      // Inner Stopper
      const stopper = new THREE.Mesh(
        new THREE.CylinderGeometry(0.13, 0.13, 0.06, 24).rotateZ(Math.PI / 2),
        metalMaterial
      );
      stopper.position.x = sideMultiplier * 0.7;
      stopper.castShadow = true;
      group.add(stopper);

      // Plate 1 (Heavy Plate 5KG)
      const p1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.68, 0.68, 0.18, 12).rotateZ(Math.PI / 2),
        bodyMaterial
      );
      p1.position.x = sideMultiplier * 0.86;
      p1.castShadow = true;
      p1.receiveShadow = true;
      group.add(p1);

      // Plate 1 Groove
      const p1Groove = new THREE.Mesh(
        new THREE.TorusGeometry(0.55, 0.015, 12, 24).rotateY(Math.PI / 2),
        accentMaterial
      );
      p1Groove.position.x = sideMultiplier * 0.96;
      group.add(p1Groove);

      // Plate 2 (Medium Plate 2.5KG)
      const p2 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.55, 0.55, 0.16, 12).rotateZ(Math.PI / 2),
        bodyMaterial
      );
      p2.position.x = sideMultiplier * 1.06;
      p2.castShadow = true;
      group.add(p2);

      // Plate 3 (Light Plate 1.25KG)
      const p3 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.44, 0.44, 0.14, 12).rotateZ(Math.PI / 2),
        bodyMaterial
      );
      p3.position.x = sideMultiplier * 1.24;
      p3.castShadow = true;
      group.add(p3);

      // Lock Collar / Quick-Lock Clamp
      const clamp = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.08, 24).rotateZ(Math.PI / 2),
        accentMaterial
      );
      clamp.position.x = sideMultiplier * 1.36;
      group.add(clamp);
    }

    buildPlateSide(leftPlates, -1);
    buildPlateSide(rightPlates, 1);

    // Studio pedestal shadow catcher
    const pedestalGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.06, 48);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x0a100c,
      roughness: 0.3,
      metalness: 0.7,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -1.15;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // Subtle floor neon circle
    const haloGeo = new THREE.RingGeometry(1.65, 1.72, 48);
    haloGeo.rotateX(-Math.PI / 2);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0x34d399, side: THREE.DoubleSide });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.y = -1.12;
    scene.add(halo);

    // 7. Interaction - Pointer Drag
    let isDragging = false;
    let previousPosition = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousPosition = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousPosition.x;
      const deltaY = e.clientY - previousPosition.y;

      modelGroup.rotation.y += deltaX * 0.009;
      modelGroup.rotation.x = Math.max(-0.5, Math.min(0.5, modelGroup.rotation.x + deltaY * 0.007));

      previousPosition = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.style.touchAction = 'none';
    domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      const elapsed = clock.getElapsedTime();

      if (autoRotateRef.current && !isDragging) {
        modelGroup.rotation.y += 0.007;
        modelGroup.position.y = Math.sin(elapsed * 1.5) * 0.05;
      }

      renderer.render(scene, camera);
    };

    render();

    // 9. Resize
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
      domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update Wireframe
  useEffect(() => {
    if (!materialsRef.current) return;
    materialsRef.current.metal.wireframe = wireframe;
    materialsRef.current.body.wireframe = wireframe;
    materialsRef.current.accent.wireframe = wireframe;
  }, [wireframe]);

  // Update Exploded View
  useEffect(() => {
    if (!leftPlatesRef.current || !rightPlatesRef.current) return;
    const targetOffset = exploded ? 0.35 : 0;

    // Smooth position offset
    leftPlatesRef.current.position.x = -targetOffset;
    rightPlatesRef.current.position.x = targetOffset;
  }, [exploded]);

  // Update Colorway
  const handleColorChange = (preset: ColorPreset) => {
    setActiveColor(preset.id);
    if (!materialsRef.current) return;
    materialsRef.current.body.color.setHex(preset.colorHex);
  };

  // Zoom controls
  const handleZoom = (delta: number) => {
    if (!cameraRef.current) return;
    const newZ = cameraRef.current.position.z + delta;
    if (newZ >= 2.2 && newZ <= 6.5) {
      cameraRef.current.position.z = newZ;
    }
  };

  const handleResetCamera = () => {
    if (!cameraRef.current || !modelGroupRef.current) return;
    cameraRef.current.position.set(0, 1.2, 4.2);
    modelGroupRef.current.rotation.set(0, 0, 0);
  };

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] border border-stone-200 bg-gradient-to-b from-stone-900 via-[#131a16] to-[#0c120e] text-white shadow-2xl">
      {/* 3D Canvas Container */}
      <div
        ref={containerRef}
        className="h-full w-full cursor-grab active:cursor-grabbing"
        title="Kéo để xoay 360° thiết bị thể thao"
      />

      {/* Top Header Information */}
      <div className="pointer-events-none absolute left-5 top-5 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="flex size-2 rounded-full bg-emerald-400"></span>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400">
            Chế độ 3D Studio 360°
          </span>
        </div>
        <p className="text-xs font-semibold text-white/80">{productName}</p>
      </div>

      {/* Interactive Controls Overlay - Right Toolbar */}
      <div className="absolute right-4 top-4 flex flex-col gap-2">
        {/* Auto Rotate Toggle */}
        <button
          type="button"
          onClick={() => setAutoRotate(!autoRotate)}
          className={`flex size-9 items-center justify-center rounded-xl border border-white/15 backdrop-blur-md transition ${
            autoRotate ? 'bg-emerald-400 text-ink shadow-lg shadow-emerald-500/20' : 'bg-black/50 text-white hover:bg-white/20'
          }`}
          title={autoRotate ? 'Tạm dừng xoay' : 'Bật tự động xoay'}
        >
          <RotateCw className={`size-4 ${autoRotate ? 'animate-spin' : ''}`} />
        </button>

        {/* Exploded / Component View Toggle */}
        <button
          type="button"
          onClick={() => setExploded(!exploded)}
          className={`flex size-9 items-center justify-center rounded-xl border border-white/15 backdrop-blur-md transition ${
            exploded ? 'bg-brand-400 text-ink' : 'bg-black/50 text-white hover:bg-white/20'
          }`}
          title={exploded ? 'Đóng cấu trúc' : 'Mở cấu trúc từng tầng (Exploded View)'}
        >
          <Layers className="size-4" />
        </button>

        {/* Wireframe Toggle */}
        <button
          type="button"
          onClick={() => setWireframe(!wireframe)}
          className={`flex size-9 items-center justify-center rounded-xl border border-white/15 backdrop-blur-md transition ${
            wireframe ? 'bg-amber-400 text-ink' : 'bg-black/50 text-white hover:bg-white/20'
          }`}
          title={wireframe ? 'Chế độ vật liệu thực' : 'Xem khung dây kỹ thuật (Wireframe)'}
        >
          <Box className="size-4" />
        </button>

        {/* Zoom In */}
        <button
          type="button"
          onClick={() => handleZoom(-0.5)}
          className="flex size-9 items-center justify-center rounded-xl border border-white/15 bg-black/50 text-white backdrop-blur-md transition hover:bg-white/20"
          title="Phóng to"
        >
          <ZoomIn className="size-4" />
        </button>

        {/* Zoom Out */}
        <button
          type="button"
          onClick={() => handleZoom(0.5)}
          className="flex size-9 items-center justify-center rounded-xl border border-white/15 bg-black/50 text-white backdrop-blur-md transition hover:bg-white/20"
          title="Thu nhỏ"
        >
          <ZoomOut className="size-4" />
        </button>

        {/* Reset Camera */}
        <button
          type="button"
          onClick={handleResetCamera}
          className="flex size-9 items-center justify-center rounded-xl border border-white/15 bg-black/50 text-white backdrop-blur-md transition hover:bg-white/20"
          title="Đặt lại góc nhìn"
        >
          <RefreshCw className="size-4" />
        </button>
      </div>

      {/* Bottom Colorway Selector & Tips */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3">
        {/* Colorway Pills */}
        <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-black/60 p-1.5 backdrop-blur-md">
          <span className="pl-2 pr-1 text-[11px] font-bold text-white/60">Màu sắc:</span>
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleColorChange(preset)}
              className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-semibold transition ${
                activeColor === preset.id
                  ? 'bg-white text-ink shadow-md'
                  : 'text-white/75 hover:bg-white/10'
              }`}
            >
              <span
                className="size-2.5 rounded-full border border-black/20"
                style={{ backgroundColor: preset.bgHex }}
              />
              <span className="hidden sm:inline">{preset.name}</span>
            </button>
          ))}
        </div>

        {/* Status indicator */}
        <div className="pointer-events-none hidden items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white/60 backdrop-blur-md md:flex">
          <span>Kéo chuột để xoay 360° · Cuộn để phóng to</span>
        </div>
      </div>
    </div>
  );
}
