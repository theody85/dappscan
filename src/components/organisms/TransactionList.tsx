import { useContext } from "react";

import CardList from "./CardList";
import { receipt } from "../../assets";
import Transaction from "../molecules/Transaction";
import { AlchemyContext } from "../../context";
import { CardProps } from "../molecules/Card";

const TransactionList = () => {
  const { transactionList } = useContext(AlchemyContext);

  return (
    <CardList title="Transactions">
      {transactionList &&
        transactionList.map((transaction) => {
          const cardProps = {
            icon: receipt,
            identifier: transaction.transactionHash.slice(0, 18) + "...",
            timestamp: String(transaction.status),
            amount: 2,
          } as CardProps;

          const to = transaction.to;
          const from = transaction.from;

          return (
            <Transaction
              key={cardProps.identifier}
              to={to}
              from={from}
              cardProps={cardProps}
            />
          );
        })}
    </CardList>
  );
};

export default TransactionList;
