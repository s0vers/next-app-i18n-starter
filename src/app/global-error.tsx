"use client";

// Rendered only when the root layout itself fails (for example the locale
// layout throws). It replaces the whole page, so it must define its own
// <html> and <body>. It sits outside the next-intl provider, so it cannot use
// translated messages. Errors inside a page use src/app/[locale]/error.tsx.
export default function GlobalError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center font-sans">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p>An unexpected error occurred. Try again, or reload the page.</p>
        <button
          type="button"
          onClick={() => retry()}
          className="min-h-11 rounded-md border px-4"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
