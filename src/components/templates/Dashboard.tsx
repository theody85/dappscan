import BlockList from "../organisms/BlockList";
import TransactionList from "../organisms/TransactionList";

const Dashboard = () => {
  return (
    <div className="mx-16 text-sm grid lg:grid-cols-2 gap-10 pb-20 -mt-20">
      <BlockList />
      <TransactionList />
    </div>
  );
};

export default Dashboard;
