import { useMemo } from 'react'

import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Box from '@mui/material/Box'
import { alpha, useTheme } from '@mui/material/styles'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { useEditor } from '../context'

const DAY = 24 * 60 * 60 * 1000
const isoDay = (date: Date) => date.toISOString().slice(0, 10)
const shortDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })

/** Daily views from the first recorded day (at most 90 days back, at least 14) to today */
export const buildSeries = (dateViewCount: Record<string, number>) => {
  const days = Object.keys(dateViewCount ?? {}).sort()
  const today = new Date()
  const earliest = days.length ? new Date(`${days[0]}T00:00:00Z`) : today
  const span = Math.min(
    90,
    Math.max(14, Math.ceil((today.getTime() - earliest.getTime()) / DAY) + 1)
  )
  return Array.from({ length: span }, (_, i) => {
    const date = isoDay(new Date(today.getTime() - (span - 1 - i) * DAY))
    return { date, views: dateViewCount?.[date] ?? 0 }
  })
}

const Stat = ({ label, value }: { label: string; value: string | number }) => (
  <Box>
    <Box sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 500 }}>{label}</Box>
    <Box
      sx={{
        fontSize: 22,
        fontWeight: 700,
        letterSpacing: '-0.02em',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {value}
    </Box>
  </Box>
)

/** Views chart for a published page */
const AnalyticsBlock = () => {
  const editor = useEditor()
  const theme = useTheme()
  const color = theme.palette.primary.main
  const series = useMemo(() => buildSeries(editor.dateViewCount), [editor.dateViewCount])

  const total = series.reduce((sum, day) => sum + day.views, 0)
  const todayViews = series[series.length - 1]?.views ?? 0
  const best = series.reduce((top, day) => (day.views > top.views ? day : top), series[0])

  const card = {
    borderRadius: 3,
    border: '1px solid',
    borderColor: 'divider',
    p: { xs: 2, sm: 2.5 },
    background:
      theme.palette.mode === 'dark'
        ? `linear-gradient(180deg, ${alpha(color, 0.06)}, transparent 60%)`
        : `linear-gradient(180deg, ${alpha(color, 0.07)}, transparent 60%)`,
  }

  if (editor.isUserBroke) {
    return (
      <Box
        sx={{ ...card, display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.secondary' }}
      >
        <LockOutlinedIcon />
        <Box>
          <Box sx={{ fontWeight: 600, color: 'text.primary' }}>
            Page analytics is a Premium feature
          </Box>
          <Box sx={{ fontSize: 14 }}>
            Switch plans from the account menu in the sidebar (it’s a demo, no payment).
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={card}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <InsertChartOutlinedIcon sx={{ color }} fontSize="small" />
        <Box sx={{ fontWeight: 600 }}>Page views</Box>
        <Box sx={{ fontSize: 12, color: 'text.secondary', ml: 'auto' }}>
          Last {series.length} days
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: { xs: 3, sm: 5 }, mb: 1.5, flexWrap: 'wrap' }}>
        <Stat label="Total views" value={total.toLocaleString()} />
        <Stat label="Today" value={todayViews.toLocaleString()} />
        <Stat label="Best day" value={best && best.views > 0 ? shortDate(best.date) : '—'} />
      </Box>

      <Box sx={{ position: 'relative', height: 200, mx: -1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="opalViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={theme.palette.divider} />
            <XAxis
              dataKey="date"
              tickFormatter={shortDate}
              tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
              axisLine={false}
              tickLine={false}
              minTickGap={28}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              labelFormatter={(label) => shortDate(String(label))}
              formatter={(value) => [value, 'Views']}
              contentStyle={{
                background: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="views"
              stroke={color}
              strokeWidth={2}
              fill="url(#opalViews)"
              animationDuration={900}
            />
          </AreaChart>
        </ResponsiveContainer>

        {!editor.isPublic && total === 0 && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              fontSize: 14,
              color: 'text.secondary',
              textAlign: 'center',
              px: 2,
            }}
          >
            Publish this page from the Share menu to start counting views.
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default AnalyticsBlock
