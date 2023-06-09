import React from "react";
import Wrapper from "../Wrapper";
import Link from "next/link";

const Card = ({
  img,
  num,
  title,
  desc,
  link,
  className,
}: {
  img: string;
  num: string;
  title: string;
  desc: string;
  link: string;
  className?: string;
}) => {
  return (
    <div className={`font-proxima z-10 ${className}`}>
      <Wrapper className="flex flex-col justify-center items-start px-8 py-4 bg-white rounded-2xl shadow-lg hover:scale-105 transition duration-300">
        <h2 className="text-3xl font-recoleta_bold text-[#00d084] mt-2">
          {num}
        </h2>
        <h2 className="text-3xl font-proxima_bold font-extrabold my-2">
          {title}
        </h2>
        <h2>{desc}</h2>

        {link && (
          <Link href={link} className="text-[#00d084] underline my-5">
            Start Exploring →
          </Link>
        )}
        {/* {img && (
          <Image
            src={img}
            alt={title}
            width={200}
            height={200}
            className="w-16 aspect-auto absolute -top-12 left-3 "
          />
        )} */}
      </Wrapper>
    </div>
  );
};

export default Card;
