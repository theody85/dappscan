// import { Block } from "alchemy-sdk";
// import { useState, useContext, useEffect } from "react";
// import { AlchemyContext } from "../context";

// const BLOCKS_PER_PAGE = 8;

export const useFetchBlockData = () => {
  // const [blockList, setBlockList] = useState<Block[]>([]);
  // const [limit, setLimit] = useState<number>(BLOCKS_PER_PAGE);
  // const [loading, setLoading] = useState<boolean>(false);
  // const alchemy = useContext(AlchemyContext);
  // const getBlockList = async (blockNumber: number, limit: number) => {
  //   const blockList: Block[] = [];
  //   for (let i = 0; i < limit; i++) {
  //     const block = await alchemy.core.getBlock(blockNumber);
  //     blockList.push(block);
  //     blockNumber--;
  //   }
  //   setBlockList(blockList);
  //   setLoading(false);
  // };
  // const getBlock = async (blockNumber: number) => {
  //   const block = await alchemy.core.getBlock(blockNumber);
  //   return block;
  // };
  // useEffect(() => {
  //   (async () => {
  //     setLoading(true);
  //     const latestBlock = await alchemy.core.getBlockNumber();
  //     getBlockList(latestBlock, limit);
  //   })();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [limit]);
  // return {
  //   blockList,
  //   getBlockList,
  //   getBlock,
  //   setLimit,
  //   loading,
  // };
};
