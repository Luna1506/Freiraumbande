import { ReactNode } from 'react'
import { GlassCard } from '../components/ui/GlassCard'
import { useContent } from '../hooks/useContent'

interface SectionProps {
  title: string
  children: ReactNode
}

function Section({ title, children }: SectionProps) {
  return (
    <div>
      <h2 className="text-white font-semibold text-base mb-1.5">{title}</h2>
      <div className="text-white/65 text-sm leading-relaxed whitespace-pre-line">{children}</div>
    </div>
  )
}

export function Impressum() {
  const { text } = useContent()

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="font-display text-6xl font-bold text-white uppercase mb-2 text-shadow">
          Impressum
        </h1>
        <div className="w-16 h-0.5 bg-white/30 mb-12" />

        <GlassCard className="p-8 space-y-7">
          <Section title="Angaben gemäß § 5 DDG">
            {text('impressum.name')}
            {'\n'}
            {text('impressum.address')}
          </Section>

          <Section title="Vertreten durch">
            {text('impressum.representative')}
          </Section>

          <Section title="Kontakt">
            {`Telefon: ${text('impressum.phone')}\nE-Mail: ${text('impressum.email')}`}
          </Section>

          <Section title="Registereintrag">
            {text('impressum.register')}
          </Section>

          <Section title="Verantwortlich für den Inhalt gemäß § 18 Abs. 2 MStV">
            {text('impressum.responsible')}
          </Section>

          <Section title="Haftung für Inhalte">
            Die Inhalte dieser Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
            Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
          </Section>

          <Section title="Haftung für Links">
            Unser Angebot enthält gegebenenfalls Links zu externen Websites Dritter, auf deren
            Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der
            jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
          </Section>
        </GlassCard>

        <p className="text-white/30 text-xs mt-4">
          Hinweis: Die Angaben in eckigen Klammern sind Platzhalter und können im Admin-Bereich
          unter „Texte → Impressum" ausgefüllt werden.
        </p>
      </div>
    </div>
  )
}
