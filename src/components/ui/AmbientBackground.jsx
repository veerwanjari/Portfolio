import React, { useEffect } from "react";

export default function AmbientBackground() {
  useEffect(() => {
    const canvas = document.getElementById("plexus-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const faceCanvas = document.createElement("canvas");
    const faceCtx = faceCanvas.getContext("2d");

    let width = (canvas.width = faceCanvas.width = window.innerWidth);
    let height = (canvas.height = faceCanvas.height = window.innerHeight);

    let mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      isDown: false,
      isOutside: true,
      speed: 0,
    };

    let scrollY = window.scrollY;
    let targetScrollY = window.scrollY;

    let hoveredParticle = null;
    let draggedParticle = null;
    let isRotatingNet = false;
    let lastMousePos = { x: 0, y: 0 };

    let netsCount = 6;
    let netRotations = [];
    let nets = [];
    let dustParticles = [];
    let ambientOrbs = [];

    const particlesCount = 65;
    const maxLineDistance = 200;
    const maxFaceDistance = 120;
    const dustCount = 65;
    const minVertexDistance = 35;

    class Particle {
      constructor(baseX, baseY, baseZ) {
        this.ox = baseX;
        this.oy = baseY;
        this.oz = baseZ;
        this.x = baseX;
        this.y = baseY;
        this.z = baseZ;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;
        this.vz = (Math.random() - 0.5) * 0.25;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.02 + Math.random() * 0.025;
        this.screenX = 0;
        this.screenY = 0;
        this.projZ = 0;
      }

      update(particlesArray) {
        if (draggedParticle === this) return;

        for (let i = 0; i < particlesArray.length; i++) {
          const other = particlesArray[i];
          if (other === this) continue;

          const dx = this.x - other.x;
          const dy = this.y - other.y;
          const dz = this.z - other.z;
          const dist = Math.hypot(dx, dy, dz);

          if (dist > 0 && dist < minVertexDistance) {
            const overlap = (minVertexDistance - dist) / dist;
            this.vx += dx * overlap * 0.015;
            this.vy += dy * overlap * 0.015;
            this.vz += dz * overlap * 0.015;
          }
        }

        this.vx *= 0.98;
        this.vy *= 0.98;
        this.vz *= 0.98;

        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;
        this.pulse += this.pulseSpeed;

        const dist3D = Math.hypot(this.x - this.ox, this.y - this.oy, this.z - this.oz);
        if (dist3D > 140) {
          this.vx *= -1;
          this.vy *= -1;
          this.vz *= -1;
        }
      }
    }

    class Dust {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = (Math.random() - 0.1) * (width * 1.2);
        this.y = Math.random() * (height * netsCount);
        this.size = 0.5 + Math.random() * 1.5;
        this.alpha = 0.08 + Math.random() * 0.35;
        this.speedY = -0.05 - Math.random() * 0.15;
        this.speedX = (Math.random() - 0.5) * 0.1;
        this.twinkle = Math.random() * Math.PI * 2;
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.twinkle += 0.03;
        const totalHeight = height * netsCount;
        if (this.y < -10 || this.x < -20 || this.x > width + 20) {
          this.reset();
          this.y = totalHeight + 10;
        }
      }
      draw() {
        let screenY = this.y - scrollY;
        if (screenY < -20 || screenY > height + 20) return;
        let currentAlpha = this.alpha + Math.sin(this.twinkle) * 0.2;
        currentAlpha = Math.max(0.04, Math.min(0.4, currentAlpha));

        ctx.fillStyle = `rgba(180, 240, 230, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(this.x, screenY, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class AmbientOrb {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * (height * netsCount);
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = 200 + Math.random() * 250;
        this.r = Math.floor(Math.random() * 150);
        this.g = Math.floor(Math.random() * 200);
        this.b = Math.floor(100 + Math.random() * 155);
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        const totalHeight = height * netsCount;
        if (this.x < -this.radius) this.x = width + this.radius;
        if (this.x > width + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = totalHeight + this.radius;
        if (this.y > totalHeight + this.radius) this.y = -this.radius;
      }
      draw() {
        let screenY = this.y - scrollY;
        if (screenY < -this.radius || screenY > height + this.radius) return;

        const orbGrad = ctx.createRadialGradient(this.x, screenY, 0, this.x, screenY, this.radius);
        orbGrad.addColorStop(0.0, `rgba(${this.r}, ${this.g}, ${this.b}, 0.14)`);
        orbGrad.addColorStop(0.5, `rgba(${this.r}, ${this.g}, ${this.b}, 0.05)`);
        orbGrad.addColorStop(1.0, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = orbGrad;
        ctx.beginPath();
        ctx.arc(this.x, screenY, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function calculateNetsCount() {
      const docHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        window.innerHeight * 8
      );
      return Math.max(8, Math.ceil(docHeight / window.innerHeight) + 2);
    }

    function initNets() {
      netsCount = calculateNetsCount();
      netRotations = [];
      for (let i = 0; i < netsCount; i++) {
        netRotations.push({
          rotX: 0,
          rotY: 0,
          targetRotX: 0,
          targetRotY: i * 1.5,
        });
      }

      nets = [];
      const marginX = width * 0.55;
      const marginY = height * 0.55;
      const depthSpan = Math.min(width, height) * 3.0;

      for (let n = 0; n < netsCount; n++) {
        let particles = [];
        let netCenterY = height * 0.5 + n * height;
        for (let i = 0; i < particlesCount; i++) {
          let x = -marginX + Math.random() * (width + marginX * 2);
          
          // --- BUG FIXED HERE ---
          // Before: it just spawned randomly near 0 for all nets, stretching the bottom ones.
          // Now: It properly centers the math vertically around each net's actual position!
          let y = netCenterY + (Math.random() - 0.5) * (height + marginY * 2); 
          
          let z = (Math.random() - 0.5) * depthSpan;
          particles.push(new Particle(x, y, z));
        }
        nets.push({ particles, centerY: netCenterY });
      }
    }

    function initDust() {
      dustParticles = [];
      for (let i = 0; i < dustCount; i++) dustParticles.push(new Dust());
    }

    function initAmbientOrbs() {
      ambientOrbs = [];
      for (let i = 0; i < 6; i++) ambientOrbs.push(new AmbientOrb());
    }

    initNets();
    initDust();
    initAmbientOrbs();

    const timer1 = setTimeout(() => { initNets(); initDust(); }, 500);
    const timer2 = setTimeout(() => { initNets(); initDust(); }, 1500);

    const resizeObserver = new ResizeObserver(() => {
      initNets();
      initDust();
    });
    resizeObserver.observe(document.body);

    function getColor(y, alpha, type = "rgba") {
      let t = Math.max(0, Math.min(1, y / height));
      let r, g, b;
      if (t < 0.25) {
        let f = t / 0.25;
        r = Math.round(50 + f * 20);
        g = Math.round(210 - f * 40);
        b = Math.round(180 + f * 50);
      } else if (t < 0.5) {
        let f = (t - 0.25) / 0.25;
        r = Math.round(70 + f * 20);
        g = Math.round(170 - f * 70);
        b = Math.round(230 + f * 25);
      } else if (t < 0.75) {
        let f = (t - 0.5) / 0.25;
        r = Math.round(90 + f * 70);
        g = Math.round(100 - f * 60);
        b = Math.round(255);
      } else {
        let f = (t - 0.75) / 0.25;
        r = Math.round(160 + f * 70);
        g = Math.round(40 - f * 30);
        b = Math.round(255 - f * 40);
      }
      r = Math.min(255, Math.max(0, r));
      g = Math.min(255, Math.max(0, g));
      b = Math.min(255, Math.max(0, b));
      if (type === "rgb") return `${r}, ${g}, ${b}`;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function updateMousePos(clientX, clientY) {
      const dx = clientX - mouse.targetX;
      const dy = clientY - mouse.targetY;
      const dist = Math.hypot(dx, dy);
      mouse.speed = Math.min(30, mouse.speed * 0.4 + dist * 0.6);
      mouse.targetX = clientX;
      mouse.targetY = clientY;
      mouse.isOutside = false;
    }

    const handleScroll = () => {
      targetScrollY = window.scrollY;
      const scrollDelta = Math.abs(window.scrollY - scrollY);
      mouse.speed = Math.min(35, mouse.speed + scrollDelta * 0.8);
    };

    const handleMouseMove = (e) => {
      updateMousePos(e.clientX, e.clientY);
      const activeNetIndex = Math.floor((scrollY + e.clientY) / height);
      const clampedIndex = Math.max(0, Math.min(netsCount - 1, activeNetIndex));

      if (draggedParticle) {
        unprojectMouseToParticle(draggedParticle, e.clientX, e.clientY, nets[clampedIndex].centerY);
      } else if (isRotatingNet) {
        const deltaX = e.clientX - lastMousePos.x;
        const deltaY = e.clientY - lastMousePos.y;
        netRotations[clampedIndex].targetRotY += deltaX * 0.018;
        netRotations[clampedIndex].targetRotX += deltaY * 0.018;
        lastMousePos = { x: e.clientX, y: e.clientY };
      } else {
        checkHover(e.clientX, e.clientY);
      }
    };

    const handleMouseLeave = () => {
      mouse.isOutside = true;
      mouse.speed = 0;
    };

    const handleMouseDown = (e) => {
      mouse.isDown = true;
      checkHover(e.clientX, e.clientY);
      if (hoveredParticle) {
        draggedParticle = hoveredParticle;
      } else {
        isRotatingNet = true;
        lastMousePos = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      mouse.isDown = false;
      draggedParticle = null;
      isRotatingNet = false;
    };

    const handleTouchStart = (e) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        updateMousePos(t.clientX, t.clientY);
        checkHover(t.clientX, t.clientY);
        if (hoveredParticle) {
          draggedParticle = hoveredParticle;
        } else {
          isRotatingNet = true;
          lastMousePos = { x: t.clientX, y: t.clientY };
        }
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        updateMousePos(t.clientX, t.clientY);
        const activeNetIndex = Math.floor((scrollY + t.clientY) / height);
        const clampedIndex = Math.max(0, Math.min(netsCount - 1, activeNetIndex));

        if (draggedParticle) {
          unprojectMouseToParticle(draggedParticle, t.clientX, t.clientY, nets[clampedIndex].centerY);
        } else if (isRotatingNet) {
          const deltaX = t.clientX - lastMousePos.x;
          const deltaY = t.clientY - lastMousePos.y;
          netRotations[clampedIndex].targetRotY += deltaX * 0.018;
          netRotations[clampedIndex].targetRotX += deltaY * 0.018;
          lastMousePos = { x: t.clientX, y: t.clientY };
        }
      }
    };

    const handleTouchEnd = () => {
      draggedParticle = null;
      isRotatingNet = false;
      mouse.isOutside = true;
      mouse.speed = 0;
    };

    let lastResizeWidth = window.innerWidth;
    let lastResizeHeight = window.innerHeight;

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      width = canvas.width = faceCanvas.width = w;
      height = canvas.height = faceCanvas.height = h;

      // A same-width resize on mobile is almost always the URL bar showing
      // or hiding, not a real layout change, so it no longer restarts the
      // whole particle scene mid-scroll.
      const widthChanged = w !== lastResizeWidth;
      const heightJump = Math.abs(h - lastResizeHeight) > lastResizeHeight * 0.25;
      if (widthChanged || heightJump) {
        lastResizeWidth = w;
        lastResizeHeight = h;
        initNets();
        initDust();
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("resize", handleResize);

    function checkHover(mx, my) {
      let closest = null;
      let minDist = 32;
      const activeNetIndex = Math.floor((scrollY + my) / height);
      const clampedIndex = Math.max(0, Math.min(netsCount - 1, activeNetIndex));

      nets[clampedIndex].particles.forEach((p) => {
        const dist = Math.hypot(p.screenX - mx, p.screenY - my);
        if (dist < minDist) {
          minDist = dist;
          closest = p;
        }
      });
      hoveredParticle = closest;
    }

    function unprojectMouseToParticle(p, mx, my, netCenterY) {
      const parallaxShiftX = (mouse.x - width / 2) * 0.025;
      const parallaxShiftY = (mouse.y - height / 2) * 0.025;
      const centerX = width / 2 + parallaxShiftX;
      const fov = 500;

      const activeNetIndex = Math.floor(netCenterY / height);
      const rot = netRotations[activeNetIndex];
      const parallaxAngleY = (mouse.x - width / 2) * 0.0001;
      const parallaxAngleX = (mouse.y - height / 2) * 0.0001;
      const angleY = rot.rotY + parallaxAngleY;
      const angleX = rot.rotX + parallaxAngleX;

      const z2 = p.projZ;
      const perspective = fov / (fov + z2 + 250);

      const x2 = (mx - centerX) / perspective;
      const y1 = (my - (netCenterY - scrollY + parallaxShiftY)) / perspective;

      const dx1 = x2 * Math.cos(angleY) - z2 * Math.sin(angleY);
      const dz1 = x2 * Math.sin(angleY) + z2 * Math.cos(angleY);
      const dy1 = y1;

      const dx = dx1;
      const dy = dy1 * Math.cos(angleX) + dz1 * Math.sin(angleX);
      const dz = -dy1 * Math.sin(angleX) + dz1 * Math.cos(angleX);

      p.x = centerX + dx;
      p.y = netCenterY + dy;
      p.z = dz;
      p.ox = p.x;
      p.oy = p.y;
      p.oz = p.z;
    }

    let animationFrameId;
    let frameCount = 0;
    function animate() {
      frameCount++;
      scrollY += (targetScrollY - scrollY) * 0.1;
      mouse.x += (mouse.targetX - mouse.x) * 0.4;
      mouse.y += (mouse.targetY - mouse.y) * 0.4;
      mouse.speed *= 0.82;

      ctx.clearRect(0, 0, width, height);

      ambientOrbs.forEach((orb) => {
        orb.update();
        orb.draw();
      });

      dustParticles.forEach((d) => {
        d.update();
        d.draw();
      });

      nets.forEach((net, netIndex) => {
        const rot = netRotations[netIndex];
        if (!draggedParticle) {
          rot.targetRotY += 0.004;
        }

        rot.rotX += (rot.targetRotX - rot.rotX) * 0.0009;
        rot.rotY += (rot.targetRotY - rot.rotY) * 0.0009;

        const parallaxAngleY = (mouse.x - width / 2) * 0.0001;
        const parallaxAngleX = (mouse.y - height / 2) * 0.0001;
        const angleY = rot.rotY + parallaxAngleY;
        const angleX = rot.rotX + parallaxAngleX;

        const parallaxShiftX = (mouse.x - width / 2) * 0.025;
        const parallaxShiftY = (mouse.y - height / 2) * 0.025;
        const centerX = width / 2 + parallaxShiftX;
        const centerY = net.centerY - scrollY + parallaxShiftY;
        const fov = 500;

        if (centerY < -height * 2.5 || centerY > height * 3.5) return;

        const projected = net.particles.map((p) => {
          p.update(net.particles);
          let dx = p.x - centerX;
          let dy = p.y - net.centerY;
          let dz = p.z;

          let y1 = dy * Math.cos(angleX) - dz * Math.sin(angleX);
          let z1 = dy * Math.sin(angleX) + dz * Math.cos(angleX);
          let x2 = dx * Math.cos(angleY) + z1 * Math.sin(angleY);
          let z2 = -dx * Math.sin(angleY) + z1 * Math.cos(angleY);

          const perspective = fov / (fov + z2 + 250);
          const screenX = centerX + x2 * perspective;
          const screenY = centerY + y1 * perspective;

          p.screenX = screenX;
          p.screenY = screenY;
          p.projZ = z2;

          return { x: screenX, y: screenY, z: z2, p: p };
        });

        let faces = net._faces || [];
        if (frameCount % 2 === 0) {
          faces = [];
          for (let i = 0; i < projected.length; i++) {
            for (let j = i + 1; j < projected.length; j++) {
              for (let k = j + 1; k < projected.length; k++) {
                const p1 = projected[i];
                const p2 = projected[j];
                const p3 = projected[k];

                const d12 = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                const d23 = Math.hypot(p2.x - p3.x, p2.y - p3.y);
                const d31 = Math.hypot(p3.x - p1.x, p3.y - p1.y);

                if (d12 < maxFaceDistance && d23 < maxFaceDistance && d31 < maxFaceDistance) {
                  const avgY = (p1.y + p2.y + p3.y) / 3;
                  const avgZ = (p1.z + p2.z + p3.z) / 3;
                  const isInteracted =
                    p1.p === hoveredParticle ||
                    p2.p === hoveredParticle ||
                    p3.p === hoveredParticle ||
                    p1.p === draggedParticle ||
                    p2.p === draggedParticle ||
                    p3.p === draggedParticle;

                  faces.push({ p1, p2, p3, avgY, avgZ, isInteracted });
                }
              }
            }
          }
          net._faces = faces;
        }

        faces.sort((a, b) => a.avgZ - b.avgZ);
        faceCtx.clearRect(0, 0, width, height);

        faces.forEach((face) => {
          const depthAlpha = Math.max(0.03, (face.avgZ + 400) / 800);
          faceCtx.beginPath();
          faceCtx.moveTo(face.p1.x, face.p1.y);
          faceCtx.lineTo(face.p2.x, face.p2.y);
          faceCtx.lineTo(face.p3.x, face.p3.y);
          faceCtx.closePath();

          let faceAlpha = (face.isInteracted ? 0.14 : 0.06) * depthAlpha;
          faceCtx.fillStyle = getColor(face.p1.y - net.centerY + height / 2, faceAlpha);
          faceCtx.fill();
        });

        ctx.save();
        ctx.globalAlpha = 0.35;
        ctx.drawImage(faceCanvas, 0, 0);
        ctx.restore();

        for (let i = 0; i < projected.length; i++) {
          for (let j = i + 1; j < projected.length; j++) {
            const p1 = projected[i];
            const p2 = projected[j];
            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

            if (dist < maxLineDistance) {
              const avgY = (p1.y + p2.y) / 2;
              const avgZ = (p1.z + p2.z) / 2;
              const depthFactor = Math.max(0.08, (avgZ + 400) / 800);

              const isConnectedToActive =
                p1.p === hoveredParticle ||
                p2.p === hoveredParticle ||
                p1.p === draggedParticle ||
                p2.p === draggedParticle;

              const alpha =
                (1 - dist / maxLineDistance) *
                (isConnectedToActive ? 0.6 : 0.42 + depthFactor * 0.4);

              ctx.strokeStyle = getColor(avgY - centerY + height / 2, alpha);
              ctx.lineWidth = isConnectedToActive ? 1.5 : 0.85;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }

        projected.forEach((p) => {
          const perspective = fov / (fov + p.z + 250);
          const isTarget = p.p === hoveredParticle || p.p === draggedParticle;
          const radius = Math.max(0.5, (isTarget ? 3.0 : 1.3) * perspective);
          const pulseIntensity = 0.85 + Math.sin(p.p.pulse) * 0.35;

          const glowRadius = radius * (isTarget ? 12 : 7) * pulseIntensity;
          const rgb = getColor(p.y - net.centerY + height / 2, 1, "rgb");

          const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
          halo.addColorStop(0.0, `rgba(${rgb}, ${isTarget ? 0.75 : 0.5 * pulseIntensity})`);
          halo.addColorStop(0.4, `rgba(${rgb}, ${isTarget ? 0.3 : 0.18 * pulseIntensity})`);
          halo.addColorStop(1.0, "rgba(0, 0, 0, 0)");

          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
          ctx.fill();

          const coreAlpha = Math.min(0.6, 0.48 * pulseIntensity);
          ctx.fillStyle = isTarget ? "rgba(255, 255, 255, 0.8)" : `rgba(215, 245, 235, ${coreAlpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas id="plexus-canvas" style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1, pointerEvents: "auto" }} />;
}
