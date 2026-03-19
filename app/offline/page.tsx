export default function OfflinePage() {
  return (
    <div className="h-dvh flex flex-col items-center justify-center bg-white px-8 text-center">
      <svg className="w-16 h-16 text-gray-300 mb-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0" />
        <circle cx="12" cy="18" r="0.75" fill="currentColor" />
      </svg>
      <h1 className="text-xl font-semibold text-gray-900 mb-2">You&apos;re offline</h1>
      <p className="text-sm text-gray-500 max-w-xs">
        Connect to the internet to translate. Your conversation history is saved locally and will be here when you&apos;re back.
      </p>
    </div>
  );
}
