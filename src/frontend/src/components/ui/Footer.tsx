import { Link } from 'react-router-dom'
import { useContent } from '../../hooks/useContent'

export function Footer() {
  const { text } = useContent()
  const year = new Date().getFullYear()

  return (
    <footer className="glass-nav border-t border-white/15 mt-8">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Club */}
          <div>
            <p className="font-display text-lg font-bold text-white tracking-widest uppercase mb-2">
              Freiraumbande
            </p>
            <p className="text-white/55 text-sm leading-relaxed">{text('footer.tagline')}</p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-white/80 text-sm font-semibold uppercase tracking-wider mb-3">
              Seiten
            </p>
            <nav className="flex flex-col gap-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/ueber-uns', label: 'Über uns' },
                { to: '/kalender', label: 'Kalender' },
                { to: '/kontakt', label: 'Kontakt' },
              ].map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-white/55 text-sm hover:text-white transition-colors w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Kontakt / Rechtliches */}
          <div>
            <p className="text-white/80 text-sm font-semibold uppercase tracking-wider mb-3">
              Kontakt
            </p>
            <p className="text-white/55 text-sm leading-relaxed whitespace-pre-line mb-2">
              {text('contact.address')}
            </p>
            <a
              href={`mailto:${text('contact.email')}`}
              className="text-white/55 text-sm hover:text-white transition-colors"
            >
              {text('contact.email')}
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs">
            © {year} Freiraumbande. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-5">
            <Link
              to="/impressum"
              className="text-white/40 text-xs hover:text-white transition-colors"
            >
              Impressum
            </Link>
            <Link
              to="/admin"
              className="text-white/25 text-xs hover:text-white/60 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
