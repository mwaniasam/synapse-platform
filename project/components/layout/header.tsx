"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Brain, Settings, LogOut, User, Menu, X, Home, BookOpen, Timer, Map, Activity } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function Header() {
  const { data: session } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/app/resources", label: "Resources", icon: BookOpen },
    { href: "/cognitive", label: "Cognitive Test", icon: Activity },
    { href: "/app/pomodoro", label: "Pomodoro", icon: Timer },
    { href: "/app/knowledge-map", label: "Knowledge Map", icon: Map },
  ]

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 md:h-20 items-center px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
              <Brain className="h-4 w-4 md:h-6 md:w-6 text-primary" />
            </div>
            <span className="font-bold text-lg md:text-2xl gradient-text">
              Synapse
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 ml-8">
          {session && navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-primary text-foreground/80 px-3 py-2 rounded-lg hover:bg-primary/10 text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side - Desktop */}
        <div className="flex items-center space-x-2 md:space-x-4 ml-auto">
          <ThemeToggle />
          
          {/* Mobile Menu Button */}
          {session && (
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden p-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[300px]">
                <div className="flex flex-col h-full">
                  {/* Mobile Menu Header */}
                  <div className="flex items-center justify-between py-4 border-b">
                    <Link href="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
                      <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                        <Brain className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-bold text-lg gradient-text">Synapse</span>
                    </Link>
                  </div>

                  {/* Mobile Navigation Links */}
                  <nav className="flex-1 py-6">
                    <div className="space-y-2">
                      {navigationLinks.map((link) => {
                        const Icon = link.icon
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={closeMobileMenu}
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-foreground/80 hover:text-primary hover:bg-primary/10 transition-colors"
                          >
                            <Icon className="h-5 w-5" />
                            <span className="font-medium">{link.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </nav>

                  {/* Mobile User Menu */}
                  {session && (
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex items-center space-x-3 px-4 py-3 bg-muted/50 rounded-lg">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="" alt={session.user?.name || ""} />
                          <AvatarFallback className="text-xs">
                            {session.user?.name?.charAt(0) || session.user?.email?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          {session.user?.name && (
                            <p className="font-medium text-sm truncate">{session.user.name}</p>
                          )}
                          {session.user?.email && (
                            <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                          )}
                        </div>
                      </div>
                      
                      <Link
                        href="/profile"
                        onClick={closeMobileMenu}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg text-foreground/80 hover:text-primary hover:bg-primary/10 transition-colors"
                      >
                        <User className="h-5 w-5" />
                        <span className="font-medium">Profile</span>
                      </Link>
                      
                      <Link
                        href="/settings"
                        onClick={closeMobileMenu}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg text-foreground/80 hover:text-primary hover:bg-primary/10 transition-colors"
                      >
                        <Settings className="h-5 w-5" />
                        <span className="font-medium">Settings</span>
                      </Link>
                      
                      <button
                        onClick={() => {
                          closeMobileMenu()
                          signOut()
                        }}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors w-full text-left"
                      >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Log out</span>
                      </button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          )}

          {/* Desktop User Menu */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 md:h-10 md:w-10 rounded-full hover:scale-105 transition-transform duration-200">
                  <Avatar className="h-8 w-8 md:h-10 md:w-10">
                    <AvatarImage src="" alt={session.user?.name || ""} />
                    <AvatarFallback className="text-xs md:text-sm">
                      {session.user?.name?.charAt(0) || session.user?.email?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 md:w-64 p-2" align="end" forceMount>
                <div className="flex items-center justify-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex flex-col space-y-1 leading-none">
                    {session.user?.name && <p className="font-semibold text-sm">{session.user.name}</p>}
                    {session.user?.email && (
                      <p className="w-[140px] md:w-[180px] truncate text-xs text-muted-foreground">
                        {session.user.email}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer p-3 rounded-lg">
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer p-3 rounded-lg">
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer p-3 rounded-lg text-red-600 focus:text-red-600"
                  onSelect={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2 md:space-x-4">
              <Button variant="ghost" size="sm" className="rounded-xl hover:scale-105 transition-all duration-200 text-xs md:text-sm px-3 md:px-4" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button size="sm" className="rounded-xl hover:scale-105 transition-all duration-200 text-xs md:text-sm px-3 md:px-4" asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}