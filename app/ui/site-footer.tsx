export default function SiteFooter() {
  return (
    <footer className="mt-6 w-full max-w-3xl border-t border-gray-200 px-2 py-6 pb-28 md:pb-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-gray-600">
          Have any questions or need help?{" "}
          <a
            href="mailto:john@johnbovard.dev"
            className="block sm:inline font-medium text-gray-700 hover:text-gray-900 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2"
          >
            Feel free to send me an email.
          </a>
        </p>
        <p className="mt-2 text-xs text-gray-600">© 2026 John Bovard</p>
      </div>
    </footer>
  );
}
