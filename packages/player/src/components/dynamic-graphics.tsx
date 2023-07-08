import * as React from "react";
import LoadedGraph from "./loaded-graph";
import LineTime from "./line-time";
import WaveForms from "./wave-form";
import { Annulus, ArcSector, subSectorByPercent } from "@wdaw/svg";

const playingModeIcons = {
  paused: "M 115 97 l 0 10 8 -5Z",
  play: "M 115 97 v 10 m7 -10 v 10",
};

type PlayingMode = keyof typeof playingModeIcons;

const getIcon = (name: keyof typeof playingModeIcons) => playingModeIcons[name];

const formatTime = (time: number) =>
  Math.floor(time / 60) + ":" + ("0" + (Math.floor(time) % 60)).slice(-2);

type TimeControllerProps = {
  time: number;
  mode: PlayingMode;
  annulus: Annulus;
  toggle: () => void;
};

type AudioState = {
  mode: PlayingMode;
  pro: number;
  time: number;
  freq: Uint8Array;
  spec: Uint8Array;
};

type DynamicGraphicsProps = {
  src: string;
  stageSector: ArcSector;
  innerAnnulus: Annulus;
  outerAnnulus: Annulus;
  state: AudioState;
  toggle: () => void;
};

const color = "#777";

const TimeController: React.FC<TimeControllerProps> = ({
  toggle,
  annulus,
  mode,
  time,
}) => (
  <g onClick={toggle} fill={color} style={{ cursor: "pointer" }}>
    <path
      d={getIcon(mode)}
      strokeLinecap="round"
      strokeLinejoin="round"
      fillOpacity="0"
      strokeWidth="2px"
      stroke={color}
    />
    <text
      x={annulus.center.x - 6}
      y={annulus.center.y + 8}
      fontSize="18px"
      textAnchor="middle"
      fontFamily="sans-serif"
    >
      {formatTime(time)}
    </text>
    <circle
      cx={annulus.center.x}
      cy={annulus.center.y}
      r={annulus.radius[0]}
      opacity={0}
    />
  </g>
);

const DynamicGraphics: React.FC<DynamicGraphicsProps> = ({
  innerAnnulus,
  outerAnnulus,
  stageSector,
  toggle,
  state: { pro, time, mode, freq, spec },
}) => {
  const playedSector = subSectorByPercent(pro, stageSector, false);
  return (
    <g>
      <WaveForms
        fr={freq}
        spec={spec}
        annulus={outerAnnulus}
        sector={stageSector}
        sector2={playedSector}
      />
      <LoadedGraph
        annulus={innerAnnulus}
        sector={playedSector}
        fill="#FFF"
        fillOpacity={0.8}
      />
      <LineTime annulus={innerAnnulus} sector={playedSector} />
      <TimeController
        toggle={toggle}
        annulus={innerAnnulus}
        mode={mode}
        time={time}
      />
    </g>
  );
};

export default DynamicGraphics;
