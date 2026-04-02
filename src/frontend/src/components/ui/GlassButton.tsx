import { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'default' | 'danger' | 'success'

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
}

const variantClasses: Record<Variant, string> = {
  default: 'bg-white/15 hover:bg-white/25 border-white/25 text-white',
  danger:  'bg-red-500/20 hover:bg-red-500/35 border-red-400/30 text-red-200',
  success: 'bg-emerald-500/20 hover:bg-emerald-500/35 border-emerald-400/30 text-emerald-200',
}

export function GlassButton({ children, variant = 'default', className = '', ...props }: GlassButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        backdrop-blur-sm border rounded-xl px-4 py-2
        text-sm font-medium transition-all duration-200
        hover:scale-[1.02] active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        cursor-pointer
        ${variantClasses[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
