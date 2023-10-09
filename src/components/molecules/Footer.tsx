import { logoicon } from "../../assets";
import K from "../../constants";

const Footer = () => {
  return (
    <div className="hero w-full  md:px-16 py-16 flex flex-col justify-center md:flex-row md:justify-between items-center ">
      <div className="flex items-center shadow">
        <img src={logoicon} alt="logo icon" className="w-16 h-16" />
        <span className="text-xl text-white font-semibold">
          {" "}
          Powered by DappScan
        </span>
      </div>
      <div className="flex gap-8">
        {K.SOCIAL.map((social) => (
          <a href={social.url} className=" drop-shadow-2xl">
            <img
              src={social.icon}
              alt="social media icon"
              className="w-6 h-6 hover:scale-105 "
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default Footer;
