import { useEffect, useState } from "react";
import { useFetchBlockData } from "../hooks";
import { useParams } from "react-router-dom";
import { Block } from "alchemy-sdk";
import moment from "moment";

const BlockDetail = () => {
  const params = useParams<{ blockNumber: string }>();
  const { getBlock } = useFetchBlockData();

  const [block, setBlock] = useState<Block | null>(null);

  useEffect(() => {
    (async () => {
      const block = await getBlock(Number(params.blockNumber));
      setBlock(block);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(block, params);
  return (
    <div className="my-24 px-16 flex flex-col">
      <div className="text-3xl">
        Block <span className="text-[#9918b3]">#{block?.number}</span>
      </div>
      <div className="shadow-xl flex flex-col px-16 py-6">
        <div className="flex py-5  gap-40">
          <span className="font-semibold w-1/3">Block Height: </span>
          <span className="w-2/3">{block?.number}</span>
        </div>
        <div className="flex py-5  gap-40 border-bottom-2">
          <span className="font-semibold w-1/3">Timestamp: </span>
          <span className="w-2/3">
            {block ? moment.unix(block.timestamp).fromNow() : 0}
          </span>
        </div>
        <div className="flex py-5  gap-40 border-bottom-2">
          <span className="font-semibold w-1/3">Transactions: </span>
          <span className="w-2/3">{block?.transactions.length}</span>
        </div>
        <div className="flex py-5  gap-40 border-bottom-2">
          <span className="font-semibold w-1/3">Validated by: </span>
          <span className="text-[#9918b3] w-2/3">{block?.miner}</span>
        </div>
        <div className="flex py-5  gap-40 border-bottom-2">
          <span className="font-semibold w-1/3">Block Reward: </span>
          <span className="w-2/3">{}</span>
        </div>
        <div className="flex py-5  gap-40 border-bottom-2">
          <span className="font-semibold w-1/3">Difficulty: </span>
          <span className="w-2/3">{block?.difficulty}</span>
        </div>
        <div className="flex py-5  gap-40 border-bottom-2">
          <span className="font-semibold w-1/3">Total Difficulty: </span>
          <span className="w-2/3">{}</span>
        </div>
        <div className="flex py-5  gap-40 border-bottom-2">
          <span className="font-semibold w-1/3">Size: </span>
          <span className="w-2/3">{}</span>
        </div>
        <div className="flex py-5  gap-40 border-bottom-2">
          <span className="font-semibold w-1/3">Gas Used: </span>
          <span className="2/3">{}</span>
        </div>
        <div className="flex py-5  gap-40 border-bottom-2">
          <span className="font-semibold w-1/3">Gas Limit: </span>
          <span className="w-2/3">{}</span>
        </div>
        <div className="flex py-5  gap-40 border-bottom-2">
          <span className="font-semibold w-1/3">Base Fee Per Gas: </span>
          <span className="w-2/3">{}</span>
        </div>
        <div className="flex py-5  gap-40 border-bottom-2">
          <span className="font-semibold w-1/3">Burnt Fees: </span>
          <span className="2/3">{}</span>
        </div>
        <div className="flex py-5  gap-40 border-bottom-2">
          <span className="font-semibold w-1/3 ">Extra Data: </span>
          <span className="bg-[#e3bfeb] w-2/3">
            {block?.extraData.slice(0, 40)}...
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlockDetail;
