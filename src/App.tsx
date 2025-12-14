import { useCallback, useEffect, useState } from "react";
import type { Direction, ElevatorState } from "./types";
import { FLOORS, MOVE_DELAY } from "./constants";
import ArrowButtons from "./components/ArrowButtons";
import FloorButton from "./components/FloorButton";
import InsidePanel from "./components/InsidePanel";

// queue optimization
const optimizeQueue = (
  current: number,
  queue: number[],
  direction: Direction
): number[] => {
  const sorted = [...new Set(queue)].sort((a, b) => a - b);

  if (direction === "up") {
    return [
      ...sorted.filter((f) => f > current),
      ...sorted.filter((f) => f < current).reverse(),
    ];
  }

  if (direction === "down") {
    return [
      ...sorted.filter((f) => f < current).reverse(),
      ...sorted.filter((f) => f > current),
    ];
  }

  return sorted;
};

// ---- Inside elevator buttons (only active floor)
// const InsidePanel = ({ onPress }: { onPress: (f: number) => void }) => (
//   <div className="absolute right-[15px] top-1/2 -translate-y-1/2 flex flex-col gap-1">
//     {FLOORS.map((f) => (
//       <button
//         key={f}
//         onClick={() => onPress(f)}
//         className="w-4 h-4 rounded-full bg-yellow-400 border border-yellow-600 hover:scale-110 transition flex items-center justify-center"
//       >
//         {f}
//       </button>
//     ))}
//   </div>
// );

export default function App() {
  const [state, setState] = useState<ElevatorState>({
    currentFloor: 0,
    direction: "idle",
    queue: [],
  });
  //console.log("queue", state.queue);
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
