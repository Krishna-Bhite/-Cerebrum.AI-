# 🧠 Cerebrum.AI

**Cerebrum.AI** is a full-stack AI-driven platform that helps users prepare for technical interviews, analyze resumes for ATS compliance, explore curated YouTube course recommendations, and generate tailored cover letters — all powered by modern AI tooling and a beautiful, responsive UI.

[🔗 Live Site](https://cerebrumai.vercel.app)

---

## 🚀 Features

### 🎙️ Hyperrealistic AI Interview Bot
- Simulates real-life technical interviews using **Vapi** and **Gemini LLM**
- Generates role-specific and level-based questions
- Assesses answers and returns detailed performance feedback

### 📄 ATS Resume Checker
- Upload `.docx` resumes and a job description
- Resume is parsed using `Mammoth.js`
- Evaluated by **Gemini** against the JD
- Detailed insights and visual feedback with **Recharts**

### 📚 Course & Video Insights
- Smart YouTube search based on optimized queries
- Paste video links to get:
  - Title, description, highlights, key takeaways, and conclusion
  - Timestamp-based summary using `youtube-transcript` and **Gemini**

### ✍️ AI-Powered Cover Letter Generator
- Upload your resume, input the job description, and select tone
- Generates a professional cover letter tailored to your application
- Tone-controlled output (e.g., formal, confident, friendly)

---

## 🧱 Tech Stack

| Area               | Tech                                                                 |
|--------------------|----------------------------------------------------------------------|
| Framework          | Next.js (SSR + SEO)                                                  |
| Auth               | Firebase Auth                                                        |
| File Storage       | Cloudinary                                                           |
| Resume Parsing     | Mammoth.js                                                           |
| LLM Integration    | Gemini Pro LLM                                                       |
| Voice Interface    | Vapi                                                                 |
| Forms              | React Hook Form + Zod                                                |
| Charts             | Recharts                                                             |
| UI Libraries       | shadcn/ui, AcertinityUI                                              |
| Loaders            | uiverse.io                                                           |
| Deployment         | Vercel                                                               |

---

## 🧭 App Flow

1. **Landing Page → Get Started**
2. Redirects to **Dashboard (auth-protected)**:
   - If not logged in, redirects to **Firebase Auth (email/password)**
3. After login:
   - Auth token stored as cookie using `next-cookies`
   - Verified using `verifySession` in layout
4. **Main Dashboard**:
   - View previous interviews
   - Create a new one using Vapi & Gemini
5. **ATS Check**:
   - Upload resume + JD → Parsed → Assessed → Visual report
6. **Course Recommendation**:
   - Search courses or deep-analyze video with ID/link
7. **Cover Letter Generation**:
   - Resume + JD + Tone → Tailored cover letter in seconds

---

## 📦 Project Structure (Simplified)

