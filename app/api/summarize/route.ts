import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { transcript, customPrompt } = await request.json()

    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json({ error: "Transcript is required" }, { status: 400 })
    }

    // Default prompt if none provided
    const defaultPrompt =
      "Summarize this meeting transcript in a clear, structured format with key points, decisions made, and action items."
    const prompt = customPrompt && customPrompt.trim() ? customPrompt : defaultPrompt

    // Generate summary using Groq
    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      system: `You are an expert meeting summarizer. Your task is to analyze meeting transcripts and create clear, actionable summaries. Always structure your response in a professional format that's easy to read and understand.`,
      prompt: `${prompt}

Meeting Transcript:
${transcript}

Please provide a comprehensive summary based on the instructions above.`,
    })

    return NextResponse.json({ summary: text })
  } catch (error) {
    console.error("Error generating summary:", error)
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 })
  }
}
