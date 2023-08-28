import { useState } from "react";
import { dropdown } from "../../assets";
import { Link } from "react-router-dom";

type CustomSelectProps = {
  items: { name: string; link: string }[];
  display: string;
};

const CustomSelect = ({ items, display }: CustomSelectProps) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div className="relative w-[160px] ">
      <div
        className={`flex gap-5 items-center cursor-pointer pl-1 hover:text-[#9918b3] hover:scale-105 `}
        onClick={toggleVisibility}
      >
        <span className={`${visible && "text-[#9918b3]"}`}>{display}</span>
        <img src={dropdown} alt="dropdown icon" className="w-[10px] h-[10px]" />
      </div>
      <div
        className={`${
          visible ? "flex" : "hidden"
        } flex flex-col bg-white shadow p-4 mt-4 rounded-b-xl absolute cursor-pointer border-t-2 border-[#9918b3]`}
      >
        {items.map((item, index) => (
          <Link to={`${item.link}`} key={index} className={`mb-4`}>
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CustomSelect;
