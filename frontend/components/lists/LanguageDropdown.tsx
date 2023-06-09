import React, { useState } from "react";
import { LuLanguages } from "react-icons/lu";
import { AiOutlineCaretDown } from "react-icons/ai";
import { useRouter } from "next/router";

type LanguageDropdownProps = {
  className?: string;
};
const LanguageDropdown = ({ className }: LanguageDropdownProps) => {
  const { locale, locales } = useRouter();
  const router = useRouter();
  const [showLang, setShowLang] = useState(false);
  return (
    <div
      className="relative my-auto mx-2"
      onMouseEnter={() => {
        setShowLang(true);
      }}
      onMouseLeave={() => {
        setShowLang(false);
      }}
    >
      <button
        className={`flex  hover:text-green-400 focus:text-green-400 ${className}`}
        onClick={() => {
          showLang ? setShowLang(false) : setShowLang(true);
        }}
      >
        <LuLanguages className="my-auto mr-2" size={"1.5rem"} />
        {locale?.toLocaleUpperCase()}
        <AiOutlineCaretDown className="my-auto ml-1" size={"1rem"} />
      </button>
      {showLang && (
        <div className="absolute flex flex-col bg-black/[0.8] rounded-lg py-2 px-4 translate-x-[30%]">
          {locales?.map((locale) => (
            <button
              key={locale}
              className="text-white hover:text-green-400"
              onClick={() => {
                router.push(router.pathname, router.pathname, {
                  locale,
                });
              }}
            >
              {locale?.toLocaleUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;
