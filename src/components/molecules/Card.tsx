export type CardProps = {
  icon: string;
  identifier: number | string;
  timestamp: string | null;
  amount: string | number;
  amountTitle?: string;
  children?: React.ReactNode;
  navigateToBlockDetail?: VoidFunction;
};

const Card = ({
  icon,
  identifier,
  timestamp,
  children,
  amount,
  amountTitle,
  navigateToBlockDetail,
}: CardProps) => {
  return (
    <div className="p-4 flex flex-col md:flex-row justify-between border-b-2 gap-y-4">
      <div className="flex gap-3 items-center">
        <span className="bg-gray-100 p-2">
          <img src={icon} alt={`${icon}-icon`} className="w-6 h-6 opacity-60" />
        </span>
        <div className="flex flex-col w-full lg:w-32">
          <span
            className="text-[#9918b3] hover:text-[#4a1554] cursor-pointer"
            onClick={() => {
              if (navigateToBlockDetail) {
                navigateToBlockDetail();
              }
            }}
          >
            {identifier}
          </span>
          <span>{timestamp}</span>
        </div>
      </div>
      {children}
      <div
        title={amountTitle}
        className="px-5 h-8 reward-border rounded-lg flex items-center cursor-default w-fit"
      >
        {amount} Eth
      </div>
    </div>
  );
};

export default Card;
