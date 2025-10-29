import { Sector } from 'recharts';
// Utils
import { formatNumberToFixed } from "../utils/commonFunctions";

export const renderCustomizedShape = (props: any, name: string) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
  const value = payload.value === 100 ? 0 : midAngle;
  const sin = Math.sin(-RADIAN * value);
  const cos = Math.cos(-RADIAN * value);
  const sx = cx + (outerRadius - 5) * cos;
  const sy = cy + (outerRadius - 5) * sin;
  const mx = cx + (outerRadius + 10) * cos;
  const my = cy + (outerRadius + 20) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 140;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <circle cx={sx} cy={sy} r={2} fill="#FFFFFF" stroke="none" />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke="#FFFFFF" fill="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * -125} y={ey - 5} textAnchor={textAnchor} fill="#FE7B00" fontWeight="600">
        {`Gantry : ${name}`}
      </text>
    </g>
  );
};

export const renderCustomizedLabel = (props: any, active: boolean) => {
  if (!active) return null;

  const RADIAN = Math.PI / 180;
  const { cx, cy, innerRadius, outerRadius, payload } = props;

  const fixedAngle = 270;
  const isActive = payload.name === "Active";

  let labelPosition = outerRadius <= 80 ? 0.75 : (isActive && payload.value < 45) || (!isActive && payload.value >= 30) ? 0.5 : 0.4;
  const radius = innerRadius + (outerRadius - innerRadius) * labelPosition;

  const angleToUse = isActive ? payload.value < 45 ? props.midAngle : fixedAngle : payload.value === 100 ? fixedAngle : props.midAngle;
  const x = cx + radius * Math.cos(-angleToUse * RADIAN);
  const y = cy + radius * Math.sin(-angleToUse * RADIAN);

  if (Math.round(payload.value) <= 0) return null;

  return (
    <text
      x={x}
      y={y}
      fill={isActive ? "black" : "#FEF400"}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={14}
    >
      {`${ payload.value % 1 === 0 ? payload.value : formatNumberToFixed(payload.value, 1)}%`}
    </text>
  );
};
