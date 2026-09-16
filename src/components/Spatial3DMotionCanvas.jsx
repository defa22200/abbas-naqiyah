import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Spatial3DMotionCanvas — the spatial layer behind the invitation.
 *
 * - Lazily initialised only after Act 0 resolves, so first paint stays cheap.
 * - Per-stage colour grading (linen → moss → sage → mist → champagne) lerped onto the
 *   light rig via ScrollTrigger-free stage props.
 * - Render loop pauses on `visibilitychange`; DPR clamped to <= 2.
 */
const STAGE_LIGHTING = {
  linen: { ambient: 0xfffaf0, key: 0xfff6e6, rim: 0xc7a86b, cursor: 0xfff2d8, exposure: 1.15 },
  moss: { ambient: 0xbfd0c2, key: 0xf0e6d0, rim: 0xc7a86b, cursor: 0xffeec4, exposure: 0.95 },
  sage: { ambient: 0xe6f0e8, key: 0xfff8ec, rim: 0x93a899, cursor: 0xfff2d8, exposure: 1.1 },
  mist: { ambient: 0xfff6ea, key: 0xfffaf0, rim: 0xd8c49a, cursor: 0xfff4de, exposure: 1.2 },
  champagne: { ambient: 0xfff2d4, key: 0xfffaf0, rim: 0xc7a86b, cursor: 0xffeab8, exposure: 1.25 },
};

