export default function AnalysisPanel({ analysis, onClose }) {
  return (
    <div className="min-h-screen bg-gray-50 p-4 max-w-lg mx-auto">
      <div className="pt-4 mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">🤖 Analyse Claude</h1>
        <p className="text-sm text-gray-500">Basée sur ta séance du jour</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 min-h-[200px]">
        {analysis === '' ? (
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Claude analyse ta séance...</span>
          </div>
        ) : (
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{analysis}</p>
        )}
      </div>

      {analysis && (
        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white rounded-2xl py-4 font-bold text-base"
        >
          Retour au dashboard
        </button>
      )}
    </div>
  )
}
