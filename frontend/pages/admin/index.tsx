import React, { ChangeEvent, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { ConnectWallet } from "@/components/Button/ConnectWallet";
import Wrapper from "@/components/Wrapper";
import Image from "next/image";
import EN from "@/constants/en";
import BR from "@/constants/br";
import LanguageDropdown from "@/components/lists/LanguageDropdown";
import RacotoContract from "@/constants/abis/abi.json";
import {
  prepareWriteContract,
  waitForTransaction,
  writeContract,
} from "wagmi/actions";
import { useAccount } from "wagmi";

const AdminIndex = () => {
  const { locale } = useRouter();
  const [isValid, setIsValid] = useState<boolean>(false);
  const [content, setContent] = useState<{
    wallet_address: string;
    geoJson?: string;
  }>({
    geoJson: "",
    wallet_address: "",
  });
  const [showAccept, setShowAccept] = useState<boolean>(true);
  const { isConnected } = useAccount();
  const [data, setData] = useState<{
    walletAddress: string;
    password: string;
  }>({
    walletAddress: "",
    password: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (data.walletAddress === "" || data.password === "") {
      toast.error("Please fill all the fields");
      return;
    }
    axios
      .post("/api/admin", {
        address: data.walletAddress,
        password: data.password,
      })
      .then((res) => {
        console.log(res);
        if (res.data.status === "SUCCESS" && res.data.isValid) {
          toast.success("Welcome Admin!");
          setIsValid(true);
        } else if (res.data.status === "SUCCESS" && !res.data.isValid) {
          toast("Incorrect credentials", {
            icon: "⚠️",
          });
          setIsValid(false);
        } else {
          toast.error("Admin only");
          setIsValid(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getTranslation = (locale: string) => {
    switch (locale) {
      case "br":
        return BR;
      default:
        return EN;
    }
  };
  const t = getTranslation(locale as string);

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setContent({
      ...content,
      [name]: value,
    });
  };

  const handleAccept = async (e: any) => {
    e.preventDefault();
    if (!isConnected) {
      toast.error("Please connect your wallet");
      return;
    }
    if (content.wallet_address === "") {
      toast.error("Please fill all the fields");
      return;
    }
    toast.loading("Calling contract", {
      id: "connecting",
    });
    try {
      const { request } = await prepareWriteContract({
        address: RacotoContract.address as `0x${string}`,
        abi: RacotoContract.abi,
        functionName: "whitelistRainforestOwner",
        args: [content.wallet_address, content.geoJson],
      });

      const { hash } = await writeContract(request);
      await waitForTransaction({ hash });
      toast.dismiss("connecting");
      toast.success("Successfully approved");
      setContent({
        geoJson: "",
        wallet_address: "",
      });
    } catch (err) {
      toast.dismiss("connecting");
      console.error(err);
      toast.error("Error connecting with contract");
    }
  };
  const handleReject = async (e: any) => {
    e.preventDefault();
    if (!isConnected) {
      toast.error("Please connect your wallet");
      return;
    }
    if (content.wallet_address === "" || content.geoJson === "") {
      toast.error("Please fill all the fields");
      return;
    }
    toast.loading("Calling contract", {
      id: "connecting",
    });
    try {
      const { request } = await prepareWriteContract({
        address: RacotoContract.address as `0x${string}`,
        abi: RacotoContract.abi,
        functionName: "rejectRainforestOwner",
        args: [content.wallet_address],
      });
      const { hash } = await writeContract(request);
      await waitForTransaction({ hash });
      toast.dismiss("connecting");
      toast.success("Successfully rejected");
    } catch (err) {
      toast.dismiss("connecting");
      console.error(err);
      toast.error("Error connecting with contract");
    }
  };

  return (
    <div>
      {isValid ? (
        <main className="realtive w-full h-screen text-white bg-[#0c0f1a] font-proxima">
          <nav
            className={`w-full h-[50px] md:h-[80px] z-20 sticky transition-transform duration-700 flex justify-between items-center  text-white border-b-[1px] border-white/[0.3] top-0 bg-[#0c0f1a] shadow-md transalate-y-0`}
          >
            <Wrapper className="h-[60px] flex justify-between items-center text-xl py-3 ">
              <Image
                src="/assets/logo.png"
                alt="logo"
                width="200"
                height={200}
                className="w-14 h-14"
              />

              <div className="flex justify-between basis-1/5">
                <button
                  className="hover:text-[#18c99d]"
                  onClick={() => {
                    setShowAccept(true);
                  }}
                >
                  {t.admin_nav_accept}
                </button>
                <button
                  className="hover:text-[#18c99d]"
                  onClick={() => {
                    setShowAccept(false);
                  }}
                >
                  {t.admin_nav_reject}
                </button>
              </div>
              <section className="flex">
                <LanguageDropdown className="text-white" />
                <ConnectWallet
                  connect_wallet_btn={t.connect_wallet_btn}
                  wrong_network_btn={t.wrong_network_btn}
                />
              </section>
            </Wrapper>
          </nav>
          <Wrapper className="mt-12 w-full flex flex-col items-center justify-center h-[70vh]">
            {showAccept ? (
              <section className="font-proxima w-[50%] text-center text-white flex flex-col">
                <h2 className="font-recoleta text-3xl mb-5">
                  {t.admin_accept_app_title}
                </h2>
                <input
                  placeholder={t.admin_wallet_placeholder}
                  className="border-b-2 border-white/[0.3] p-1 w-1/2 my-5 outline-none bg-transparent mx-auto "
                  id="wallet_address"
                  name="wallet_address"
                  type="text"
                  onChange={handleOnChange}
                />
                <input
                  placeholder={t.admin_boundary_placeholder}
                  className="border-b-2 border-white/[0.3] p-1 w-1/2 h-50px my-5 outline-none bg-transparent mx-auto "
                  id="geoJson"
                  name="geoJson"
                  type="text"
                  onChange={handleOnChange}
                />
                <button
                  className=" outline-none bg-[#18c99d] p-2 rounded-lg w-1/2 my-7 mx-auto hover:scale-95 cursor-pointer duration-300"
                  onClick={handleAccept}
                >
                  {t.admin_submit}
                </button>
              </section>
            ) : (
              <section className="font-proxima w-[50%] text-center text-white flex flex-col">
                <h2 className="font-recoleta text-3xl mb-5">
                  {t.admin_reject_app_title}
                </h2>
                <input
                  placeholder={t.admin_wallet_placeholder}
                  className="border-b-2 border-white/[0.3] p-1 w-1/2 my-5 outline-none bg-transparent mx-auto "
                  id="wallet_address"
                  name="wallet_address"
                  type="text"
                  onChange={handleOnChange}
                />

                <button
                  className=" outline-none bg-[#18c99d] p-2 rounded-lg w-1/2 my-7 mx-auto hover:scale-95 cursor-pointer duration-300"
                  onClick={handleReject}
                >
                  {t.admin_submit}
                </button>
              </section>
            )}
          </Wrapper>
          {/* {open && ()} */}
        </main>
      ) : (
        <div className="flex justify-center items-center h-screen w-screen bg-[#0c0f1a]">
          <section className="font-proxima w-[50%] text-center text-white flex flex-col">
            <h2 className="font-proxima_semibold text-3xl mb-5">
              {t.admin_login_title}
            </h2>
            <input
              placeholder={t.admin_wallet_placeholder}
              className="border-b-2 border-white/[0.3] p-1 w-1/2 my-5 outline-none bg-transparent mx-auto "
              id="walletAddress"
              type="text"
              onChange={handleChange}
            />
            <input
              placeholder={t.admin_password_placeholder}
              className="outline-none border-b-2 p-1 border-white/[0.3] mx-auto bg-transparent w-1/2"
              id="password"
              type="password"
              onChange={handleChange}
            />
            <button
              className=" outline-none bg-[#18c99d] p-2 rounded-lg w-1/2 my-7 mx-auto hover:scale-95 cursor-pointer duration-300"
              onClick={handleSubmit}
            >
              {t.admin_submit}
            </button>
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminIndex;
