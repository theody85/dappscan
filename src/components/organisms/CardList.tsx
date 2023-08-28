import { rightarrow } from "../../assets";
import { Link } from "react-router-dom";

const CardList = ({ title, children }) => {
  return (
    <div className="shadow-xl rounded-xl bg-white">
      <div className="border-thin p-5">
        <h3 className="text-xl font-bold">Latest {title}</h3>
      </div>
      {children}
      <Link
        to={`/${title.toLowerCase()}`}
        className="bg-gray-100 p-5 flex justify-center gap-3 items-center text-gray-500 hover:bg-[#9918b3] hover:text-white"
      >
        <h3 className="uppercase text-sm ">View all {title}</h3>
        <img src={rightarrow} alt="right-arrow" className="w-4 h-4" />
      </Link>
    </div>
  );
};

export default CardList;
