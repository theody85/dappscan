import SearchBar from "../molecules/SearchBar";

const Hero = () => {
  return (
    <div className="hero w-full px-4 text-center lg:px-16 pt-32  pb-20 lg:pb-40 flex flex-col items-center">
      <h2 className="text-3xl text-white mb-5">
        The Ethereum Blockchain Explorer
      </h2>
      <SearchBar />
    </div>
  );
};

export default Hero;
