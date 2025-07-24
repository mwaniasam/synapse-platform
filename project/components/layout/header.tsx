"use client"

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
import { Brain, Settings, LogOut, User } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <span className="font-bold text-2xl gradient-text">
              Synapse
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between">
          <nav className="flex items-center space-x-8 text-sm font-medium">
            {session && (
              <>
                <Link
                  href="/dashboard"
                  className="transition-colors hover:text-primary text-foreground/80 px-3 py-2 rounded-lg hover:bg-primary/10"
                >
                  Dashboard
                </Link>
                <Link
                  href="/app/resources"
                  className="transition-colors hover:text-primary text-foreground/80 px-3 py-2 rounded-lg hover:bg-primary/10"
                >
                  Resources
                </Link>
                <Link
                  href="/cognitive"
                  className="transition-colors hover:text-primary text-foreground/80 px-3 py-2 rounded-lg hover:bg-primary/10"
                >
                  Cognitive Test
                </Link>
                <Link
                  href="/app/pomodoro"
                  className="transition-colors hover:text-primary text-foreground/80 px-3 py-2 rounded-lg hover:bg-primary/10"
                >
                  Pomodoro
                </Link>
                <Link
                  href="/app/knowledge-map"
                  className="transition-colors hover:text-primary text-foreground/80 px-3 py-2 rounded-lg hover:bg-primary/10"
                >
                  Knowledge Map
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-6">
            <ThemeToggle />
            
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:scale-105 transition-transform duration-200">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" alt={session.user?.name || ""} />
                      <AvatarFallback>
                        {session.user?.name?.charAt(0) || session.user?.email?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
                  <div className="flex items-center justify-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex flex-col space-y-1 leading-none">
                      {session.user?.name && <p className="font-semibold">{session.user.name}</p>}
                      {session.user?.email && (
                        <p className="w-[180px] truncate text-sm text-muted-foreground">
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
              <div className="flex items-center space-x-4">
                <Button variant="ghost" className="rounded-xl hover:scale-105 transition-all duration-200" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button className="rounded-xl hover:scale-105 transition-all duration-200" asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}