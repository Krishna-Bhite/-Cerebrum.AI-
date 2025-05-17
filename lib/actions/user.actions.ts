"use server";
import axios from "axios";
import mammoth from "mammoth"; // For .docx
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { YoutubeTranscript } from "youtube-transcript";

type atsProp = {
  Description: string;
  document: string; // secure_url from Cloudinary
  docType: "pdf" | "docx";
};

export const getAtsScore = async (data: atsProp) => {
  try {
    const { Description, document, docType } = data;

    const response = await axios.get(document, {
      responseType: "arraybuffer",
    });

    const buffer = Buffer.from(response.data);

    const { value: text } = await mammoth.extractRawText({ buffer });

    const atsResponse = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `You are an Applicant Tracking System (ATS) designed to score resumes based on how well they match a given job description.

Job Description: ${
        Description === ""
          ? "No job description provided. Please generate a suitable prompt for scoring."
          : Description
      }

Resume Text: ${text}

Please evaluate the resume and return a structured JSON response with the following format. Each score should be an integer between 0 and 100, where 100 represents an ideal match. Return only this JSON object with no extra commentary.

{
  "overallScore": number, // Final weighted score based on all categories

  "contentQuality": {
    "overallContentScore": number,
    "skillsRelevanceScore": number,     // Alignment of skills with job description
    "buzzwordScore": number,            // Usage of industry-relevant terms and keywords
    "achievementsScore": number,        // Measurable accomplishments and impact
    "jobTitleMatchScore": number        // Similarity of past job titles to the target role
  },

  "experience": {
    "overallExperienceScore": number,
    "experienceRelevanceScore": number, // How relevant experience is to the job
    "dateScore": number,                // Recency of roles and career progression
    "experienceLengthScore": number     // Appropriateness of experience duration
  },

  "formatting": {
    "overallFormattingScore": number,
    "layoutClarityScore": number,       // Clear sections and structure
    "lengthScore": number,              // Resume length suitability
    "bulletPointUsageScore": number,    // Use of bullet points for readability
    "sectionConsistencyScore": number,  // Consistent formatting across sections
    "fileCleanlinessScore": number      // No extraneous characters, bad encodings, etc.
  },

  "readability": {
    "overallReadabilityScore": number,
    "grammarScore": number,             // Grammar, spelling, and punctuation
    "sentenceStructureScore": number,   // Concise and well-structured writing
    "jargonClarityScore": number,       // Minimal use of confusing or vague jargon
    "wordDensityScore": number          // Balanced keyword distribution
  },

  "Summary": {
    "summary": string,                 // Brief summary of the resume’s overall value
    "positives": string[],               // Highlight what the resume does well return as an array
    "negatives": string[]                // Major issues or areas for improvement return as an array
  },

  "Recommendations": string            // Suggestions to improve the resume's effectiveness
  "JobMatch": number                   // Percentage match with the job description or chances of passing ATS
  "labels": string[]                // List of labels or tags that describe the resume's content keep them accordingly if overall score bad keep them bad if good keep them good
}

      `,
    });

    const jsonText = atsResponse.text.trim();
    const firstBrace = jsonText.indexOf("{");
    const lastBrace = jsonText.lastIndexOf("}");
    const jsonSubstring = jsonText.substring(firstBrace, lastBrace + 1);

    const parsed = JSON.parse(jsonSubstring);
    return parsed;
  } catch (e: any) {
    console.error("Error in getAtsScore:", e);
    return { success: false, error: e.message };
  }
};

export const getCourseRecommendation = async (prompt: string) => {
  try {
    const response = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `You are a course recommendation system.
Your job is to help users find the best and most relevant free YouTube videos for their learning goals or career interests.

The user will give a long, natural-language input describing their aspirations, skills, or career objectives.
Your task is to:

Extract the most important keywords (technologies, roles, goals, years, salary aspirations). // No need to return keywords

Create a short and optimized YouTube search query using those keywords. //Return this query as a string.

Ensure the query is likely to return high-quality, relevant results.

Ignore filler words or vague sentences.
Focus on terms like roadmap, tutorial, high salary, free course, jobs, and relevant technologies/tools.
Include year if relevant (e.g., 2025).

Also if user stops abruptly or doesn't provide a clear input you can improvise a bit and create a search query based on the context.

And most importantly if user search anything vulgar or inappropriate like related to sexual talks or controversial religious matters then just return video search query for "https://www.youtube.com/watch?v=9Deg7VrpHbM" this video.

Based on the user input below, respond strictly in as string format with the search query only. Do not include any additional text or explanations.:

The user input is: ${prompt}`,
    });

    const { text } = response;
    const ytResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        text
      )}&type=video&maxResults=5&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
    );

    return ytResponse.data.items;
  } catch (e: any) {
    console.error("Error in getCourseRecommendation:", e);
    return { success: false, error: e.message };
  }
};

export const getDetails = async (url: string) => {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(url);
    const transcriptText = transcript
      .map((item) => item.text)
      .join(" ")
      .replace(/<[^>]*>/g, "");
    const response = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `You are a highly intelligent YouTube video summarization assistant.

Your task is to analyze the **transcript** of a YouTube video and return a detailed JSON object with the following fields:

1. "title": A concise and accurate title of the video (use clues from transcript if necessary).
2. "description": A 2–4 sentence summary of what the video is about.
3. "highlights": A paragraph summarizing the core ideas, insights, or themes of the video.  // This should be a bit more detailed than the description but still concise and should be in format String[].
4. "timestamps": A list of key moments in the video. Each entry should be an object with:
   - "time": Timestamp in MM:SS format.
   - "summary": A 1–2 sentence description of what happens or is explained at this point.
5. "key_points": An array of concise, standalone bullet points highlighting the most useful takeaways, such as: // Make sure these are different from the highlights and are unique should be in format String[].
   - Key definitions
   - Formulas
   - Core ideas
   - Actionable tips
   - Thought-provoking facts
6. "conclusion": A brief summary of the video’s conclusion or final thoughts.

### Guidelines:
- Your response must be a **valid JSON object** only (no Markdown or extra commentary).
- If the transcript is vague or incomplete, use your best judgment to create a meaningful summary.
- Do not hallucinate or make up content not present in the transcript.
- Aim for clarity, specificity, and usefulness — avoid fluff or repetition.

---

### Input:
Transcript:
"""
${transcriptText}`,
    });

    const { text } = response;
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    const jsonSubstring = text.substring(firstBrace, lastBrace + 1);
    const parsed = JSON.parse(jsonSubstring);
    return parsed;
  } catch (e: any) {
    console.error("Error in getDetails:", e);
    return { success: false, error: e.message };
  }
};
