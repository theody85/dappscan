import { useContext } from "react";
import BlockList from "../organisms/BlockList";
import TransactionList from "../organisms/TransactionList";
import { AlchemyContext } from "../../context";
import { Loader } from "../atoms";

const Dashboard = () => {
  const { loading } = useContext(AlchemyContext);
  return (
    <>
      {loading ? (
        <div className="flex flex-col justify-center items-center h-64">
          <Loader size="large" />
          <p className="text-center">Loading data...</p>
        </div>
      ) : (
        <div className="mx-16 text-sm grid lg:grid-cols-2 gap-10 pb-20 -mt-20">
          <BlockList />
          <TransactionList />
        </div>
      )}
    </>
  );
};

export default Dashboard;
