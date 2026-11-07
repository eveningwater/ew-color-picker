import { describe, it, expect } from "vitest";
import {
  parseGradient,
  serializeGradient,
  splitTopLevel,
} from "../src/parse";

describe("parseGradient", () => {
  it("parses a linear gradient with angle and stops", () => {
    const value = parseGradient(
      "linear-gradient(90deg, #ff0000 0%, #0000ff 100%)"
    );

    expect(value).not.toBeNull();
    expect(value!.type).toBe("linear");
    expect(value!.repeating).toBe(false);
    expect(value!.angle).toEqual({ value: 90, unit: "deg" });
    expect(value!.stops).toEqual([
      { color: "#ff0000", position: 0 },
      { color: "#0000ff", position: 100 },
    ]);
  });

  it("maps side keywords to angles", () => {
    const top = parseGradient("linear-gradient(to top, red, blue)");
    const bottomRight = parseGradient(
      "linear-gradient(to bottom right, red, blue)"
    );

    expect(top!.angle.value).toBe(0);
    expect(bottomRight!.angle.value).toBe(135);
  });

  it("keeps the original angle unit", () => {
    const value = parseGradient(
      "linear-gradient(0.25turn, red, blue)"
    );

    expect(value!.angle).toEqual({ value: 0.25, unit: "turn" });
  });

  it("treats a color-only first argument as the first stop", () => {
    const value = parseGradient("linear-gradient(red, blue)");

    expect(value).not.toBeNull();
    expect(value!.angle).toEqual({ value: 180, unit: "deg" });
    expect(value!.stops.map((stop) => stop.color)).toEqual(["red", "blue"]);
  });

  it("supports repeating gradients", () => {
    const value = parseGradient(
      "repeating-linear-gradient(45deg, red, blue)"
    );

    expect(value!.repeating).toBe(true);
    expect(value!.type).toBe("linear");
    expect(value!.angle.value).toBe(45);
  });

  it("parses radial shape, size and position", () => {
    const value = parseGradient(
      "radial-gradient(circle closest-side at 30% 40%, red, blue)"
    );

    expect(value!.type).toBe("radial");
    expect(value!.radialShape).toBe("circle");
    expect(value!.radialSize).toBe("closest-side");
    expect(value!.position).toEqual({ x: 30, y: 40 });
  });

  it("parses radial gradients without shape keywords", () => {
    const value = parseGradient(
      "radial-gradient(at center, red, blue)"
    );

    expect(value!.position).toEqual({ x: 50, y: 50 });
    expect(value!.radialShape).toBe("ellipse");
  });

  it("parses conic gradients with from and at", () => {
    const value = parseGradient(
      "conic-gradient(from 45deg at 20% 80%, red, blue)"
    );

    expect(value!.type).toBe("conic");
    expect(value!.conicFrom).toEqual({ value: 45, unit: "deg" });
    expect(value!.position).toEqual({ x: 20, y: 80 });
  });

  it("extracts interpolation hints", () => {
    const value = parseGradient(
      "linear-gradient(45deg in oklch longer hue, red, blue)"
    );

    expect(value!.interpolation).toBe("oklch longer hue");
    expect(value!.angle.value).toBe(45);
  });

  it("supports interpolation-only first argument", () => {
    const value = parseGradient("linear-gradient(in oklab, red, blue)");

    expect(value!.interpolation).toBe("oklab");
    expect(value!.stops.length).toBe(2);
  });

  it("parses double position stops", () => {
    const value = parseGradient(
      "linear-gradient(red 0% 20%, blue 100%)"
    );

    expect(value!.stops[0]).toEqual({
      color: "red",
      position: 0,
      position2: 20,
    });
    expect(value!.stops[1]).toEqual({ color: "blue", position: 100 });
  });

  it("does not split commas inside color functions", () => {
    const value = parseGradient(
      "linear-gradient(90deg, rgb(255, 0, 0), rgba(0, 0, 255, 0.5))"
    );

    expect(value!.stops.map((stop) => stop.color)).toEqual([
      "rgb(255, 0, 0)",
      "rgba(0, 0, 255, 0.5)",
    ]);
  });

  it("rejects length based stop positions", () => {
    expect(parseGradient("linear-gradient(red 10px, blue)")).toBeNull();
  });

  it("rejects gradients with less than two stops", () => {
    expect(parseGradient("linear-gradient(red)")).toBeNull();
  });

  it("rejects unsupported strings", () => {
    expect(parseGradient("not-a-gradient")).toBeNull();
    expect(parseGradient("")).toBeNull();
  });

  it("keeps parse -> serialize -> parse stable", () => {
    const css =
      "radial-gradient(circle farthest-corner at 25% 75%, red 0%, #00ff00 50%, blue 100%)";
    const first = parseGradient(css)!;
    const serialized = serializeGradient(first);
    const second = parseGradient(serialized)!;

    expect(serializeGradient(second)).toBe(serialized);
    expect(second.stops).toEqual(first.stops);
    expect(second.radialShape).toBe(first.radialShape);
    expect(second.radialSize).toBe(first.radialSize);
    expect(second.position).toEqual(first.position);
  });

  it("serializes all gradient types", () => {
    const linear = parseGradient("linear-gradient(90deg, red, blue)")!;
    expect(serializeGradient(linear)).toBe(
      "linear-gradient(90deg, red, blue)"
    );

    const conic = parseGradient("conic-gradient(red, blue)")!;
    expect(serializeGradient(conic)).toBe(
      "conic-gradient(from 0deg at 50% 50%, red, blue)"
    );

    const repeating = parseGradient("repeating-linear-gradient(red, blue)")!;
    expect(serializeGradient(repeating)).toContain("repeating-linear-gradient(");
  });
});

describe("splitTopLevel", () => {
  it("splits only top level commas", () => {
    expect(
      splitTopLevel("rgb(255, 0, 0), rgba(0, 0, 255, 0.5)")
    ).toEqual(["rgb(255, 0, 0)", "rgba(0, 0, 255, 0.5)"]);
  });

  it("trims each part", () => {
    expect(splitTopLevel("  a , b ")).toEqual(["a", "b"]);
  });
});
