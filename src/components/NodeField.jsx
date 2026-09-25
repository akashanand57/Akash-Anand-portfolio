import { useEffect, useRef } from 'react'

// A restrained "agent graph" — drifting nodes connected by thin lines that
// brighten near the cursor. Static single frame under reduced-motion.
export default function NodeField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width, height, dpr
    let nodes = []
    const mouse = { x: -9999, y: -9999 }
    let raf

    const cssVar = (name) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim()
    const rgb = (name, a) => `rgb(${cssVar(name)} / ${a})`

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(64, Math.floor((width * height) / 16000))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.8,
      }))
    }

    function draw() {
      ctx.clearRect(0, 0, width, height)
      const linkDist = 130

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        if (!reduce) {
          n.x += n.vx
          n.y += n.vy
          if (n.x < 0 || n.x > width) n.vx *= -1
          if (n.y < 0 || n.y > height) n.vy *= -1
        }

        // links
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j]
          const dx = n.x - m.x
          const dy = n.y - m.y
          const dist = Math.hypot(dx, dy)
          if (dist < linkDist) {
            const near =
              Math.hypot(n.x - mouse.x, n.y - mouse.y) < 160 ||
              Math.hypot(m.x - mouse.x, m.y - mouse.y) < 160
            const alpha = (1 - dist / linkDist) * (near ? 0.55 : 0.14)
            ctx.strokeStyle = near ? rgb('--c-primary', alpha) : rgb('--c-secondary', alpha)
            ctx.lineWidth = near ? 1 : 0.6
            ctx.beginPath()
            ctx.moveTo(n.x, n.y)
            ctx.lineTo(m.x, m.y)
            ctx.stroke()
          }
        }
      }

      // nodes
      for (const n of nodes) {
        const near = Math.hypot(n.x - mouse.x, n.y - mouse.y) < 160
        ctx.fillStyle = near ? rgb('--c-primary', 0.9) : rgb('--c-muted', 0.5)
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fill()
      }

      if (!reduce) raf = requestAnimationFrame(draw)
    }

    function onMove(e) {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    function onLeave() {
      mouse.x = -9999
      mouse.y = -9999
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  )
}
