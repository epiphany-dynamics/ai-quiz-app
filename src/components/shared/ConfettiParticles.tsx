import { motion } from 'framer-motion'
import { useMemo } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  color: string
  size: number
  rotation: number
  delay: number
}

const COLORS = [
  '#f0f0f0', // cream
  '#ececec', // cream hover
  '#a1a1aa', // muted grey
  '#ffffff', // white
  '#d4d4d8', // light grey
  '#f0f0f0', // section cream
]

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

interface ConfettiParticlesProps {
  count?: number
  originX?: number
  originY?: number
  spread?: number
}

export function ConfettiParticles({
  count = 20,
  originX = 50,
  originY = 50,
  spread = 180,
}: ConfettiParticlesProps) {
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: randomBetween(-spread, spread),
        y: randomBetween(-spread * 1.2, -spread * 0.2),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: randomBetween(6, 14),
        rotation: randomBetween(-360, 360),
        delay: randomBetween(0, 0.15),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return (
    <div
      style={{
        position: 'absolute',
        left: `${originX}%`,
        top: `${originY}%`,
        pointerEvents: 'none',
        zIndex: 50,
      }}
    >
      {particles.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            background: p.color,
            top: 0,
            left: 0,
            marginLeft: -p.size / 2,
            marginTop: -p.size / 2,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: 0,
            scale: [0, 1.2, 1],
            rotate: p.rotation,
          }}
          transition={{
            duration: randomBetween(0.6, 1.0),
            delay: p.delay,
            ease: [0.2, 0.8, 0.4, 1],
          }}
        />
      ))}
    </div>
  )
}
