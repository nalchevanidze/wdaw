import * as React from "react";
import { RingComponentProps } from "../types";
import { sectorCutLine } from "@nalche/svg";

const LineTime: React.FC<RingComponentProps> = ({ annulus, sector }) => (
  <path d={"M " + sectorCutLine(annulus, sector.start)} stroke="#FFC107" />
);

export default LineTime;
