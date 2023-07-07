import * as React from "react";
import LevelWaveForm from "./components/level-wave-form";
import DynamicGraphics from "./components/dynamic-graphics";
import { AudioLevel } from "./components/audio-level";
import { AudioObject } from "./utils/audio-player";
import { Annulus, ArcSector, Point, SvgStage } from "@nalche/svg";
import PlayAtController from "./components/play-at-controller";
export { Sound } from "./components/sound-form";
import AnimationFrame from "./components/animation-frame";

type Parameters = {
  center: Point;
  radius: readonly [number, number, number];
  levelSector?: ArcSector;
  stageSector?: ArcSector;
};

export type AudioVisualizerProps = {
  par: Parameters;
  src: string;
  height?: string | number;
  width?: string | number;
  play?: boolean;
};

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  par,
  src,
  width,
  height,
}) => {
  const [audio] = React.useState(() => new AudioObject());
  React.useEffect(() => audio.playNew(src), [src]);
  React.useEffect(() => audio.stop, []);

  const {
    center,
    radius: [r1, r2, r3],
    levelSector = { start: 315, end: 360 },
    stageSector = { start: 45, end: 315 },
  } = par;
  const innerAnnulus: Annulus = { center, radius: [r1, r2] };

  return (
    <SvgStage viewBox="0 0 200 200" width={width} height={height}>
      <LevelWaveForm
        annulusSector={{
          center,
          radius: [r1, r2],
          sector: stageSector,
        }}
        src={src + ".json"}
      />
      <AnimationFrame observable={audio.getState}>
        {(state) => (
          <DynamicGraphics
            stageSector={stageSector}
            innerAnnulus={innerAnnulus}
            outerAnnulus={{
              center,
              radius: [r2, r3],
            }}
            state={state as any}
            toggle={audio.toggle}
            src={src}
          />
        )}
      </AnimationFrame>
      <AudioLevel
        annulus={innerAnnulus}
        onChange={audio.setVolume}
        stageSector={stageSector}
        levelSector={levelSector}
      />
      <PlayAtController
        annulus={innerAnnulus}
        sector={stageSector}
        onClick={audio.playAt}
      />
    </SvgStage>
  );
};

export default AudioVisualizer;
