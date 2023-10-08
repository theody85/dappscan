import Card, { CardProps } from "./Card";

type TransactionProps = {
  to: string;
  from: string;
  cardProps: CardProps;
  navigateToTxnDetail?: VoidFunction;
};
const Transaction = ({
  to,
  from,
  cardProps,
  navigateToTxnDetail,
}: TransactionProps) => {
  return (
    <Card
      {...cardProps}
      amountTitle="Ether"
      navigateToBlockDetail={navigateToTxnDetail}
    >
      <div className="flex flex-col items-start">
        <div>
          To{" "}
          <span title={to} className="text-[#9918b3]">
            {to.slice(0, 16)}...
          </span>
        </div>
        <div>
          From{" "}
          <span title={from} className="text-[#9918b3]">
            {from.slice(0, 15)}...
          </span>
        </div>
      </div>
    </Card>
  );
};

export default Transaction;
