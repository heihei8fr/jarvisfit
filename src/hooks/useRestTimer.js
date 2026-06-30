import { useState, useEffect, useRef, useCallback } from 'react'

export function useRestTimer() {
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [completed, setCompleted] = useState(false)
  const intervalRef = useRef(null)
  const audioCtxRef = useRef(null)

  function playBeep(frequency = 880, duration = 0.15, volume = 0.5) {
    try {
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
      }
      const ctx = audioCtxRef.current
      if (ctx.state === 'suspended') ctx.resume()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = frequency
      osc.type = 'sine'
      gain.gain.setValueAtTime(volume, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + duration)
    } catch {}
  }

  function playFinishSound() {
    playBeep(660, 0.12, 0.4)
    setTimeout(() => playBeep(880, 0.12, 0.4), 150)
    setTimeout(() => playBeep(1100, 0.25, 0.5), 300)
  }

  function vibrate(pattern) {
    if (navigator.vibrate) navigator.vibrate(pattern)
  }

  const start = useCallback((seconds) => {
    clearInterval(intervalRef.current)
    setTimeLeft(seconds)
    setTotalTime(seconds)
    setIsRunning(true)
    setCompleted(false)
    playBeep(440, 0.1, 0.3)
    vibrate([50])
  }, [])

  const stop = useCallback(() => {
    clearInterval(intervalRef.current)
    setIsRunning(false)
    setTimeLeft(0)
    setTotalTime(0)
    setCompleted(false)
  }, [])

  const addTime = useCallback((seconds) => {
    setTimeLeft(prev => prev + seconds)
    setTotalTime(prev => prev + seconds)
  }, [])

  useEffect(() => {
    if (!isRunning) return
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          setIsRunning(false)
          setCompleted(true)
          playFinishSound()
          vibrate([200, 100, 200, 100, 400])
          return 0
        }
        if (prev === 4) playBeep(660, 0.1, 0.3)
        if (prev === 3) playBeep(660, 0.1, 0.3)
        if (prev === 2) playBeep(660, 0.1, 0.3)
        if (prev === 1) playBeep(880, 0.1, 0.4)
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [isRunning])

  useEffect(() => () => clearInterval(intervalRef.current), [])

  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0

  return { isRunning, timeLeft, totalTime, completed, progress, start, stop, addTime }
}
