'use client'

import { Bell, Search, Command, Menu } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface HeaderProps {
  title: string
  subtitle?: string
  onMenuClick?: () => void
}

export function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border/60 bg-background/80 backdrop-blur-xl px-4 py-3 sm:px-6 lg:px-8 lg:py-4">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-white/50 hover:bg-white transition-colors"
        >
          <Menu className="h-5 w-5 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">{title}</h1>
          {subtitle && <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 hidden sm:block">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search - Hidden on small screens */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
          <Input
            type="search"
            placeholder="Search patients, reports..."
            className="w-48 lg:w-72 rounded-lg border-border/60 bg-muted/30 pl-9 pr-12 text-sm placeholder:text-muted-foreground/50 focus:bg-white"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-border/60 bg-muted/50 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </div>

        {/* Mobile Search Button */}
        <button className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-white/50 hover:bg-white transition-colors">
          <Search className="h-4 w-4 text-muted-foreground" />
        </button>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-white/50 hover:bg-white transition-colors">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <Badge 
            variant="destructive" 
            className="absolute -right-1 -top-1 h-4 w-4 rounded-full p-0 text-[10px] flex items-center justify-center"
          >
            3
          </Badge>
        </button>
      </div>
    </header>
  )
}
