import * as React from 'react';
import { Point } from './types';

const StageContext = React.createContext(
  (e: React.MouseEvent<SVGGElement, MouseEvent>): Point => ({ x: 0, y: 0 })
);

type SvgStageProps = {
  viewBox: string;
  height?: string | number;
  width?: string | number;
  style?: {};
  children: React.ReactNode;
};

const svgCoordinates =
  (svg: SVGSVGElement) =>
  (event: React.MouseEvent<SVGGElement, MouseEvent>): Point => {
    const { clientX, clientY } = event;
    const point = svg.createSVGPoint();
    point.x = clientX;
    point.y = clientY;
    return point.matrixTransform(svg.getScreenCTM()?.inverse());
  };

const fallback = () => ({ x: 0, y: 0 });

const SvgStage: React.FC<SvgStageProps> = ({ children, ...props }) => {
  const [_, setClient] = React.useState(false);
  const ref = React.useRef<SVGSVGElement>(null);
  React.useEffect(() => setClient(true), []);

  return (
    <svg {...props} ref={ref}>
      <StageContext.Provider
        value={ref.current ? svgCoordinates(ref.current) : fallback}
      >
        {children}
      </StageContext.Provider>
    </svg>
  );
};

export { SvgStage, StageContext };
