import pdfParse from "pdf-parse";
import axios from "axios";
import mammoth from "mammoth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { Description, document, docType } = body;

    console.log("Fetching document from:", document);

    const response = await axios.get(document, {
      responseType: "arraybuffer",
    });

    const buffer = Buffer.from(response.data);

    let extractedText = "";

    if (docType === "docx") {
      const { value } = await mammoth.extractRawText({ buffer });
      extractedText = value;
    } else if (docType === "pdf") {
      const result = await pdfParse(buffer); // ✅ This line is critical
      extractedText = result.text;
    } else {
      return NextResponse.json({ success: false, error: "Unsupported doc type" }, { status: 400 });
    }

    return NextResponse.json({ success: true, text: extractedText });
  } catch (err: any) {
    console.error("API ERROR:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
