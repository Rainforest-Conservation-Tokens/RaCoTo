import React from "react";
import Image from "next/image";

const ProjectCard = ({ img, title }: { img: string; title: string }) => {
  return (
    <div className="rounded-xl w-[400px] mx-5 relative">
      <Image
        src={img}
        width={500}
        height={500}
        alt=""
        className="rounded-xl h-[250px] aspect-video object-cover"
      />
      <h2 className="absolute bottom-3 left-3 text-white font-proxima text-xl z-20">
        {title}
      </h2>
      <span className="w-full h-full absolute top-0 bg-black/[0.3] z-10 rounded-xl" />
    </div>
  );
};

export default ProjectCard;
