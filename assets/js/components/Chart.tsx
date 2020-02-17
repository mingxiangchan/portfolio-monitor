import React from 'react'
import { Line } from 'react-chartjs-2'
import { ChartData, ChartOptions } from 'chart.js'

interface PropTypes {
  height?: string
  width?: string
  data: ChartData
  options: ChartOptions
}

const Chart: React.FunctionComponent<PropTypes> = ({
  height,
  width,
  data,
  options,
}: PropTypes) => {
  return (
    <div
      style={{
        height: height ? height : '100%',
        width: width ? width : '100%',
      }}
    >
      <Line data={data} options={{ ...options, maintainAspectRatio: false }} />
    </div>
  )
}

export default Chart
