"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Edit3, Save, Undo2, Copy, FileText, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { EmailShareDialog } from "@/components/email-share-dialog"

interface SummaryDisplayProps {
  summary: string
  onStartOver: () => void
  transcript: string
  customPrompt: string
}

export function SummaryDisplay({ summary, onStartOver, transcript, customPrompt }: SummaryDisplayProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedSummary, setEditedSummary] = useState(summary)
  const [originalSummary, setOriginalSummary] = useState(summary)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const { toast } = useToast()

  // Calculate word count
  useEffect(() => {
    const words = editedSummary
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0)
    setWordCount(words.length)
  }, [editedSummary])

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(editedSummary !== originalSummary)
  }, [editedSummary, originalSummary])

  const handleStartEdit = () => {
    setIsEditing(true)
    setOriginalSummary(editedSummary)
  }

  const handleSave = () => {
    setIsEditing(false)
    setOriginalSummary(editedSummary)
    setHasUnsavedChanges(false)
    setLastSaved(new Date())
    toast({
      title: "Summary saved",
      description: "Your changes have been saved successfully.",
    })
  }

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (window.confirm("You have unsaved changes. Are you sure you want to cancel?")) {
        setEditedSummary(originalSummary)
        setIsEditing(false)
        setHasUnsavedChanges(false)
      }
    } else {
      setIsEditing(false)
    }
  }

  const handleUndo = () => {
    setEditedSummary(originalSummary)
    setHasUnsavedChanges(false)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedSummary)
      toast({
        title: "Copied to clipboard",
        description: "Summary has been copied to your clipboard.",
      })
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header with Back Button and Stats */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onStartOver}
          className="flex items-center gap-2 bg-transparent transition-all duration-200 hover:scale-105"
        >
          <ArrowLeft className="h-4 w-4" />
          Start Over
        </Button>
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>{transcript.length} chars</span>
          </div>
          {lastSaved && (
            <div className="flex items-center gap-1 animate-in fade-in duration-300">
              <Clock className="h-4 w-4" />
              <span>Saved {lastSaved.toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Custom Prompt Display */}
      {customPrompt && (
        <Card className="bg-blue-50 border-blue-200 animate-in fade-in slide-in-from-top-2 duration-500">
          <CardContent className="pt-4">
            <div className="text-sm">
              <span className="font-medium text-blue-900">Custom Instructions: </span>
              <span className="text-blue-700">{customPrompt}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Editor */}
      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Meeting Summary
              {hasUnsavedChanges && (
                <span className="text-orange-500 text-sm font-normal animate-pulse">(Unsaved changes)</span>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              {/* Word Count */}
              <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">{wordCount} words</span>

              {/* Action Buttons */}
              {isEditing ? (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleUndo}
                    size="sm"
                    disabled={!hasUnsavedChanges}
                    className="transition-all duration-200 hover:scale-105 bg-transparent"
                  >
                    <Undo2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    size="sm"
                    className="transition-all duration-200 hover:scale-105 bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 transition-all duration-200 hover:scale-105"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCopy}
                    size="sm"
                    className="transition-all duration-200 hover:scale-105 bg-transparent"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleStartEdit}
                    size="sm"
                    className="transition-all duration-200 hover:scale-105 bg-transparent"
                  >
                    <Edit3 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="border rounded-lg p-4 bg-slate-50 transition-all duration-200 focus-within:bg-white focus-within:shadow-sm">
                <Textarea
                  value={editedSummary}
                  onChange={(e) => setEditedSummary(e.target.value)}
                  className="min-h-[400px] resize-none border-0 bg-transparent p-0 focus-visible:ring-0 text-sm leading-relaxed"
                  placeholder="Edit your summary here..."
                />
              </div>

              {/* Editing Tips */}
              <div className="text-xs text-slate-500 bg-slate-100 p-3 rounded-lg border-l-4 border-blue-400">
                <strong>Editing Tips:</strong> Use clear headings, bullet points for action items, and bold text for key
                decisions. Press Ctrl+Z to undo changes.
              </div>
            </div>
          ) : (
            <div className="prose prose-slate max-w-none">
              <div className="bg-white border rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-700 m-0">
                  {editedSummary}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {!isEditing && (
        <div className="flex justify-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
          <EmailShareDialog summary={editedSummary} transcript={transcript} customPrompt={customPrompt} />
        </div>
      )}
    </div>
  )
}
