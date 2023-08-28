import { useState, useContext, useEffect } from "react";

import CardList from "./CardList";
import { receipt } from "../../assets";
import Transaction from "../molecules/Transaction";
import { AlchemyContext } from "../../context";
import { TransactionReceipt } from "alchemy-sdk";
import { CardProps } from "../molecules/Card";

const TransactionList = () => {
  const [transactionList, setTransactionList] = useState<TransactionReceipt[]>(
    []
  );
  const alchemy = useContext(AlchemyContext);

  const getTransactionList = async (blockNumber: number) => {
    const transactionList: TransactionReceipt[] | null = [];

    for (let i = 0; i < 8; i++) {
      const block = await alchemy.core.getBlock(blockNumber);
      const blockTransactions = block.transactions;
      const latestTransactionHash =
        blockTransactions[blockTransactions.length - 1];
      const latestTransaction = await alchemy.core.getTransactionReceipt(
        latestTransactionHash
      );
      if (latestTransaction) {
        transactionList.push(latestTransaction);
        blockNumber--;
      }
    }
    // console.log(transactionList);

    setTransactionList(transactionList);
  };

  useEffect(() => {
    (async () => {
      const latestBlock = await alchemy.core.getBlockNumber();
      console.log(latestBlock);
      getTransactionList(latestBlock);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
