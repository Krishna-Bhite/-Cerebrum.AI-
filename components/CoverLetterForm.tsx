"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { FileUpload } from "./ui/file-upload";
import { CldUploadWidget } from "next-cloudinary";
import { getAtsScore, getCoverLetter } from "@/lib/actions/user.actions";
import { doc } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/navigation";

const schema = z.object({
  Description: z.string(),
});

type descriptionSchema = z.infer<typeof schema>;

const CoverLetterForm = ({
  loading,
  addData,
}: {
  loading: React.Dispatch<React.SetStateAction<boolean>>;
  addData: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<descriptionSchema>({
    resolver: zodResolver(schema),
  });

  const router = useRouter();
  const [document, setDocument] = React.useState<any>(null);
  const [tone, setTone] = React.useState<
    "enthusastic" | "professional" | "energetic" | "casual"
  >("enthusastic");

  const onSubmit = handleSubmit(async (data) => {
    try {
      loading(true);
      if (!document) {
        alert("Please upload a document of your resume");
        return;
      }
      const docType = document?.path?.split(".").pop();

      if (docType !== "docx") {
        alert("Please upload a document of type docx.");
        return;
      }

      const atsScore = await getCoverLetter({
        ...data,
        document: document.secure_url,
        tone: tone,
      });
      console.log(atsScore);
      addData(atsScore);
    } catch (e) {
      console.log(e);
      alert("Something went wrong. Please try again.");
    } finally {
      loading(false);
    }
  });

  return (
    <div className="w-full flex flex-col justify-center gap-4">
      <form
        onSubmit={onSubmit}
        className="w-full flex flex-col items-center justify-center mb-[30px]"
      >
        <h4 className="font-bold">Description</h4>
        <input
          {...register("Description")}
          className="formInput w-full mt-2"
          placeholder="Enter the job description by company or what description you are targeting"
        />
        {errors.Description?.message && <p>{errors.Description?.message}</p>}
      </form>

      <div className="flex w-[75%] flex-col md:flex-row md:items-center justify-center mx-auto border-2 rounded-lg p-4 gap-4 mb-[30px]">
        <p className="max-md:text-center">Select a tone: </p>
        <div
          className={`flex items-center justify-center mx-3 p-2 ${
            tone === "enthusastic"
              ? "bg-blue-100 shadow-[8px_8px_12px_rgba(59,130,246,0.3)]"
              : "bg-gray-100"
          } rounded-full cursor-pointer`}
          onClick={() => setTone("enthusastic")}
        >
          <div
            className={`size-3 rounded-full ${
              tone === "enthusastic" ? "bg-blue-600" : "bg-gray-400"
            } mr-1`}
          />
          <p
            className={`text-sm ${
              tone === "enthusastic" ? "text-blue-600" : "text-gray-500"
            } font-semibold`}
          >
            Enthusiastic
          </p>
        </div>

        <div
          className={`flex items-center justify-center mx-3 p-2 ${
            tone === "professional"
              ? "bg-blue-100 shadow-[8px_8px_12px_rgba(59,130,246,0.3)]"
              : "bg-gray-100"
          } rounded-full cursor-pointer`}
          onClick={() => setTone("professional")}
        >
          <div
            className={`size-3 rounded-full ${
              tone === "professional" ? "bg-blue-600" : "bg-gray-400"
            } mr-1`}
          />
          <p
            className={`text-sm ${
              tone === "professional" ? "text-blue-600" : "text-gray-500"
            } font-semibold`}
          >
            Professional
          </p>
        </div>

        <div
          className={`flex items-center justify-center mx-3 p-2 ${
            tone === "casual"
              ? "bg-blue-100 shadow-[8px_8px_12px_rgba(59,130,246,0.3)]"
              : "bg-gray-100"
          } rounded-full cursor-pointer`}
          onClick={() => setTone("casual")}
        >
          <div
            className={`size-3 rounded-full ${
              tone === "casual" ? "bg-blue-600" : "bg-gray-400"
            } mr-1`}
          />
          <p
            className={`text-sm ${
              tone === "casual" ? "text-blue-600" : "text-gray-500"
            } font-semibold`}
          >
            Casual
          </p>
        </div>

        <div
          className={`flex items-center justify-center mx-3 p-2 ${
            tone === "energetic"
              ? "bg-blue-100 shadow-[8px_8px_12px_rgba(59,130,246,0.3)]"
              : "bg-gray-100"
          } rounded-full cursor-pointer`}
          onClick={() => setTone("energetic")}
        >
          <div
            className={`size-3 rounded-full ${
              tone === "energetic" ? "bg-blue-600" : "bg-gray-400"
            } mr-1`}
          />
          <p
            className={`text-sm ${
              tone === "energetic" ? "text-blue-600" : "text-gray-500"
            } font-semibold`}
          >
            Energetic
          </p>
        </div>
      </div>

      <div className="w-full flex flex-col items-center justify-center border-2 rounded-lg p-4">
        {document ? (
          <Image
            src={"/docx_icon.svg.png"}
            alt="docs"
            height={200}
            width={200}
            className="mb-8"
          />
        ) : (
          <CldUploadWidget
            uploadPreset="cerebrum"
            onSuccess={(res, { widget }) => {
              setDocument(res.info);
              widget.close();
            }}
          >
            {({ open }) => {
              return (
                <div onClick={() => open()}>
                  <FileUpload />
                </div>
              );
            }}
          </CldUploadWidget>
        )}

        <button
          className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 w-[100px]"
          onClick={onSubmit}
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm text-white backdrop-blur-3xl font-bold">
            Submit
          </span>
        </button>
      </div>
    </div>
  );
};

export default CoverLetterForm;
