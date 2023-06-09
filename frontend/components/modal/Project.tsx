import axios from "axios";
import { ConnectWallet } from "../Button/ConnectWallet";
import { RxCross2 } from "react-icons/rx";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/router";

type LoginModalProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProjectModal = ({ setOpen }: LoginModalProps) => {
  const { address, isConnected } = useAccount();
  const router = useRouter();

  // const checkValid = () => {
  //   axios
  //     .post("/api/check", { address })
  //     .then((res) => {
  //       console.log(res);
  //       if (res.data.status === "SUCCESS" && res.data.isValid) {
  //         router.replace("/user/abc");
  //       } else if (res.data.status === "SUCCESS" && !res.data.isValid) {
  //         toast("Not approved yet!", {
  //           icon: "⚠️",
  //         });
  //         router.replace("/waitlist");
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };
  // if (isConnected) {
  //   checkValid();
  // }
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/[.3] flex justify-center items-center">
      <section className="bg-white relative w-[20%] h-[30%] rounded-lg text-black flex flex-col justify-around p-3 items-center">
        <span className="text-center mt-3">
          <h2 className="font-recoleta_bold text-3xl">Connect Wallet</h2>
          <h3 className="font-proxima text-lg">
            Connect Wallet to get started
          </h3>
        </span>
        <ConnectWallet />
        <RxCross2
          className="absolute top-3 right-3 text-xl cursor-pointer"
          onClick={() => setOpen(false)}
        />
      </section>
    </div>
  );
};
export default ProjectModal;
