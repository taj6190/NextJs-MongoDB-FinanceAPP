"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "./sidebar";

const Navigation = ({ children }) => {
  const { status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated" && pathname !== "/login" && pathname !== "/register") {
      router.push("/login");
    }
  }, [status, router, pathname]);

  // Render content based on status and pathname
  const renderContent = () => {
    if (pathname === "/login" || pathname === "/register") {
      return children;
    }

    if (status === "loading") {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
        </div>
      );
    }

    if (status === "error") {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
          <div className="text-center bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-700">
            <h2 className="text-lg font-semibold text-red-600 mb-2">Authentication Error</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              There was a problem authenticating your session.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 text-sm"
            >
              Return to Login
            </button>
          </div>
        </div>
      );
    }

    return (
      <>
        <Sidebar />
        <main className="min-h-screen bg-gray-50 dark:bg-zinc-900 px-4 pt-8 pb-10 w-full">
          <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm p-6">
            {children}
          </div>
        </main>
      </>
    );
  };

  return renderContent();
};

export default Navigation;
