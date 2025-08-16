import { type NextRequest, NextResponse } from "next/server"

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

    // In a real implementation, you would integrate with an email service like:
    // - Resend
    // - SendGrid
    // - AWS SES
    // - Nodemailer with SMTP

    // For demo purposes, we'll simulate sending
    console.log("[v0] Email would be sent to:", validRecipients)
    console.log("[v0] Subject:", subject)
    console.log("[v0] Content length:", emailContent.length)

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In production, replace this with actual email sending logic:
    /*
    const emailService = new EmailService() // Your chosen email service
    await emailService.send({
      to: validRecipients,
      subject,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>'), // Basic HTML conversion
    })
    */

    return NextResponse.json({
      success: true,
      demo: true,
      message: `Demo Mode: Email preview generated for ${validRecipients.length} recipient${validRecipients.length > 1 ? "s" : ""}`,
      recipients: validRecipients,
      emailPreview: {
        to: validRecipients,
        subject,
        content: emailContent,
      },
    })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
