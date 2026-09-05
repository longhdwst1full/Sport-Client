'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function KineticBallCanvas({
  theme = 'emerald',
  height = '360px',
}: {
  theme?: 'emerald' | 'amber' | 'crimson';
  height?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const heightPx = container.clientHeight || 360;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 50);
    camera.position.z = 4.8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Color palettes
    const mainColor =
      theme === 'amber' ? 0xf59e0b : theme === 'crimson' ? 0xef4444 : 0x10b981;
    const glowColor =
      theme === 'amber' ? 0xfde68a : theme === 'crimson' ? 0xfca5a5 : 0x6ee7b7;

    // Group
    const ballGroup = new THREE.Group();
    scene.add(ballGroup);

    // 1. Icosahedron Wireframe Structure (Sports Ball / Football Polyhedron vibe)
    const icoGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: mainColor,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireMesh = new THREE.Mesh(icoGeo, wireMat);
    ballGroup.add(wireMesh);

    // 2. Inner Glowing Core
    const coreGeo = new THREE.SphereGeometry(1.15, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0f1712,
      emissive: mainColor,
      emissiveIntensity: 0.35,
      roughness: 0.4,
      metalness: 0.6,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    ballGroup.add(coreMesh);

    // 3. Orbiting Sports Rings
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

    // 4. Point Particle Cloud
    const particleCount = 120;
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
    const pMat = new THREE.PointsMaterial({
      color: glowColor,
      size: 0.04,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(pGeo, pMat);
    ballGroup.add(particles);

    // Lighting
    const light = new THREE.PointLight(mainColor, 3, 10);
    light.position.set(2, 2, 3);
    scene.add(light);

    const ambLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambLight);

    // Mouse Interaction
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

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth inertia towards mouse
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      ballGroup.rotation.y = elapsed * 0.35 + mouseX;
      ballGroup.rotation.x = Math.sin(elapsed * 0.25) * 0.15 - mouseY;

      ring1.rotation.z = elapsed * 0.5;
      ring2.rotation.z = -elapsed * 0.4;

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || 360;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden select-none"
      style={{ height }}
    />
  );
}
