"use client";

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
  DropdownMenuTrigger
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

function getPageTitle(pathname) {
  if (pathname === "/") return "Dashboard";
  const found = navItems.find((item) => item.href === pathname);
  return found ? found.title : "";
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pageTitle = useMemo(() => getPageTitle(pathname), [pathname]);

  async function handleSignOut() {
    await signOut({ redirect: false });
    router.push("/login");
  }

  return (
    <header className="w-full sticky top-0 z-40 bg-white dark:bg-zinc-900 border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14 px-4">
        {/* Logo */}
        <Link href="/" className="font-bold text-lg text-blue-600 dark:text-blue-300">
          FinTracker
        </Link>

        {/* Page Title */}
        <span className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-200">
          {pageTitle}
        </span>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1 px-2">
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">{session?.user?.name || "Account"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="w-4 h-4 mr-2" /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.title}
                  </Link>
                ))}
                <div className="pt-4 border-t mt-4 flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setMobileOpen(false);
                      router.push("/settings");
                    }}
                  >
                    <Settings className="w-4 h-4 mr-2" /> Settings
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-red-600"
                    onClick={() => {
                      setMobileOpen(false);
                      handleSignOut();
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Log out
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop nav */}
      <nav className="hidden md:flex justify-center border-t bg-white dark:bg-zinc-900 py-2">
        <ul className="flex gap-4">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center gap-2 text-sm px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
              >
                <item.icon className="w-4 h-4" />
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
