'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GlassCard } from '@/components/glass/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Stethoscope,
  Mic,
  FileText,
  Brain,
  Shield,
  ArrowRight,
  Mail,
  Lock,
  ShieldCheck,
  Syringe,
  ClipboardList,
  Activity,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/types/medical'

const roles: { id: UserRole; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'doctor', label: 'Doctor', icon: Stethoscope, description: 'Full clinical access' },
  { id: 'admin', label: 'Admin', icon: ShieldCheck, description: 'System management' },
  { id: 'nurse', label: 'Nurse', icon: Syringe, description: 'Patient care' },
  { id: 'receptionist', label: 'Receptionist', icon: ClipboardList, description: 'Front desk' },
]

const features = [
  {
    icon: Mic,
    title: 'Voice-to-Text',
    description: 'Real-time transcription with medical vocabulary optimization',
  },
  {
    icon: Brain,
    title: 'AI Processing',
    description: 'Automatic SOAP notes generation and ICD-10 coding',
  },
  {
    icon: FileText,
    title: 'Smart Reports',
    description: 'Structured medical reports with approval workflow',
  },
  {
    icon: Shield,
    title: 'HIPAA Ready',
    description: 'Enterprise-grade security and audit compliance',
  },
]

const stats = [
  { value: '99.2%', label: 'Accuracy' },
  { value: '< 2s', label: 'Response' },
  { value: '50k+', label: 'Reports' },
]

export default function LoginPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<UserRole>('doctor')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen gradient-mesh-login flex">
      {/* Left Panel - Branding & Features */}
      <div className="hidden lg:flex lg:w-[55%] flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-125 h-125 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-100 h-100 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground tracking-tight">MedVoice AI</h1>
              <p className="text-xs text-muted-foreground">Medical Documentation Platform</p>
            </div>
          </div>

          {/* Hero Content */}
          <div className="max-w-xl">
            <h2 className="text-4xl font-semibold text-foreground mb-4 leading-[1.15] tracking-tight text-balance">
              Transform clinical documentation with AI-powered voice recognition
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Reduce documentation time by 70% while maintaining accuracy. Our platform converts voice recordings into structured medical reports instantly.
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-semibold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="relative z-10 grid grid-cols-2 gap-4 mt-auto">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group flex items-start gap-3 rounded-xl bg-white/40 backdrop-blur-sm border border-black/4 p-4 transition-all hover:bg-white/60"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground">{feature.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 lg:p-12">
        <GlassCard className="w-full max-w-105 p-8" variant="strong">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">MedVoice AI</h1>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-foreground tracking-tight">Welcome back</h2>
            <p className="text-sm text-muted-foreground mt-1">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Role Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Select Role</Label>
              <div className="grid grid-cols-4 gap-2">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 rounded-xl p-3 text-xs transition-all duration-200 border',
                      selectedRole === role.id
                        ? 'bg-primary/10 border-primary/30 text-primary ring-1 ring-primary/20'
                        : 'bg-white/40 border-black/4 text-muted-foreground hover:bg-white/60 hover:text-foreground'
                    )}
                  >
                    <role.icon className="h-4 w-4" />
                    <span className="font-medium">{role.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@medclinic.com"
                  defaultValue="sarah.johnson@medclinic.com"
                  className="h-11 rounded-xl border-black/8 bg-white/50 pl-10 text-sm focus:bg-white"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  defaultValue="demo123"
                  className="h-11 rounded-xl border-black/8 bg-white/50 pl-10 text-sm focus:bg-white"
                />
              </div>
            </div>

            {/* Demo Notice */}
            <div className="flex items-center gap-2 rounded-lg bg-accent/10 border border-accent/20 px-3 py-2.5">
              <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
              <p className="text-xs text-accent">
                Demo Mode: Click sign in to explore with sample data
              </p>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign in to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            Protected by enterprise-grade security
          </p>
        </GlassCard>
      </div>
    </div>
  )
}
