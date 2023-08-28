import { Alchemy, Network } from "alchemy-sdk";
import { createContext } from "react";

type AlchemyContextProviderProps = {
  children: React.ReactNode;
};

export const AlchemyContext = createContext({} as Alchemy);

const AlchemyContextProvider = ({ children }: AlchemyContextProviderProps) => {
  const settings = {
    apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
  };

  const alchemy = new Alchemy(settings);

  return (
    <AlchemyContext.Provider value={alchemy}>
      {children}
    </AlchemyContext.Provider>
  );
};

export default AlchemyContextProvider;
