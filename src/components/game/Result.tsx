import { useMemo } from 'react'
import { useGameStore } from '../../store/gameStore'
import { useAccessibility } from '../../hooks/useAccessibility'
import { SeededRandom } from '../../game/utils/seededRandom'

interface Particle {
  left: number
  delay: number
  duration: number
  color: string
  symbol: string
}

const FIREWORK_COLORS = ['#FFD700', '#FF6B6B', '#4ECDC4', '#FF8ADA', '#95E1D3']
const COIN_SYMBOLS = ['🎉', '🎊', '✨', '🪙', '⭐']

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash = hash & hash
  }
  return hash === 0 ? 1 : Math.abs(hash)
}

function generateVictoryParticles(seed: number): Particle[] {
  const rng = new SeededRandom(seed)
  return Array.from({ length: 20 }, () => ({
    left: rng.nextInt(0, 100),
    delay: rng.next() * 1.5,
    duration: 1.5 + rng.next() * 1,
    color: rng.pick(FIREWORK_COLORS) as string,
    symbol: rng.pick(COIN_SYMBOLS) as string,
  }))
}

export default function Result() {
  const state = useGameStore()
  const dispatch = useGameStore.getState().dispatch
  const { isReducedMotion } = useAccessibility()

  const battle = state.battle
  const isVictory = battle?.phase === 'victory'

  const particles = useMemo(() => {
    if (!battle || !isVictory) return []
    return generateVictoryParticles(hashString(battle.monster.id))
  }, [battle, isVictory])

  const handleContinue = () => {
    if (isVictory) {
      dispatch({ type: 'COMPLETE_OCEAN' })
    } else {
      dispatch({ type: 'GAME_OVER' })
    }
  }

  if (!battle) {
    return null
  }

  return (
    <div
      className={`result-screen ${isVictory ? 'result-victory' : 'result-defeat'} ${
        !isVictory && !isReducedMotion ? 'result-defeat-animated' : ''
      }`}
      style={!isVictory && isReducedMotion ? { filter: 'grayscale(0.7)' } : undefined}
    >
      <style>
        {`
          @keyframes resultParticleFall {
            0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(110vh) rotate(360deg); opacity: 0.8; }
          }
          @keyframes resultGrayscaleIn {
            0% { filter: grayscale(0); }
            100% { filter: grayscale(0.7); }
          }
          .result-particle {
            position: fixed;
            top: 0;
            font-size: 24px;
            pointer-events: none;
            z-index: 1200;
            animation-name: resultParticleFall;
            animation-timing-function: ease-in;
            animation-iteration-count: infinite;
          }
          .result-defeat-animated {
            animation: resultGrayscaleIn 1.2s ease-in forwards;
          }
        `}
      </style>
      {isVictory && !isReducedMotion && (
        <div className="result-particles" aria-hidden="true">
          {particles.map((p, i) => (
            <span
              key={i}
              className="result-particle"
              style={{
                left: `${p.left}%`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                color: p.color,
              }}
            >
              {p.symbol}
            </span>
          ))}
        </div>
      )}
      <h1>{isVictory ? '🎉 胜利！🎉' : '💀 失败 💀'}</h1>
      <div className="result-content">
        {isVictory ? (
          <>
            <p>恭喜你打败了 {battle.monster.name}！</p>
            <p>波吉王子和船员们继续前进！</p>
          </>
        ) : (
          <>
            <p>很遗憾，{battle.player.name}倒下了...</p>
            <p>但是冒险还会继续！</p>
            <p>没关系，再试一次一定可以战胜他！</p>
          </>
        )}
      </div>
      <button onClick={handleContinue}>
        {isVictory ? '继续冒险' : '重新开始'}
      </button>
    </div>
  )
}
