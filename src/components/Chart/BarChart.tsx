import * as React from "react";
import { VictoryBar } from "victory";

interface ChartData {
  x: number | string;
  y: number | string;
}

type Data = ChartData[];
interface Props {
  radius: number | { top: number, bottom: number, topLeft: number, topRight: number, bottomLeft: number, bottomRight: number }
  width: number;
  dpadding?: number;
  padding?: number | { top: number, bottom: number, left: number, right: number };
  data: Data;
  showLabel?: boolean;
}

export default function BarChart({ radius, width, dpadding, padding, data, showLabel }: Props) {



  return (
    <div style={{ justifyContent: "center", textAlign: "center" }}>
      <VictoryBar
        domainPadding={dpadding}
        padding={padding}
        cornerRadius={radius}
        barWidth={width}
        style={{
          data: {
            fill: ({ datum }) => datum.x === "2.5" ? "#4ae288" : datum.x === "2" ? "#9401ea" : "#4a68e2",
          },
          labels: {
            fill: ({ datum }: any) => datum.x === "2.5" ? "#4ae288" : datum.x === "2" ? "#9401ea" : "#4a68e2",
            fontSize: "30px",
            fontFamily: "Montserrat Bold"
          }
        }}
        data={data}
        labels={showLabel === true ? ({ datum }) => datum.z : []}
      />
    </div>
  );
}
