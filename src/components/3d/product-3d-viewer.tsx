'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
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
  Check,
} from 'lucide-react';
import { isWebGLAvailable } from './webgl-detect';

type ColorPreset = {
  id: string;
  name: string;
  colorHex: number;
  bgHex: string;
  imgUrl: string;
};

const COLOR_PRESETS: ColorPreset[] = [
  {
    id: 'black',
    name: 'Stealth Black',
    colorHex: 0x181e1a,
    bgHex: '#181e1a',
    imgUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'emerald',
    name: 'Cyber Emerald',
    colorHex: 0x059669,
    bgHex: '#059669',
    imgUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'cyan',
    name: 'Decathlon Blue',
    colorHex: 0x0284c7,
    bgHex: '#0284c7',
    imgUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'chrome',
    name: 'Titanium Silver',
    colorHex: 0xe2e8f0,
    bgHex: '#94a3b8',
    imgUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=900&q=85',
  },
];

export function Product3DViewer({ productName = 'Thiết bị thể thao DCTD' }: { productName?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [wireframe, setWireframe] = useState(false);
  const [exploded, setExploded] = useState(false);
  const [activeColor, setActiveColor] = useState('black');
  const [autoRotate, setAutoRotate] = useState(true);
  const [webGLFailed, setWebGLFailed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // References for Three.js
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
    if (!isWebGLAvailable()) {
      setWebGLFailed(true);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    let renderer: THREE.WebGLRenderer | null = null;
    let animationFrameId: number;
    let clock = new THREE.Clock();

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
      camera.position.set(0, 1.2, 4.2);
      cameraRef.current = camera;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, failIfMajorPerformanceCaveat: false });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.3;
      container.appendChild(renderer.domElement);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambientLight);

      const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
      mainLight.position.set(5, 6, 4);
      mainLight.castShadow = true;
      scene.add(mainLight);

      const rimLight = new THREE.DirectionalLight(0x34d399, 1.8);
      rimLight.position.set(-5, 2, -3);
      scene.add(rimLight);

      // Materials
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

      materialsRef.current = { metal: metalMaterial, body: bodyMaterial, accent: accentMaterial };

      // Dumbbell model
      const modelGroup = new THREE.Group();
      scene.add(modelGroup);
      modelGroupRef.current = modelGroup;

      const barGeo = new THREE.CylinderGeometry(0.075, 0.075, 2.4, 32);
      barGeo.rotateZ(Math.PI / 2);
      modelGroup.add(new THREE.Mesh(barGeo, metalMaterial));

      for (let i = -0.45; i <= 0.45; i += 0.15) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(0.078, 0.006, 16, 24).rotateY(Math.PI / 2),
          accentMaterial
        );
        ring.position.x = i;
        modelGroup.add(ring);
      }

      const leftPlates = new THREE.Group();
      modelGroup.add(leftPlates);
      leftPlatesRef.current = leftPlates;

      const rightPlates = new THREE.Group();
      modelGroup.add(rightPlates);
      rightPlatesRef.current = rightPlates;

      function buildPlates(group: THREE.Group, mult: number) {
        const p1 = new THREE.Mesh(
          new THREE.CylinderGeometry(0.68, 0.68, 0.18, 12).rotateZ(Math.PI / 2),
          bodyMaterial
        );
        p1.position.x = mult * 0.86;
        group.add(p1);

        const p2 = new THREE.Mesh(
          new THREE.CylinderGeometry(0.55, 0.55, 0.16, 12).rotateZ(Math.PI / 2),
          bodyMaterial
        );
        p2.position.x = mult * 1.06;
        group.add(p2);

        const p3 = new THREE.Mesh(
          new THREE.CylinderGeometry(0.44, 0.44, 0.14, 12).rotateZ(Math.PI / 2),
          bodyMaterial
        );
        p3.position.x = mult * 1.24;
        group.add(p3);
      }

      buildPlates(leftPlates, -1);
      buildPlates(rightPlates, 1);

      // Floor
      const pedestal = new THREE.Mesh(
        new THREE.CylinderGeometry(1.6, 1.8, 0.06, 48),
        new THREE.MeshStandardMaterial({ color: 0x0a100c, roughness: 0.3, metalness: 0.7 })
      );
      pedestal.position.y = -1.15;
      scene.add(pedestal);

      // Drag interaction
      let isDragging = false;
      let prevPos = { x: 0, y: 0 };

      const onPointerDown = (e: PointerEvent) => {
        isDragging = true;
        prevPos = { x: e.clientX, y: e.clientY };
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!isDragging) return;
        const deltaX = e.clientX - prevPos.x;
        const deltaY = e.clientY - prevPos.y;
        modelGroup.rotation.y += deltaX * 0.009;
        modelGroup.rotation.x = Math.max(-0.5, Math.min(0.5, modelGroup.rotation.x + deltaY * 0.007));
        prevPos = { x: e.clientX, y: e.clientY };
      };

      const onPointerUp = () => {
        isDragging = false;
      };

      const domElement = renderer.domElement;
      domElement.style.touchAction = 'none';
      domElement.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);

      // Animation Loop
      const render = () => {
        animationFrameId = requestAnimationFrame(render);
        const elapsed = clock.getElapsedTime();

        if (autoRotateRef.current && !isDragging) {
          modelGroup.rotation.y += 0.007;
          modelGroup.position.y = Math.sin(elapsed * 1.5) * 0.05;
        }

        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      };

      render();

      const onResize = () => {
        if (!container || !renderer) return;
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
        if (renderer && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        if (renderer) {
          renderer.dispose();
        }
      };
    } catch (err) {
      console.warn('Product 3D WebGL failed, falling back to Interactive 360 viewer:', err);
      setWebGLFailed(true);
      if (renderer) {
        try {
          renderer.dispose();
        } catch {}
      }
    }
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
    leftPlatesRef.current.position.x = -targetOffset;
    rightPlatesRef.current.position.x = targetOffset;
  }, [exploded]);

  const handleColorChange = (preset: ColorPreset) => {
    setActiveColor(preset.id);
    if (materialsRef.current) {
      materialsRef.current.body.color.setHex(preset.colorHex);
    }
  };

  const handleZoom = (delta: number) => {
    if (!cameraRef.current) {
      setZoomLevel((z) => Math.max(0.8, Math.min(1.6, z - delta * 0.5)));
      return;
    }
    const newZ = cameraRef.current.position.z + delta;
    if (newZ >= 2.2 && newZ <= 6.5) {
      cameraRef.current.position.z = newZ;
    }
  };

  const selectedPresetObj = COLOR_PRESETS.find((p) => p.id === activeColor) || COLOR_PRESETS[0];

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] border border-stone-200 bg-gradient-to-b from-stone-900 via-[#131a16] to-[#0c120e] text-white shadow-2xl">
      {!webGLFailed ? (
        /* Three.js Canvas Container */
        <div
          ref={containerRef}
          className="h-full w-full cursor-grab active:cursor-grabbing"
          title="Kéo để xoay 360° thiết bị thể thao"
        />
      ) : (
        /* Interactive Multi-Angle Fallback Viewer */
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-b from-stone-900 via-[#121a15] to-[#0a100d] p-6">
          <div
            className="relative aspect-square size-72 transition-transform duration-300 sm:size-88"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <Image
              src={selectedPresetObj.imgUrl}
              alt={productName}
              fill
              priority
              sizes="400px"
              className="object-cover rounded-3xl shadow-2xl ring-1 ring-white/10"
            />
          </div>

          <div className="pointer-events-none absolute bottom-16 left-6 rounded-full bg-black/60 px-3.5 py-1 text-xs font-bold text-emerald-400 backdrop-blur-md">
            Chế độ xem HD Studio: {selectedPresetObj.name}
          </div>
        </div>
      )}

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
        {!webGLFailed && (
          <>
            <button
              type="button"
              onClick={() => setAutoRotate(!autoRotate)}
              className={`flex size-9 items-center justify-center rounded-xl border border-white/15 backdrop-blur-md transition ${
                autoRotate ? 'bg-emerald-400 text-ink shadow-lg' : 'bg-black/50 text-white hover:bg-white/20'
              }`}
              title={autoRotate ? 'Tạm dừng xoay' : 'Bật tự động xoay'}
            >
              <RotateCw className={`size-4 ${autoRotate ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => setExploded(!exploded)}
              className={`flex size-9 items-center justify-center rounded-xl border border-white/15 backdrop-blur-md transition ${
                exploded ? 'bg-brand-400 text-ink' : 'bg-black/50 text-white hover:bg-white/20'
              }`}
              title="Bóc tách linh kiện"
            >
              <Layers className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => setWireframe(!wireframe)}
              className={`flex size-9 items-center justify-center rounded-xl border border-white/15 backdrop-blur-md transition ${
                wireframe ? 'bg-amber-400 text-ink' : 'bg-black/50 text-white hover:bg-white/20'
              }`}
              title="Chế độ khung dây Wireframe"
            >
              <Box className="size-4" />
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => handleZoom(-0.5)}
          className="flex size-9 items-center justify-center rounded-xl border border-white/15 bg-black/50 text-white backdrop-blur-md transition hover:bg-white/20"
          title="Phóng to"
        >
          <ZoomIn className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => handleZoom(0.5)}
          className="flex size-9 items-center justify-center rounded-xl border border-white/15 bg-black/50 text-white backdrop-blur-md transition hover:bg-white/20"
          title="Thu nhỏ"
        >
          <ZoomOut className="size-4" />
        </button>
      </div>

      {/* Bottom Colorway Selector */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3">
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
      </div>
    </div>
  );
}
