"use client";
import AtsForm from "@/components/AtsForm";
import CoverLetterForm from "@/components/CoverLetterForm";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import Image from "next/image";
import React from "react";

const page = () => {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<any>(null);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async (data: string) => {
    try {
      await navigator.clipboard.writeText(data);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 sec
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

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
  ) : data ? (
    <div className="flex flex-col relative bg-[#1e1e1e] p-4 rounded-lg">
      <pre className="whitespace-pre-wrap text-sm leading-relaxed">{data}</pre>
      {!copied ? (
        <Image
          src={"/toCopy.png"}
          alt="copy"
          height={30}
          width={30}
          className="rounded-full absolute top-4 right-4 cursor-pointer"
          onClick={() => handleCopy(data)}
        />
      ) : (
        <Image
          src={"/copied.jpg"}
          alt="copy"
          height={30}
          width={30}
          className="rounded-full absolute top-4 right-4 cursor-pointer"
        />
      )}
    </div>
  ) : (
    <div className="flex flex-col justify-center">
      <h3 className="text-center mb-10">
        Want to make a best coverletter design it with our{" "}
        <ContainerTextFlip
          words={["Modern", "Accurate", "Awesome"]}
        />{" "}
        Builder
      </h3>

      <div className="flex flex-col items-center justify-center rounded-lg p-4 border-2 border-dashed">
        <CoverLetterForm loading={setLoading} addData={setData} />
      </div>
    </div>
  );
};

export default page;
