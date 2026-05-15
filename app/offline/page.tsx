export default function OfflinePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">You&apos;re offline</h1>
      <p className="text-gray-500 mb-6">
        Check your connection and try again.
      </p>
      <a
        href="/"
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        Try again
      </a>
    </main>
  );
}
