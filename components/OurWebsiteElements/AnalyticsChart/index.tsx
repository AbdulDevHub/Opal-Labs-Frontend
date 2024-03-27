import React, { useEffect, useRef, useState } from 'react'

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography'

import NewElementMenu from '@/components/DashboardComponents/NewElementMenu'
import AnalyticsChartToolbarElement from '@/components/Toolbar/AnalyticsChart'
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
import styled from 'styled-components'

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
  index: number
  isUserBroke: boolean
  dateViewCount: Record<string, number>
  handleDeleteContent: (index: number) => void
  moveElement: (index: number, moveBy: number) => void
  handleSelectType: (type: string, index: number) => void
  isEditable: boolean
  isDarkMode: boolean
  isDraggable: boolean
  setComponentFocused: (isFocused: boolean) => void
}

/**
 * A React functional component that renders an analytics chart with various features and UI elements.
 *
 * @param {number} index - the index of the chart
 * @param {boolean} isUserBroke - flag indicating if the user is broke
 * @param {Object} dateViewCount - object containing date view counts
 * @param {Function} handleDeleteContent - function to handle content deletion
 * @param {Function} moveElement - function to move the chart element
 * @param {Function} handleSelectType - function to handle type selection
 * @param {boolean} isEditable - flag indicating if the chart is editable
 * @param {boolean} isDarkMode - flag indicating if dark mode is enabled
 * @param {boolean} isDraggable - flag indicating if the chart is draggable
 * @param {Function} setComponentFocused - function to set the focused component
 * @return {JSX.Element} the rendered analytics chart component
 */
const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  index,
  isUserBroke,
  dateViewCount,
  handleDeleteContent,
  moveElement,
  handleSelectType,
  isEditable,
  isDarkMode,
  isDraggable,
  setComponentFocused
}) => {
  {/* -------------------------- ANALYTICS CHART STATES -----------------------*/ }
  const [isHovered, setIsHovered] = useState(false)
  const [isAnalyticsChartFocused, setIsAnalyticsChartFocused] = useState(false)

  // Div to position the toolbar on the top of the screen
  const StyledDiv = styled.div`
    position: fixed;
    top: 90px;
    left: 574px;
    background-color: ${isDarkMode ? '#212121' : 'white'};
    z-index: 1;
    padding: 15px;
    border-radius: 5px;
    border: 1px solid ${isDarkMode ? 'white' : 'lightgray'};

    @media (max-width: 1920px) and (min-width: 870px) {
      left: calc(1009px + ((100vw - 1920px) / 2));
    }

    @media (max-width: 870px) {
      left: 483px;
    }

    @media (max-width: 928px) {
      top: calc(90px + 25px);
    }
`;

  {/* -------------------------- ANALYTICS CHART EFFECTS -----------------------*/ }
  // Inside your component
  const toolbarRef = useRef<HTMLDivElement>(null);

  {/* Function to hide the toolbar if you click outside of it or the element */ }
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setIsAnalyticsChartFocused(false)
        setComponentFocused(false)
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [setComponentFocused, toolbarRef])

  {/* -------------------------- ANALYTICS CHART FUNCTIONS/HANDLERS -----------------------*/ }
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
      {/* TOOLBAR */}
      {isAnalyticsChartFocused && isEditable && !isDraggable && (
        <StyledDiv ref={toolbarRef}>
          <AnalyticsChartToolbarElement
            index={index}
            isDarkMode={isDarkMode}
            handleDeleteContent={handleDeleteContent}
            moveElement={moveElement}
            setComponentFocused={setComponentFocused}
          />
        </StyledDiv>
      )}

      {/* -------------------------- BROKE USER UPGRADE TO PREMIUM -----------------------*/}
      {isUserBroke ? (
        <div
          ref={toolbarRef}
          id="analyticsChartDiv"
          onClick={() => { setIsAnalyticsChartFocused(true); setComponentFocused(true); }}
          style={{
            display: 'flex', width: '100%', background: isDarkMode ? '#424242' : '#F5F5F5', padding: '15px 20px',
            borderRadius: '5px', outline: isAnalyticsChartFocused ? '2px solid #1976d2' : 'none'
          }}
        >
          <AccountCircleIcon style={{ color: isDarkMode ? '#fff' : 'black', marginRight: '10px' }} />
          <p style={{ margin: '0', color: isDarkMode ? '#fff' : 'black' }}>Upgrade Your Account To View Analytics</p>
        </div>
      ) : (
        <div id="analyticsChartDiv"
          ref={toolbarRef}
          onClick={() => { setIsAnalyticsChartFocused(true); setComponentFocused(true); }}
          style={{
            paddingTop: '14px',
            paddingRight: '30px',
            border: '15px solid lightblue',
            borderRadius: '5px',
            outline: isAnalyticsChartFocused ? '2px solid #1976d2' : 'none',
          }}>
          {/* -------------------------- PREMIUM USERS GET ANALYTICS CHART -----------------------*/}
          <Typography variant="h6" style={{ color: isDarkMode ? '#fff' : 'black' }}>Total View Count: {totalViewCount}</Typography>
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
      )}

      {/* NEW ELEMENT MENU */}
      <NewElementMenu
        index={index}
        isTopElement={false}
        isEditable={isEditable}
        isDarkMode={isDarkMode}
        isDraggable={isDraggable}
        handleSelectType={handleSelectType}
      />
    </div>
  )
}

export default AnalyticsChart