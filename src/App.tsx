import { Route, Routes } from "react-router-dom";
import "./App.css";
import { AlchemyContextProvider } from "./context";
import {
  BlockDetail,
  Blocks,
  Home,
  TransactionDetail,
  Transactions,
} from "./pages";
import { RootLayout } from "./components/layouts";

function App() {
  return (
    <AlchemyContextProvider>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/blocks" element={<Blocks />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/blocks/:blockNumber" element={<BlockDetail />} />
          <Route path="/txns/:txnHash" element={<TransactionDetail />} />
          <Route path="*">"404 Not Found"</Route>"
        </Route>
      </Routes>
    </AlchemyContextProvider>
  );
}

export default App;
