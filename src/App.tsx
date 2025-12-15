import { useCallback, useEffect, useState } from "react";
import type { Direction, ElevatorState } from "./types";
import { FLOORS, MOVE_DELAY } from "./constants";
import ArrowButtons from "./components/ArrowButtons";
import FloorButton from "./components/FloorButton";
import InsidePanel from "./components/InsidePanel";

// Enhanced optimizeQueue function
const optimizeQueue = (
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

export default function App() {
  const [state, setState] = useState<ElevatorState>({
    currentFloor: 0,
    direction: "idle",
    queue: [],
  });

  const addToQueue = useCallback((floor: number) => {
    setState((prev) => {
      if (floor === prev.currentFloor || prev.queue.includes(floor))
        return prev;

      return {
        ...prev,
        queue: optimizeQueue(
          prev.currentFloor,
          [...prev.queue, floor],
          prev.direction
        ),
      };
    });
  }, []);

  // movement
  useEffect(() => {
    if (state.queue.length === 0) {
      setState((s) => ({ ...s, direction: "idle" }));
      return;
    }
    console.log("queue");
    const next = state.queue[0];
    const direction: Direction = next > state.currentFloor ? "up" : "down";

    const timer = setTimeout(() => {
      setState((prev) => {
        const nextFloor =
          direction === "up" ? prev.currentFloor + 1 : prev.currentFloor - 1;

        if (nextFloor === next) {
          return {
            currentFloor: nextFloor,
            direction: prev.queue.length > 1 ? direction : "idle",
            queue: prev.queue.slice(1),
          };
        }

        return { ...prev, currentFloor: nextFloor, direction };
      });
    }, MOVE_DELAY);

    return () => clearTimeout(timer);
  }, [state.queue, state.currentFloor]);

  return (
    <div className="bg-[#E5E5EA] min-h-screen flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold text-[#1C9C8C] mb-10">
        Elevator Playground
      </h1>
      <div className="flex flex-col gap-6">
        {FLOORS.map((floor) => {
          const isActive = floor === state.currentFloor;

          return (
            <div key={floor} className="flex items-center gap-6 relative">
              <ArrowButtons onPress={() => addToQueue(floor)} />

              <div className="relative">
                <FloorButton floor={floor} active={isActive} />
                {isActive && <InsidePanel onPress={addToQueue} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
