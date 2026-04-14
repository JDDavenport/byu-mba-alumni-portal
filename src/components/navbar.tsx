"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/directory", label: "Directory" },
  { href: "#", label: "Map", disabled: true },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#002E5D] text-sm font-bold text-white">
            BY
          </div>
          <span className="hidden text-lg font-semibold text-[#002E5D] sm:inline">
            MBA Alumni
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.disabled ? "#" : link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-[#002E5D]/10 text-[#002E5D]"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                link.disabled && "pointer-events-none opacity-50"
              )}
            >
              {link.label}
              {link.disabled && (
                <span className="ml-1 text-xs text-gray-400">(soon)</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button
            className="bg-[#002E5D] hover:bg-[#002E5D]/90"
            disabled
          >
            Sign in with LinkedIn
          </Button>
        </div>

        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="md:hidden" />
            }
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="text-[#002E5D]">Menu</SheetTitle>
            <nav className="mt-6 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.disabled ? "#" : link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-[#002E5D]/10 text-[#002E5D]"
                      : "text-gray-600 hover:bg-gray-100",
                    link.disabled && "pointer-events-none opacity-50"
                  )}
                >
                  {link.label}
                  {link.disabled && (
                    <span className="ml-1 text-xs text-gray-400">(soon)</span>
                  )}
                </Link>
              ))}
              <Button
                className="mt-4 bg-[#002E5D] hover:bg-[#002E5D]/90"
                disabled
              >
                Sign in with LinkedIn
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
