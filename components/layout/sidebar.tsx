'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Mic,
  FileText,
  Users,
  Pill,
  Settings,
  LogOut,
  ChevronRight,
  Activity,
  X,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/voice-recording', label: 'Voice Recording', icon: Mic },
  { href: '/reports', label: 'AI Reports', icon: FileText },
  { href: '/patients', label: 'Patients', icon: Users },
  { href: '/prescriptions', label: 'Prescriptions', icon: Pill },
]

interface SidebarProps {
  user?: {
    name: string
    role: string
    specialty?: string
  }
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ user, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          'fixed left-0 top-0 z-50 h-screen w-[280px] glass-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out lg:translate-x-0 lg:z-40',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between border-b border-sidebar-border px-5 py-4 lg:px-6 lg:py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary/20">
                <Activity className="h-5 w-5 text-sidebar-primary" />
              </div>
              <div>
                <h1 className="text-base font-semibold text-sidebar-foreground tracking-tight">MedVoice AI</h1>
                <p className="text-xs text-sidebar-muted">Medical Documentation</p>
              </div>
            </div>
            {/* Mobile Close Button */}
            <button 
              onClick={onClose}
              className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg hover:bg-sidebar-accent/50 text-sidebar-muted"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            <p className="px-3 mb-2 text-[10px] font-medium uppercase tracking-widest text-sidebar-muted">
              Main Menu
            </p>
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-foreground'
                      : 'text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  )}
                >
                  <item.icon className={cn(
                    'h-[18px] w-[18px] transition-colors',
                    isActive ? 'text-sidebar-primary' : 'text-sidebar-muted group-hover:text-sidebar-foreground'
                  )} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && (
                    <ChevronRight className="h-4 w-4 text-sidebar-muted" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User Profile */}
          {user && (
            <div className="border-t border-sidebar-border p-4">
              <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent/50 px-3 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-primary/20 ring-2 ring-sidebar-primary/10 flex-shrink-0">
                  <span className="text-xs font-semibold text-sidebar-primary">
                    {user.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 overflow-hidden min-w-0">
                  <p className="truncate text-sm font-medium text-sidebar-foreground">{user.name}</p>
                  <p className="truncate text-xs text-sidebar-muted">
                    {user.specialty || user.role}
                  </p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-1.5 rounded-lg bg-sidebar-accent/30 px-3 py-2 text-xs font-medium text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors">
                  <Settings className="h-3.5 w-3.5" />
                  Settings
                </button>
                <Link
                  href="/"
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-sidebar-accent/30 px-3 py-2 text-xs font-medium text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </Link>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
