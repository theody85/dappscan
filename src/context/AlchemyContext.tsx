import { Alchemy, Block, Network, TransactionReceipt } from "alchemy-sdk";
import { ethers } from "ethers";
import { createContext, useEffect, useState } from "react";

type AlchemyContextProviderProps = {
  children: React.ReactNode;
};

type AlchemyContextType = {
  alchemy: Alchemy;
  blockList: Block[] | null;
  transactionList: TransactionReceipt[] | null;
  blockRewardList: string[] | null;
  getBlockList: (blockNumber: number, limit: number) => Promise<void>;
  getBlock: (blockNumber: number) => Promise<Block | null>;
  getBlockReward: (block: Block) => Promise<number | null>;
  getBurntFees: (block: Block) => Promise<number | null>;
  blocksPerPage: number;
  setBlocksPerPage: (blocksPerPage: number) => void;
  loading: boolean;
};

export const AlchemyContext = createContext<AlchemyContextType>({
  alchemy: {} as Alchemy,
  blockList: null,
  transactionList: null,
  blockRewardList: null,
  getBlockList: () => Promise.resolve(void 0),
  getBlock: () => Promise.resolve(null),
  getBlockReward: () => Promise.resolve(null),
  getBurntFees: () => Promise.resolve(null),
  blocksPerPage: 0,
  setBlocksPerPage: () => null,
  loading: false,
});

const settings = {
  apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const BLOCKS_PER_PAGE = 10;

const AlchemyContextProvider = ({ children }: AlchemyContextProviderProps) => {
  const [blockList, setBlockList] = useState<Block[]>([]);
  const [blocksPerPage, setBlocksPerPage] = useState<number>(BLOCKS_PER_PAGE);
  const [transactionList, setTransactionList] = useState<TransactionReceipt[]>(
    [],
  );
  const [blockRewardList, setblockRewardList] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const alchemy = new Alchemy(settings);

  const getBlockList = async (blockNumber: number, limit: number) => {
    const blockList: Block[] = [];
    const transactionList: TransactionReceipt[] = [];
    const blockRewardList: string[] = [];

    for (let i = 0; i < limit; i++) {
      const block = await getBlock(blockNumber);
      const blockTransactions = block.transactions;
      const latestTransactionHash =
        blockTransactions[blockTransactions.length - 1];
      const latestTransaction = await alchemy.core.getTransactionReceipt(
        latestTransactionHash,
      );
      if (latestTransaction) {
        transactionList.push(latestTransaction);
      }
      blockList.push(block);
      const blockReward = await getBlockReward(block);
      blockRewardList.push(blockReward.toPrecision(4));
      blockNumber--;
    }

    setBlockList(blockList);
    setTransactionList(transactionList);
    setblockRewardList(blockRewardList);
    setLoading(false);
  };

  const getBlock = async (blockNumber: number) => {
    const block = await alchemy.core.getBlock(blockNumber);
    return block;
  };

  const getTxnsGasUseage = async (blockHash: string) => {
    const { receipts } = await alchemy.core.getTransactionReceipts({
      blockHash,
    });
    let totalTxnsFee = 0;

    if (receipts)
      for (const receipt of receipts) {
        const txnFee =
          Number(receipt.gasUsed) * Number(receipt.effectiveGasPrice);

        totalTxnsFee += Number(txnFee);
      }

    return totalTxnsFee;
  };
  const getBurntFees = async (block: Block) => {
    const baseFeePerGas = block.baseFeePerGas;
    const gasUsed = block.gasUsed;

    const burnedFees = baseFeePerGas?.mul(gasUsed);
    const burnedFeesNum = Number(burnedFees);

    return burnedFeesNum;
  };
  const getBlockReward = async (block: Block) => {
    const txnsFee = await getTxnsGasUseage(block.hash);

    const burntFees = await getBurntFees(block);

    const blockReward = txnsFee - burntFees;
    const formattedblockReward = ethers.formatEther(BigInt(blockReward));

    return Number(formattedblockReward);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const latestBlock = await alchemy.core.getBlockNumber();
      getBlockList(latestBlock, blocksPerPage);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocksPerPage]);
  console.log(blocksPerPage);
  return (
    <AlchemyContext.Provider
      value={{
        alchemy,
        blockList,
        transactionList,
        blockRewardList,
        getBlockList,
        getBlock,
        setBlocksPerPage,
        getBlockReward,
        getBurntFees,
        blocksPerPage,
        loading,
      }}
    >
      {children}
    </AlchemyContext.Provider>
  );
};

export default AlchemyContextProvider;
