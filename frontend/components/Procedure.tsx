import React from "react";
import Wrapper from "./Wrapper";
import Card from "./Cards/Card";
type ProcedureProps = {
  title: string;
  pre_title: string;
  procedure_title_1: string;
  procedure_desc_1: string;
  procedure_title_2: string;
  procedure_desc_2: string;
  procedure_title_3: string;
  procedure_desc_3: string;
  procedure_title_4: string;
  procedure_desc_4: string;
};
const Procedure = ({
  title,
  pre_title,
  procedure_title_1,
  procedure_desc_1,
  procedure_title_2,
  procedure_desc_2,
  procedure_title_3,
  procedure_desc_3,
  procedure_title_4,
  procedure_desc_4,
}: ProcedureProps) => {
  const cardData: {
    title: string;
    num: string;
    desc: string;
    img: string;
  }[] = [
    {
      num: "01",
      title: procedure_title_1,
      desc: procedure_desc_1,
      img: "/assets/Certificate.jpg",
    },
    {
      num: "02",
      title: procedure_title_2,
      desc: procedure_desc_2,
      img: "/assets/Certificate.jpg",
    },
    {
      num: "03",
      title: procedure_title_3,
      desc: procedure_desc_3,
      img: "/assets/Certificate.jpg",
    },
    {
      num: "04",
      title: procedure_title_4,
      desc: procedure_desc_4,
      img: "/assets/Certificate.jpg",
    },
  ];
  return (
    <div
      className="relative my-5 bg-[url('/assets/bg-2.png')] object-contain w-[100vw] h-[99vh]"
      id="procedure"
    >
      <div className="absolute top-0 w-[100vw] h-[99vh] bg-[#61ce701a]"></div>
      <Wrapper className="flex flex-col justify-center items-center h-full">
        <h2 className="font-proxima_bold text-xl text-[#48bb78] mt-5 md:mt-9 text-center">
          {pre_title}
        </h2>
        <h1 className="font-recoleta_semibold text-5xl my-3 text-center ">
          {" "}
          {title}
        </h1>
        <div className="grid grid-cols-4 gap-8 w-[85%] mx-auto my-16">
          {cardData.map((card, index) =>
            index % 2 == 0 ? (
              <Card
                title={card.title}
                num={card.num}
                link="/register"
                key={card.num}
                img="/assets/Certificate.jpg"
                desc={card.desc}
              />
            ) : (
              <Card
                className="mt-8"
                title={card.title}
                num={card.num}
                link="/register"
                key={card.num}
                img="/assets/Certificate.jpg"
                desc={card.desc}
              />
            )
          )}
        </div>
      </Wrapper>
    </div>
  );
};

export default Procedure;
