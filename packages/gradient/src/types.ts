export type GradientType = "linear" | "radial" | "conic";
export type AngleUnit = "deg" | "rad" | "grad" | "turn";

export interface GradientAngle {
  value: number;
  unit: AngleUnit;
}

export interface GradientStop {
  color: string;
  position?: number;
  position2?: number;
}

export interface GradientPosition {
  x: number;
  y: number;
}

export interface GradientValue {
  type: GradientType;
  repeating: boolean;
  angle: GradientAngle;
  radialShape: "circle" | "ellipse";
  radialSize: string;
  conicFrom: GradientAngle;
  position: GradientPosition;
  interpolation: string | null;
  stops: GradientStop[];
}

export function createGradientValue(
  type: GradientType = "linear"
): GradientValue {
  return {
    type,
    repeating: false,
    angle: { value: 180, unit: "deg" },
    radialShape: "ellipse",
    radialSize: "farthest-corner",
    conicFrom: { value: 0, unit: "deg" },
    position: { x: 50, y: 50 },
    interpolation: null,
    stops: [],
  };
}

export function cloneGradientValue(value: GradientValue): GradientValue {
  return {
    ...value,
    angle: { ...value.angle },
    conicFrom: { ...value.conicFrom },
    position: { ...value.position },
    stops: value.stops.map((stop) => ({ ...stop })),
  };
}
