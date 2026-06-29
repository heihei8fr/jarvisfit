import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

export default function PRChart({ data, exerciseName }) {
  if (!data?.length) {
    return (
      <div className="h-32 flex items-center justify-center text-sm text-gray-400">
        Pas encore de données pour cet exercice
      </div>
    )
  }

  const maxOrm = Math.max(...data.map(d => d.orm))

  return (
    <div>
      <p className="text-xs font-semibold text-gray-600 mb-3">{exerciseName} — 1RM estimé (kg)</p>
      <ResponsiveContainer width="100%" height={140}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickFormatter={d => d.slice(5)}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            domain={['auto', 'auto']}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(v) => [`${v} kg`, '1RM estimé']}
            labelFormatter={l => `Date : ${l}`}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
          />
          <ReferenceLine y={maxOrm} stroke="#2563eb" strokeDasharray="3 3" strokeOpacity={0.4} />
          <Line
            type="monotone"
            dataKey="orm"
            stroke="#2563eb"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#2563eb', strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
