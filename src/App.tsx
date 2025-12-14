import { useCallback, useEffect, useState } from "react";
import type { ElevatorState } from "./types";
import { FLOORS, MOVE_DELAY } from "./constants";
import ArrowButtons from "./components/ArrowButtons";
import FloorButton from "./components/FloorButton";

// queue optimization
const computeOptimizedQueue = (current: number, queue: number[]): number[] => {
  const sorted = [...queue].sort((a, b) => a - b);
  if (queue.length === 0) return [];
  if (current <= sorted[0]) return sorted;
  if (current >= sorted[sorted.length - 1]) return sorted.reverse();

  const down = sorted.filter((f) => f < current).reverse();
  const up = sorted.filter((f) => f > current);

  return [...up, ...down];
};

export default function App() {
  const [state, setState] = useState<ElevatorState>({
    currentFloor: 0,
    direction: "idle",
    queue: [],
  });

  const addToQueue = useCallback((target: number) => {
    setState((prev) => {
      if (prev.queue.includes(target) || target === prev.currentFloor)
        return prev;

      return {
        ...prev,
        queue: computeOptimizedQueue(prev.currentFloor, [
          ...prev.queue,
          target,
        ]),
      };
    });
  }, []);

  // movement
  useEffect(() => {
    if (state.queue.length === 0) {
      setState((s) => ({ ...s, direction: "idle" }));
      return;
    }

    const next = state.queue[0];
    const direction = next > state.currentFloor ? "up" : "down";

    const timer = setTimeout(() => {
      setState((prev) => {
        const newFloor =
          direction === "up" ? prev.currentFloor + 1 : prev.currentFloor - 1;

        if (newFloor === next) {
          return {
            currentFloor: newFloor,
            direction: prev.queue.length > 1 ? direction : "idle",
            queue: prev.queue.slice(1),
          };
        }

        return { ...prev, currentFloor: newFloor, direction };
      });
    }, MOVE_DELAY);

    return () => clearTimeout(timer);
  }, [state]);

  return (
    <div className="bg-[#E5E5EA] min-h-screen flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold text-[#1C9C8C] mb-10">
        Elevator Playground
      </h1>
      <div className="flex flex-col gap-6">
        {FLOORS.map((floor) => (
          <div key={floor} className="flex items-center gap-6">
            <ArrowButtons onPress={() => addToQueue(floor)} />
            <FloorButton floor={floor} active={state.currentFloor === floor} />
          </div>
        ))}
      </div>
    </div>
  );
}
