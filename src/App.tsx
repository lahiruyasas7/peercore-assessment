import { useCallback, useEffect, useState } from "react";
import type { Direction, ElevatorState } from "./types";
import { FLOORS, MOVE_DELAY } from "./constants";
import ArrowButtons from "./components/ArrowButtons";
import FloorButton from "./components/FloorButton";
import InsidePanel from "./components/InsidePanel";
import OptimizeQueue from "./utils/OptimizeQueue";

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
        queue: OptimizeQueue(
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
