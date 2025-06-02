'use client';

import { cn } from "@/lib/utils";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart,
  LayoutDashboard,
  LogOut,
  Menu,
  PieChart,
  Settings,
  User
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "./ui/sheet";

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/" },
  { title: "Income", icon: ArrowUpCircle, href: "/income" },
  { title: "Expenses", icon: ArrowDownCircle, href: "/expenses" },
  { title: "Categories", icon: PieChart, href: "/categories" },
  { title: "Reports", icon: BarChart, href: "/reports" },
  
];

const getPageTitle = (pathname) => {
  if (pathname === "/") return "Dashboard";
  const found = navItems.find((item) => item.href === pathname);
  return found ? found.title : "";
};

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const pageTitle = useMemo(() => getPageTitle(pathname), [pathname]);

  return (
    <header className="w-full sticky top-0 z-40 bg-gradient-to-r from-blue-50/80 via-white/90 to-blue-100/80 dark:from-zinc-900/90 dark:via-zinc-950/90 dark:to-blue-900/80 backdrop-blur-md shadow-xl border-b-0 border-t-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-3 sm:px-6 md:px-10 rounded-b-2xl relative">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 min-w-[140px]">
          <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-primary transition-transform hover:scale-105 hover:drop-shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400/60 rounded-lg">
            <span className="w-10 h-10 flex items-center justify-center mr-1 rounded-full ring-2 ring-blue-400/30 bg-white dark:bg-zinc-900 shadow-sm transition-transform group-hover:scale-110">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="8" fill="#2563eb"/>
                <path d="M10 22C10 18 16 18 16 14C16 12 14 10 12 10C10 10 8 12 8 14" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 10C22 14 16 14 16 18C16 20 18 22 20 22C22 22 24 20 24 18" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="hidden sm:inline bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 bg-clip-text text-transparent">FinTracker</span>
          </Link>
        </div>
        {/* Page Title (centered, responsive) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none select-none w-full md:w-auto">
          {pageTitle && (
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-200 text-center truncate px-2 max-w-[70vw] md:max-w-xs lg:max-w-md">
              {pageTitle}
            </span>
          )}
        </div>
        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center justify-center gap-2 lg:gap-4 flex-1">
          <ul className="flex gap-1 lg:gap-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-4 py-2 text-base font-semibold transition-all duration-200 hover:bg-blue-100/60 hover:text-blue-700 dark:hover:bg-zinc-900/60 dark:hover:text-blue-300 focus-visible:ring-2 focus-visible:ring-blue-400/40 focus:outline-none",
                    pathname === item.href && "bg-blue-100/80 text-blue-700 dark:bg-zinc-900/80 dark:text-blue-300 shadow-sm"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Right side: theme, user, mobile menu */}
        <div className="flex items-center gap-1 md:gap-3">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2 md:px-3 rounded-xl hover:bg-blue-100/60 dark:hover:bg-zinc-900/60 focus-visible:ring-2 focus-visible:ring-blue-400/40">
                <User className="h-5 w-5" />
                <span className="hidden md:inline truncate">{session?.user?.name || "My Account"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white/95 dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-xl mt-2 animate-fade-in">
              <DropdownMenuLabel className="font-semibold text-blue-700 dark:text-blue-300">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/settings")} className="rounded-lg">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut} className="rounded-lg text-red-600 hover:text-white hover:bg-red-500/80">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Mobile menu button */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="ml-1 rounded-xl hover:bg-blue-100/60 dark:hover:bg-zinc-900/60 focus-visible:ring-2 focus-visible:ring-blue-400/40">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="p-0 w-full max-w-full bg-gradient-to-r from-blue-50/80 via-white/90 to-blue-100/80 dark:from-zinc-900/90 dark:via-zinc-950/90 dark:to-blue-900/80 backdrop-blur-md border-b shadow-xl rounded-b-2xl animate-slide-down">
              <SheetHeader>
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 p-4">
                <ul className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-2 rounded-xl px-4 py-3 text-base font-semibold transition-all duration-200 hover:bg-blue-100/60 hover:text-blue-700 dark:hover:bg-zinc-900/60 dark:hover:text-blue-300 focus-visible:ring-2 focus-visible:ring-blue-400/40 focus:outline-none",
                          pathname === item.href && "bg-blue-100/80 text-blue-700 dark:bg-zinc-900/80 dark:text-blue-300 shadow-sm"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-3 mt-4 border-t pt-4">
                  <ThemeToggle />
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-2 rounded-xl hover:bg-blue-100/60 dark:hover:bg-zinc-900/60"
                    onClick={() => {
                      setMobileOpen(false);
                      router.push("/settings");
                    }}
                  >
                    <Settings className="h-5 w-5" />
                    Settings
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-2 rounded-xl text-red-600 hover:text-white hover:bg-red-500/80"
                    onClick={() => {
                      setMobileOpen(false);
                      handleSignOut();
                    }}
                  >
                    <LogOut className="h-5 w-5" />
                    Log out
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Sidebar;
