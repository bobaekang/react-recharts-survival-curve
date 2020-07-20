import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { schemeCategory10 } from 'd3-scale-chromatic'

function addSurvivalProbability(data) {
  const newData = data

  newData.forEach((patients) =>
    patients.forEach((patient, i) => {
      const survival = 1 - patient.death / patient.number
      patient.prob = i === 0 ? survival : patients[i - 1].prob * survival
    })
  )

  return newData
}

const SurvivalCurve = ({ data }) => {
  const pTimes = data.flatMap((ps) => ps.flatMap((p) => parseFloat(p.time)))
  const maxTime = Math.ceil(Math.max(0, ...pTimes))
  const ticks = Array.from(Array(Math.ceil(maxTime / 10)), (_, e) => e * 10)

  return (
    <LineChart
      width={500}
      height={300}
      margin={{ top: 40, bottom: 40, left: 40, right: 40 }}
    >
      <XAxis
        dataKey="time"
        type="number"
        label={{
          value: 'Time (in months)',
          position: 'insideBottom',
          offset: -5,
        }}
        ticks={ticks}
      />
      <YAxis
        label={{
          value: 'Survival Rate',
          angle: -90,
          position: 'insideLeft',
        }}
      />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Legend align="right" verticalAlign="top" />
      {addSurvivalProbability(data).map((patients, i) => (
        <Line
          key={i}
          data={patients}
          dataKey="prob"
          dot={false}
          name={patients[0].type}
          type="stepAfter"
          stroke={schemeCategory10[i]}
        />
      ))}
    </LineChart>
  )
}

export default SurvivalCurve
