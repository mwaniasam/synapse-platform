"use client"

import { useEffect, useState } from 'react'

interface BrainAnimationProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  type?: 'processing' | 'thinking' | 'analyzing' | 'focused'
  className?: string
}

export function BrainAnimation({ 
  size = 'md', 
  type = 'processing', 
  className = '' 
}: BrainAnimationProps) {
  const [activeNeuron, setActiveNeuron] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNeuron(prev => (prev + 1) % 4)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  }

  const getAnimationClass = () => {
    switch (type) {
      case 'processing': return 'animate-pulse'
      case 'thinking': return 'animate-bounce'
      case 'analyzing': return 'animate-spin'
      case 'focused': return 'animate-pulse'
      default: return 'animate-pulse'
    }
  }

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <style jsx>{`
        @keyframes neuron-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes brain-glow {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.3)); }
          50% { filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.6)); }
        }
        .neuron-active {
          animation: neuron-pulse 0.8s ease-in-out;
        }
        .brain-glow {
          animation: brain-glow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Main Brain with Glow Effect */}
      <div className={`relative w-full h-full brain-glow ${type !== 'analyzing' ? getAnimationClass() : ''}`}>
        {/* Brain SVG */}
        <svg 
          viewBox="0 0 100 100" 
          className={`w-full h-full text-primary transition-transform duration-500 ${
            type === 'analyzing' ? 'animate-spin' : ''
          }`}
          fill="currentColor"
        >
          {/* Main Brain Shape */}
          <path 
            d="M50 10 C30 10, 15 25, 15 45 C15 65, 30 80, 50 90 C70 80, 85 65, 85 45 C85 25, 70 10, 50 10 Z" 
            className="opacity-90"
          />
          
          {/* Brain Folds/Texture */}
          <path 
            d="M35 25 C35 20, 40 15, 45 15 C50 15, 55 20, 55 25" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5"
            className="opacity-60"
          />
          <path 
            d="M55 35 C60 35, 65 30, 70 35 C75 40, 70 45, 65 45" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5"
            className="opacity-60"
          />
          <path 
            d="M25 50 C30 45, 35 50, 40 45 C45 40, 50 45, 45 50" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5"
            className="opacity-60"
          />
          <path 
            d="M60 55 C65 50, 70 55, 75 50 C80 55, 75 60, 70 60" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5"
            className="opacity-60"
          />
        </svg>

        {/* Neural Activity Dots */}
        {type === 'processing' && (
          <>
            <div
              className={`absolute top-6 left-6 w-2 h-2 rounded-full transition-all duration-300 ${
                activeNeuron === 0 
                  ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50 neuron-active' 
                  : 'bg-yellow-200 opacity-40'
              }`}
            />
            <div
              className={`absolute top-8 right-8 w-2 h-2 rounded-full transition-all duration-300 ${
                activeNeuron === 1 
                  ? 'bg-blue-400 shadow-lg shadow-blue-400/50 neuron-active' 
                  : 'bg-blue-200 opacity-40'
              }`}
            />
            <div
              className={`absolute bottom-8 left-8 w-2 h-2 rounded-full transition-all duration-300 ${
                activeNeuron === 2 
                  ? 'bg-green-400 shadow-lg shadow-green-400/50 neuron-active' 
                  : 'bg-green-200 opacity-40'
              }`}
            />
            <div
              className={`absolute bottom-6 right-6 w-2 h-2 rounded-full transition-all duration-300 ${
                activeNeuron === 3 
                  ? 'bg-purple-400 shadow-lg shadow-purple-400/50 neuron-active' 
                  : 'bg-purple-200 opacity-40'
              }`}
            />
          </>
        )}

        {/* Thinking Bubbles */}
        {type === 'thinking' && (
          <div className="absolute -top-8 -right-8">
            <div className="relative">
              <div className="w-4 h-4 bg-blue-300 rounded-full opacity-80 animate-bounce" 
                   style={{ animationDelay: '0s' }} />
              <div className="absolute -top-3 -right-2 w-3 h-3 bg-blue-400 rounded-full opacity-70 animate-bounce" 
                   style={{ animationDelay: '0.2s' }} />
              <div className="absolute -top-5 -right-4 w-2 h-2 bg-blue-500 rounded-full opacity-60 animate-bounce" 
                   style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}

        {/* Focus Ring */}
        {type === 'focused' && (
          <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
        )}
      </div>

      {/* Scanning Lines for Analyzing */}
      {type === 'analyzing' && (
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-pulse" />
          <div 
            className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-bounce"
            style={{ animationDuration: '1.5s' }}
          />
        </div>
      )}
    </div>
  )
}
