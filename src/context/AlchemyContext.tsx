import { Alchemy, Block, Network, TransactionReceipt } from "alchemy-sdk";
import { ethers } from "ethers";
import { createContext, useEffect, useState } from "react";

type AlchemyContextProviderProps = {
  children: React.ReactNode;
};

export type ExtendedBlock = Block & { reward: string; burntFees: number };
export type ExtendedTransaction = TransactionReceipt & {
  value: bigint;
  timestamp: number;
  feeRecipient: string;
};

export type AlchemyContextType = {
  alchemy: Alchemy;
  blockList: ExtendedBlock[] | null;
  transactionList: ExtendedTransaction[] | null;
  getBlockList: (blockNumber: number, limit: number) => Promise<void>;
  getBlock: (blockNumber: number) => Promise<ExtendedBlock | null>;
  getTransaction: (
    transactionHash: string,
  ) => Promise<ExtendedTransaction | null>;
  fetchedTxns: ExtendedTransaction[] | null;
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
  getTransaction: () => Promise.resolve(null),
  fetchedTxns: null,
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
  const [blockList, setBlockList] = useState<ExtendedBlock[]>([]);
  const [blocksPerPage, setBlocksPerPage] = useState<number>(BLOCKS_PER_PAGE);
  const [transactionList, setTransactionList] = useState<ExtendedTransaction[]>(
    [],
  );
  const [fetchedTxns, setFetchedTxns] = useState<ExtendedTransaction[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const alchemy = new Alchemy(settings);
  const provider = new ethers.AlchemyProvider(undefined, settings.apiKey);

  const getBlockList = async (blockNumber: number, limit: number) => {
    const blockList: ExtendedBlock[] = [];
    const transactionList: ExtendedTransaction[] = [];
    const fetchedTxns: ExtendedTransaction[] = [];

    for (let i = 0; i < limit; i++) {
      const block = await getBlock(blockNumber);
      const blockTransactions = block.transactions;
      const latestTransactionHash =
        blockTransactions[blockTransactions.length - 1];
      const latestTransaction = await getTransaction(latestTransactionHash);

      latestTransaction && transactionList.push(latestTransaction);

      blockList.push(block);

      if (fetchedTxns.length < limit) {
        for (const txnHash of blockTransactions) {
          const txn = await getTransaction(txnHash);
          txn && fetchedTxns.push(txn);
          if (fetchedTxns.length === limit) break;
        }
      }

      blockNumber--;
    }

    setBlockList(blockList);
    setTransactionList(transactionList);
    setFetchedTxns(fetchedTxns);

    setLoading(false);
  };

  const getBlock = async (blockNumber: number) => {
    const block = await alchemy.core.getBlock(blockNumber);
    const { reward, burntFees } = await getBlockReward(block);

    const fullBlock = { ...block, reward: reward.toPrecision(4), burntFees };
    return fullBlock;
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

    return { reward: Number(formattedblockReward), burntFees };
  };

  const getTransaction = async (transactionHash: string) => {
    const transaction = await alchemy.core.getTransactionReceipt(
      transactionHash,
    );
    const txn = await provider.getTransaction(transactionHash);

    if (!transaction || !txn) return null;
    const { timestamp, miner } = await getBlock(transaction?.blockNumber);

    const fullTxnDetails = {
      ...transaction,
      value: txn?.value,
      timestamp,
      feeRecipient: miner,
    };

    return fullTxnDetails;
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
        getTransaction,
        fetchedTxns,
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
