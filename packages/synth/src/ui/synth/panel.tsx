import * as React from "react";
import { ConfiguratorContext } from "../configurator";
import { PANEL_ID } from "../../engine/types";
import { colors} from '../styles';

const styles = {
  label: {
    fontSize: "12px",
    margin: "0",
    width: "100%",
    textAlign: "center",
    textTransform: "uppercase",
  },
  button: {
    display: "block",
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    margin: "2px",
    border: "2px solid #888888",
    padding: "0px",
    cursor: "pointer",
    flexShrink: 0,
  },
  grid: (size: number, active?: boolean) =>
    ({
      display: "flex",
      margin: "5px",
      justifyContent: "space-around",
      flexWrap: "wrap",
      flexShrink: "0",
      width: `${size * 50 + (size - 1) * 20}px`,
      opacity: active ? 1 : 0.5,
    } as const),
} as const;

export type Props = {
  id?: PANEL_ID;
  label: string;
  size?: number;
  children?: any;
  isActive?: boolean;
  color?: string;
  optional?: boolean;
};

const Panel: React.FC<Props> = ({
  children,
  label,
  size = 1,
  color = "#555",
  optional,
  id,
}) => {
  const [config, dispatch] = React.useContext(ConfiguratorContext);
  const target = id ? config[id] : undefined;

  const toggle = () =>
    id ? dispatch({ type: "TOGGLE_PANEL", id }) : undefined;
  const active =
    (optional && target && "enabled" in target && target.enabled) || !optional;

  const gridStyle = styles.grid(size, active);

  return (
    <div style={gridStyle}>
      <div
        style={{
          display: "flex",
          height: 10,
          cursor: optional ? "pointer" : "default",
        }}
        onClick={optional ? toggle : undefined}
      >
        {optional ? (
          <div
            style={{
              ...styles.button,
              background: active ? colors.highlight : colors.black,
            }}
          />
        ) : null}
        <h3 style={{ ...styles.label, color }}>{label}</h3>
      </div>
      <div style={gridStyle}>{children}</div>
    </div>
  );
};

export { Panel };
