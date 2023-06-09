import React from "react";
import styles from "../styles/slider.module.css";

const Slider = ({
  children,
  title,
  isProject,
}: {
  children: React.ReactNode;
  title?: string;
  isProject: boolean;
}) => {
  return (
    <div>
      {title && (
        <h1 className="text-center font-proxima_bold text-xl text-[#48bb78] mt-7 md:mt-14 lg:text-2xl">
          {title}
        </h1>
      )}
      {isProject ? (
        <div className="w-full relative overflow-hidden  my-5 h-80">
          <div className={`${styles.project} flex absolute left-0`}>
            <div className={`flex w-1/2 justify-around`}>{children}</div>
            <div className="flex w-1/2 justify-around">{children}</div>
          </div>
        </div>
      ) : (
        <div className="w-full relative overflow-hidden p-16 my-10 h-fit">
          <div className={`${styles.logo} flex absolute left-0`}>
            <div className={`flex w-1/2 justify-around`}>{children}</div>
            <div className="flex w-1/2 justify-around">{children}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Slider;
