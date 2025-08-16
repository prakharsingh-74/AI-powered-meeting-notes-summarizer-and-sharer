# AI Meeting Summarizer and Email Sharer

## Overview
This project is an AI-powered meeting notes summarizer and sharer. It allows users to upload meeting transcripts, generate concise and actionable summaries using an LLM API, and share those summaries via email directly from the web interface.

---

## Tech Stack

### Frontend
- **Next.js (App Router)**: Modern React framework for server-side rendering and routing.
- **TypeScript**: Type safety for both frontend and backend code.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.

### Backend/API

- **ai & @ai-sdk/groq**: Used to interact with Groq's API for generating meeting summaries.
- **Nodemailer**: For sending emails via SMTP.

---

## Approach & Process

### 1. Summarization
- **User uploads a transcript** or enters meeting notes.
- The frontend sends a POST request to `/api/summarize` with the transcript and (optionally) a custom prompt.
- The backend uses the `generateText` function from the `ai` SDK, with the Groq LLM API, to generate a structured summary.
- The summary is returned to the frontend and displayed to the user.

### 2. Email Sharing
- The user can open a dialog to share the summary via email.
- The frontend collects recipient email(s), subject, and an optional message.
- A POST request is sent to `/api/send-email` with the summary and email details.
- The backend validates the input, constructs the email content, and uses Nodemailer to send the email via SMTP.
- The result (success or error) is returned to the frontend for user feedback.

### 3. Environment Variables
- Sensitive information (API keys, SMTP credentials) is stored in a `.env` file and accessed via `process.env`.
- Example `.env` variables:
  - `GROQ_API_KEY` (for LLM access)
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` (for email sending)

---

## Key Files & Structure

- `app/api/summarize/route.ts`: Handles summarization requests using Groq LLM.
- `app/api/send-email/route.ts`: Handles email sending using Nodemailer.
- `components/`: Contains reusable UI components (dialogs, forms, etc.).
- `.env`: Stores environment variables (not committed to version control).

---

## Security & Best Practices
- **Environment variables** are never hardcoded; always use `.env` for secrets.
- **Input validation** is performed on both API routes to prevent misuse.
- **Error handling** is implemented to provide clear feedback and avoid leaking sensitive information.
- **Dependencies** are managed with `--legacy-peer-deps` when necessary to resolve conflicts.

---

## How to Run Locally
1. Clone the repository.
2. Run `npm install --legacy-peer-deps` to install dependencies.
3. Create a `.env` file in the root with your Groq API key and SMTP credentials.
4. Run `npm run dev` to start the development server.
5. Access the app at `http://localhost:3000`.

---

## Extensibility
- The summarization model can be swapped for any LLM supported by the `ai` SDK.
- The email service can be replaced with any provider supported by Nodemailer (e.g., SendGrid, Mailgun, etc.).
- UI components are modular and can be extended for more features (e.g., scheduling, attachments).

---

## Troubleshooting
- **Dependency conflicts**: Use `--legacy-peer-deps` with npm/yarn if you encounter peer dependency errors.
- **Email not sending**: Double-check your SMTP credentials and provider settings in `.env`.
- **LLM errors**: Ensure your Groq API key is valid and you have access to the specified model.

---
