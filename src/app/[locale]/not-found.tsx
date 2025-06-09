import Link from "next/link";

export default function NotFound() {
  return (
    <html>
      <body className="flex items-center justify-center h-screen bg-slate-500/20">
        <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md">
          <div className="flex flex-col items-center justify-center mb-6">
            <svg
              className="w-16 h-16 text-yellow-500 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h1 className="text-3xl font-bold text-gray-800">
              Oops! Something went wrong.
            </h1>
          </div>
          <p className="text-gray-600 text-lg mb-8 text-center">
            We&apos;re sorry, but we couldn&apos;t find the page you were
            looking for. Please check the URL or go back to the homepage.
          </p>
          <div className="flex justify-center">
            <Link
              href="/"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-full transition duration-200 ease-in-out hover:scale-105"
            >
              Go Back Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
