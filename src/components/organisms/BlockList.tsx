import CardList from "./CardList";
import BlockData from "../molecules/Block";
import { blockIcon } from "../../assets";
// import { useFetchBlockData } from "../../hooks";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { Loader } from "lucide-react";
import { useContext } from "react";
import { AlchemyContext } from "../../context";

const BlockList = () => {
  const { blockList, loading } = useContext(AlchemyContext);
  const navigate = useNavigate();

  if (loading) {
    <Loader />;
  }
  return (
    <CardList title="Blocks">
      {blockList &&
        blockList.map((block) => {
          const cardProps = {
            icon: blockIcon,
            identifier: block.number,
            timestamp: moment.unix(block.timestamp).fromNow(),
            amount: block.reward,
          };
          const miner = block.miner;
          const numberOfTxns = block.transactions.length;

          return (
            <BlockData
              key={cardProps.identifier}
              feeRecipient={miner}
              numberTxns={numberOfTxns}
              cardProps={cardProps}
              navigateToBlockDetail={() =>
                navigate(`/blocks/${cardProps.identifier}`)
              }
            />
          );
        })}
    </CardList>
  );
};

export default BlockList;
