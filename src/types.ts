export interface ElevatorState {
  currentFloor: number;
  direction: "up" | "down" | "idle";
  queue: number[];
}

export type Direction = "up" | "down" | "idle";