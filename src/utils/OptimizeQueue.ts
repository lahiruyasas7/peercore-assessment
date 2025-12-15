import type { Direction } from "../types";

// Enhanced optimizeQueue function
const OptimizeQueue = (
  current: number,
  queue: number[],
  direction: Direction
): number[] => {
  // Remove duplicates and sort initially
  const uniqueFloors = [...new Set(queue)];

  if (direction === "idle") {
    // If idle, go to nearest floor first
    return uniqueFloors.sort(
      (a, b) => Math.abs(a - current) - Math.abs(b - current)
    );
  }

  if (direction === "up") {
    // First serve all floors above current in ascending order
    const above = uniqueFloors.filter((f) => f > current).sort((a, b) => a - b);
    // Then serve floors below current in descending order (direction change)
    const below = uniqueFloors.filter((f) => f < current).sort((a, b) => b - a);
    return [...above, ...below];
  }

  if (direction === "down") {
    // First serve all floors below current in descending order
    const below = uniqueFloors.filter((f) => f < current).sort((a, b) => b - a);
    // Then serve floors above current in ascending order (direction change)
    const above = uniqueFloors.filter((f) => f > current).sort((a, b) => a - b);
    return [...below, ...above];
  }

  return uniqueFloors;
};

export default OptimizeQueue;
