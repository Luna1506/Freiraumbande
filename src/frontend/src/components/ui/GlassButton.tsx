import { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'default' | 'danger' | 'success'

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
}

// Tint liegt auf ::after, damit er ÜBER der Frosted-Glass-Ebene
// (::before, siehe index.css) sichtbar bleibt
const variantClasses: Record<Variant, string> = {
  default: 'after:bg-white/15 hover:after:bg-white/25 border-white/25 text-white',
  danger:  'after:bg-red-500/20 hover:after:bg-red-500/35 border-red-400/30 text-red-200',
  success: 'after:bg-emerald-500/20 hover:after:bg-emerald-500/35 border-emerald-400/30 text-emerald-200',
}

export function GlassButton({ children, variant = 'default', className = '', ...props }: GlassButtonProps) {
  return (
    <button
      className={`
        frost-btn
        inline-flex items-center justify-center gap-2
        border rounded-xl px-4 py-2
        text-sm font-medium transition-colors duration-200
        after:transition-colors after:duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
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
