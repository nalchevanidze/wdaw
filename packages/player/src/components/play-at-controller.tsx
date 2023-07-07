import * as React from "react";
import LoadedGraph from "./loaded-graph";
import { percentFromPoints, StageContext } from "@nalche/svg";
import { RingComponentProps } from "../types";

type PlayAtControllerProps = RingComponentProps & {
  onClick: (pro: number) => void;
};

const PlayAtController: React.FC<PlayAtControllerProps> = ({
  annulus,
  sector,
  onClick,
}) => {
  const getCoordinates = React.useContext(StageContext);

  return (
    <LoadedGraph
      annulus={annulus}
      sector={sector}
      onClick={(event) =>
        onClick(
          percentFromPoints(getCoordinates(event), annulus.center, sector)
        )
      }
      fillOpacity={0}
    />
  );
};

export default PlayAtController;
