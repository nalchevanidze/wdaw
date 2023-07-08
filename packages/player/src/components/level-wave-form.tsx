import { AnnulusSector } from "@waw/svg";
import * as React from "react";
import { circleFill } from "@waw/svg";
import { withWaveform } from "../utils/waveform-service";

export default withWaveform<{
  annulusSector: AnnulusSector;
}>(({ waveform, annulusSector }) => (
  <path d={circleFill(waveform, annulusSector)} fillOpacity={0.8} />
));
