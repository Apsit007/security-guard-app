import React, { useRef, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Constants
import { ALL_MONTHS } from "../../../constants/chartData";

interface WorkerData {
  month: string;
  sickLeave: number;
  personalLeave: number;
  annualLeave: number;
  ordinationLeave: number;
  leaveWithoutPay: number;
}

type WorkerBarChartProps = {
  data: WorkerData[];
  onChartRendered?: () => void;
};

const WorkerBarChart: React.FC<WorkerBarChartProps> = ({ data, onChartRendered }) => {
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
        sickLeave: 0,
        personalLeave: 0,
        annualLeave: 0,
        ordinationLeave: 0,
        leaveWithoutPay: 0,
      }
    );
  });

  return (
    <ResponsiveContainer width="100%" height={200} ref={chartRef}>
      <BarChart
        data={completeData}
        margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
      >
        <CartesianGrid strokeWidth={1} vertical={false} stroke="#DBDCDE" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#124692' }} />
        <YAxis tick={{ fontSize: 12, fill: '#124692' }} />
        {/* <Tooltip /> */}

        <Legend
          wrapperStyle={{
            fontSize: "12px",
          }}
          formatter={(value) => (
            <span style={{ color: "#124692" }}>{value}</span>
          )}
        />

        <Bar dataKey="sickLeave" barSize={6} stackId="a" fill="#FFB601" name="ลาป่วย" />
        <Bar dataKey="personalLeave" barSize={6} stackId="b" fill="#FF9F01" name="ลากิจ" />
        <Bar dataKey="annualLeave" barSize={6} stackId="c" fill="#FF8600" name="ลาพักร้อน" />
        <Bar dataKey="ordinationLeave" barSize={6} stackId="d" fill="#FF6D01" name="ลาบวช" />
        <Bar dataKey="leaveWithoutPay" barSize={6} stackId="e" fill="#C32F27" name="ขาดงาน" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WorkerBarChart;
