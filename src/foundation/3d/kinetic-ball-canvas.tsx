'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { isWebGLAvailable } from './webgl-detect';

export function KineticBallCanvas({
  theme = 'emerald',
  height = '360px',
}: {
  theme?: 'emerald' | 'amber' | 'crimson';
  height?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGLFailed, setWebGLFailed] = useState(false);

  useEffect(() => {
    if (!isWebGLAvailable()) {
      setWebGLFailed(true);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const heightPx = container.clientHeight || parseInt(height, 10) || 360;

    let renderer: THREE.WebGLRenderer | null = null;
    let animId: number;
    let clock = new THREE.Clock();

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 50);
      camera.position.z = 4.8;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, failIfMajorPerformanceCaveat: false });
      renderer.setSize(width, heightPx);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const mainColor =
        theme === 'amber' ? 0xf59e0b : theme === 'crimson' ? 0xef4444 : 0x10b981;
      const glowColor =
        theme === 'amber' ? 0xfde68a : theme === 'crimson' ? 0xfca5a5 : 0x6ee7b7;

      const ballGroup = new THREE.Group();
      scene.add(ballGroup);

      const icoGeo = new THREE.IcosahedronGeometry(1.6, 2);
      const wireMat = new THREE.MeshBasicMaterial({
        color: mainColor,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      });
      ballGroup.add(new THREE.Mesh(icoGeo, wireMat));

      const coreGeo = new THREE.SphereGeometry(1.15, 32, 32);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x0f1712,
        emissive: mainColor,
        emissiveIntensity: 0.35,
        roughness: 0.4,
        metalness: 0.6,
      });
      ballGroup.add(new THREE.Mesh(coreGeo, coreMat));

      const ring1Geo = new THREE.TorusGeometry(1.9, 0.02, 16, 64);
      const ring1Mat = new THREE.MeshBasicMaterial({ color: glowColor });
      const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
      ring1.rotation.x = Math.PI / 3;
      ballGroup.add(ring1);

      const ring2Geo = new THREE.TorusGeometry(2.1, 0.015, 16, 64);
      const ring2Mat = new THREE.MeshBasicMaterial({ color: mainColor, transparent: true, opacity: 0.6 });
      const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
      ring2.rotation.y = Math.PI / 4;
      ballGroup.add(ring2);

      const particleCount = 90;
      const pGeo = new THREE.BufferGeometry();
      const pPos = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = Math.cbrt(Math.random()) * 0.8 + 1.6;
        pPos[i] = r * Math.sin(phi) * Math.cos(theta);
        pPos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
        pPos[i + 2] = r * Math.cos(phi);
      }
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
      const pMat = new THREE.PointsMaterial({ color: glowColor, size: 0.04, transparent: true, opacity: 0.8 });
      ballGroup.add(new THREE.Points(pGeo, pMat));

      const light = new THREE.PointLight(mainColor, 3, 10);
      light.position.set(2, 2, 3);
      scene.add(light);
      scene.add(new THREE.AmbientLight(0xffffff, 0.8));

      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;

      const onMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        targetX = x * 0.6;
        targetY = y * 0.6;
      };

      window.addEventListener('mousemove', onMouseMove);

      const animate = () => {
        animId = requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        mouseX += (targetX - mouseX) * 0.05;
        mouseY += (targetY - mouseY) * 0.05;

        ballGroup.rotation.y = elapsed * 0.35 + mouseX;
        ballGroup.rotation.x = Math.sin(elapsed * 0.25) * 0.15 - mouseY;
        ring1.rotation.z = elapsed * 0.5;
        ring2.rotation.z = -elapsed * 0.4;

        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      };

      animate();

      const onResize = () => {
        if (!container || !renderer) return;
        const newW = container.clientWidth;
        const newH = container.clientHeight || parseInt(height, 10) || 360;
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      };

      window.addEventListener('resize', onResize);

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('mousemove', onMouseMove);
        if (renderer && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        if (renderer) {
          renderer.dispose();
        }
      };
    } catch (err) {
      console.warn('KineticBall WebGL failed, falling back to CSS Orb:', err);
      setWebGLFailed(true);
      if (renderer) {
        try {
          renderer.dispose();
        } catch {}
      }
    }
  }, [theme, height]);

  const colorClass =
    theme === 'amber'
      ? 'border-amber-400/30 bg-amber-500/10 text-amber-400'
      : theme === 'crimson'
      ? 'border-red-500/30 bg-red-500/10 text-red-400'
      : 'border-emerald-400/30 bg-emerald-500/10 text-emerald-400';

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden select-none flex items-center justify-center"
      style={{ height }}
    >
      {webGLFailed && (
        /* CSS Animated Sports Orb Fallback */
        <div className="relative flex items-center justify-center">
          <div className={`size-48 sm:size-56 rounded-full border-2 ${colorClass} animate-pulse blur-sm`} />
          <div
            className={`absolute size-40 sm:size-48 rounded-full border border-dashed ${colorClass} animate-spin`}
            style={{ animationDuration: '16s' }}
          />
          <div
            className={`absolute size-32 sm:size-36 rounded-full border border-double ${colorClass} animate-spin`}
            style={{ animationDuration: '24s', animationDirection: 'reverse' }}
          />
          <div className="absolute size-16 sm:size-20 rounded-full bg-emerald-400/20 backdrop-blur-md shadow-inner shadow-emerald-500/50" />
        </div>
      )}
    </div>
  );
}
