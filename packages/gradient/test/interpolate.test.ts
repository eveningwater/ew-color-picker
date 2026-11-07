import { describe, it, expect } from "vitest";
import {
  interpolateStops,
  parseColorToRgba,
  resolveGradientPositions,
  rgbToOklab,
  oklabToRgb,
} from "../src/interpolate";

describe("parseColorToRgba", () => {
  it("parses hex colors", () => {
    expect(parseColorToRgba("#ff0000")).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(parseColorToRgba("#f00")).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(parseColorToRgba("#ff000080")).toEqual({
      r: 255,
      g: 0,
      b: 0,
      a: 128 / 255,
    });
  });

  it("parses rgb and hsl syntaxes", () => {
    expect(parseColorToRgba("rgb(0, 128, 255)")).toEqual({
      r: 0,
      g: 128,
      b: 255,
      a: 1,
    });
    expect(parseColorToRgba("rgba(0 0 0 / 50%)")).toEqual({
      r: 0,
      g: 0,
      b: 0,
      a: 0.5,
    });
    expect(parseColorToRgba("hsl(120, 100%, 50%)")).toEqual({
      r: 0,
      g: 255,
      b: 0,
      a: 1,
    });
  });

  it("handles transparent and keywords", () => {
    expect(parseColorToRgba("transparent")).toEqual({
      r: 0,
      g: 0,
      b: 0,
      a: 0,
    });
    expect(parseColorToRgba("red")).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  it("returns null for invalid colors", () => {
    expect(parseColorToRgba("not-a-color")).toBeNull();
    expect(parseColorToRgba("")).toBeNull();
  });
});

describe("resolveGradientPositions", () => {
  it("defaults the first stop to 0% and the last to 100%", () => {
    expect(resolveGradientPositions([{ color: "red" }, { color: "blue" }])).toEqual([
      0, 100,
    ]);
  });

  it("distributes intermediate stops evenly", () => {
    expect(
      resolveGradientPositions([
        { color: "red" },
        { color: "green" },
        { color: "blue" },
      ])
    ).toEqual([0, 50, 100]);
  });

  it("fills gaps between explicit positions", () => {
    expect(
      resolveGradientPositions([
        { color: "red", position: 20 },
        { color: "green" },
        { color: "blue", position: 100 },
      ])
    ).toEqual([20, 60, 100]);
  });

  it("returns an empty list for no stops", () => {
    expect(resolveGradientPositions([])).toEqual([]);
  });
});

describe("interpolateStops", () => {
  it("returns the edge colors outside the stop range", () => {
    const stops = [
      { color: "#ff0000", position: 10 },
      { color: "#0000ff", position: 90 },
    ];

    expect(interpolateStops(stops, 0)).toBe("rgba(255, 0, 0, 1)");
    expect(interpolateStops(stops, 100)).toBe("rgba(0, 0, 255, 1)");
  });

  it("mixes colors in sRGB by default", () => {
    const result = interpolateStops(
      [
        { color: "#ff0000", position: 0 },
        { color: "#0000ff", position: 100 },
      ],
      50
    );

    expect(result).toBe("rgba(128, 0, 128, 1)");
  });

  it("interpolates alpha", () => {
    const result = interpolateStops(
      [
        { color: "rgba(255, 0, 0, 0)", position: 0 },
        { color: "rgba(255, 0, 0, 1)", position: 100 },
      ],
      50
    );

    expect(result).toBe("rgba(255, 0, 0, 0.5)");
  });

  it("expands double position stops", () => {
    const result = interpolateStops(
      [
        { color: "red", position: 0, position2: 10 },
        { color: "blue", position: 100 },
      ],
      5
    );

    expect(result).toBe("rgba(255, 0, 0, 1)");
  });

  it("supports oklab interpolation", () => {
    const srgb = interpolateStops(
      [
        { color: "#ff0000", position: 0 },
        { color: "#0000ff", position: 100 },
      ],
      50,
      "srgb"
    );
    const oklab = interpolateStops(
      [
        { color: "#ff0000", position: 0 },
        { color: "#0000ff", position: 100 },
      ],
      50,
      "oklab"
    );

    expect(oklab).not.toBe(srgb);
    expect(oklab).toMatch(/^rgba\(\d+, \d+, \d+, 1\)$/);
  });

  it("returns an empty string when there are no valid stops", () => {
    expect(interpolateStops([], 50)).toBe("");
    expect(interpolateStops([{ color: "invalid" }], 50)).toBe("");
  });
});

describe("oklab conversion", () => {
  it("round-trips a color through oklab", () => {
    const lab = rgbToOklab({ r: 255, g: 0, b: 0, a: 1 });
    const rgb = oklabToRgb(lab);

    expect(rgb.r).toBeCloseTo(255, -1);
    expect(rgb.g).toBeLessThan(5);
    expect(rgb.b).toBeLessThan(5);
  });
});
