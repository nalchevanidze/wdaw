import { ArcSector } from "@waw/svg";
import * as React from "react";
import { RingComponentProps } from "../types";
import { roundFillStat, roundStatStripes } from "@waw/svg";

type WaveFormProps = RingComponentProps & {
  sector2: ArcSector;
  fr: Uint8Array;
  spec: Uint8Array;
};

const WaveForm: React.FC<WaveFormProps> = ({
  annulus,
  fr,
  spec,
  sector,
  sector2,
}) => (
  <g>
    <path
      d={roundFillStat(spec, annulus, sector2)}
      fillOpacity={0.6}
      fill="#777"
      fillRule="evenodd"
    />
    <path
      d={roundStatStripes(fr, annulus, sector)}
      stroke="#DDD"
      strokeWidth={0.4}
    />
  </g>
);
export default WaveForm;
