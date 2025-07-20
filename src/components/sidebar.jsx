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
  return found ? found.title : "Page";
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pageTitle = useMemo(() => getPageTitle(pathname), [pathname]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const NavLink = ({ href, icon: Icon, title }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        onClick={() => setMobileOpen(false)}
        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
          isActive
            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 font-medium"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
        }`}
      >
        <Icon className="w-4 h-4" />
        {title}
      </Link>
    );
  };

  return (
    <header className="w-full sticky top-0 z-40 bg-white dark:bg-zinc-900 border-b shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14 px-4">
        {/* Logo */}
        <Link href="/" className="font-bold text-lg text-blue-600 dark:text-blue-300">
          FinTracker
        </Link>

        {/* Page Title */}
        <span className="text-sm sm:text-base font-semibold text-gray-800 dark:text-white">
          {pageTitle}
        </span>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Account Menu */}
          <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" className="flex items-center gap-1 px-2">
      <User className="h-5 w-5" />
      <span className="hidden sm:inline">{session?.user?.name || "Account"}</span>
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent
    align="end"
    className="bg-white border border-gray-200 rounded-xl shadow-lg w-48 p-2"
  >
    <DropdownMenuLabel className="text-xs text-gray-500 px-2 pb-1">
      My Account
    </DropdownMenuLabel>
    <DropdownMenuSeparator className="my-1" />

    <DropdownMenuItem
      onClick={() => router.push("/settings")}
      className="text-sm text-gray-700 hover:bg-gray-100 rounded-md px-2 py-2 cursor-pointer"
    >
      <Settings className="w-4 h-4 mr-2 text-gray-500" />
      Settings
    </DropdownMenuItem>

    <DropdownMenuItem
      onClick={handleSignOut}
      className="text-sm text-red-600 hover:bg-red-50 rounded-md px-2 py-2 cursor-pointer"
    >
      <LogOut className="w-4 h-4 mr-2 text-red-500" />
      Log out
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

  <SheetContent side="right" className="bg-white text-right p-6 w-[80vw] max-w-sm">
    <SheetHeader className="mb-4">
      <SheetTitle className="text-right text-lg font-semibold">Menu</SheetTitle>
    </SheetHeader>

    <nav className="flex flex-col gap-3 items-end">
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          icon={item.icon}
          title={item.title}
          className="flex items-center gap-2 hover:text-blue-600 transition-all"
        />
      ))}

      <div className="pt-4 border-t mt-4 w-full flex flex-col gap-3 items-end">
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-right"
          onClick={() => {
            setMobileOpen(false);
            router.push("/settings");
          }}
        >
          <Settings className="w-4 h-4" /> Settings
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-red-600"
          onClick={() => {
            setMobileOpen(false);
            handleSignOut();
          }}
        >
          <LogOut className="w-4 h-4" /> Log Out
        </Button>
      </div>
    </nav>
  </SheetContent>
</Sheet>

        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex justify-center border-t bg-white dark:bg-zinc-900 py-2">
        <ul className="flex gap-4">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavLink href={item.href} icon={item.icon} title={item.title} />
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
