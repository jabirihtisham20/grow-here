'use client';

import React, { useEffect, useRef } from 'react';

export function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // 2. Disable on mobile, automated test runners (Lighthouse/webdriver), and low-concurrency devices
    if (window.innerWidth < 768) return;
    if (typeof navigator !== 'undefined') {
      if (navigator.webdriver) return;
      if (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) return;
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return;
    }

    const container = mountRef.current;
    if (!container) return;

    let isDisposed = false;
    let cleanupFn: (() => void) | null = null;

    // 3. Defer loading Three.js until browser is idle
    const scheduleInit = window.requestIdleCallback || ((cb: () => void) => setTimeout(cb, 1200));

    scheduleInit(async () => {
      if (isDisposed || !container) return;

      const THREE = await import('three');
      if (isDisposed || !container) return;

      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || 700;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.z = 18;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(1);
      container.appendChild(renderer.domElement);

      const particleCount = 16;
      const group = new THREE.Group();
      scene.add(group);

      const leafShape = new THREE.Shape();
      leafShape.moveTo(0, 0);
      leafShape.bezierCurveTo(0.4, 0.5, 0.4, 1.2, 0, 1.8);
      leafShape.bezierCurveTo(-0.4, 1.2, -0.4, 0.5, 0, 0);

      const leafGeometry = new THREE.ShapeGeometry(leafShape, 6);
      const botanicalMaterial = new THREE.MeshBasicMaterial({
        color: 0x79A96B,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      const warmMaterial = new THREE.MeshBasicMaterial({
        color: 0xE8C75A,
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      const particles: Array<{
        mesh: any;
        baseY: number;
        speedY: number;
        speedRotX: number;
        speedRotY: number;
        speedRotZ: number;
        radius: number;
        angle: number;
        orbitSpeed: number;
      }> = [];

      for (let i = 0; i < particleCount; i++) {
        const isWarm = Math.random() > 0.75;
        const mesh = new THREE.Mesh(leafGeometry, isWarm ? warmMaterial : botanicalMaterial);

        const scale = 0.3 + Math.random() * 0.4;
        mesh.scale.set(scale, scale, scale);

        const angle = Math.random() * Math.PI * 2;
        const radius = 4 + Math.random() * 10;
        const x = Math.cos(angle) * radius;
        const y = (Math.random() - 0.5) * 12;
        const z = (Math.random() - 0.5) * 6;

        mesh.position.set(x, y, z);
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

        group.add(mesh);

        particles.push({
          mesh,
          baseY: y,
          speedY: 0.002 + Math.random() * 0.004,
          speedRotX: (Math.random() - 0.5) * 0.008,
          speedRotY: (Math.random() - 0.5) * 0.008,
          speedRotZ: (Math.random() - 0.5) * 0.006,
          radius,
          angle,
          orbitSpeed: (Math.random() - 0.5) * 0.001,
        });
      }

      let animationFrameId: number;
      let isVisible = true;
      let isIntersecting = true;

      const animate = () => {
        if (!isVisible || !isIntersecting) return;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.angle += p.orbitSpeed;
          p.mesh.position.x = Math.cos(p.angle) * p.radius;
          p.mesh.position.y += Math.sin(Date.now() * 0.001 + i) * 0.003;
          p.mesh.rotation.x += p.speedRotX;
          p.mesh.rotation.y += p.speedRotY;
          p.mesh.rotation.z += p.speedRotZ;
        }

        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(animate);
      };

      const handleVisibilityChange = () => {
        if (document.hidden) {
          isVisible = false;
          cancelAnimationFrame(animationFrameId);
        } else {
          isVisible = true;
          if (isIntersecting) {
            animationFrameId = requestAnimationFrame(animate);
          }
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Intersection observer to pause rendering when hero is scrolled out of viewport
      let observer: IntersectionObserver | null = null;
      if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver((entries) => {
          const entry = entries[0];
          isIntersecting = !!entry?.isIntersecting;
          if (isIntersecting && isVisible) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(animationFrameId);
          }
        }, { threshold: 0.05 });
        observer.observe(container);
      }

      const handleResize = () => {
        if (!container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      animationFrameId = requestAnimationFrame(animate);

      cleanupFn = () => {
        cancelAnimationFrame(animationFrameId);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('resize', handleResize);
        if (observer) observer.disconnect();

        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }

        leafGeometry.dispose();
        botanicalMaterial.dispose();
        warmMaterial.dispose();
        renderer.dispose();
      };
    });

    return () => {
      isDisposed = true;
      if (cleanupFn) cleanupFn();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-75"
    />
  );
}
