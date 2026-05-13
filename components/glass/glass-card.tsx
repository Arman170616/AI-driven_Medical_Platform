import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'strong' | 'solid'
  hover?: boolean
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'default', hover = false, children, ...props }, ref) => {
    const variants = {
      default: 'bg-white/80 backdrop-blur-2xl border-black/[0.06] shadow-xl shadow-black/[0.04]',
      subtle: 'bg-white/60 backdrop-blur-xl border-black/[0.04] shadow-lg shadow-black/[0.02]',
      strong: 'bg-white/90 backdrop-blur-3xl border-black/[0.08] shadow-2xl shadow-black/[0.06]',
      solid: 'bg-white border-black/[0.06] shadow-xl shadow-black/[0.04]',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl border transition-all duration-300',
          variants[variant],
          hover && 'hover:shadow-2xl hover:shadow-black/[0.08] hover:border-black/[0.08] hover:-translate-y-0.5',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
GlassCard.displayName = 'GlassCard'

export { GlassCard }
