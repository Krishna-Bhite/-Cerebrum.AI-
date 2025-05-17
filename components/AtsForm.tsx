"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { FileUpload } from "./ui/file-upload";
import { CldUploadWidget } from "next-cloudinary";
import { getAtsScore } from "@/lib/actions/user.actions";
import { doc } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/navigation";

const schema = z.object({
  Description: z.string(),
});

type descriptionSchema = z.infer<typeof schema>;

const AtsForm = ({
  loading,
}: {
  loading: React.Dispatch<React.SetStateAction<boolean>>;
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

      const atsScore = await getAtsScore({
        ...data,
        document: document.secure_url,
        docType: docType,
      });
      console.log(atsScore);
      const encodedScore = encodeURIComponent(JSON.stringify(atsScore))
      router.push(`/ats-checker/results?score=${encodedScore}`);
      
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
        className="w-full flex flex-col items-center justify-center mb-[80px]"
      >
        <h4 className="font-bold">Description</h4>
        <input
          {...register("Description")}
          className="formInput w-full mt-2"
          placeholder="Enter the job description by company or what description you are targeting"
        />
        {errors.Description?.message && <p>{errors.Description?.message}</p>}
      </form>

      <div className="w-full flex flex-col items-center justify-center border-2 rounded-lg p-4">
        {document ? (
          <Image src={"/docx_icon.svg.png"} alt="docs" height={200} width={200} className="mb-8"/>
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

export default AtsForm;
