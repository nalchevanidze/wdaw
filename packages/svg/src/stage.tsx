import * as React from 'react';
import { Point } from './types';

type Fun = (_: React.MouseEvent<SVGGElement, MouseEvent>) => Point;

const StageContext = React.createContext<Fun>((): Point => ({ x: 0, y: 0 }));

type SvgStageProps = {
  width: number;
  height: number;
  viewBox?: [number, number, number, number];
  style?: React.CSSProperties;
  children: React.ReactNode;
  shift?: { x: number; y: number };
  zoom?: number;
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

const Svg: React.FC<SvgStageProps> = ({
  width,
  height,
  viewBox = [0, 0, width, height],
  style,
  children,
  shift,
  zoom = 1
}) => {
  const [, setClient] = React.useState(false);
  const ref = React.useRef<SVGSVGElement>(null);
  React.useEffect(() => setClient(true), []);

  const w = shift ? width + shift.x : width;
  const h = shift ? height + shift.y : height;
  const vb = shift ? [-shift.x, -shift.y, w, h] : viewBox;

  return (
    <svg
      width={w * zoom}
      height={h * zoom}
      style={style}
      ref={ref}
      viewBox={vb.join(' ')}
    >
      <StageContext.Provider
        value={ref.current ? svgCoordinates(ref.current) : fallback}
      >
        {children}
      </StageContext.Provider>
    </svg>
  );
};

export { Svg, StageContext };
