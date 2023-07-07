import { Circle } from "./types";

const renderPoint = ({ center, radius }: Circle, degree: number): number[] => {
  const radian = (degree * Math.PI) / 180.0,
    x = center.x + radius * Math.cos(radian),
    y = center.y + radius * Math.sin(radian);
  return [Number(x.toFixed(2)), Number(y.toFixed(2))];
};

function renderArc(
  circle: Circle,
  startDegree: number,
  endDegree: number
): string {
  const cutMethod =
    Math.floor((endDegree - startDegree) / 180) % 2 === 0 ? "0,1" : "1,1";
  return [
    "M" + renderPoint(circle, startDegree),
    "A" + circle.radius,
    circle.radius,
    0,
    cutMethod,
    renderPoint(circle, endDegree),
  ].join(" ");
}

const renderArcs = (circle: Circle, percent: number): string =>
  renderArc(circle, 90, 90 + percent * 3.6);

export { renderArcs };
