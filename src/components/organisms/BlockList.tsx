import CardList from "./CardList";
import BlockData from "../molecules/Block";
import { blockIcon } from "../../assets";
import { useFetchBlockData } from "../../hooks";

const BlockList = () => {
  const { blockList } = useFetchBlockData();

  return (
    <CardList title="Blocks">
      {blockList &&
        blockList.map((block) => {
          const cardProps = {
            icon: blockIcon,
            identifier: block.number,
            timestamp: new Date(block.timestamp * 1000).toLocaleTimeString(),
            amount: 2,
          };

          const miner = block.miner;
          const numberOfTxns = block.transactions.length;

          return (
            <BlockData
              key={cardProps.identifier}
              feeRecipient={miner}
              numberTxns={numberOfTxns}
              cardProps={cardProps}
            />
          );
        })}
    </CardList>
  );
};

export default BlockList;
