import React, { useRef, useEffect } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
} from "recharts";

// Constants
import { ALL_MONTHS } from "../../../constants/chartData";

interface EventData {
  month: string;
  value1: number;
  value2: number;
}

type LineAreaChartProps = {
  data: EventData[];
  onChartRendered?: () => void;
}

const LineAreaChart: React.FC<LineAreaChartProps> = ({ data, onChartRendered }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (onChartRendered) onChartRendered();
    }
  }, [data]);
  
  const completeData = ALL_MONTHS.map((month) => {
    const existing = data.find((d) => d.month === month);
    return (
      existing || {
        month,
        value1: 0,
        value2: 0,
      }
    );
  });

  return (
    <ResponsiveContainer width="100%" height={200} ref={chartRef}>
      <AreaChart
        data={completeData}
        margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
      >
        <defs>
          <linearGradient id="value1Incident" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#334E87" stopOpacity={0.6}/>
            <stop offset="95%" stopColor="#DBDCDE" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="value2Incident" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#62999D" stopOpacity={0.6}/>
            <stop offset="95%" stopColor="#DBDCDE" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeWidth={1} vertical={false} stroke="#DBDCDE" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#124692' }} />
        <YAxis tick={{ fontSize: 12, fill: '#124692' }} />
        {/* <Tooltip /> */}
        <Area
          type="monotone"
          dataKey="value1"
          stroke="#324E87"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#value1Incident)"
        />
        <Line
          type="monotone"
          dataKey="value1"
          stroke="#324E87"
          strokeWidth={2}
          dot={{ r: 3, strokeWidth: 2, fill: "#324E87" }}
        />
        <Area
          type="monotone"
          dataKey="value2"
          stroke="#62999D"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#value2Incident)"
        />
        <Line
          type="monotone"
          dataKey="value2"
          stroke="#62999D"
          strokeWidth={2}
          dot={{ r: 3, strokeWidth: 2, fill: "#62999D" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default LineAreaChart;