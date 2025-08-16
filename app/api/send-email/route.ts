import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const { recipients, subject, message, summary, customPrompt, transcriptLength } = await request.json()

    // Validate input
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: "Recipients are required" }, { status: 400 })
    }

    if (!subject || !summary) {
      return NextResponse.json({ error: "Subject and summary are required" }, { status: 400 })
    }

    // Validate email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const validRecipients = recipients.filter((email) => emailRegex.test(email))

    if (validRecipients.length === 0) {
      return NextResponse.json({ error: "No valid email addresses provided" }, { status: 400 })
    }

    // Create email content
    const emailContent = `
${message}

---

MEETING SUMMARY
${customPrompt ? `\nSummary Instructions: ${customPrompt}` : ""}
Generated from ${transcriptLength} character transcript

${summary}

---

This summary was generated using AI Meeting Summarizer.
    `.trim()


    // Configure Nodemailer transporter using SMTP credentials from environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Send the email
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER, // sender address
      to: validRecipients.join(","),
      subject,
      text: emailContent,
      html: emailContent.replace(/\n/g, "<br>"),
    })

    return NextResponse.json({
      success: true,
      message: `Email sent to ${validRecipients.length} recipient${validRecipients.length > 1 ? "s" : ""}`,
      recipients: validRecipients,
    })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
