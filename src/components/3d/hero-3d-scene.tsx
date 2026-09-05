'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import * as THREE from 'three';
import { RotateCw, Sparkles, ShieldCheck, Dumbbell } from 'lucide-react';
import { isWebGLAvailable } from './webgl-detect';

export function Hero3DScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [activePreset, setActivePreset] = useState<'dumbbell' | 'kettlebell'>('dumbbell');
  const [webGLFailed, setWebGLFailed] = useState(false);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;

  // Fallback mouse parallax coordinates
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // 1. First verify WebGL availability
    if (!isWebGLAvailable()) {
      setWebGLFailed(true);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 480;

    let renderer: THREE.WebGLRenderer | null = null;
    let animationFrameId: number;
    let clock = new THREE.Clock();

    try {
      // 1. Scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // 2. Camera
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 1.2, 4.5);

      // 3. Renderer with try-catch safety
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, failIfMajorPerformanceCaveat: false });
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
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0x34d399, 1.4);
      fillLight.position.set(-4, -2, -2);
      scene.add(fillLight);

      const rimLight = new THREE.PointLight(0x10b981, 4, 10);
      rimLight.position.set(0, -1, 2);
      scene.add(rimLight);

      // 5. Model Group
      const modelGroup = new THREE.Group();
      scene.add(modelGroup);
      modelGroupRef.current = modelGroup;

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

      // Dumbbell builder
      function createDumbbell() {
        const dumbbell = new THREE.Group();
        const barGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.6, 32);
        barGeo.rotateZ(Math.PI / 2);
        dumbbell.add(new THREE.Mesh(barGeo, metalMaterial));

        for (let i = -0.5; i <= 0.5; i += 0.25) {
          const ring = new THREE.Mesh(
            new THREE.TorusGeometry(0.085, 0.008, 16, 32).rotateY(Math.PI / 2),
            accentMaterial
          );
          ring.position.x = i;
          dumbbell.add(ring);
        }

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

          const cap = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.12, 0.05, 24).rotateZ(Math.PI / 2),
            accentMaterial
          );
          cap.position.x = side * 1.32;
          dumbbell.add(cap);
        });

        return dumbbell;
      }

      modelGroup.add(createDumbbell());

      // Studio Stage
      const stageGeo = new THREE.CylinderGeometry(1.9, 2.1, 0.08, 48);
      const stageMat = new THREE.MeshStandardMaterial({
        color: 0x0e1410,
        roughness: 0.2,
        metalness: 0.8,
      });
      const stage = new THREE.Mesh(stageGeo, stageMat);
      stage.position.y = -1.35;
      scene.add(stage);

      const haloGeo = new THREE.RingGeometry(1.95, 2.05, 64);
      haloGeo.rotateX(-Math.PI / 2);
      const haloMat = new THREE.MeshBasicMaterial({ color: 0x34d399, side: THREE.DoubleSide });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.y = -1.3;
      scene.add(halo);

      // Ambient Particles
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

      // Mouse drag controls
      let isDragging = false;
      let prevMousePos = { x: 0, y: 0 };

      const onPointerDown = (e: PointerEvent) => {
        isDragging = true;
        prevMousePos = { x: e.clientX, y: e.clientY };
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!isDragging) return;
        const deltaX = e.clientX - prevMousePos.x;
        const deltaY = e.clientY - prevMousePos.y;
        modelGroup.rotation.y += deltaX * 0.008;
        modelGroup.rotation.x = Math.max(-0.4, Math.min(0.4, modelGroup.rotation.x + deltaY * 0.006));
        prevMousePos = { x: e.clientX, y: e.clientY };
      };

      const onPointerUp = () => {
        isDragging = false;
      };

      const domElement = renderer.domElement;
      domElement.style.touchAction = 'none';
      domElement.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);

      // Render loop
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        if (autoRotateRef.current && !isDragging) {
          modelGroup.rotation.y += 0.009;
          modelGroup.position.y = Math.sin(elapsed * 1.6) * 0.08;
        }

        particleSystem.rotation.y = elapsed * 0.03;
        if (renderer && scene) {
          renderer.render(scene, camera);
        }
      };

      animate();

      const handleResize = () => {
        if (!container || !renderer) return;
        const newW = container.clientWidth;
        const newH = container.clientHeight;
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
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
      console.warn('WebGL initialization failed, falling back to CSS 3D Studio:', err);
      setWebGLFailed(true);
      if (renderer) {
        try {
          renderer.dispose();
        } catch {}
      }
    }
  }, []);

  // Fallback parallax mouse move
  const handleMouseMoveFallback = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 24;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -24;
    setTilt({ x, y });
  };

  const handleMouseLeaveFallback = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="relative h-full w-full select-none overflow-hidden rounded-[24px]">
      {!webGLFailed ? (
        /* Three.js Canvas Container */
        <div
          ref={containerRef}
          className="h-full min-h-[380px] w-full cursor-grab active:cursor-grabbing sm:min-h-[460px] lg:min-h-[520px]"
          title="Kéo chuột để xoay thiết bị 3D 360°"
        />
      ) : (
        /* Premium CSS 3D Fallback Stage (Always works even without GPU WebGL) */
        <div
          onMouseMove={handleMouseMoveFallback}
          onMouseLeave={handleMouseLeaveFallback}
          className="relative flex h-full min-h-[380px] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-stone-900/80 via-[#111914] to-[#0b120e] p-6 sm:min-h-[460px] lg:min-h-[520px]"
          style={{ perspective: '1000px' }}
        >
          {/* Animated Glow Rings */}
          <div className="pointer-events-none absolute size-72 rounded-full border border-emerald-400/20 bg-emerald-500/10 blur-xl animate-pulse" />
          <div className="pointer-events-none absolute size-88 rounded-full border border-emerald-400/10 animate-spin" style={{ animationDuration: '24s' }} />

          {/* 3D Floating Equipment Card with Parallax */}
          <div
            className="relative z-10 flex flex-col items-center transition-transform duration-200 ease-out"
            style={{
              transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="relative aspect-square size-64 sm:size-72">
              <Image
                src={
                  activePreset === 'dumbbell'
                    ? 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=85'
                    : 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=85'
                }
                alt={activePreset === 'dumbbell' ? 'Bộ tạ tay chuyên nghiệp DCTD Pro' : 'Tạ bình vôi kettlebell'}
                fill
                priority
                sizes="300px"
                className="object-cover rounded-3xl shadow-2xl ring-2 ring-emerald-400/30"
              />
            </div>

            {/* Glowing Floor Pedestal */}
            <div className="mt-6 flex items-center gap-2 rounded-full border border-emerald-400/40 bg-black/60 px-4 py-1.5 backdrop-blur-md">
              <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
                {activePreset === 'dumbbell' ? 'Hex Dumbbell Pro Series' : 'Cast Iron Kettlebell'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Floating 3D Badge Overlay */}
      <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full border border-emerald-400/30 bg-black/60 px-3.5 py-1.5 backdrop-blur-md">
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
        </span>
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-300">
          DCTD 3D Studio
        </span>
      </div>

      {/* Floating Interactive Controls */}
      <div className="absolute right-4 top-4 flex flex-col gap-2">
        <div className="flex rounded-xl border border-white/15 bg-black/60 p-1 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setActivePreset('dumbbell')}
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
            onClick={() => setActivePreset('kettlebell')}
            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
              activePreset === 'kettlebell'
                ? 'bg-emerald-400 text-ink shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Tạ Bình
          </button>
        </div>

        {!webGLFailed && (
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex items-center justify-center gap-1.5 rounded-xl border border-white/15 p-2 text-xs font-semibold backdrop-blur-md transition ${
              autoRotate ? 'bg-white/20 text-white' : 'bg-black/60 text-white/60 hover:text-white'
            }`}
          >
            <RotateCw className={`size-3.5 ${autoRotate ? 'text-emerald-400' : ''}`} />
            <span className="hidden sm:inline">{autoRotate ? 'Đang xoay' : 'Dừng'}</span>
          </button>
        )}
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
