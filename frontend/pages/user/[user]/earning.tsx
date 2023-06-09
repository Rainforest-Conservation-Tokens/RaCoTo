import UserNavbar from "@/components/Navbar/UserNavbar";
import Footer from "@/components/Footer";
import Wrapper from "@/components/Wrapper";
import { useRouter } from "next/router";
import EN from "@/constants/en";
import BR from "@/constants/br";
import RaCoToMain from "@/constants/abis/RaCoToMain.json";
import {
  prepareWriteContract,
  readContract,
  waitForTransaction,
  writeContract,
} from "wagmi/actions";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";
import { useState } from "react";

export default function Earnings() {
  const { address } = useAccount();
  const { locale } = useRouter();
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const getTranslation = (locale: string) => {
    switch (locale) {
      case "br":
        return BR;
      default:
        return EN;
    }
  };
  const t = getTranslation(locale as string);
  if (!address) {
    toast.error("Connect Wallet");
    router.push("/");
    return;
  }

  const getBal = async () => {
    const data = await readContract({
      address: RaCoToMain.address as `0x${string}`,
      abi: RaCoToMain.abi,
      functionName: "tokensNeededToClaimByUser",
      args: [address],
    });
    console.log(data);
    setBalance(Number(data as bigint) / 10 ** 18);
  };
  const handleWithdraw = async () => {
    if (!address) {
      toast.error("Connect Wallet");
      return;
    }
    const { request } = await prepareWriteContract({
      address: RaCoToMain.address as `0x${string}`,
      abi: RaCoToMain.abi,
      functionName: "claimToken",
      args: [],
    });
    const { hash } = await writeContract(request);
    await waitForTransaction({ hash });
    toast.success("Withdrawn");
    router.push(`/user/${address}`);
  };
  getBal();
  return (
    <main className="realtive w-full">
      <UserNavbar />
      <Wrapper className="mt-12 flex flex-col items-center justify-center w-full h-[60vh]">
        <div className="bg-[#61ce701a] w-[55%] text-center flex flex-col py-10 rounded-xl justify-center items-center">
          <h2 className="font-recoleta text-4xl my-2 lg:text-5xl ">
            {t.user_earnings}
          </h2>
          <h2 className="font-proxima text-xl my-4 lg:text-2xl">
            {" "}
            {balance} RCT
          </h2>
          <button
            className="bg-black text-white px-4 py-2 my-3 transition duration-300 hover:scale-95 rounded-md text-lg lg:text-xl"
            onClick={handleWithdraw}
          >
            {t.user_withdraw}
          </button>
        </div>
      </Wrapper>
      <Footer />
    </main>
  );
}
