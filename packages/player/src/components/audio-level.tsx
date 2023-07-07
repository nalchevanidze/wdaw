import * as React from "react";
import LoadedGraph from "./loaded-graph";
import {
  getDistance,
  Annulus,
  ArcSector,
  StageContext,
} from "@nalche/svg";
import { useContext } from "react";

type AudioLevelProps =  {
  annulus: Annulus;
  stageSector: ArcSector;
  levelSector: ArcSector;
  onChange(v: number): void;
};

const AudioLevel: React.FC<AudioLevelProps> = ({
  onChange,
  annulus,
  levelSector,
  stageSector,
}) => {
  const getCoordinates = useContext(StageContext);
  const [trackChanges, setTracking] = React.useState(false);
  const [gain, setGain] = React.useState(0.5);
  const {
    radius: [r1, r2],
    center,
  } = annulus;

  const onMouseUp = (): void => setTracking(false);

  const onMouseDown = (
    event: React.MouseEvent<SVGGElement, MouseEvent>
  ): void => {
    setTracking(true);
    onMouseMove(event);
  };

  const onMouseMove = (
    event: React.MouseEvent<SVGGElement, MouseEvent>
  ): void => {
    if (trackChanges) {
      const distance = getDistance(getCoordinates(event), center);
      const gain = Math.min(0.98, Math.max(0.05, (distance - r1) / (r2 - r1)));
      setGain(gain);
      onChange(gain ** 2);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mouseup", onMouseUp, false);
    return () => document.removeEventListener("mouseup", onMouseUp, false);
  });

  const levelAnnulus: Annulus = { center, radius: [r1 + (r2 - r1) * gain, r1] };

  return (
    <g
      fill="#BBB"
      stroke="#BBB"
      strokeWidth={0.5}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
    >
      <LoadedGraph
        annulus={levelAnnulus}
        sector={levelSector}
        fillOpacity={0.1}
        stroke="#CCC"
      />
      <LoadedGraph
        annulus={levelAnnulus}
        sector={stageSector}
        fillOpacity={0.4}
      />
      <LoadedGraph
        annulus={annulus}
        sector={levelSector}
        fill="black"
        fillOpacity={0.0}
      />
    </g>
  );
};

export { AudioLevel };
