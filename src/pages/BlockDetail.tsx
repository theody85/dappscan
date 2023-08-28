import { useEffect, useState } from "react";
import { useFetchBlockData } from "../hooks";
import { useParams } from "react-router-dom";
import { Block } from "alchemy-sdk";

const BlockDetail = () => {
  const params = useParams<{ blockNumber: string }>();
  const { getBlock } = useFetchBlockData();

  const [block, setBlock] = useState<Block | null>(null);

  useEffect(() => {
    (async () => {
      const block = await getBlock(Number(params.blockNumber));
      setBlock(block);
    })();
  }, []);

  console.log(block, params);
  return <div>{JSON.stringify(block)}</div>;
};

export default BlockDetail;
