import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { AlchemyContext } from "../context";
import { ethers } from "ethers";
import {
  ChevronLeft,
  ChevronRight,
  Clock4,
  Files,
  HelpCircle,
} from "lucide-react";
import { Progress } from "@material-tailwind/react";
import { ExtendedBlock } from "../context/AlchemyContext";

const BlockDetail = () => {
  const params = useParams<{ blockNumber: string }>();
  const navigate = useNavigate();
  const { getBlock } = useContext(AlchemyContext);

  const [block, setBlock] = useState<ExtendedBlock | null>(null);

  useEffect(() => {
    (async () => {
      const block = await getBlock(Number(params.blockNumber));

      setBlock(block);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(block, params);
  return (
    <div className="my-24 px-8 lg:px-16 flex flex-col w-full">
      <div className="text-3xl mb-6">
        Block <span className="text-[#9918b3]">#{block?.number} </span>
      </div>
      <div className="shadow-xl flex flex-col px-8 lg:px-16  text-sm rounded-lg border w-full">
        <div className="flex flex-col border-b py-6">
          <div className="flex flex-col md:flex-row py-5  gap-y-4 lg:gap-40">
            <span className="w-full md:w-1/3 flex gap-4 items-center font-bold">
              <span title="Also known as Block Number. The block height, which indicates the length of the blockchain, increases after the addition of the new block.">
                <HelpCircle size={15} />
              </span>
              Block Height:{" "}
            </span>
            <span className="w-full md:w-2/3 font-medium flex items-center gap-1">
              {block?.number}{" "}
              <span
                className="bg-[#e9ecef] p-1 inline-block items-center rounded-md ml-1"
                onClick={() => navigate(`/blocks/${block && block.number - 1}`)}
              >
                <ChevronLeft className="i " size={15} />
              </span>
              <span
                className="bg-[#e9ecef] p-1 inline-block items-center rounded-md"
                onClick={() => navigate(`/blocks/${block && block.number + 1}`)}
              >
                <ChevronRight className="i " size={15} />
              </span>
            </span>
          </div>
          <div className="flex py-5 flex-col md:flex-row gap-y-4 lg:gap-40 border-bottom-2">
            <span className="w-full md:w-1/3 flex gap-4 items-center font-bold">
              <span title="The date and time at which a block is produced. ">
                <HelpCircle size={15} />
              </span>
              Timestamp:{" "}
            </span>
            <span className="w-full md:w-2/3 font-medium flex items-start lg:items-center flex-col lg:flex-row">
              <div className="flex items-center gap-x-1">
                <Clock4 className="mr-2" size={15} />
                {block ? moment.unix(block.timestamp).fromNow() : 0}
              </div>

              <span className="text-[#9918b3] ml-1">
                ({block ? moment.unix(block.timestamp).toLocaleString() : 0})
              </span>
            </span>
          </div>
          <div className="flex py-5 flex-col md:flex-row gap-y-4  lg:gap-40 border-bottom-2">
            <span className="w-full md:w-1/3 flex gap-4 items-center font-bold">
              <span title="The number of transactions in the block. Internal transaction is transactions as a result of contract execution that involves Ether value.">
                <HelpCircle className=" " size={15} />
              </span>
              Transactions:{" "}
            </span>
            <span className="w-full md:w-2/3 font-medium ">
              <span className="text-[#9918b3] ">
                {block?.transactions.length} transactions
              </span>{" "}
              in this block
            </span>
          </div>
        </div>
        <div className="flex flex-col border-b py-6">
          <div className="flex py-5 flex-col md:flex-row gap-y-4 lg:gap-40 border-bottom-2">
            <span className="w-full md:w-1/3 flex gap-4 items-center font-bold">
              <span title="Address receiving fees from transactions in this block.">
                <HelpCircle className=" " size={15} />
              </span>
              Fee Recipient:{" "}
            </span>
            <span className="w-full md:w-2/3 font-medium flex items-center">
              <span className="text-[#9918b3] text-ellipsis overflow-hidden">
                {block?.miner}
              </span>

              <Files
                className="ml-2 cursor-pointer hover:text-[#9918b3] active:text-[#9918b3]/60"
                size={15}
                onClick={() =>
                  block && navigator.clipboard.writeText(block?.miner)
                }
              />
            </span>
          </div>
          <div className="flex py-5 flex-col md:flex-row gap-y-4 lg:gap-40 border-bottom-2">
            <span className="w-full md:w-1/3 flex gap-4 items-center font-bold">
              <span title="For each block, the block producer is rewarded with a finite amount of Ether on top of the fees paid for all transactions in the block.">
                <HelpCircle className=" " size={15} />
              </span>
              Block Reward:{" "}
            </span>
            <span className="w-full md:w-2/3 font-medium ">
              {block?.reward} ETH
            </span>
          </div>

          <div className="flex py-5 flex-col md:flex-row gap-y-4 lg:gap-40 border-bottom-2">
            <span className="w-full md:w-1/3 flex gap-4 items-center font-bold">
              <span title="Total difficulty of the chain until this block.">
                <HelpCircle className=" " size={15} />
              </span>
              Total Difficulty:{" "}
            </span>
            <span className="w-full md:w-2/3 font-medium ">
              {Number(block?._difficulty).toLocaleString()}
            </span>
          </div>
        </div>
        <div className="flex flex-col  py-6">
          <div className="flex py-5 flex-col md:flex-row gap-y-4 lg:gap-40 border-bottom-2">
            <span className="w-full md:w-1/3 flex gap-4 items-center font-bold">
              <span title="The total gas used in the block and its percentage of gas filled in the block.">
                <HelpCircle className=" " size={15} />
              </span>
              Gas Used:{" "}
            </span>
            <span className="w-full md:w-2/3 font-medium flex gap-2 items-center">
              {Number(block?.gasUsed).toLocaleString()}{" "}
              <span className="flex flex-col">
                <span
                  className={`text-${
                    (Number(block?.gasUsed) * 100) / Number(block?.gasLimit) <
                    50
                      ? "red-500"
                      : "green-500"
                  } self-end text-[12px]`}
                >
                  (
                  {(
                    (Number(block?.gasUsed) * 100) /
                    Number(block?.gasLimit)
                  ).toPrecision(4)}
                  %)
                </span>
                <Progress
                  value={
                    (Number(block?.gasUsed) * 100) / Number(block?.gasLimit)
                  }
                  size="sm"
                  color={`${
                    (Number(block?.gasUsed) * 100) / Number(block?.gasLimit) <
                    50
                      ? "red"
                      : "green"
                  }`}
                  className="w-20"
                />
              </span>
            </span>
          </div>
          <div className="flex py-5 flex-col md:flex-row gap-y-4  lg:gap-40 border-bottom-2">
            <span className="w-full md:w-1/3 flex gap-4 items-center font-bold">
              <span title="The total gas used in the block and its percentage of gas filled in the block.">
                <HelpCircle className=" " size={15} />
              </span>
              Gas Limit:{" "}
            </span>
            <span className="w-full md:w-2/3 font-medium ">
              {Number(block?.gasLimit).toLocaleString()}
            </span>
          </div>
          <div className="flex py-5 flex-col md:flex-row gap-y-4 lg:gap-40 border-bottom-2">
            <span className="w-full md:w-1/3 flex gap-4 items-center font-bold">
              <span title="Post-London Upgrade, this represents the minimum gasUsed multiplier required for a tx to be included in a block. ">
                <HelpCircle className=" " size={15} />
              </span>
              Base Fee Per Gas:{" "}
            </span>
            <span className="w-full md:w-2/3 font-medium ">
              {block?.baseFeePerGas &&
                ethers.formatEther(BigInt(Number(block?.baseFeePerGas)))}{" "}
              ETH{" "}
              <span className="text-[#9918b3]">
                (
                {block?.baseFeePerGas &&
                  ethers.formatUnits(
                    BigInt(Number(block?.baseFeePerGas)),
                    "gwei",
                  )}{" "}
                Gwei)
              </span>
            </span>
          </div>
          <div className="flex py-5  flex-col md:flex-row gap-y-4 lg:gap-40 border-bottom-2">
            <span className="w-full md:w-1/3 flex gap-4 items-center font-bold">
              <span title="Post-London Upgrade, this represents the part of the tx fee that is burnt: baseFeePerGas * gasUsed.">
                <HelpCircle className=" " size={15} />
              </span>
              Burnt Fees:{" "}
            </span>
            <span className="w-full md:w-2/3 font-medium ">
              🔥{" "}
              {block?.burntFees && ethers.formatEther(BigInt(block?.burntFees))}{" "}
              ETH
            </span>
          </div>
          <div className="flex py-5 flex-col md:flex-row gap-y-4 lg:gap-40 border-bottom-2">
            <span className="w-full md:w-1/3 flex gap-4 items-center font-bold">
              <span title="Any data that can be included by the block producer in the block.">
                <HelpCircle className=" " size={15} />
              </span>
              Extra Data:{" "}
            </span>
            <span className="bg-[#9918b3]/60 w-full lg:w-2/3 font-medium  px-5 py-5 rounded-md overflow-hidden text-ellipsis">
              {block?.extraData.slice(0, 40)}...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockDetail;
