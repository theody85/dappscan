import Select from "../atoms/Select";
import K from "../../constants";
import { search } from "../../assets";

const SearchBar = () => {
  return (
    <div className="w-4/5 lg:w-1/2 bg-white px-2 py-2  rounded-xl gap-2 flex flex-row items-center text-sm relative">
      <Select options={K.FILTERS} />
      <div className="flex gap-2 w-full relative">
        <input
          placeholder="Search by Address / Txn Hash / Block / Token / Domain Name"
          type="text"
          className="border-none w-11/12 py-2 px-1 active:border-none"
        />
        <div className="bg-[#9918b3] px-3 rounded-xl flex items-center drop-shadow-2xl ">
          <img src={search} alt="search icon" className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
