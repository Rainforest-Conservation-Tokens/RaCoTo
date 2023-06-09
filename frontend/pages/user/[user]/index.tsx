import UserNavbar from "@/components/Navbar/UserNavbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/router";
import Wrapper from "@/components/Wrapper";
import Image from "next/image";
import { RxCross2 } from "react-icons/rx";
import { useState } from "react";
import { useAccount } from "wagmi";
import { readContract } from "wagmi/actions";
import RacotoContract from "@/constants/abis/abi.json";
import { toast } from "react-hot-toast";

export default function User() {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const [open, setOpen] = useState(false);
  const { user } = router.query;
  if (!router.isReady) return;
  if (!isConnected || !user) {
    toast.error("Connect Wallet");
    router.push("/");
    return;
  }
  if (user != address) {
    console.log(user, address);
    toast.error("Address don't match");
    router.push("/");
    return;
  }
  const checkWhitlisted = async (address: `0x${string}`) => {
    const data = await readContract({
      address: RacotoContract.address as `0x${string}`,
      abi: RacotoContract.abi,
      functionName: "isUserWhitelisted",
      args: [address],
    });
    if (!data) {
      toast("You are not whitelisted", {
        icon: "❌",
      });
      router.push("/register");
    }
  };
  // if (address) {
  //   checkWhitlisted(user as `0x${string}`);
  // }

  return (
    <main className="realtive w-full">
      <UserNavbar />
      <Wrapper className="mt-12 min-h-[80vh]">
        <h2 className="font-recoleta text-2xl my-2">Welcome owner,</h2>

        <h3 className="text-3xl mt-9 font-proxima_semibold">Your Project</h3>
        <div
          className="font-proxima rounded-lg shadow-lg w-[20%] h-[40vh] my-5 hover:scale-105 duration-300 transition cursor-pointer"
          onClick={() => {
            setOpen(true);
          }}
        >
          <Image
            src={"/assets/waitlist-1.jpg"}
            alt={"card-img"}
            width={200}
            height={200}
            className="w-full h-[80%] rounded-t-lg object-cover"
          />
          <h2 className="font-proxima text-xl m-3">Brazil 101</h2>
        </div>
      </Wrapper>
      {open && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/[.3] flex justify-center items-center">
          <section className="bg-white relative w-[25%] h-[30%] rounded-lg text-black flex flex-col justify-around p-3 items-center">
            <span className="text-center mt-3">
              <h2 className="font-recoleta_bold text-3xl">Brazil 101</h2>
              {/* <h3 className="font-proxima text-lg">{login_modal_desc}</h3> */}
            </span>
            <RxCross2
              className="absolute top-3 right-3 text-xl cursor-pointer"
              onClick={() => setOpen(false)}
            />
          </section>
        </div>
      )}
      <Footer />
    </main>
  );
}
