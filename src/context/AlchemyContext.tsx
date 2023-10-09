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
  getBlockList: (
    blockNumber: number,
    limit: number,
    fetchTxn?: boolean,
  ) => Promise<void>;
  getBlock: (blockNumber: number) => Promise<ExtendedBlock | null>;
  getTransaction: (
    transactionHash: string,
  ) => Promise<ExtendedTransaction | null>;

  fetchedTxns: ExtendedTransaction[] | null;
  limit: number;
  setLimit: (limit: number) => void;
  loading: boolean;
  setFetchTxnsOnly: (fetchTxnsOnly: boolean) => void;
};

export const AlchemyContext = createContext<AlchemyContextType>({
  alchemy: {} as Alchemy,
  blockList: null,
  transactionList: null,
  getBlockList: () => Promise.resolve(void 0),
  getBlock: () => Promise.resolve(null),
  getTransaction: () => Promise.resolve(null),
  fetchedTxns: null,
  limit: 0,
  setLimit: () => null,
  loading: false,
  setFetchTxnsOnly: () => null,
});

const settings = {
  apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const AlchemyContextProvider = ({ children }: AlchemyContextProviderProps) => {
  const [blockList, setBlockList] = useState<ExtendedBlock[]>([]);
  const [limit, setLimit] = useState<number>(0);
  // const [transactionsPerPage, setTransactionsPerPage] = useState<number>(0);
  const [latestTransactionList, setLatestTransactionList] = useState<
    ExtendedTransaction[]
  >([]);
  const [fetchedTxns, setFetchedTxns] = useState<ExtendedTransaction[]>([]);
  const [fetchTxnsOnly, setFetchTxnsOnly] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const alchemy = new Alchemy(settings);
  const provider = new ethers.AlchemyProvider(undefined, settings.apiKey);

  const getBlockList = async (blockNumber: number, limit: number) => {
    const blockList: ExtendedBlock[] = [];
    const transactionList: ExtendedTransaction[] = [];

    for (let i = 0; i < limit; i++) {
      const block = await getBlock(blockNumber);
      const blockTransactions = block.transactions;
      const latestTransactionHash =
        blockTransactions[blockTransactions.length - 1];

      const latestTransaction = await getTransaction(latestTransactionHash);
      latestTransaction && transactionList.push(latestTransaction);
      blockList.push(block);

      blockNumber--;
    }

    setBlockList(blockList);
    setLatestTransactionList(transactionList);

    setLoading(false);
  };

  const getBlock = async (blockNumber: number) => {
    const block = await alchemy.core.getBlock(blockNumber);
    const { reward, burntFees } = await getBlockReward(block);

    const fullBlock = { ...block, reward: reward.toFixed(5), burntFees };
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

  const getTransactionListWithDetails = async (blockNumber: number) => {
    const transactionList: ExtendedTransaction[] = [];

    for (let i = 0; i < limit; i++) {
      const block = await getBlock(blockNumber);
      const txnHashes = block.transactions;

      for (const hash of txnHashes) {
        if (transactionList.length === limit) break;
        const txn = await getTransaction(hash);
        txn && transactionList.push(txn);
      }
      if (transactionList.length === limit) break;
      blockNumber--;
    }

    return transactionList;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const latestBlock = await alchemy.core.getBlockNumber();
      if (fetchTxnsOnly) {
        const txns = await getTransactionListWithDetails(latestBlock);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        setFetchedTxns(txns);
        setLoading(false);
        return;
      }
      getBlockList(latestBlock, limit);
    };

    if (limit) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

  return (
    <AlchemyContext.Provider
      value={{
        alchemy,
        blockList,
        transactionList: latestTransactionList,
        getBlockList,
        getBlock,
        getTransaction,
        fetchedTxns,
        setLimit,
        limit,
        loading,
        setFetchTxnsOnly,
      }}
    >
      {children}
    </AlchemyContext.Provider>
  );
};

export default AlchemyContextProvider;
