import { UploadInterface } from "@/components/upload-interface"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              AI-Powered Meeting Intelligence
            </div>
            <h1 className="text-5xl font-bold text-slate-900 mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              AI Meeting Summarizer
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Transform your meeting transcripts into structured, actionable summaries with AI-powered intelligence.
              Upload, customize, edit, and share with ease.
            </p>
          </div>

          {/* Main Upload Interface */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            <UploadInterface />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-slate-600">
                <span className="font-semibold">AI Meeting Summarizer</span> - Powered by advanced AI technology
              </div>
              <div className="flex items-center gap-6 text-sm text-slate-500">
                <span>Secure & Private</span>
                <span>•</span>
                <span>Fast Processing</span>
                <span>•</span>
                <span>Easy Sharing</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
