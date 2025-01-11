'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from './ThemeProvider'

export function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()
    window.addEventListener('resize', setCanvasSize)

    const particles: { x: number; y: number; speed: number; size: number }[] = []
    const particleCount = 50

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 0.05 + Math.random() * 0.1, 
        size: 1 + Math.random() * 1
      })
    }

    function drawGrid() {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
      ctx.lineWidth = 0.5

      const gridSize = 80 

      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          const opacity = theme === 'dark' ? 0.03 + Math.random() * 0.05 : 0.1 + Math.random() * 0.1
          ctx.fillStyle = theme === 'dark' ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`
          ctx.fillRect(x, y, 1, 1)
        }
      }

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      particles.forEach(particle => {
        particle.y -= particle.speed
        if (particle.y < 0) {
          particle.y = canvas.height
          particle.x = Math.random() * canvas.width
        }

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'
        ctx.fill()
      })

      requestAnimationFrame(drawGrid)
    }

    drawGrid()

    return () => {
      window.removeEventListener('resize', setCanvasSize)
    }
  }, [theme]) 

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ background: theme === 'dark' ? 'linear-gradient(to bottom, #1E1E1E, #141414)' : 'white' }}
    />
  )
}

