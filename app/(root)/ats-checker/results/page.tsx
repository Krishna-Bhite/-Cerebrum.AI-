import React from "react";
import { json } from "stream/consumers";
import { redirect } from "next/navigation";
import AtsResult from "@/components/AtsResult";
import RadarGraph from "@/components/RadarGraph";
import JobMatch from "@/components/JobMatch";
import { Progress } from "@/components/ui/progress";

const page = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { score } = searchParams;
  if (!score || score === undefined || score === null) {
    redirect("/ats-checker");
  }
  const scoreFinal = JSON.parse(score as string);

  const radarData: any = [];

  [
    {
      key: "contentQuality",
      label: "Content",
      scoreKey: "overallContentScore",
    },
    {
      key: "experience",
      label: "Experience",
      scoreKey: "overallExperienceScore",
    },
    {
      key: "formatting",
      label: "Formatting",
      scoreKey: "overallFormattingScore",
    },
    {
      key: "readability",
      label: "Readability",
      scoreKey: "overallReadabilityScore",
    },
  ].forEach(({ key, label, scoreKey }) => {
    radarData.push({
      subject: label,
      A: scoreFinal[key][scoreKey],
      fullMark: 100,
    });
  });

  return (
    <div className="border-2 border-gray-400 p-4 rounded-sm flex flex-col gap-2">
      <h3 className="font-semibold text-center">Your Report Card</h3>
      <div className="flex flex-col gap-2 md:flex-row">
        <div className="flex flex-col gap-2 w-full md:w-1/2 items-center border-1 border-gray-400 p-2 rounded-sm h-[700px]">
          <h4 className="font-semibold text-2xl">ATS Score</h4>
          <AtsResult score={scoreFinal?.overallScore} />
          <div className="flex flex-col gap-2 w-full px-4">
            <h3 className="font-semibold ml-2 text-md">Labels</h3>
            <div className="flex flex-row gap-2 w-full flex-wrap">
              {scoreFinal?.labels.map((item:any) => (
                <div key={item} className={`border-1 rounded-full p-2 text-center ${scoreFinal?.overallScore < 40 ? "border-red-500 bg-red-300" : scoreFinal?.overallScore < 80 ? "border-orange-500 bg-orange-300" : "border-green-500 bg-green-300"}`}>
                  <p className="text-sm text-black">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <div className="flex flex-col gap-2 border-1 border-gray-400 p-2 rounded-sm h-[400px] items-center">
            <h4 className="font-semibold text-2xl">Radar Graph</h4>
            <RadarGraph data={radarData} />
          </div>

          <div className="flex flex-col gap-2 border-1 border-gray-400 p-2 rounded-sm h-[290px] items-center">
            <h4 className="font-semibold text-2xl">Job Matching</h4>
            <JobMatch data={scoreFinal.JobMatch} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 items-center mt-6">
        <h4 className="font-semibold text-2xl">Detailed Report</h4>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col md:flex-row gap-2 w-full">
            <div className="flex flex-col gap-2 w-full md:w-1/2 border-1 border-gray-400 p-4 rounded-sm px-4">
              <h4 className="font-semibold text-lg mb-4">Content Quality</h4>
              <div className="flex flex-col gap-6">
                <div>
                  <h4 className="font-semibold text-sm mb-1">
                    Skill Relevance:{" "}
                    {scoreFinal.contentQuality.skillsRelevanceScore}
                  </h4>
                  <Progress
                    value={scoreFinal.contentQuality.skillsRelevanceScore}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-1">
                    Achievement Clarity:{" "}
                    {scoreFinal.contentQuality.achievementsScore}
                  </h4>
                  <Progress
                    value={scoreFinal.contentQuality.achievementsScore}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-1">
                    Industry Keywords: {scoreFinal.contentQuality.buzzwordScore}
                  </h4>
                  <Progress value={scoreFinal.contentQuality.buzzwordScore} />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-1/2 border-1 border-gray-400 p-4 rounded-sm px-4">
              <h4 className="font-semibold text-lg mb-4">Experience</h4>
              <div className="flex flex-col gap-6">
                <div>
                  <h4 className="font-semibold text-sm mb-1">
                    Job Relevance:{" "}
                    {scoreFinal.experience.experienceRelevanceScore}
                  </h4>
                  <Progress
                    value={scoreFinal.experience.experienceRelevanceScore}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-1">
                    Experience Recency: {scoreFinal.experience.dateScore}
                  </h4>
                  <Progress value={scoreFinal.experience.dateScore} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-2 w-full">
            <div className="flex flex-col gap-2 w-full md:w-1/2 border-1 border-gray-400 p-4 rounded-sm px-4">
              <h4 className="font-semibold text-lg mb-4">Formatting</h4>
              <div className="flex flex-col gap-6">
                <div>
                  <h4 className="font-semibold text-sm mb-1">
                    Layout & Structure:{" "}
                    {scoreFinal.formatting.layoutClarityScore}
                  </h4>
                  <Progress value={scoreFinal.formatting.layoutClarityScore} />
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-1">
                    Bullet Point Usage:{" "}
                    {scoreFinal.formatting.bulletPointUsageScore}
                  </h4>
                  <Progress
                    value={scoreFinal.formatting.bulletPointUsageScore}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-1">
                    File Cleanliness:{" "}
                    {scoreFinal.formatting.fileCleanlinessScore}
                  </h4>
                  <Progress
                    value={scoreFinal.formatting.fileCleanlinessScore}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-1/2 border-1 border-gray-400 p-4 rounded-sm px-4">
              <h4 className="font-semibold text-lg mb-4">Readeblity</h4>
              <div className="flex flex-col gap-6">
                <div>
                  <h4 className="font-semibold text-sm mb-1">
                    Grammar: {scoreFinal.readability.grammarScore}
                  </h4>
                  <Progress value={scoreFinal.readability.grammarScore} />
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-1">
                    Sentence Structure:{" "}
                    {scoreFinal.readability.sentenceStructureScore}
                  </h4>
                  <Progress
                    value={scoreFinal.readability.sentenceStructureScore}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-1">
                    Jargon Clarity: {scoreFinal.readability.jargonClarityScore}
                  </h4>
                  <Progress value={scoreFinal.readability.jargonClarityScore} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2  mt-6">
        <h3 className="font-semibold text-center">Feedback</h3>
        <div className="flex flex-col items-center gap-4">
          <div className="border-2 border-gray-400 p-4 rounded-sm flex flex-col gap-2">
            <h4 className="font-semibold text-lg mb-2">Summary</h4>
            <p className="text-sm">{scoreFinal.Summary.summary}</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="border-2 border-gray-400 p-4 rounded-sm flex flex-col gap-2 w-full md:w-1/2 text-green-400">
            <h4 className="font-semibold text-lg mb-2">Positives</h4>
            {scoreFinal.Summary.positives.map((item: any) => (
              <p key={item} className="text-sm">
                • {item}
              </p>
            ))}
          </div>

          <div className="border-2 border-gray-400 p-4 rounded-sm flex flex-col gap-2 w-full md:w-1/2 text-red-400">
            <h4 className="font-semibold text-lg mb-2">Negatives</h4>
            {scoreFinal.Summary.negatives.map((item: any) => (
              <p key={item} className="text-sm">
                • {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
