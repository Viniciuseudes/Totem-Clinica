import type { ReactNode } from "react"

interface TotemFrameProps {
  children: ReactNode
  className?: string
}

export function TotemFrame({ children, className = "" }: TotemFrameProps) {
  return (
    <div
      className={`relative w-full max-w-4xl ${className} rounded-3xl overflow-hidden shadow-2xl border-8 border-gray-800 bg-white flex flex-col`}
    >
      {/* Totem Header - reduzido */}
      <div className="h-12 bg-gradient-to-r from-orange-500 to-orange-700 flex items-center justify-center z-10">
        <div className="absolute left-4 w-2 h-2 rounded-full bg-red-500 shadow-inner"></div>
        <div className="absolute left-8 w-2 h-2 rounded-full bg-yellow-500 shadow-inner"></div>
        <div className="absolute left-12 w-2 h-2 rounded-full bg-green-500 shadow-inner"></div>
        <h1 className="text-xl font-bold text-white tracking-wider">FUSION CLINIC</h1>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">{children}</div>
      </div>

      {/* Bottom Bezel - reduzido */}
      <div className="h-3 bg-gray-800 flex items-center justify-center">
        <div className="w-24 h-1 rounded-full bg-gray-600"></div>
      </div>
    </div>
  )
}
