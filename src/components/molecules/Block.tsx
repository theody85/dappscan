import Card, { CardProps } from "./Card";

type BlockProps = {
  feeRecipient: string;
  numberTxns: number;
  cardProps: CardProps;
  navigateToBlockDetail: VoidFunction;
};

const Block = ({
  feeRecipient,
  numberTxns,
  cardProps,
  navigateToBlockDetail,
}: BlockProps) => {
  return (
    <Card
      {...cardProps}
      amountTitle="Block Reward"
      navigateToBlockDetail={navigateToBlockDetail}
    >
      <div className="flex gap-2 md:gap-0 md:flex-col ">
        <div>
          Validated By{" "}
          <span title={feeRecipient} className="text-[#9918b3]">
            {feeRecipient.slice(0, 15)}...
          </span>
        </div>
        <div className="text-[#9918b3]">{numberTxns} txns</div>
      </div>
    </Card>
  );
};

export default Block;
