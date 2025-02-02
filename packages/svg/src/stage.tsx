import * as React from 'react';
import { Point } from './types';

type Context = {
  width: number;
  height: number;
  left: number;
  top: number;
  toPoint: (_: React.MouseEvent<SVGGElement, MouseEvent>) => Point;
};

const Context = React.createContext<Context>({
  toPoint: () => ({ x: 0, y: 0 }),
  width: 0,
  height: 0,
  left: 0,
  top: 0
});

type SvgStageProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
  width: number;
  height: number;
  paddingLeft?: number;
  paddingTop?: number;
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

export const usePoint = () => {
  const { toPoint } = React.useContext(Context);

  return toPoint;
};

export const Svg: React.FC<SvgStageProps> = ({
  width,
  height,
  style,
  children,
  paddingLeft = 0,
  paddingTop = 0,
  zoom = 1
}) => {
  const [, setClient] = React.useState(false);
  const ref = React.useRef<SVGSVGElement>(null);
  React.useEffect(() => setClient(true), []);

  const w = width + paddingLeft;
  const h = paddingTop + height;

  return (
    <svg
      width={w * zoom}
      height={h * zoom}
      style={style}
      ref={ref}
      viewBox={[-paddingLeft, -paddingTop, w, h].join(' ')}
    >
      <Context.Provider
        value={{
          left: paddingLeft,
          top: paddingTop,
          width,
          height,
          toPoint: ref.current ? svgCoordinates(ref.current) : fallback
        }}
      >
        {children}
      </Context.Provider>
    </svg>
  );
};
