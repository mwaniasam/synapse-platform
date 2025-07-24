"use client"

import { useEffect, useState } from 'react'

interface FocusAnimationProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  type?: 'scanning' | 'target' | 'attention' | 'tracking'
  className?: string
}

export function FocusAnimation({ 
  size = 'md', 
  type = 'scanning', 
  className = '' 
}: FocusAnimationProps) {
  const [scanPosition, setScanPosition] = useState(0)
  const [targetActive, setTargetActive] = useState(false)

  useEffect(() => {
    if (type === 'scanning') {
      const interval = setInterval(() => {
        setScanPosition(prev => (prev + 1) % 8)
      }, 300)
      return () => clearInterval(interval)
    }
    
    if (type === 'target') {
      const interval = setInterval(() => {
        setTargetActive(prev => !prev)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [type])

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  }

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <style jsx>{`
        @keyframes radar-sweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes eye-blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        .radar-sweep {
          animation: radar-sweep 3s linear infinite;
        }
        .pulse-ring {
          animation: pulse-ring 2s ease-out infinite;
        }
        .eye-blink {
          animation: eye-blink 4s ease-in-out infinite;
        }
      `}</style>

      {/* Scanning Eye Animation */}
      {type === 'scanning' && (
        <div className="relative w-full h-full">
          {/* Eye Base */}
          <div className="absolute inset-0 bg-blue-100 rounded-full border-2 border-blue-300 eye-blink">
            {/* Iris */}
            <div className="absolute top-1/2 left-1/2 w-1/2 h-1/2 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2">
              {/* Pupil */}
              <div className="absolute top-1/2 left-1/2 w-1/3 h-1/3 bg-blue-900 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
              {/* Scanning Line */}
              <div 
                className="absolute top-0 left-1/2 w-0.5 h-full bg-yellow-400 transform -translate-x-1/2 radar-sweep"
                style={{ transformOrigin: 'bottom center' }}
              />
            </div>
          </div>
          
          {/* Scanning Grid */}
          <div className="absolute inset-2">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-1 h-1 rounded-full transition-all duration-300 ${
                  scanPosition === i 
                    ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50 scale-150' 
                    : 'bg-gray-300 opacity-40'
                }`}
                style={{
                  top: `${20 + (i % 4) * 20}%`,
                  left: `${20 + Math.floor(i / 4) * 40}%`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Target Focus Animation */}
      {type === 'target' && (
        <div className="relative w-full h-full">
          {/* Crosshair */}
          <svg viewBox="0 0 100 100" className="w-full h-full text-red-500">
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className={targetActive ? 'animate-ping' : ''}
            />
            <circle 
              cx="50" 
              cy="50" 
              r="30" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
            />
            <circle 
              cx="50" 
              cy="50" 
              r="15" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1"
            />
            <line 
              x1="50" 
              y1="10" 
              x2="50" 
              y2="90" 
              stroke="currentColor" 
              strokeWidth="1"
            />
            <line 
              x1="10" 
              y1="50" 
              x2="90" 
              y2="50" 
              stroke="currentColor" 
              strokeWidth="1"
            />
          </svg>
          
          {/* Center Dot */}
          <div className={`absolute top-1/2 left-1/2 w-2 h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
            targetActive ? 'bg-red-500 shadow-lg shadow-red-500/50 scale-150' : 'bg-red-400'
          }`} />
        </div>
      )}

      {/* Attention Network Animation */}
      {type === 'attention' && (
        <div className="relative w-full h-full">
          {/* Central Hub */}
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-purple-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          
          {/* Network Nodes */}
          {[...Array(6)].map((_, i) => {
            const angle = (i * 60) * (Math.PI / 180)
            const radius = 35
            const x = 50 + radius * Math.cos(angle)
            const y = 50 + radius * Math.sin(angle)
            
            return (
              <div key={i}>
                {/* Connection Line */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  <line
                    x1="50"
                    y1="50"
                    x2={x}
                    y2={y}
                    stroke="rgb(168 85 247)"
                    strokeWidth="0.5"
                    className="opacity-60 animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                </svg>
                
                {/* Node */}
                <div
                  className="absolute w-2 h-2 bg-purple-400 rounded-full animate-pulse"
                  style={{
                    top: `${y}%`,
                    left: `${x}%`,
                    transform: 'translate(-50%, -50%)',
                    animationDelay: `${i * 0.3}s`
                  }}
                />
              </div>
            )
          })}
        </div>
      )}

      {/* Eye Tracking Animation */}
      {type === 'tracking' && (
        <div className="relative w-full h-full">
          {/* Eye Shape */}
          <div className="absolute inset-0 bg-green-100 rounded-full border-2 border-green-300">
            {/* Moving Iris */}
            <div 
              className="absolute w-1/2 h-1/2 bg-green-500 rounded-full transition-all duration-1000 ease-in-out"
              style={{
                top: `${25 + 10 * Math.sin(Date.now() / 1000)}%`,
                left: `${25 + 10 * Math.cos(Date.now() / 1000)}%`,
              }}
            >
              {/* Pupil */}
              <div className="absolute top-1/2 left-1/2 w-1/3 h-1/3 bg-green-900 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
          
          {/* Tracking Path */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <path
              d="M 20,30 Q 50,10 80,30 Q 80,50 50,70 Q 20,50 20,30"
              fill="none"
              stroke="rgb(34 197 94)"
              strokeWidth="1"
              strokeDasharray="2,2"
              className="opacity-40 animate-pulse"
            />
          </svg>
        </div>
      )}

      {/* Pulse Rings */}
      <div className="absolute inset-0 rounded-full pulse-ring border-2 border-current opacity-30" />
      <div className="absolute inset-0 rounded-full pulse-ring border border-current opacity-20" style={{ animationDelay: '0.5s' }} />
    </div>
  )
}
