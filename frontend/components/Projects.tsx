import React from "react";
import Wrapper from "./Wrapper";
import ProjectCard from "@/components/Cards/ProjectCard";
import Slider from "@/components/Slider";
import { projects } from "@/constants/constants";
import { title } from "process";
type ProjectsProps = {
  title: string;
  pre_title: string;
};
const Projects = ({ title, pre_title }: ProjectsProps) => {
  return (
    <div className="my-5 w-full " id="projects">
      <Wrapper className="flex flex-col justify-center items-center h-full">
        <h2 className="font-proxima_bold text-xl text-[#48bb78] mt-5 md:mt-9 lg:text-2xl">
          {pre_title}
        </h2>
        <h1 className="font-recoleta_semibold text-5xl my-3 lg:text-6xl text-center">
          {" "}
          {title}
        </h1>
      </Wrapper>
      <Slider title={""} isProject={true}>
        {projects.map((project) => (
          <ProjectCard
            img={project}
            title="🇧🇷 Mongabay, Brazil"
            key={project}
          />
        ))}
      </Slider>
    </div>
  );
};

export default Projects;
