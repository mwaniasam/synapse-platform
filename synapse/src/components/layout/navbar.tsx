"use client"

import type React from "react"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { AppBar, Toolbar, Typography, Button, Avatar, Menu, MenuItem, IconButton, Box, Tooltip } from "@mui/material"
import { Dashboard, Settings, ExitToApp, DarkMode, LightMode, Psychology } from "@mui/icons-material"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "@/components/providers/theme-provider"

export function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()
  const { darkMode, toggleDarkMode } = useTheme()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
    handleClose()
  }

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Psychology sx={{ mr: 1 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            Synapse
          </Link>
        </Typography>

        <Tooltip title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
          <IconButton color="inherit" onClick={toggleDarkMode}>
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Tooltip>

        {session ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button color="inherit" component={Link} href="/dashboard">
              Dashboard
            </Button>
            <Button color="inherit" component={Link} href="/sessions">
              Sessions
            </Button>

            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar
                src={session.user?.image || undefined}
                alt={session.user?.name || "User"}
                sx={{ width: 32, height: 32 }}
              >
                {session.user?.name?.[0]}
              </Avatar>
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  router.push("/dashboard")
                  handleClose()
                }}
              >
                <Dashboard sx={{ mr: 1 }} />
                Dashboard
              </MenuItem>
              <MenuItem
                onClick={() => {
                  router.push("/settings")
                  handleClose()
                }}
              >
                <Settings sx={{ mr: 1 }} />
                Settings
              </MenuItem>
              <MenuItem onClick={handleSignOut}>
                <ExitToApp sx={{ mr: 1 }} />
                Sign Out
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button color="inherit" component={Link} href="/auth/signin">
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}
