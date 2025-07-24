"use client"

import { useEffect, useState } from 'react'

interface MemoryGridAnimationProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  gridSize?: 3 | 4 | 5
  animationType?: 'sequence' | 'pattern' | 'flash' | 'wave'
  className?: string
}

export function MemoryGridAnimation({ 
  size = 'md', 
  gridSize = 3,
  animationType = 'sequence',
  className = '' 
}: MemoryGridAnimationProps) {
  const [activeCell, setActiveCell] = useState(0)
  const [sequence, setSequence] = useState<number[]>([])
  const [wavePosition, setWavePosition] = useState(0)

  useEffect(() => {
    if (animationType === 'sequence') {
      const interval = setInterval(() => {
        setActiveCell(prev => (prev + 1) % (gridSize * gridSize))
      }, 600)
      return () => clearInterval(interval)
    }
    
    if (animationType === 'pattern') {
      // Generate random sequence
      const newSequence = Array.from({ length: 5 }, () => 
        Math.floor(Math.random() * (gridSize * gridSize))
      )
      setSequence(newSequence)
      
      let index = 0
      const interval = setInterval(() => {
        setActiveCell(newSequence[index])
        index = (index + 1) % newSequence.length
      }, 800)
      return () => clearInterval(interval)
    }
    
    if (animationType === 'wave') {
      const interval = setInterval(() => {
        setWavePosition(prev => (prev + 1) % (gridSize * 2))
      }, 200)
      return () => clearInterval(interval)
    }
  }, [animationType, gridSize])

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  }

  const getCellDelay = (row: number, col: number) => {
    if (animationType === 'wave') {
      const distance = Math.abs(row - Math.floor(wavePosition / 2)) + Math.abs(col - (wavePosition % gridSize))
      return distance * 100
    }
    return 0
  }

  const isCellActive = (index: number, row: number, col: number) => {
    if (animationType === 'flash') {
      return Math.random() > 0.7 // Random flashing
    }
    if (animationType === 'wave') {
      const distance = Math.abs(row - Math.floor(wavePosition / 2)) + Math.abs(col - (wavePosition % gridSize))
      return distance <= 1
    }
    return index === activeCell
  }

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <style jsx>{`
        @keyframes cell-glow {
          0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8); }
        }
        @keyframes memory-pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes wave-ripple {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(1.2); opacity: 0; }
        }
        .cell-active {
          animation: cell-glow 0.6s ease-in-out, memory-pulse 0.6s ease-in-out;
        }
        .wave-cell {
          animation: wave-ripple 0.8s ease-out;
        }
      `}</style>

      {/* Grid Container */}
      <div 
        className="grid gap-1 w-full h-full p-2"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      >
        {Array.from({ length: gridSize * gridSize }, (_, index) => {
          const row = Math.floor(index / gridSize)
          const col = index % gridSize
          const isActive = isCellActive(index, row, col)
          
          return (
            <div
              key={index}
              className={`
                rounded border-2 transition-all duration-300 relative overflow-hidden
                ${isActive 
                  ? 'bg-blue-500 border-blue-600 cell-active' 
                  : 'bg-gray-200 border-gray-300 hover:bg-gray-300'
                }
                ${animationType === 'wave' && isActive ? 'wave-cell' : ''}
              `}
              style={{
                animationDelay: `${getCellDelay(row, col)}ms`
              }}
            >
              {/* Cell Content */}
              <div className="w-full h-full flex items-center justify-center">
                {animationType === 'sequence' && isActive && (
                  <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                )}
                
                {animationType === 'pattern' && isActive && (
                  <div className="text-xs font-bold text-white">
                    {sequence.indexOf(index) + 1}
                  </div>
                )}
                
                {animationType === 'flash' && isActive && (
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 animate-pulse" />
                )}
                
                {animationType === 'wave' && isActive && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500" />
                )}
              </div>
              
              {/* Ripple Effect */}
              {isActive && animationType !== 'flash' && (
                <div className="absolute inset-0 bg-blue-400 opacity-30 animate-ping" />
              )}
            </div>
          )
        })}
      </div>

      {/* Center Indicator */}
      <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      
      {/* Memory Trail Effect */}
      {animationType === 'sequence' && (
        <div className="absolute inset-0 pointer-events-none">
          {sequence.slice(-3).map((cellIndex, i) => {
            const row = Math.floor(cellIndex / gridSize)
            const col = cellIndex % gridSize
            const cellSize = 100 / gridSize
            
            return (
              <div
                key={`trail-${i}`}
                className="absolute rounded border border-blue-300 bg-blue-100 opacity-50"
                style={{
                  top: `${8 + row * cellSize}%`,
                  left: `${8 + col * cellSize}%`,
                  width: `${cellSize - 2}%`,
                  height: `${cellSize - 2}%`,
                  opacity: 0.3 - (i * 0.1)
                }}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
