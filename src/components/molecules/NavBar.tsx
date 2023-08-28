import { logo } from "../../assets";
import CustomSelect from "../atoms/CustomSelect";
import K from "../../constants";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="flex justify-between fixed items-center bg-white top-0 left-0 w-full px-16 py-3 z-50">
      <Link to="/">
        <img src={logo} alt="logo" className="w-52" />
      </Link>

      <div className="flex gap-16 items-center">
        <Link
          to="/"
          className={`hover:text-[#9918b3] hover:scale-105 ${
            window.location.href === "/" && "text-[#9918b3]"
          }`}
        >
          Home
        </Link>
        <CustomSelect display="Blockchain" items={K.BLOCKCHAIN} />
      </div>
    </div>
  );
};

export default NavBar;
