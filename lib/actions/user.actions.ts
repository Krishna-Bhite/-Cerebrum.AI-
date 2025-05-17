"use server";
import axios from "axios";
import mammoth from "mammoth"; // For .docx
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

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