export default function Spatial3DMotionCanvas({ stage = 'linen', isReady = true }) {
  const mountRef = useRef(null);
  const stageRef = useRef(stage);

  // Keep the latest stage available to the render loop without re-initialising it
  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || !isReady) return;

    // 1. Scene & camera
    const scene = new THREE.Scene();

    let width = window.innerWidth;
    let height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 12);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    // ponytail: phones get 1.5x — 2x fullscreen WebGL is the main low-end killer.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 640 ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Procedural studio environment map for specular realism
    const envCanvas = document.createElement('canvas');
    envCanvas.width = 512;
    envCanvas.height = 256;
    const envCtx = envCanvas.getContext('2d');

    const grad = envCtx.createLinearGradient(0, 0, 512, 256);
    grad.addColorStop(0, '#FFFDF9');
    grad.addColorStop(0.3, '#E6D3A8');
    grad.addColorStop(0.65, '#FFF9ED');
    grad.addColorStop(1, '#B08C3F');
    envCtx.fillStyle = grad;
    envCtx.fillRect(0, 0, 512, 256);

    envCtx.fillStyle = '#FFFFFF';
    envCtx.beginPath();
    envCtx.ellipse(140, 70, 95, 50, 0.3, 0, Math.PI * 2);
    envCtx.fill();
    envCtx.beginPath();
    envCtx.ellipse(380, 180, 115, 60, -0.2, 0, Math.PI * 2);
    envCtx.fill();

    const envTexture = new THREE.CanvasTexture(envCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = envTexture;

    // 3. Lighting rig (colour-graded per stage)
    const ambientLight = new THREE.AmbientLight(0xfffaf0, 1.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff6e6, 3.4);
    keyLight.position.set(6, 12, 8);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc7a86b, 2.6);
    rimLight.position.set(-8, -6, 5);
    scene.add(rimLight);

    const cursorLight = new THREE.PointLight(0xfff2d8, 4.2, 16);
    cursorLight.position.set(0, 0, 4);
    scene.add(cursorLight);

    // 4. Materials — antique gold, champagne gold, celadon jade
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xffe194,
      metalness: 0.96,
      roughness: 0.1,
      envMapIntensity: 2.6,
    });

    const antiqueGoldMaterial = new THREE.MeshStandardMaterial({
      color: 0xc5a059,
      metalness: 0.94,
      roughness: 0.16,
      envMapIntensity: 2.4,
    });

    const jadeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x93a899,
      metalness: 0.5,
      roughness: 0.2,
      transparent: true,
      opacity: 0.55,
      envMapIntensity: 1.4,
    });

    const wireframeGoldMat = new THREE.MeshBasicMaterial({
      color: 0xd8b245,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });

    // 5. Interlocking 3D wedding rings
    const ringsGroup = new THREE.Group();
    const ringRadius = 1.05;
    const ringGeom = new THREE.TorusGeometry(ringRadius, 0.09, 36, 90);

    const ring1 = new THREE.Mesh(ringGeom, goldMaterial);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;

    const ring2 = new THREE.Mesh(ringGeom, antiqueGoldMaterial);
    ring2.position.x = ringRadius * 0.95;
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = -Math.PI / 5;

    ringsGroup.add(ring1);
    ringsGroup.add(ring2);
    scene.add(ringsGroup);

    // 6. Flowing golden spline ribbon
    const splinePoints = [
      new THREE.Vector3(-4, 8, -3),
      new THREE.Vector3(-2, 4, 1),
      new THREE.Vector3(2.5, 0.5, -0.5),
      new THREE.Vector3(3.8, -4, 1.5),
      new THREE.Vector3(0.5, -8, -1),
      new THREE.Vector3(-3.5, -12, 0.5),
    ];
    const splineCurve = new THREE.CatmullRomCurve3(splinePoints);
    const ribbonGeom = new THREE.TubeGeometry(splineCurve, 100, 0.045, 12, false);
    const ribbonMat = new THREE.MeshPhysicalMaterial({
      color: 0xf5d37e,
      metalness: 0.9,
      roughness: 0.15,
      transparent: true,
      opacity: 0.26,
      emissive: 0x8a6a20,
      emissiveIntensity: 0.16,
    });
    const ribbonMesh = new THREE.Mesh(ribbonGeom, ribbonMat);
    scene.add(ribbonMesh);

    // 7. Islamic geometric polyhedra — celadon jade crystal with gold wireframes
    const octaGeom = new THREE.OctahedronGeometry(0.7, 0);
    const icosaGeom = new THREE.IcosahedronGeometry(0.55, 0);

    const prism1Group = new THREE.Group();
    prism1Group.add(new THREE.Mesh(octaGeom, jadeMaterial));
    prism1Group.add(new THREE.Mesh(new THREE.OctahedronGeometry(0.8, 0), wireframeGoldMat));

    const prism2Group = new THREE.Group();
    prism2Group.add(new THREE.Mesh(icosaGeom, jadeMaterial));
    prism2Group.add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.64, 0), wireframeGoldMat));

    scene.add(prism1Group);
    scene.add(prism2Group);

    // 8. Celestial gold stardust + floating gold flecks
    const particlesGroup = new THREE.Group();
    const petalCount = 20;
    const fleckMeshes = [];

    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, 0);
    petalShape.quadraticCurveTo(0.12, 0.2, 0, 0.35);
    petalShape.quadraticCurveTo(-0.12, 0.2, 0, 0);
    const petalGeom = new THREE.ShapeGeometry(petalShape);

    const fleckMat1 = new THREE.MeshStandardMaterial({
      color: 0xe5d3a3,
      roughness: 0.35,
      metalness: 0.6,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.48,
    });

    const fleckMat2 = new THREE.MeshStandardMaterial({
      color: 0xc7a86b,
      roughness: 0.4,
      metalness: 0.7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.42,
    });

    for (let i = 0; i < petalCount; i++) {
      const mat = i % 2 === 0 ? fleckMat1 : fleckMat2;
      const mesh = new THREE.Mesh(petalGeom, mat);
      const scale = Math.random() * 0.6 + 0.5;
      mesh.scale.set(scale, scale, scale);
      mesh.position.set(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 6
      );
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      mesh.userData = {
        speedY: Math.random() * 0.012 + 0.006,
        rotSpeedX: (Math.random() - 0.5) * 0.02,
        rotSpeedY: (Math.random() - 0.5) * 0.02,
        wobbleSpeed: Math.random() * 1.5 + 0.8,
        initialX: mesh.position.x,
      };
      particlesGroup.add(mesh);
      fleckMeshes.push(mesh);
    }

    // Golden micro-stardust
    const stardustGeom = new THREE.SphereGeometry(0.035, 12, 12);
    const stardustMeshes = [];
    for (let i = 0; i < 16; i++) {
      const mesh = new THREE.Mesh(stardustGeom, goldMaterial);
      mesh.position.set(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 6
      );
      mesh.userData = {
        floatOffset: Math.random() * Math.PI * 2,
        initialY: mesh.position.y,
      };
      particlesGroup.add(mesh);
      stardustMeshes.push(mesh);
    }
    scene.add(particlesGroup);

    // 9. Responsive framing
    let worldHalfW = 6;
    // Resting heights, captured from the responsive layout so the scroll-driven
    // motion below drifts around the real position instead of a stale constant.
    const baseY = { rings: 1.2, prism1: 2.4, prism2: -3.0 };
    const updateDimensionsAndPositions = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const aspect = width / height;
      const isMob = width < 768;

      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const vFovHeight = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
      worldHalfW = (vFovHeight * aspect) / 2;

      // Objects are pushed hard to the frame edges and kept small: on a phone the
      // content column spans almost the full width, so anything central would
      // compete with the invitation text.
      if (isMob) {
        ringsGroup.position.set(Math.max(worldHalfW * 0.95, 1.7), 1.4, -1.5);
        ringsGroup.scale.set(0.4, 0.4, 0.4);

        prism1Group.position.set(-Math.max(worldHalfW * 0.96, 1.75), 2.6, -1.5);
        prism1Group.scale.set(0.44, 0.44, 0.44);

        prism2Group.position.set(-Math.max(worldHalfW * 0.92, 1.65), -3.1, -1);
        prism2Group.scale.set(0.4, 0.4, 0.4);

        ribbonMesh.position.x = worldHalfW * 0.98;
        ribbonMesh.scale.set(0.3, 0.72, 0.3);
      } else {
        ringsGroup.position.set(Math.min(worldHalfW * 0.8, 5.6), 1.2, -0.6);
        ringsGroup.scale.set(0.68, 0.68, 0.68);

        prism1Group.position.set(Math.max(-worldHalfW * 0.85, -6), 2.4, -1.4);
        prism1Group.scale.set(0.72, 0.72, 0.72);

        prism2Group.position.set(Math.max(-worldHalfW * 0.8, -5.6), -3.2, -0.8);
        prism2Group.scale.set(0.68, 0.68, 0.68);

        ribbonMesh.position.x = worldHalfW * 0.62;
        ribbonMesh.scale.set(0.62, 0.95, 0.62);
      }

      baseY.rings = ringsGroup.position.y;
      baseY.prism1 = prism1Group.position.y;
      baseY.prism2 = prism2Group.position.y;
    };

    updateDimensionsAndPositions();

    // 10. Scroll & pointer tracking
    let scrollY = window.scrollY;
    let targetScrollY = window.scrollY;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };
    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / width - 0.5) * 2;
      targetMouseY = (e.clientY / height - 0.5) * 2;
    };
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        targetMouseX = (e.touches[0].clientX / width - 0.5) * 2;
        targetMouseY = (e.touches[0].clientY / height - 0.5) * 2;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', updateDimensionsAndPositions, { passive: true });

    // 11. Pause the loop when the tab is hidden
    let isPaused = document.hidden;
    const handleVisibility = () => {
      isPaused = document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // 12. Stage colour grading — lerped toward the active stage palette
    const stageColorTargets = Object.fromEntries(
      Object.entries(STAGE_LIGHTING).map(([key, value]) => [
        key,
        {
          ambient: new THREE.Color(value.ambient),
          key: new THREE.Color(value.key),
          rim: new THREE.Color(value.rim),
          cursor: new THREE.Color(value.cursor),
          exposure: value.exposure,
        },
      ])
    );
    const gradeToStage = (delta) => {
      const target = stageColorTargets[stageRef.current] || stageColorTargets.linen;
      const alpha = Math.min(1, delta * 1.6);

      ambientLight.color.lerp(target.ambient, alpha);
      keyLight.color.lerp(target.key, alpha);
      rimLight.color.lerp(target.rim, alpha);
      cursorLight.color.lerp(target.cursor, alpha);
      renderer.toneMappingExposure +=
        (target.exposure - renderer.toneMappingExposure) * alpha;
    };

    // 13. Render loop
    let animationId;
    const clock = new THREE.Clock();
    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ponytail: reduced-motion gets one static frame, not a running universe.
    if (reduceMotion) {
      gradeToStage(1);
      renderer.render(scene, camera);
      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('resize', updateDimensionsAndPositions);
        document.removeEventListener('visibilitychange', handleVisibility);
        if (container && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
        envTexture.dispose();
      };
    }

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.05);
      if (isPaused) return;
      const elapsedTime = clock.getElapsedTime();

      gradeToStage(delta);

      scrollY += (targetScrollY - scrollY) * 0.08;
      const maxScroll = Math.max(document.body.scrollHeight - height, 1);
      const scrollProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      cursorLight.position.x = mouseX * worldHalfW * 0.9;
      cursorLight.position.y = -mouseY * 4.5;

      const targetCamZ = 12 - Math.sin(scrollProgress * Math.PI) * 2.5;
      camera.position.z += (targetCamZ - camera.position.z) * 0.05;
      camera.position.x = mouseX * 0.55;
      camera.position.y = -mouseY * 0.4 + Math.sin(elapsedTime * 0.5) * 0.08;
      camera.rotation.z = Math.sin(scrollProgress * Math.PI * 2) * 0.035;
      camera.lookAt(0, 0, 0);

      // Interlocking rings
      ringsGroup.rotation.y = elapsedTime * 0.22 + scrollProgress * Math.PI * 4;
      ringsGroup.rotation.x = Math.sin(elapsedTime * 0.25) * 0.15 + scrollProgress * Math.PI * 2;
      ringsGroup.rotation.z = Math.cos(elapsedTime * 0.2) * 0.1;
      ringsGroup.position.y = baseY.rings - scrollProgress * 3.6 + Math.sin(elapsedTime * 0.7) * 0.12;

      // Golden spline ribbon
      ribbonMesh.rotation.y = Math.sin(elapsedTime * 0.2) * 0.2 + scrollProgress * 1.5;
      ribbonMesh.rotation.z = Math.cos(elapsedTime * 0.15) * 0.1;

      // Geometric prisms
      prism1Group.rotation.x = elapsedTime * 0.35 + scrollProgress * Math.PI * 2.8;
      prism1Group.rotation.y = elapsedTime * 0.4 + scrollProgress * Math.PI * 2.2;
      prism1Group.position.y = baseY.prism1 - scrollProgress * 4.2 + Math.cos(elapsedTime * 0.6) * 0.15;

      prism2Group.rotation.x = -elapsedTime * 0.3 + scrollProgress * Math.PI * 2.4;
      prism2Group.rotation.z = elapsedTime * 0.35;
      prism2Group.position.y = baseY.prism2 + scrollProgress * 5.0 + Math.sin(elapsedTime * 0.7) * 0.15;

      // Gold flecks
      for (let i = 0; i < fleckMeshes.length; i++) {
        const p = fleckMeshes[i];
        p.position.y -= p.userData.speedY * (1 + scrollProgress * 1.5);
        p.rotation.x += p.userData.rotSpeedX;
        p.rotation.y += p.userData.rotSpeedY;
        p.position.x = p.userData.initialX + Math.sin(elapsedTime * p.userData.wobbleSpeed + i) * 0.4;
        if (p.position.y < -9) p.position.y = 9;
      }

      // Golden stardust
      for (let i = 0; i < stardustMeshes.length; i++) {
        const s = stardustMeshes[i];
        s.position.y =
          s.userData.initialY +
          Math.sin(elapsedTime * 1.4 + s.userData.floatOffset) * 0.35 -
          scrollProgress * 2.5;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 14. Teardown
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', updateDimensionsAndPositions);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      envTexture.dispose();
    };
  }, [isReady]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none z-0 select-none overflow-hidden transition-opacity duration-1000 ${
        isReady ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
}
