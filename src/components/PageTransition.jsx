import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function PageTransition({ children }) {
  const location = useLocation()
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(false)
    const t = setTimeout(() => setShow(true), 50)
    return () => clearTimeout(t)
  }, [location.pathname])

  return (
    <div style={{
      opacity: show ? 1 : 0,
      transform: show ? 'translateY(0)' : 'translateY(12px)',
      transition: 'opacity 0.25s ease, transform 0.25s ease',
      minHeight: '100%'
    }}>
      {children}
    </div>
  )
}
