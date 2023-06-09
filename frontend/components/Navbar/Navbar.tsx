import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Wrapper from "../Wrapper";
import LoginModal from "../modal/Login";
import EN from "@/constants/en";
import BR from "@/constants/br";
import LanguageDropdown from "../lists/LanguageDropdown";
import { useRouter } from "next/router";
type NavbarProps = {
  className?: string;
};
const Navbar = ({ className }: NavbarProps) => {
  const [show, setScroll] = useState("");
  const [link, setLink] = useState("text-white");
  const [open, setOpen] = useState(false);
  const { locale } = useRouter();
  const [lastScrollY, setLastScrollY] = useState(0);
  const handleScroll = () => {
    if (window.scrollY > 150) {
      // lastScrollY > window.scrollY
      //   ? setScroll("bg-white text-black shadow-md transalate-y-0 top-0")
      //   : setScroll(" -translate-y-10 duration-700");
      setScroll("top-0 bg-white text-black shadow-md transalate-y-0 ");
      setLink("text-black");
    } else {
      setScroll("bg-transparent transalate-y-0 text-white");
      setLink("text-white");
    }
    setLastScrollY(window.scrollY);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

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
      className={`w-screen h-[50px] md:h-[80px] z-20 sticky transition-transform duration-700 flex justify-between items-center ${link}  ${show} ${className}`}
    >
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
        <div className="flex justify-between basis-[55%] font-proxima text-xl ">
          <Link
            href="#home"
            scroll={true}
            className="hover:scale-105 transition duration-300"
          >
            {t.nav_home}
          </Link>
          <Link
            href="#synopsis"
            scroll
            className="hover:scale-105 transition duration-300"
          >
            {t.nav_synopsis}
          </Link>
          <Link
            href="#procedure"
            scroll
            className="hover:scale-105 transition duration-300"
          >
            {t.nav_procedure}
          </Link>
          <Link
            href="#projects"
            scroll
            className="hover:scale-105 transition duration-300"
          >
            {t.nav_users}
          </Link>
          <Link
            href="#faqs"
            scroll
            className="hover:scale-105 transition duration-300"
          >
            {t.nav_faq}
          </Link>
        </div>
        <section className="flex">
          <LanguageDropdown className={link} />
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="border-[#00a694] hover:scale-95 mr-2 transition duration-300 border-2 px-3 py-1 rounded-lg "
          >
            {t.navbar_login}
          </button>
          <Link
            href="/register"
            className="bg-gradient-to-r from-[#4dbc5d] to-[#00a694] hover:scale-95 transition duration-300 px-3 py-2 rounded-lg text-white"
          >
            {t.navbar_register}
          </Link>
        </section>
      </Wrapper>
      {open && (
        <LoginModal
          setOpen={setOpen}
          login_modal_desc={t.login_modal_desc}
          login_modal_title={t.login_modal_title}
          connect_wallet_btn={t.connect_wallet_btn}
          wrong_network_btn={t.wrong_network_btn}
        />
      )}
    </nav>
  );
};

export default Navbar;
