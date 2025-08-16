"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, FileText, Sparkles, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { SummaryDisplay } from "@/components/summary-display"
import { useToast } from "@/hooks/use-toast"

export function UploadInterface() {
  const [transcript, setTranscript] = useState("")
  const [customPrompt, setCustomPrompt] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [summary, setSummary] = useState("")
  const [error, setError] = useState("")
  const [isDragOver, setIsDragOver] = useState(false)
  const { toast } = useToast()

  const handleFileUpload = useCallback(
    (file: File) => {
      if (file && file.type === "text/plain") {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          setTranscript(content)
          toast({
            title: "File uploaded successfully",
            description: `Loaded ${content.length} characters from ${file.name}`,
          })
        }
        reader.onerror = () => {
          toast({
            title: "Upload failed",
            description: "Failed to read the file. Please try again.",
            variant: "destructive",
          })
        }
        reader.readAsText(file)
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a .txt file only.",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const files = Array.from(e.dataTransfer.files)
      const textFile = files.find((file) => file.type === "text/plain")

      if (textFile) {
        handleFileUpload(textFile)
      } else {
        toast({
          title: "Invalid file type",
          description: "Please drop a .txt file only.",
          variant: "destructive",
        })
      }
    },
    [handleFileUpload, toast],
  )

  const handleGenerateSummary = async () => {
    if (!transcript.trim()) return

    setIsProcessing(true)
    setError("")
    setSummary("")

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcript: transcript.trim(),
          customPrompt: customPrompt.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate summary")
      }

      setSummary(data.summary)
      toast({
        title: "Summary generated successfully",
        description: "Your meeting summary is ready for review and editing.",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)
      toast({
        title: "Generation failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setTranscript("")
    setCustomPrompt("")
    setSummary("")
    setError("")
  }

  if (summary) {
    return (
      <SummaryDisplay summary={summary} onStartOver={handleReset} transcript={transcript} customPrompt={customPrompt} />
    )
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50 animate-in fade-in slide-in-from-top-2 duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Section */}
      <Card
        className={`border-2 border-dashed transition-all duration-300 ${
          isDragOver ? "border-blue-400 bg-blue-50 scale-[1.02]" : "border-slate-300 hover:border-blue-400"
        }`}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-600" />
            Upload Meeting Transcript
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className="flex items-center justify-center w-full"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <label
              htmlFor="file-upload"
              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ${
                isDragOver ? "border-blue-400 bg-blue-100" : "border-slate-300 bg-slate-50 hover:bg-slate-100"
              }`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileText
                  className={`w-8 h-8 mb-4 transition-colors ${isDragOver ? "text-blue-600" : "text-slate-500"}`}
                />
                <p className="mb-2 text-sm text-slate-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-500">TXT files only</p>
              </div>
              <input
                id="file-upload"
                type="file"
                accept=".txt"
                className="hidden"
                onChange={handleFileInputChange}
                aria-label="Upload transcript file"
              />
            </label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transcript">Or paste your transcript directly:</Label>
            <Textarea
              id="transcript"
              placeholder="Paste your meeting transcript here..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="min-h-[200px] resize-none transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              aria-describedby="transcript-help"
            />
            <p id="transcript-help" className="text-xs text-slate-500">
              Supports meeting notes, call transcripts, and other text content
            </p>
          </div>

          {transcript && (
            <div className="flex items-center gap-2 text-sm text-slate-500 animate-in fade-in slide-in-from-left-2 duration-300">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>{transcript.length} characters loaded</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Prompt Section */}
      <Card className="transition-all duration-300 hover:shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Custom Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="custom-prompt">How would you like the summary formatted?</Label>
              <Textarea
                id="custom-prompt"
                placeholder="e.g., 'Summarize in bullet points for executives' or 'Highlight only action items and deadlines'"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="min-h-[100px] resize-none transition-all duration-200 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Quick Prompt Templates */}
            <div className="space-y-2">
              <Label>Quick Templates:</Label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Summarize in bullet points for executives",
                  "Highlight action items and deadlines",
                  "Extract key decisions made",
                  "Focus on next steps and responsibilities",
                ].map((template) => (
                  <Button
                    key={template}
                    variant="outline"
                    size="sm"
                    onClick={() => setCustomPrompt(template)}
                    className="text-xs transition-all duration-200 hover:scale-105 hover:bg-purple-50 hover:border-purple-300"
                  >
                    {template}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleGenerateSummary}
          disabled={!transcript.trim() || isProcessing}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Summary...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Summary
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
