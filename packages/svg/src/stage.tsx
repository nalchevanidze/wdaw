import * as React from 'react';
import { Point } from './types';

type Fun = (_: React.MouseEvent<SVGGElement, MouseEvent>) => Point;

const StageContext = React.createContext<Fun>((): Point => ({ x: 0, y: 0 }));

type SvgStageProps = {
  viewBox: string;
  height?: string | number;
  width?: string | number;
  style?: React.CSSProperties;
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
  const [, setClient] = React.useState(false);
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
