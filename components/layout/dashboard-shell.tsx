'use client'

import { Sidebar } from './sidebar'
import { Header } from './header'
import { demoUsers } from '@/lib/demo-data'

interface DashboardShellProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function DashboardShell({ children, title, subtitle }: DashboardShellProps) {
  const currentUser = demoUsers[0] // Demo: using first doctor

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        user={{
          name: currentUser.name,
          role: currentUser.role,
          specialty: currentUser.specialty,
        }}
      />
      <div className="ml-[260px]">
        <Header title={title} subtitle={subtitle} />
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}
