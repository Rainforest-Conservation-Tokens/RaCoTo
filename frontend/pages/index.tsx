import Navbar from "@/components/Navbar/Navbar";
import Procedure from "@/components/Procedure";
import Slider from "@/components/Slider";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import { useRouter } from "next/router";
import EN from "@/constants/en";
import BR from "@/constants/br";
import { brands } from "@/constants/constants";
import Wrapper from "@/components/Wrapper";
import ProblemCard from "@/components/Cards/ProblemCard";
import Accordian from "@/components/lists/Accordian";
import { useState } from "react";

export default function Home() {
  const { locale } = useRouter();
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
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
  const data: { title: string; body: string; id: string }[] = [
    {
      title: t.accordian_title_1,
      body: t.accordian_desc_1,
      id: "faq1",
    },
    {
      title: t.accordian_title_2,
      body: t.accordian_desc_2,
      id: "faq2",
    },
    {
      title: t.accordian_title_3,
      body: t.accordian_desc_3,
      id: "faq3",
    },
    {
      title: t.accordian_title_4,
      body: t.accordian_desc_4,
      id: "faq4",
    },
    {
      title: t.accordian_title_5,
      body: t.accordian_desc_5,
      id: "faq5",
    },
    {
      title: t.accordian_title_6,
      body: t.accordian_desc_6,
      id: "faq6",
    },
    {
      title: t.accordian_title_7,
      body: t.accordian_desc_7,
      id: "faq7",
    },
    {
      title: t.accordian_title_8,
      body: t.accordian_desc_8,
      id: "faq8",
    },
  ];
  return (
    <main className="realtive w-full">
      <Navbar className="absolute top-0" />
      <div
        className="w-screen h-[99vh] flex flex-col justify-center items-center"
        id="home"
      >
        <section className=" h-full w-screen absolute top-0 bg-black/[0.6] -z-10" />
        <video
          src={
            "https://bafybeicww3juliwxgqcs5xfkbfdztewbj6jbdkpdixi6pvl4ej7qtlq4oi.ipfs.w3s.link/pexels-mikhail-nilov-8334944-2732x1440-24fps.mp4"
          }
          autoPlay
          loop
          muted
          className="w-screen h-full object-cover -z-20 absolute top-0"
        />
        <h2
          className="text-5xl md:text-7xl text-white font-recoleta_bold z-10
      
          text-center"
        >
          {t.hero_title}
        </h2>
        <section className="text-xl md:text-3xl text-white font-proxima z-10 font-bold my-5 w-[70%] mx-auto text-center ">
          {t.hero_desc}
        </section>
        <section className="flex justify-center my-5">
          <button
            className="px-5 py-3 transition duration-300 hover:scale-95 bg-white rounded-lg z-10 mx-4 font-proxima text-xl font-bold hover:text-white hover:bg-transparent border-2  hover:border-white "
            onClick={() => {
              router.push("/waitlist");
            }}
          >
            {t.hero_button}
          </button>
        </section>
      </div>
      <div className="h-[92vh] mb-10">
        <Wrapper className="flex flex-col justify-start items-center h-full">
          <section className="text-center" id="synopsis">
            <h2 className="font-proxima_bold text-xl  text-[#48bb78] mt-5 md:mt-9 lg:text-2xl">
              {t.home_pre_title_2}
            </h2>
            <h1 className="font-recoleta_semibold text-5xl my-3 lg:text-6xl">
              {t.home_title_2}
            </h1>
          </section>
          <div className="flex gap-3 w-[75%] mx-auto my-16 justify-stretch">
            <ProblemCard
              title={t.home_problem_title}
              description={t.home_problem_desc}
            />
            <ProblemCard
              title={t.home_solution_title}
              description={t.home_solution_desc}
            />
          </div>
        </Wrapper>
      </div>
      {/* <Slider title={t.home_pre_title_3} isProject={false}>
        {brands.map((brand: string) => (
          <img src={brand} key={brand} alt="" className="w-[190px]" />
        ))}
      </Slider> */}

      <Procedure
        title={t.home_procedure_title}
        pre_title={t.home_procedure_pre_title}
        procedure_title_1={t.procedure_title_1}
        procedure_desc_1={t.procedure_desc_1}
        procedure_title_2={t.procedure_title_2}
        procedure_desc_2={t.procedure_desc_2}
        procedure_title_3={t.procedure_title_3}
        procedure_desc_3={t.procedure_desc_3}
        procedure_title_4={t.procedure_title_4}
        procedure_desc_4={t.procedure_desc_4}
      />
      <Projects
        title={t.home_project_title}
        pre_title={t.home_project_pre_title}
      />
      <div className="my-5  mb-10 bg-[#d9e8e5] py-5 md:py-10 " id="faqs">
        <Wrapper className="flex flex-col justify-center items-center h-full">
          <h2 className="font-proxima_bold text-xl  text-[#48bb78] mt-3 md:mt-6 lg:text-2xl">
            {t.home_faq_pre_title}
          </h2>
          <h1 className="font-recoleta_semibold text-5xl my-3 mb-5 md:mb-10 lg:text-6xl">
            {t.home_faq_title}
          </h1>

          {data.map((item, index) => (
            <Accordian
              title={item.title}
              expanded={expanded}
              handleChange={handleChange}
              id={item.id}
              key={item.id}
              body={item.body}
            />
          ))}
        </Wrapper>
      </div>
      <Footer />
    </main>
  );
}
