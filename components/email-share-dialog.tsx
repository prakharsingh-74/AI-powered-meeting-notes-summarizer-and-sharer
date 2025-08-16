"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Send, Plus, X, Loader2, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EmailShareDialogProps {
  summary: string
  transcript: string
  customPrompt?: string
}

export function EmailShareDialog({ summary, transcript, customPrompt }: EmailShareDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [recipients, setRecipients] = useState<string[]>([""])
  const [subject, setSubject] = useState("Meeting Summary")
  const [message, setMessage] = useState("Please find the meeting summary below:")
  const [isSending, setIsSending] = useState(false)
  const [emailPreview, setEmailPreview] = useState<string | null>(null)
  const { toast } = useToast()

  const addRecipient = () => {
    setRecipients([...recipients, ""])
  }

  const removeRecipient = (index: number) => {
    if (recipients.length > 1) {
      setRecipients(recipients.filter((_, i) => i !== index))
    }
  }

  const updateRecipient = (index: number, value: string) => {
    const newRecipients = [...recipients]
    newRecipients[index] = value
    setRecipients(newRecipients)
  }

  const handleSend = async () => {
    const validRecipients = recipients.filter((email) => email.trim() && email.includes("@"))

    if (validRecipients.length === 0) {
      toast({
        title: "Invalid recipients",
        description: "Please enter at least one valid email address.",
        variant: "destructive",
      })
      return
    }

    if (!subject.trim()) {
      toast({
        title: "Subject required",
        description: "Please enter an email subject.",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipients: validRecipients,
          subject: subject.trim(),
          message: message.trim(),
          summary,
          customPrompt,
          transcriptLength: transcript.length,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send email")
      }

      if (data.demo && data.emailPreview) {
        setEmailPreview(data.emailPreview.content)
        toast({
          title: "Demo Mode - Email Preview Generated",
          description: data.message,
        })
      } else {
        toast({
          title: "Email sent successfully",
          description: `Summary shared with ${validRecipients.length} recipient${validRecipients.length > 1 ? "s" : ""}.`,
        })
        setIsOpen(false)
        setRecipients([""])
        setSubject("Meeting Summary")
        setMessage("Please find the meeting summary below:")
      }
    } catch (error) {
      toast({
        title: "Failed to send email",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 transition-all duration-200 hover:scale-105 hover:shadow-lg">
          <Mail className="h-4 w-4" />
          Share via Email
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] animate-in fade-in zoom-in-95 duration-300">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Share Meeting Summary
          </DialogTitle>
        </DialogHeader>


        {emailPreview ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email Preview</Label>
              <div className="bg-slate-50 border rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">{emailPreview}</pre>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEmailPreview(null)
                  setIsOpen(false)
                  setRecipients([""])
                  setSubject("Meeting Summary")
                  setMessage("Please find the meeting summary below:")
                }}
                className="transition-all duration-200 hover:scale-105"
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Recipients</Label>
              {recipients.map((recipient, index) => (
                <div key={index} className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={recipient}
                    onChange={(e) => updateRecipient(index, e.target.value)}
                    className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-green-500"
                  />
                  {recipients.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeRecipient(index)}
                      className="px-2 transition-all duration-200 hover:scale-105"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addRecipient}
                className="flex items-center gap-1 bg-transparent transition-all duration-200 hover:scale-105"
              >
                <Plus className="h-4 w-4" />
                Add Recipient
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject"
                className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Optional message to include with the summary"
                className="min-h-[100px] resize-none transition-all duration-200 focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="space-y-2">
              <Label>Summary Preview</Label>
              <div className="bg-slate-50 border rounded-lg p-3 max-h-32 overflow-y-auto transition-all duration-200 hover:bg-slate-100">
                <p className="text-sm text-slate-600 line-clamp-4">{summary.substring(0, 200)}...</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSending}
                className="transition-all duration-200 hover:scale-105"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSend}
                disabled={isSending}
                className="bg-green-600 hover:bg-green-700 transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Preview...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Generate Email Preview
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
