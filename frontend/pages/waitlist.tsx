import Image from "next/image";
import Link from "next/link";
import Wrapper from "@/components/Wrapper";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";
import { ConnectWallet } from "@/components/Button/ConnectWallet";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import EN from "@/constants/en";
import BR from "@/constants/br";
import LanguageDropdown from "@/components/lists/LanguageDropdown";

const Register = () => {
  const { address } = useAccount();
  const [addressValue, setAddressValue] = useState<`0x${string}` | string>(
    address ? address : ""
  );
  const { locale } = useRouter();

  const getTranslation = (locale: string) => {
    switch (locale) {
      case "br":
        return BR;
      default:
        return EN;
    }
  };
  const t = getTranslation(locale as string);

  const handleClick = () => {
    if (
      !addressValue ||
      addressValue.length !== 42 ||
      !addressValue.startsWith("0x")
    ) {
      toast.error(t.toast_invalid_address);
    } else {
      axios
        .post("/api/add", { address: addressValue })
        .then(() => {
          toast.success(t.toast_added_to_whitelist);
        })
        .catch((err) => {
          toast.error(err.response.data.reason);
        });
      setAddressValue("");
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      {" "}
      <section className=" h-full w-full absolute top-0 bg-black/[0.6] z-10" />
      <nav className="w-full h-[50px] fixed top-2 z-20 md:h-[80px] flex justify-between items-center">
        <Wrapper className="h-[60px] flex justify-between items-center text-xl py-3 ">
          <Link href={"/"}>
            <Image
              src="/assets/logo.png"
              alt="logo"
              width="200"
              height={200}
              className="w-14 h-14"
            />
          </Link>
          <section className="flex">
            <LanguageDropdown />
            <ConnectWallet />
          </section>
        </Wrapper>
      </nav>
      <Image
        src="/assets/waitlist-1.jpg"
        alt="hero"
        width="1920"
        height="1080"
        className="w-full h-full absolute top-0"
      />
      <section className="z-20 text-center text-white">
        <h1 className="text-8xl text-white font-recoleta_bold">
          {t.waitlist_title}
        </h1>
        <h2 className="text-2xl text-white font-proxima my-3">
          {t.waitlist_desc}
        </h2>
        <div className="w-[55%]   mx-auto h-12 bg-white  my-5 md:my-7 text-black flex rounded-lg font-proxima text-lg hover:scale-[1.02] duration-300 transition ">
          <input
            placeholder={t.waitlist_form_placeholder}
            type="text"
            value={addressValue}
            onChange={(e) => setAddressValue(e.target.value)}
            className="bg-white font-proxima outline-none px-3 py-2 basis-3/4 rounded-l-lg"
          />
          <button
            className="bg-gradient-to-r from-[#4dbc5d] to-[#00a694] hover:scale-[1.01] duration-300 transition  px-3 py-2  text-white basis-1/4 rounded-r-lg"
            type="button"
            onClick={handleClick}
          >
            {t.submit}
          </button>
        </div>
      </section>
    </div>
  );
};

export default Register;
