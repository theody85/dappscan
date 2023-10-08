import { useContext } from "react";

import CardList from "./CardList";
import { receipt } from "../../assets";
import Transaction from "../molecules/Transaction";
import { AlchemyContext } from "../../context";
import { CardProps } from "../molecules/Card";
import { ethers } from "ethers";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const TransactionList = () => {
  const { transactionList } = useContext(AlchemyContext);
  const navigate = useNavigate();

  return (
    <CardList title="Transactions">
      {transactionList &&
        transactionList.map((transaction) => {
          const cardProps = {
            icon: receipt,
            identifier: transaction.transactionHash.slice(0, 18) + "...",
            timestamp: moment.unix(transaction.timestamp).fromNow(),
            amount: Number(ethers.formatEther(transaction.value)).toPrecision(
              4,
            ),
          } as CardProps;

          const to = transaction.to;
          const from = transaction.from;

          return (
            <Transaction
              key={cardProps.identifier}
              to={to}
              from={from}
              cardProps={cardProps}
              navigateToTxnDetail={() =>
                navigate(`/txns/${transaction.transactionHash}`)
              }
            />
          );
        })}
    </CardList>
  );
};

export default TransactionList;
