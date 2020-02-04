import React from 'react'
import {Line} from 'react-chartjs-2'

export default ({height, width, data, options}) => {
	return (
		<div style={{height: height ? height : "100%", width: width ? width : "100%"}}>
			<Line data={data} options={options} />
		</div>
	)
}