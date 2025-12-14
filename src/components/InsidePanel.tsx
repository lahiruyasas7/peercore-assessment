import { FLOORS } from "../constants";

const InsidePanel = ({ onPress }: { onPress: (f: number) => void }) => (
  <div className="absolute right-[15px] top-1/2 -translate-y-1/2 flex flex-col gap-1">
    {FLOORS.map((f) => (
      <button
        key={f}
        onClick={() => onPress(f)}
        className="w-4 h-4 rounded-full bg-yellow-400 border border-yellow-600 hover:scale-110 transition flex items-center justify-center"
      >
        {f}
      </button>
    ))}
  </div>
);

export default InsidePanel;
