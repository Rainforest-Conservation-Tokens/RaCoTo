import React from "react";
import Wrapper from "../Wrapper";
type ProblemProps = {
  title: string;
  description: string;
};
const ProblemCard = ({ title, description }: ProblemProps) => {
  return (
    <Wrapper className="font-proxima z-10 flex flex-col justify-center  items-start px-8 py-4 rounded-2xl shadow-lg hover:scale-95 transition duration-300 bg-[#d9e8e5]">
      <h2 className="text-3xl font-proxima_bold font-extrabold my-2">
        {title}
      </h2>
      <h2>{description}</h2>
    </Wrapper>
  );
};

export default ProblemCard;
