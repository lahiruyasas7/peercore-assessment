const FloorButton = ({ floor, active }: { floor: number; active: boolean }) => {
  return (
    <div
      className={`w-30 h-30 flex items-center justify-center rounded-2xl text-white text-2xl font-semibold
      shadow-lg transition-all duration-300
      ${active ? "bg-[#00B386] ring-4 ring-[#82E6C3]" : "bg-[#4B4C65]"}`}
    >
      {floor}
    </div>
  );
};

export default FloorButton;
