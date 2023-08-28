import Card, { CardProps } from "./Card";

type BlockProps = {
  feeRecipient: string;
  numberTxns: number;
  cardProps: CardProps;
};

const Block = ({ feeRecipient, numberTxns, cardProps }: BlockProps) => {
  return (
    <Card {...cardProps} amountTitle="Block Reward">
      <div className="flex flex-col ">
        <div>
          Validated By{" "}
          <span title={feeRecipient} className="text-[#9918b3]">
            {feeRecipient.slice(0, 15)}...
          </span>
        </div>
        <div className="text-[#9918b3]">
          {numberTxns} txns
          {/* <span></span> */}
        </div>
      </div>
    </Card>
  );
};

export default Block;
