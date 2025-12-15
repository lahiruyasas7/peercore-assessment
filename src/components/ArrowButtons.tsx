const ArrowButtons = ({ onPress }: { onPress: () => void }) => {
  return (
    <div
      className="flex flex-col items-center cursor-pointer select-none"
      onClick={onPress}
    >
      <div className="text-[#1C9C8C] text-xl leading-[18px]">▲</div>
      <div className="text-[#1C9C8C] text-xl leading-[18px]">▼</div>
    </div>
  );
};

export default ArrowButtons;
