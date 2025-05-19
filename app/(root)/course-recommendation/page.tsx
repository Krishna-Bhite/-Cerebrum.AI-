"use client";
import {
  getCourseRecommendation,
  getDetails,
} from "@/lib/actions/user.actions";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { set } from "zod";

const page = () => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const router = useRouter();

  const [isActive, setIsActive] = React.useState<"course" | "deep">("course");
  const handleClick = (type: "course" | "deep") => {
    setIsActive(type);
    setData(null);
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete("page");
    router.push(`${window.location.pathname}?${searchParams.toString()}`);
  };
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  // Pagenation for timestamps
  const p = page ? parseInt(page) : 1;
  const hasPrev = 1 * (p - 1) > 0;
  const hasNext = 1 * (p - 1) + 1 < data?.timestamps?.length;

  const changePage = (newPage: number) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", newPage.toString());
    router.push(`${window.location.pathname}?${searchParams.toString()}`);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = (e.currentTarget[0] as HTMLInputElement).value;
    if (!value) return;

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete("page");
    router.push(`${window.location.pathname}?${searchParams.toString()}`);
    // Handle form submission logic here
    try {
      setLoading(true);
      if (isActive === "course") {
        const response = await getCourseRecommendation(value);
        setData(response);
        console.log(response);
        console.log(Array.isArray(response));
        console.log(typeof response);
      } else {
        const response = await getDetails(value);
        setData(response);
        console.log(response);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (videoId: string) => {
    try {
      await navigator.clipboard.writeText(videoId);
      setCopiedId(videoId);
      setTimeout(() => setCopiedId(null), 2000); // Reset after 2 sec
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div className="h-[80vh] flex flex-col items-center justify-between">
      <div className="flex flex-col h-[85%] w-full overflow-auto">
        {loading ? (
          isActive === "course" ? (
            <div className="flex flex-col gap-6 p-4">
              <div className="flex flex-row gap-6 mb-10">
                <div className="animate-pulse bg-gray-300 w-[250px]  h-[200px] max-md:h-[100px] max-md:w-[100px] rounded-md"></div>
                <div className="flex flex-col justify-between gap-2 flex-1">
                  <div className="flex flex-col gap-2">
                    <div className="animate-pulse bg-gray-300 w-[20%] h-5 rounded-full"></div>
                    <div className="animate-pulse bg-gray-300 w-[40%] h-5 rounded-full"></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="animate-pulse bg-gray-300  w-[70%] h-5 rounded-full"></div>
                    <div className="animate-pulse bg-gray-300 w-[70%] h-5 rounded-full"></div>
                    <div className="animate-pulse bg-gray-300  w-[70%] h-5 rounded-full max-md:hidden"></div>
                    <div className="animate-pulse bg-gray-300 w-[70%] h-5 rounded-full max-md:hidden"></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-row gap-6 ">
                <div className="animate-pulse bg-gray-300 w-[250px] h-[200px] max-md:h-[100px] max-md:w-[100px] rounded-md"></div>
                <div className="flex flex-col justify-between gap-2 flex-1">
                  <div className="flex flex-col gap-2">
                    <div className="animate-pulse bg-gray-300 w-[20%] h-5 rounded-full"></div>
                    <div className="animate-pulse bg-gray-300 w-[40%] h-5 rounded-full"></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="animate-pulse bg-gray-300  w-[70%] h-5 rounded-full"></div>
                    <div className="animate-pulse bg-gray-300 w-[70%] h-5 rounded-full"></div>
                    <div className="animate-pulse bg-gray-300  w-[70%] h-5 rounded-full max-md:hidden"></div>
                    <div className="animate-pulse bg-gray-300 w-[70%] h-5 rounded-full max-md:hidden"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6 p-4">
              <div className="h-[45px] w-full animate-pulse bg-gray-300 rounded-md" />
              <div className="h-[160px] w-full animate-pulse bg-gray-300 rounded-md" />
              <div className="flex flex-col md:flex-row gap-4">
                <div className="h-[160px] w-full md:w-1/2 animate-pulse bg-gray-300 rounded-md" />
                <div className="h-[160px] w-full md:w-1/2 animate-pulse bg-gray-300 rounded-md" />
              </div>
              <div className="h-[160px] w-full animate-pulse bg-gray-300 rounded-md" />
            </div>
          )
        ) : isActive === "course" && data ? (
          <div>
            <h1 className="text-2xl font-bold text-center">Top free courses</h1>
            <div className="flex flex-col gap-6 p-4">
              {data.map((item: any) => (
                <div
                  className="flex flex-row max-md:items-center"
                  key={item.id.videoId}
                >
                  <Image
                    src={item?.snippet?.thumbnails?.high?.url}
                    alt="thumbnail"
                    width={250}
                    height={200}
                    className="rounded-md max-md:h-[100px] max-md:w-[100px]"
                  />
                  <div className="flex flex-col gap-2 flex-1 py-5 px-2">
                    <div className="flex flex-col gap-2">
                      <div className="text-lg font-bold max-md:text-sm">
                        {item?.snippet?.title}
                      </div>
                      <div className="text-sm text-gray-500 max-md:text-xs">
                        {item?.snippet?.description}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 max-md:text-xs">
                      {item?.snippet?.channelTitle}
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`https://www.youtube.com/watch?v=${item.id.videoId}`}
                        className="text-blue-500 max-md:text-xs"
                      >
                        Click here for video
                      </Link>
                      <button
                        onClick={() => handleCopy(item.id.videoId)}
                        className="text-sm text-blue-600 border border-blue-400 px-2 py-1 rounded hover:bg-blue-50 max-md:text-xs"
                      >
                        {copiedId === item.id.videoId ? "Copied!" : "Copy Link"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : isActive === "deep" && data ? (
          <div className="flex flex-col gap-4 p-4">
            <div className="bg-[#ff7700] py-2 px-4 rounded-md">
              <h1 className="text-2xl font-bold text-center">{data?.title}</h1>
            </div>
            <div className="bg-[#1e1e1e] py-4 px-4 rounded-md text-gray-500 font-semibold">
              {data?.description}
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-col gap-2 bg-[#1e1e1e] py-4 px-4 rounded-md w-full md:w-1/2">
                <h2 className="text-lg font-bold text-[#4d5bf9]">
                  Video Highlights
                </h2>
                <div className="w-full h-[5px] bg-[#ff7700] rounded-full mb-4" />
                <div className="flex flex-col gap-2">
                  {data?.highlights?.map((item: any, index: number) => (
                    <div className="flex" key={index}>
                      <div className="size-3 bg-green-400 rounded-full mt-1.5" />
                      <p className="text-[15px] text-gray-500 ml-4 w-[90%] font-semibold">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 bg-[#1e1e1e] py-4 px-4 rounded-md w-full md:w-1/2">
                <h2 className="text-lg font-bold text-[#4d5bf9]">Key Points</h2>
                <div className="w-full h-[5px] bg-[#ff7700] rounded-full mb-4" />
                <div className="flex flex-col gap-2">
                  {data?.key_points?.map((item: any, index: number) => (
                    <div className="flex" key={index}>
                      <div className="size-3 bg-green-400 rounded-full mt-1.5" />
                      <p className="text-[15px] text-gray-500 ml-4 w-[90%] font-semibold">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 bg-[#1e1e1e] py-4 px-4 rounded-md">
              <h2 className="text-lg font-bold text-[#4d5bf9]">Conclusion</h2>
              <div className="w-full h-[5px] bg-[#ff7700] rounded-full mb-4" />
              <p className="text-gray-500 font-semibold">{data?.conclusion}</p>
            </div>
            <div className="flex flex-col gap-2 bg-[#1e1e1e] py-4 px-4 rounded-md">
              <h2 className="text-lg font-bold text-[#4d5bf9]">Timestamps</h2>
              <div className="w-full h-[5px] bg-[#ff7700] rounded-full mb-4" />
              <div className="flex mb-4">
                <h4 className="font-semibold text-blue-500 mr-3">{data?.timestamps?.[p]?.time}</h4>
                <p className="font-semibold text-gray-500">{data?.timestamps?.[p]?.summary}</p>
              </div>
              <div className="flex justify-between">
                <button
                  className="py-1 px-2 bg-[#ff7700] rounded-md"
                  onClick={() => {
                    changePage(p - 1);
                  }}
                  disabled={!hasPrev}
                >
                  Prev
                </button>
                <div className="flex gap-2 items-center">
                  {Array.from(
                    { length: Math.ceil(data?.timestamps?.length / 1) },
                    (_, i) => {
                      const pageIndex = i + 1;
                      return (
                        <div className={`${p === pageIndex ? "bg-[#ff7700]" : "bg-slate-500"} rounded-full size-3`} key={pageIndex}/>
                      );
                    }
                  )}
                </div>
                <button
                  className="py-1 px-2 bg-[#ff7700] rounded-md"
                  onClick={() => {
                    changePage(p + 1);
                  }}
                  disabled={!hasNext}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 p-4 justify-center items-center relative">
            <h1 className="text-2xl font-bold text-center">
              {isActive === "course" ? "Course Recommendation" : "Deep Search"}
            </h1>
            <Image
              src={"/beforeSearch.png"}
              alt="search"
              width={300}
              height={300}
            />
            <p className="text-slate-400 text-[15px] font-semibold absolute bottom-10">
              {isActive === "course"
                ? "Search For Free courses to get results"
                : "Search For video summary and details"}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col h-[15%] w-full">
        <form
          className="flex h-[47%] w-[80%] md:w-[60%] lg:w-[40%] mx-auto relative"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            className="bg-gray-500 w-[100%] rounded-full px-6"
          />
          <button className="absolute right-2 top-[6px]" type="submit">
            <Image
              src={"/send.jpg"}
              alt="send"
              height={40}
              width={40}
              className="object-cover rounded-full"
            />
          </button>
        </form>
        <div className="flex gap-2 w-[75%] md:w-[55%] lg:w-[35%] mx-auto mt-2">
          <button
            className={`border-2 rounded-full px-4 ${
              isActive === "course"
                ? "bg-blue-500/40 border-blue-700 text-gray-300"
                : "border-gray-500 bg-gray-500/40"
            } cursor-pointer`}
            onClick={() => handleClick("course")}
          >
            Course
          </button>

          <button
            className={`border-2 rounded-full px-4 ${
              isActive === "deep"
                ? "bg-blue-500/40 border-blue-700 text-gray-300"
                : "border-gray-500 bg-gray-500/40"
            } cursor-pointer`}
            onClick={() => handleClick("deep")}
          >
            Deep search
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
