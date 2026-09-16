import { useEffect, useRef } from 'react'

export default function ParticleField({ className }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let dpr = 1
    let points = []
    let frameId = null
    const mouse = { x: -9999, y: -9999 }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.min(46, Math.floor((width * height) / 26000))
      points = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        size: Math.random() * 1.6 + 2.2,
        pulse: 0,
        nextPulse: 60 + Math.random() * 400,
      }))
    }

    function drawCross(p, extra) {
      const s = p.size + extra
      ctx.beginPath()
      ctx.moveTo(p.x - s, p.y)
      ctx.lineTo(p.x + s, p.y)
      ctx.moveTo(p.x, p.y - s)
      ctx.lineTo(p.x, p.y + s)
      ctx.stroke()
    }

    function step() {
      ctx.clearRect(0, 0, width, height)

      for (const p of points) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.hypot(dx, dy)
        const near = dist < 110

        p.nextPulse -= 1
        if (p.nextPulse <= 0) {
          p.pulse = 1
          p.nextPulse = 220 + Math.random() * 420
        }
        if (p.pulse > 0) p.pulse -= 0.02

        const baseAlpha = near ? 0.85 : 0.4
        ctx.lineWidth = 1
        ctx.strokeStyle = `rgba(168, 148, 255, ${baseAlpha})`
        drawCross(p, near ? 1.4 : 0)

        if (p.pulse > 0) {
          const ringSize = p.size + (1 - p.pulse) * 16
          ctx.globalAlpha = p.pulse
          ctx.strokeStyle = 'rgba(200, 255, 91, 0.8)'
          ctx.strokeRect(p.x - ringSize, p.y - ringSize, ringSize * 2, ringSize * 2)
          ctx.globalAlpha = 1
        }
      }

      frameId = requestAnimationFrame(step)
    }

    function onMove(e) {
      mouse.x = e.offsetX
      mouse.y = e.offsetY
    }
    function onLeave() {
      mouse.x = -9999
      mouse.y = -9999
    }
    function onVisibility() {
      if (document.hidden) {
        if (frameId) cancelAnimationFrame(frameId)
        frameId = null
      } else if (!prefersReduced && !frameId) {
        frameId = requestAnimationFrame(step)
      }
    }

    resize()
    if (prefersReduced) {
      step()
      cancelAnimationFrame(frameId)
      frameId = null
    } else {
      frameId = requestAnimationFrame(step)
    }

    window.addEventListener('resize', resize)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      if (frameId) cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
