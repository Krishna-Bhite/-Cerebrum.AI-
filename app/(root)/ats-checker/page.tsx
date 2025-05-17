"use client";
import AtsForm from "@/components/AtsForm";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import React from "react";

const page = () => {
  const [loading, setLoading] = React.useState(false);
  return loading ? (
    <div className="fixed top-0 left-0 flex flex-col items-center justify-center h-screen w-screen typewriter-wrapper">
      <div className="typewriter">
        <div className="slide">
          <i></i>
        </div>
        <div className="paper"></div>
        <div className="keyboard"></div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col justify-center">
      <h3 className="text-center mb-10">
        Want to check where your resume stands check it on our{" "}
        <ContainerTextFlip
          words={["Industry leading", "Modern", "Accurate", "Awesome"]}
        />{" "}
        ATS platform
      </h3>

      <div className="flex flex-col items-center justify-center rounded-lg p-4 border-2 border-dashed">
        <AtsForm loading={setLoading} />
      </div>
    </div>
  );
};

export default page;
