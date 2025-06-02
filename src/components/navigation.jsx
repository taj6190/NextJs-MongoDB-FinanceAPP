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
    // Don't show navigation on auth pages
    if (pathname === "/login" || pathname === "/register") {
      return children;
    }

    // Show loading state while checking authentication
    if (status === "loading") {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    // Show error state if authentication fails
    if (status === "error") {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Authentication Error</h2>
            <p className="text-gray-600 mb-4">There was a problem authenticating your session.</p>
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Return to Login
            </button>
          </div>
        </div>
      );
    }

    // Show main layout with navigation
    return (
      <>
        <Sidebar />
        <main className="min-h-screen bg-background px-2 sm:px-4 md:px-8 pt-6 pb-10 max-w-7xl mx-auto w-full">
          <div className="w-full h-full rounded-xl bg-white dark:bg-zinc-900 shadow-md border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 md:p-8">
            {children}
          </div>
        </main>
      </>
    );
  };

  return renderContent();
};

export default Navigation;
