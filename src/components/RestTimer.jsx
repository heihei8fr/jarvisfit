import { useState, useEffect, useRef } from 'react'

export default function RestTimer({ seconds, onDone }) {
  const [remaining, setRemaining] = useState(seconds)
  const intervalRef = useRef(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(intervalRef.current)
          if (navigator.vibrate) navigator.vibrate([200, 100, 200])
          onDone?.()
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [])

  const pct = (remaining / seconds) * 100

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onDone}
    >
      <div className="bg-white rounded-3xl p-8 text-center min-w-[200px]">
        <div className="text-5xl font-bold text-blue-600 mb-2">{remaining}s</div>
        <div className="text-sm text-gray-500 mb-4">Temps de repos</div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-1000"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-4 text-xs text-gray-400">Appuyer pour passer</p>
      </div>
    </div>
  )
}
