import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

type CardListProps = {
  title: string;
  children?: React.ReactNode;
};
const CardList = ({ title, children }: CardListProps) => {
  return (
    <div className="shadow-xl rounded-xl bg-white">
      <div className="border-thin p-5">
        <h3 className="text-xl font-bold">Latest {title}</h3>
      </div>
      {children}
      <Link
        to={`/${title.toLowerCase()}`}
        className="bg-gray-100 p-5 flex justify-center gap-3 items-center text-gray-500 hover:bg-[#e3bfeb] hover:text-black"
      >
        <h3 className="uppercase text-sm ">View all {title}</h3>
        <ArrowRight className="" size={15} />
      </Link>
    </div>
  );
};

export default CardList;
