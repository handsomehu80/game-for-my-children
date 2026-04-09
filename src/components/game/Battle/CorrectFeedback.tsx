// src/components/game/Battle/CorrectFeedback.tsx
import { useState, useEffect } from 'react'

export default function CorrectFeedback() {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number }>>([])

  useEffect(() => {
    // Generate 5 stars at random positions around the button
    const newStars = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: Math.random() * 100 - 50, // -50 to 50
      y: Math.random() * 60 - 30,  // -30 to 30
    }))
    setStars(newStars)

    // Clear stars after animation
    const timer = setTimeout(() => setStars([]), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {stars.map((star) => (
        <div
          key={star.id}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(${star.x}px, ${star.y}px)`,
            fontSize: '24px',
            animation: 'starPop 500ms ease-out forwards',
            animationDelay: `${star.id * 50}ms`,
          }}
        >
          ✨
        </div>
      ))}
    </div>
  )
}