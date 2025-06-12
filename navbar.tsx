"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Activity, Home, LogIn, Menu, BookOpen, Bell, Stethoscope } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const NavLinks = () => (
    <>
      <Link
        href="/"
        className={`flex items-center transition-colors hover:text-foreground/80 ${
          pathname === "/" ? "text-foreground" : "text-foreground/60"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <Home className="mr-2 h-4 w-4" />
        Home
      </Link>
      <Link
        href="/analysis"
        className={`flex items-center transition-colors hover:text-foreground/80 ${
          pathname === "/analysis" ? "text-foreground" : "text-foreground/60"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <Activity className="mr-2 h-4 w-4" />
        Real Time Analysis
      </Link>
      <Link
        href="/alerts"
        className={`flex items-center transition-colors hover:text-foreground/80 ${
          pathname === "/alerts" ? "text-foreground" : "text-foreground/60"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <Bell className="mr-2 h-4 w-4" />
        Generate Alerts
      </Link>
      <Link
        href="/diseases"
        className={`flex items-center transition-colors hover:text-foreground/80 ${
          pathname === "/diseases" ? "text-foreground" : "text-foreground/60"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <Stethoscope className="mr-2 h-4 w-4" />
        Diseases & Symptoms
      </Link>
      <Link
        href="/blog"
        className={`flex items-center transition-colors hover:text-foreground/80 ${
          pathname === "/blog" ? "text-foreground" : "text-foreground/60"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <BookOpen className="mr-2 h-4 w-4" />
        Health Blog
      </Link>
    </>
  )

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        {/* Logo */}
        <Link className="flex items-center space-x-2 mr-6" href="/">
          <Activity className="h-6 w-6" />
          <span className="font-bold text-lg">Disease Tracker</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium flex-1">
          <NavLinks />
        </nav>

        {/* Desktop Login Button */}
        <div className="hidden md:flex items-center">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden ml-auto">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-6">
                <NavLinks />
                <div className="pt-4 border-t">
                  <Button asChild className="w-full">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
