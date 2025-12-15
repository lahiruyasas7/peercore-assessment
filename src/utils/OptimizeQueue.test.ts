import { describe, it, expect } from "vitest";
import OptimizeQueue from "./OptimizeQueue";

describe("optimizeQueue", () => {
  it("handles downward routing correctly", () => {
    const result = OptimizeQueue(5, [0, 1, 3], "down");
    expect(result).toEqual([3, 1, 0]);
  });

  it("handles upward routing correctly", () => {
    const result = OptimizeQueue(1, [5, 3, 2], "up");
    expect(result).toEqual([2, 3, 5]);
  });

  it("handles idle state by nearest floor first", () => {
    const result = OptimizeQueue(2, [5, 1, 4], "idle");
    expect(result[0]).toBe(1);
  });

  it("removes duplicate floors", () => {
    const result = OptimizeQueue(2, [3, 3, 1, 1], "up");
    expect(result).toEqual([3, 1]);
  });
});
