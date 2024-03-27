import React, { useState } from 'react'

import Typography from '@mui/material/Typography'

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

// For Testing Purposes
// const views: any[] | undefined = []
// for (let i = 0; i < 365; i++) {
//   const date = new Date(2022, 0, 1) // Start from '2022-01-01'
//   date.setDate(date.getDate() + i)
//   const viewCount = 100 + i * 20 // Increase viewCount by 20 each day
//   views.push({
//     date: date.toISOString().split('T')[0], // Format date as 'YYYY-MM-DD'
//     viewCount: viewCount,
//   })
// }

{/* PROPS TYPE VALUES FOR ANALYTICS CHART COMPONENT */ }
interface AnalyticsChartProps {
  dateViewCount: Record<string, number>
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ dateViewCount }) => {
  {/* -------------------------- ANALYTICS CHART STATES -----------------------*/ }
  const [isHovered, setIsHovered] = useState(false)

  /**
   * A function that generates a range of dates between the start and end dates.
   *
   * @param {string} start - the start date of the range
   * @param {string} end - the end date of the range
   * @return {string[]} an array of dates in the range
   */
  const generateDateRange = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)

    let currentDate = startDate
    const dateRange = []

    while (currentDate <= endDate) {
      dateRange.push(new Date(currentDate).toISOString().split('T')[0])
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return dateRange
  }

  // Get the start and end dates from dateViewCount
  const dates = Object.keys(dateViewCount)
  const startDate = dates[0]
  const endDate = dates[dates.length - 1]

  // Generate the date range
  const dateRange = generateDateRange(startDate, endDate)

  // Create the views array
  const views = dateRange.map((date) => ({
    date,
    viewCount: dateViewCount[date] || 0,
  }))

  // For Testing Purposes
  // const views = Object.entries(dateViewCount).map(([date, viewCount]) => ({
  //   date,
  //   viewCount,
  // }))
  const totalViewCount = views.reduce((total, view) => total + view.viewCount, 0)

  /**
   * Calculates the appropriate tick interval based on the given length.
   *
   * @param {number} length - The length to calculate the tick interval for.
   * @return {number} The calculated tick interval.
   */
  const getTickInterval = (length: number) => {
    if (length <= 5) return 1
    if (length <= 20) return 2
    if (length <= 50) return 5
    if (length <= 100) return 10
    if (length <= 200) return 20
    return 100
  }
  const interval = getTickInterval(views.length)

  {/* -------------------------- ANALYTICS CHART RENDER -----------------------*/ }
  return (
    <div>
      {/* -------------------------- BROKE USER UPGRADE TO PREMIUM -----------------------*/}
      <div id="analyticsChartDiv"
        style={{
          paddingTop: '14px',
          paddingRight: '30px',
          border: '15px solid lightblue',
          borderRadius: '5px',
        }}>
        {/* -------------------------- PREMIUM USERS GET ANALYTICS CHART -----------------------*/}
        <Typography variant="h6">Total View Count: {totalViewCount}</Typography>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            onMouseMove={(event) => {
              if (event && event.activePayload) {
                setIsHovered(true)
              }
            }}
            onMouseLeave={() => setIsHovered(false)}
            data={views}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" ticks={views.map((v, i) => (i % interval === 0 ? v.date : ''))} />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
            <Area
              type="monotone"
              dataKey="viewCount"
              stroke="#8884d8"
              strokeWidth={3}
              fill="#add8e6"
              dot={false}
              name="View Count"
              animationBegin={400}
              animationDuration={3000}
              activeDot={isHovered ? { r: 8 } : { r: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* NEW ELEMENT MENU GAP*/}
      <div style={{ height: '35px', width: '100%', marginTop: '10px' }}></div>
    </div>
  )
}

export default AnalyticsChart