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
      amountTitle="Value"
      navigateToBlockDetail={navigateToTxnDetail}
    >
      <div className="flex flex-col  items-start ">
        <div>
          To{" "}
          <span
            title={to}
            className="text-[#9918b3] text-ellipsis overflow-hidden"
          >
            {to.slice(0, 16)}...
          </span>
        </div>
        <div>
          From{" "}
          <span
            title={from}
            className="text-[#9918b3] text-ellipsis overflow-hidden"
          >
            {from.slice(0, 15)}...
          </span>
        </div>
      </div>
    </Card>
  );
};

export default Transaction;
