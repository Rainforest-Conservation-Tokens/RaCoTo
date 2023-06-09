import Image from "next/image";
import Link from "next/link";
import Wrapper from "../Wrapper";
import { ConnectWallet } from "../Button/ConnectWallet";
import { useRouter } from "next/router";
import EN from "@/constants/en";
import BR from "@/constants/br";
import LanguageDropdown from "../lists/LanguageDropdown";

const UserNavbar = () => {
  const router = useRouter();
  const { locale } = useRouter();
  const { user } = router.query;
  const getTranslation = (locale: string) => {
    switch (locale) {
      case "br":
        return BR;
      default:
        return EN;
    }
  };
  const t = getTranslation(locale as string);

  return (
    <nav
      className={`w-full h-[50px] md:h-[80px] z-20 sticky transition-transform duration-700 flex justify-between items-center  text-black top-0 bg-white shadow-md transalate-y-0`}
    >
      <Wrapper className="h-[60px] flex justify-between items-center text-xl py-3 ">
        <Link href={`/user/${user}`}>
          <Image
            src="/assets/logo.png"
            alt="logo"
            width="200"
            height={200}
            className="w-14 h-14"
          />
        </Link>
        <div className="flex justify-between basis-1/3">
          <Link href={`/user/${user}/`}>{t.user_nav_project}</Link>
          <Link href={`/user/${user}/earning`}>{t.user_nav_earnings}</Link>
          <h2>{t.user_nav_support}</h2>
        </div>
        <div className="flex">
          <LanguageDropdown className={"text-black"} />
          <ConnectWallet
            connect_wallet_btn={t.connect_wallet_btn}
            wrong_network_btn={t.wrong_network_btn}
          />
        </div>
      </Wrapper>
    </nav>
  );
};

export default UserNavbar;
