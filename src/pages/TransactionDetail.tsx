import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AlchemyContext } from "../context";
import { ExtendedTransaction } from "../context/AlchemyContext";
import {
  AlertCircle,
  CheckCircle2,
  Clock4,
  Files,
  HelpCircle,
} from "lucide-react";
import moment from "moment";
import { ethers } from "ethers";
import { Loader } from "../components/atoms";

const TransactionDetail = () => {
  const params = useParams<{ txnHash: string }>();
  const { getTransaction } = useContext(AlchemyContext);
  const [txn, setTxn] = useState<ExtendedTransaction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      if (params.txnHash === undefined) return;
      setLoading(true);
      const txn = await getTransaction(params.txnHash);
      setTxn(txn);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(txn, params);
  return (
    <div className="my-24 px-8 lg:px-16 flex flex-col w-full">
      <div className="text-3xl mb-6">Transaction Details</div>
      <>
        {loading ? (
          <div className="flex flex-col justify-center items-center h-[50vh]">
            <Loader size="large" />
            <p className="text-center">Loading data...</p>
          </div>
        ) : (
          <div className="shadow-xl flex flex-col px-8 lg:px-16  text-sm rounded-lg border w-full">
            <div className="flex flex-col border-b py-6">
              <div className="flex flex-col  lg:flex-row py-5  gap-y-4 lg:gap-40 ">
                <span className="w-full  lg:w-1/3 flex gap-4 items-center font-bold">
                  <span title="A TxHash or transaction hash is a unique 66-character identifier that is generated whenever a transaction is executed.">
                    <HelpCircle size={15} />
                  </span>
                  Transaction Hash:
                </span>
                <span className="w-full xl:w-2/3 lg:w-[404px] font-medium flex items-center">
                  <p className="overflow-clip text-ellipsis w-4/5 xl:w-fit ">
                    {txn?.transactionHash}
                  </p>
                  <Files
                    className="ml-2 cursor-pointer hover:text-[#9918b3]  active:text-[#9918b3]/60"
                    size={15}
                    onClick={() =>
                      txn && navigator.clipboard.writeText(txn.transactionHash)
                    }
                  />
                </span>
              </div>
              <div className="flex py-5 flex-col md:flex-row gap-y-4 lg:gap-40 border-bottom-2">
                <span className="w-full md:w-1/3 flex gap-4 items-center font-bold">
                  <span title="The status of the transaction.">
                    <HelpCircle size={15} />
                  </span>
                  Status:{" "}
                </span>
                <span className="w-full md:w-2/3 font-bold text-[12px] ">
                  {txn?.status == 1 ? (
                    <span className="py-1 px-2 border rounded-md border-green-500 text-green-700 bg-[#e9ecef] flex items-center justify-center w-fit">
                      <CheckCircle2 className="mr-1  " size={12} />
                      Success
                    </span>
                  ) : (
                    <span className="py-1 px-2 border rounded-md border-red-500 text-red-700 bg-[#e9ecef] flex items-center justify-center w-fit">
                      <AlertCircle className="mr-1  " size={12} />
                      Failed
                    </span>
                  )}
                </span>
              </div>
              <div className="flex py-5 flex-col md:flex-row gap-y-4 lg:gap-40 border-bottom-2">
                <span className=" w-full md:w-1/3 flex gap-4 items-center font-bold">
                  <span title="Number of the block in which the transaction is recorded. Block confirmations indicate how many blocks have been added since the transaction was produced.">
                    <HelpCircle className=" " size={15} />
                  </span>
                  Block:{" "}
                </span>
                <span className="w-full md:w-2/3 font-medium ">
                  {txn?.blockNumber}
                </span>
              </div>
              <div className="flex py-5 flex-col md:flex-row gap-y-4 lg:gap-40 border-bottom-2">
                <span className=" w-full md:w-1/3 flex gap-4 items-center font-bold">
                  <span title="The date and time at which a transaction is produced. ">
                    <HelpCircle className=" " size={15} />
                  </span>
                  Timestamp:{" "}
                </span>
                <span className="w-full md:w-2/3 font-medium flex items-start lg:items-center flex-col lg:flex-row">
                  <div className="flex items-center gap-x-1">
                    <Clock4 className="mr-2" size={15} />
                    {txn ? moment.unix(txn.timestamp).fromNow() : 0}
                  </div>

                  <span className="text-[#9918b3] ml-1">
                    ({txn ? moment.unix(txn.timestamp).toLocaleString() : 0})
                  </span>
                </span>
              </div>
            </div>
            <div className="flex flex-col border-b py-6">
              <div className="flex py-5 flex-col md:flex-row gap-y-4 lg:gap-40 border-bottom-2">
                <span className=" w-full md:w-1/3 flex gap-4 items-center font-bold">
                  <span title="The sending party of the transaction.">
                    <HelpCircle className=" " size={15} />
                  </span>
                  From:{" "}
                </span>
                <span className=" w-full md:w-2/3 font-medium flex items-center">
                  <span className="text-[#9918b3] w-4/5 lg:w-fit text-ellipsis overflow-hidden">
                    {txn?.from}
                  </span>

                  <Files
                    className="ml-2 cursor-pointer hover:text-[#9918b3] active:text-[#9918b3]/60"
                    size={15}
                    onClick={() =>
                      txn && navigator.clipboard.writeText(txn?.from)
                    }
                  />
                </span>
              </div>
              <div className="flex py-5 flex-col md:flex-row gap-y-4 lg:gap-40 border-bottom-2">
                <span className=" w-full md:w-1/3 flex gap-4 items-center font-bold">
                  <span title="The receiving party of the transaction (could be a contract address).">
                    <HelpCircle className=" " size={15} />
                  </span>
                  To:{" "}
                </span>
                <span className="w-full  md:w-2/3 font-medium flex flex-col xl:flex-row xl:items-center">
                  <span className="text-[#9918b3] text-ellipsis overflow-hidden">
                    {txn?.to}
                  </span>
                  <span className="flex items-center">
                    <span>
                      (Fee Recipient: {txn?.feeRecipient.slice(0, 10)}...)
                    </span>
                    <Files
                      className="ml-2 cursor-pointer hover:text-[#9918b3] active:text-[#9918b3]/60"
                      size={15}
                      onClick={() =>
                        txn && navigator.clipboard.writeText(txn?.to)
                      }
                    />
                  </span>
                </span>
              </div>
            </div>
            <div className="flex flex-col  py-6">
              <div className="flex py-5 flex-col md:flex-row gap-y-4 lg:gap-40 border-bottom-2">
                <span className=" w-full md:w-1/3 flex gap-4 items-center font-bold">
                  <span title="The value being transacted in Ether and fiat value. Note: You can click the fiat value (if available) to see historical value at the time of transaction. ">
                    <HelpCircle className=" " size={15} />
                  </span>
                  Value:{" "}
                </span>
                <span className="w-full md:w-2/3 font-medium ">
                  {txn?.value ? ethers.formatEther(txn?.value) : 0} ETH
                </span>
              </div>
              <div className="flex py-5 flex-col md:flex-row gap-y-4 lg:gap-40 border-bottom-2">
                <span className=" w-full md:w-1/3 flex gap-4 items-center font-bold">
                  <span title="Amount paid to process the transaction in Ether and fiat value.">
                    <HelpCircle className=" " size={15} />
                  </span>
                  Transaction Fee:{" "}
                </span>
                <span className="w-full md:w-2/3 font-medium ">
                  {txn
                    ? ethers.formatEther(
                        BigInt(
                          Number(txn?.gasUsed) * Number(txn?.effectiveGasPrice),
                        ),
                      )
                    : null}{" "}
                  ETH
                </span>
              </div>
              <div className="flex py-5 flex-col md:flex-row gap-y-4 lg:gap-40 border-bottom-2">
                <span className=" w-full md:w-1/3 flex gap-4 items-center font-bold">
                  <span title="Cost per unit of gas spent for the transaction, in Ether and Gwei. ">
                    <HelpCircle className=" " size={15} />
                  </span>
                  Gas Price:{" "}
                </span>
                <span className="w-full md:w-2/3 font-medium ">
                  {txn?.effectiveGasPrice &&
                    ethers.formatUnits(
                      BigInt(Number(txn?.effectiveGasPrice)),
                      "gwei",
                    )}{" "}
                  Gwei{" "}
                  <span className="text-[#9918b3]">
                    (
                    {txn?.effectiveGasPrice &&
                      ethers.formatEther(
                        BigInt(Number(txn?.effectiveGasPrice)),
                      )}{" "}
                    ETH)
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default TransactionDetail;
