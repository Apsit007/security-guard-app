import React, { useRef, useEffect } from 'react'
import {
  PieChart, 
  Pie,
  Cell,
} from 'recharts';

// Utils
import { renderCustomizedShape, renderCustomizedLabel } from '../../../utils/customShape';

// Constants
import { deviceChartList } from "../../../constants/chartData";

interface ActiveChartProps {
  onPieLeave: () => void;
  onPieEnter: (_: any, index: number, pieIndex: number) => void;
  data01: {name: string, value: number}[];
  data02: {name: string, value: number}[];
  data03: {name: string, value: number}[];
  activePieIndex: number;
  activeIndex: number;
  pieClickIndex: number;
  onChartRendered?: () => void;
}

const ActiveChart: React.FC<ActiveChartProps> = React.memo(({
  onPieLeave,
  onPieEnter,
  data01,
  data02,
  data03,
  activePieIndex,
  activeIndex,
  pieClickIndex,
  onChartRendered,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (onChartRendered) onChartRendered();
    }
  }, [data01, data02, data03]);

  return (
    <div ref={chartRef}>
      <style>
        {`
          textarea:focus, input:focus {
            outline: none;
          }
          *:focus {
            outline: none;
          }
        `}
      </style>
      <PieChart 
        width={250} 
        height={200} 
        onMouseLeave={onPieLeave}
      >
        <defs>
          <radialGradient id="workingGradient" cx="50%" cy="50%" r="100%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="rgba(76, 32, 58, 1)" />
            <stop offset="60%" stopColor="rgba(178, 75, 135, 1)" />
          </radialGradient>

          <radialGradient id="notWorkingGradient" cx="50%" cy="50%" r="100%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="rgba(70, 22, 31, 1)" />
            <stop offset="60%" stopColor="rgba(172, 53, 75, 1)" />
          </radialGradient>

          <radialGradient id="leaveGradient" cx="50%" cy="50%" r="100%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="rgba(65, 80, 102, 1)" />
            <stop offset="60%" stopColor="rgba(129, 159, 204, 1)" />
          </radialGradient>

          <radialGradient id="sickLeaveGradient" cx="50%" cy="50%" r="100%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="rgba(51, 57, 83, 1)" />
            <stop offset="60%" stopColor="rgba(114, 128, 185, 1)" />
          </radialGradient>

          <radialGradient id="personalLeaveGradient" cx="50%" cy="50%" r="100%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="rgba(13, 20, 34, 1)" />
            <stop offset="60%" stopColor="rgba(51, 78, 136, 1)" />
          </radialGradient>

          <radialGradient id="lateGradient" cx="50%" cy="50%" r="100%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="rgba(67, 94, 86, 1)" />
            <stop offset="60%" stopColor="rgba(140, 196, 180, 1)" />
          </radialGradient>

          <radialGradient id="inTimeLeaveGradient" cx="50%" cy="50%" r="100%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="rgba(34, 54, 55, 1)" />
            <stop offset="60%" stopColor="rgba(98, 153, 157, 1)" />
          </radialGradient>
        </defs>

        {/* Base Pie Charts */}
        <Pie
          stroke="none"
          data={data01}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius={65}
          outerRadius={95}
          startAngle={120}
          endAngle={480}
          isAnimationActive={false}
          // activeIndex={activePieIndex === 1 ? activeIndex : -1}
          onMouseEnter={(_, index) => onPieEnter(_, index, 1)}
          labelLine={false}
        >
          {data01.map((entry, index) => (
            <Cell
              key={`cell1-${index}`}
              // fill={entry.name === "Working" ? "url(#workingGradient)" : "url(#notWorkingGradient)"}
              fill={entry.name === "Working" ? "#B24B87" : "#AC354B"}
            />
          ))}
        </Pie>

        <Pie
          stroke="none"
          data={data02}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius={32}
          outerRadius={62}
          startAngle={120}
          endAngle={480}
          isAnimationActive={false}
          // activeIndex={activePieIndex === 2 ? activeIndex : -1}
          onMouseEnter={(_, index) => onPieEnter(_, index, 2)}
          labelLine={false}
        >
          {data02.map((entry, index) => (
            <Cell
              key={`cell2-${index}`}
              // fill={entry.name === "Personal Leave" ? "url(#personalLeaveGradient)" : entry.name === "Sick Leave" ? "url(#sickLeaveGradient)" : "url(#leaveGradient)"}
              fill={entry.name === "Personal Leave" ? "#334E88" : entry.name === "Sick Leave" ? "#7280B9" : "#819FCC"}
            />
          ))}
        </Pie>

        <Pie
          stroke="none"
          data={data03}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius={1}
          outerRadius={30}
          startAngle={120}
          endAngle={480}
          isAnimationActive={false}
          // activeIndex={activePieIndex === 3 ? activeIndex : -1}
          onMouseEnter={(_, index) => onPieEnter(_, index, 3)}
          labelLine={false}
        >
          {data03.map((entry, index) => (
            <Cell
              key={`cell3-${index}`}
              // fill={entry.name === "Late" ? "url(#lateGradient)" : "url(#inTimeLeaveGradient)"}
              fill={entry.name === "Late" ? "#8CC4B4" : "#62999D"}
            />
          ))}
        </Pie>
        
        {/* Active Shape Layer (on top of everything) */}      
        { (pieClickIndex === 1 || pieClickIndex === -1) && activePieIndex === 1 && activeIndex !== -1 && (
          <Pie
            stroke="none"
            data={data01}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={80}
            startAngle={120}
            endAngle={480}
            activeShape={(props: any) => renderCustomizedShape(props, deviceChartList[0].name)}
            isAnimationActive={false}
            // activeIndex={activeIndex}
            fill="transparent"
          />
        )}
        
        { (pieClickIndex === 2 || pieClickIndex === -1) && activePieIndex === 2 && activeIndex !== -1 && (
          <Pie
            stroke="none"
            data={data02}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={90}
            outerRadius={120}
            startAngle={120}
            endAngle={480}
            activeShape={(props: any) => renderCustomizedShape(props, deviceChartList[1].name)}
            isAnimationActive={false}
            // activeIndex={activeIndex}
            fill="transparent"
          />
        )}
        
        { (pieClickIndex === 3 || pieClickIndex === -1) && activePieIndex === 3 && activeIndex !== -1 && (
          <Pie
            stroke="none"
            data={data03}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={130}
            outerRadius={160}
            startAngle={120}
            endAngle={480}
            activeShape={(props: any) => renderCustomizedShape(props, deviceChartList[2].name)}
            isAnimationActive={false}
            // activeIndex={activeIndex}
            fill="transparent"
          />
        )}
      </PieChart>
    </div>
  )
});

export default ActiveChart;