import * as React from 'react';
import { Point } from './types';

type Fun = (_: React.MouseEvent<SVGGElement, MouseEvent>) => Point;

const StageContext = React.createContext<Fun>((): Point => ({ x: 0, y: 0 }));

type SvgStageProps = {
  width: number;
  height: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  padding?: { left: number; top: number };
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
  style,
  children,
  padding,
  zoom = 1
}) => {
  const [, setClient] = React.useState(false);
  const ref = React.useRef<SVGSVGElement>(null);
  React.useEffect(() => setClient(true), []);

  const w = padding ? width + padding.left : width;
  const h = padding ? height + padding.top : height;
  const viewBox = padding
    ? [-padding.left, -padding.top, w, h]
    : [0, 0, width, height];

  return (
    <svg
      width={w * zoom}
      height={h * zoom}
      style={style}
      ref={ref}
      viewBox={viewBox.join(' ')}
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
