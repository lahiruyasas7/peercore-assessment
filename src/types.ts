export interface ElevatorState {
  currentFloor: number;
  direction: "up" | "down" | "idle";
  queue: number[];
}
