export default function WeekRing({ completed, total }) {
  const pct = total === 0 ? 0 : completed / total
  const r = 28
  const circ = 2 * Math.PI * r
  const dash = circ * pct

  return (
    <div className="flex flex-col items-center">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="#e5e7eb" strokeWidth="8" />
        <circle
          cx="36" cy="36" r={r} fill="none" stroke="#2563eb" strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
        />
        <text x="36" y="41" textAnchor="middle" style={{ fontSize: 14, fontWeight: 700, fill: '#1f2937' }}>
          {completed}/{total}
        </text>
      </svg>
      <span className="text-xs text-gray-500 mt-1">Séances</span>
    </div>
  )
}
