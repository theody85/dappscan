import { Alchemy, Block, Network, TransactionReceipt } from "alchemy-sdk";
import { createContext, useEffect, useState } from "react";

type AlchemyContextProviderProps = {
  children: React.ReactNode;
};

type AlchemyContextType = {
  alchemy: Alchemy;
  blockList: Block[] | null;
  transactionList: TransactionReceipt[] | null;
  getBlockList: (blockNumber: number, limit: number) => Promise<void>;
  getBlock: (blockNumber: number) => Promise<Block | null>;
  blocksPerPage: number;
  setBlocksPerPage: (blocksPerPage: number) => void;
  loading: boolean;
};

export const AlchemyContext = createContext<AlchemyContextType>({
  alchemy: {} as Alchemy,
  blockList: null,
  transactionList: null,
  getBlockList: () => Promise.resolve(void 0),
  getBlock: () => Promise.resolve(null),
  blocksPerPage: 0,
  setBlocksPerPage: () => null,
  loading: false,
});

const settings = {
  apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const BLOCKS_PER_PAGE = 8;

const AlchemyContextProvider = ({ children }: AlchemyContextProviderProps) => {
  const [blockList, setBlockList] = useState<Block[]>([]);
  const [blocksPerPage, setBlocksPerPage] = useState<number>(BLOCKS_PER_PAGE);
  const [transactionList, setTransactionList] = useState<TransactionReceipt[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);

  const alchemy = new Alchemy(settings);

  const getBlockList = async (blockNumber: number, limit: number) => {
    const blockList: Block[] = [];
    const transactionList: TransactionReceipt[] = [];

    for (let i = 0; i < limit; i++) {
      const block = await alchemy.core.getBlock(blockNumber);
      const blockTransactions = block.transactions;
      const latestTransactionHash =
        blockTransactions[blockTransactions.length - 1];
      const latestTransaction = await alchemy.core.getTransactionReceipt(
        latestTransactionHash
      );
      if (latestTransaction) {
        transactionList.push(latestTransaction);
      }
      blockList.push(block);
      blockNumber--;
    }

    setBlockList(blockList);
    setTransactionList(transactionList);
    setLoading(false);
  };

  const getBlock = async (blockNumber: number) => {
    const block = await alchemy.core.getBlock(blockNumber);
    return block;
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
        getBlockList,
        getBlock,
        setBlocksPerPage,
        blocksPerPage,
        loading,
      }}
    >
      {children}
    </AlchemyContext.Provider>
  );
};

export default AlchemyContextProvider;
