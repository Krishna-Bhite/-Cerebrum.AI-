import { cn, getTechLogos } from "@/lib/utils";
import React from "react";

const DisplayTechIcons = async ({ techStack }: TechIconProps) => {
  const techIcons = await getTechLogos(techStack);
  return (
    <div className="flex flex-row">
      {techIcons.slice(0, 3).map((icon,index) => (
        <div
          key={icon.tech}
          className={cn("relative group bg-dark-300 rounded-full p-2 flex-center",index >=0 && "-ml-3")}
        >
          <span className="tech-tooltip">{icon.tech}</span>
          <img
            src={icon.url}
            alt={icon.tech}
            className="size-5 object-contain"
          />
        </div>
      ))}
    </div>
  );
};

export default DisplayTechIcons;
