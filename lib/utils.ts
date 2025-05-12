import { interviewCovers, mappings } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const normalizeTechName = (tech: string) => {
  const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
  return mappings[key as keyof typeof mappings];
};

const checkIconExists = async (url: string) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok; // Returns true if the icon exists
  } catch {
    return false;
  }
};

export const getTechLogos = async (techArray: string[]) => {
  const logoURLs = techArray.map((tech) => {
    const normalized = normalizeTechName(tech);
    return {
      tech,
      url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`,
    };
  });

  const results = await Promise.all(
    logoURLs.map(async ({ tech, url }) => ({
      tech,
      url: (await checkIconExists(url)) ? url : "/tech.svg",
    }))
  );

  return results;
};

export const getRandomInterviewCover = () => {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);
  return `/covers${interviewCovers[randomIndex]}`;
};


// Get actual compnany logo from clearbit
export async function getCompanyLogo(companyName : string) {
  const fallbackLogo = '/companyLogo.png';

  // Normalize name: remove spaces, to lowercase, fix common misspellings if needed
  const normalized = companyName.trim().toLowerCase();

  // Construct Clearbit logo URL
  const logoUrl = `https://logo.clearbit.com/${normalized}.com`;

  try {
    const res = await fetch(logoUrl, { method: 'HEAD' }); // Just check if it exists
    if (res.ok) {
      return logoUrl;
    } else {
      return fallbackLogo;
    }
  } catch (error) {
    return fallbackLogo;
  }
}
