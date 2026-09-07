import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import './BookingsChart.css'

const CHART_COLORS = {
  created: '#1f9aa0',
  done: '#2e9d63',
  cancelled: '#c26060',
}

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="bc-tooltip">
      <span className="bc-tooltip__dot" style={{ background: item.payload?.fill }} />
      <span className="bc-tooltip__label">{item.name}</span>
      <span className="bc-tooltip__value">{item.value}</span>
    </div>
  )
}

function BookingsChart({ data }) {
  const chartData = [
    { name: 'Created', value: data.bookings_created, fill: CHART_COLORS.created },
    { name: 'Done', value: data.bookings_done, fill: CHART_COLORS.done },
    { name: 'Cancelled', value: data.bookings_cancled, fill: CHART_COLORS.cancelled },
  ]

  return (
    <div className="bc">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top: 16, right: 12, left: -20, bottom: 4 }} barCategoryGap="40%">
          <CartesianGrid vertical={false} strokeDasharray="3 8" stroke="#e4eaf0" />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#52606b', fontSize: 13, fontWeight: 600 }}
            dy={8}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#52606b', fontSize: 12 }}
            width={44}
          />
          <Tooltip
            cursor={{ fill: 'rgba(26, 127, 130, 0.06)' }}
            content={<ChartTooltip />}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 13, color: '#52606b' }}
            formatter={(value) => <span className="bc-legend">{value}</span>}
          />
          <Bar
            dataKey="value"
            name="Bookings"
            radius={[8, 8, 4, 4]}
            maxBarSize={64}
            isAnimationActive
            animationDuration={600}
            animationEasing="ease-out"
          >
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BookingsChart