'use client';

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-blue-50/80 via-white/90 to-blue-100/80 dark:from-zinc-900/90 dark:via-zinc-950/90 dark:to-blue-900/80 backdrop-blur-md shadow-xl border-t-0 border-b-0 py-6 mt-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center text-sm text-gray-600 dark:text-blue-200 font-medium">
          <span className="text-xs text-gray-400 dark:text-gray-500">&copy; {new Date().getFullYear()} Expense Tracker. All rights reserved.</span>
        </div>
        <div className="flex flex-col items-end text-xs text-gray-400 dark:text-gray-500">
          <span>Created by <a href="https://www.linkedin.com/in/sulvytaj/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 dark:hover:text-blue-300 font-semibold">MD. Syedy Sulvy Taj</a></span>
        </div>
      </div>
    </footer>
  );
}