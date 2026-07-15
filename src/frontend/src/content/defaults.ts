/**
 * Zentrale Definition aller über das Admin-Panel editierbaren Inhalte.
 * Der Default-Wert greift, solange im Backend nichts überschrieben wurde —
 * die Website funktioniert damit auch ohne gepflegte Inhalte.
 */

export interface ContentField {
  key: string
  label: string
  type: 'text' | 'textarea'
  default: string
  hint?: string
}

export interface ContentSection {
  id: string
  title: string
  fields: ContentField[]
}

export const BACKGROUND_KEY = 'design.backgroundImage'

export const CONTENT_SECTIONS: ContentSection[] = [
  {
    id: 'home',
    title: 'Startseite',
    fields: [
      { key: 'home.kicker', label: 'Überschrift klein (Kicker)', type: 'text', default: 'Kicker Club' },
      { key: 'home.title', label: 'Haupttitel', type: 'text', default: 'Freiraumbande' },
      {
        key: 'home.subtitle', label: 'Untertitel', type: 'textarea',
        default: 'Leidenschaft, Gemeinschaft, Tore. Dein Tischfußball-Club für alle, die Spaß am Spiel haben.',
      },
      { key: 'home.eventsTitle', label: 'Überschrift Termin-Vorschau', type: 'text', default: 'Nächste Termine' },
      { key: 'home.feature1.title', label: 'Kachel 1 – Titel', type: 'text', default: 'Turniere' },
      { key: 'home.feature1.text', label: 'Kachel 1 – Text', type: 'textarea', default: 'Regelmäßige Wettkämpfe für alle Spielstärken.' },
      { key: 'home.feature2.title', label: 'Kachel 2 – Titel', type: 'text', default: 'Leonhardt-Tische' },
      { key: 'home.feature2.text', label: 'Kachel 2 – Text', type: 'textarea', default: 'Wir spielen auf hochwertigen Leonhardt-Kickern.' },
      { key: 'home.feature3.title', label: 'Kachel 3 – Titel', type: 'text', default: 'Community' },
      { key: 'home.feature3.text', label: 'Kachel 3 – Text', type: 'textarea', default: 'Über 10 aktive Mitglieder – jeder ist willkommen.' },
    ],
  },
  {
    id: 'about',
    title: 'Über uns',
    fields: [
      {
        key: 'about.who1', label: '„Wer wir sind" – Absatz 1', type: 'textarea',
        default: 'Wir sind die Freiraumbande – ein leidenschaftlicher Tischfußball-Club. Unsere Mission ist es, den Kickersport in der Stadt zu fördern und eine offene, freundschaftliche Gemeinschaft zu schaffen, in der jeder willkommen ist.',
      },
      {
        key: 'about.who2', label: '„Wer wir sind" – Absatz 2', type: 'textarea',
        default: 'Wir treffen uns regelmäßig, spielen gemeinsam und veranstalten Turniere. Bei uns zählt der Spaß am Spiel – egal ob Anfänger oder erfahrener Profi.',
      },
      {
        key: 'about.history1', label: '„Unsere Geschichte" – Absatz 1', type: 'textarea',
        default: 'Hier steht bald die Geschichte der Freiraumbande: Wie alles angefangen hat, wer die Gründungsmitglieder waren und was uns bis heute antreibt.',
      },
      {
        key: 'about.history2', label: '„Unsere Geschichte" – Absatz 2', type: 'textarea',
        default: 'Von den ersten Trainingsabenden bis zu unseren Turnieren – dieser Text lässt sich jederzeit im Admin-Bereich anpassen.',
      },
      { key: 'about.value1.title', label: 'Wert 1 – Titel', type: 'text', default: 'Gemeinschaft' },
      { key: 'about.value1.text', label: 'Wert 1 – Text', type: 'text', default: 'Zusammen spielen, zusammen lachen.' },
      { key: 'about.value2.title', label: 'Wert 2 – Titel', type: 'text', default: 'Fairplay' },
      { key: 'about.value2.text', label: 'Wert 2 – Text', type: 'text', default: 'Respekt und Sportsgeist über alles.' },
      { key: 'about.value3.title', label: 'Wert 3 – Titel', type: 'text', default: 'Leidenschaft' },
      { key: 'about.value3.text', label: 'Wert 3 – Text', type: 'text', default: 'Kicker ist mehr als ein Spiel.' },
    ],
  },
  {
    id: 'contact',
    title: 'Kontakt',
    fields: [
      {
        key: 'contact.address', label: 'Adresse', type: 'textarea',
        default: 'Jahnstraße 3a\n17033 Neubrandenburg',
        hint: 'Zeilenumbrüche werden übernommen.',
      },
      { key: 'contact.email', label: 'E-Mail-Adresse', type: 'text', default: 'info@freiraumbande.de' },
      {
        key: 'contact.hours', label: 'Trainings- und Spielzeiten', type: 'textarea',
        default: 'Dienstag|18:00 – 20:00\nMittwoch|18:00 – 20:00\nDonnerstag|18:00 – 20:00',
        hint: 'Eine Zeile pro Termin, Format: Tag|Uhrzeit',
      },
      { key: 'contact.instagram', label: 'Instagram-Name', type: 'text', default: '@freiraumbande' },
      { key: 'contact.instagramUrl', label: 'Instagram-Link', type: 'text', default: '' },
      { key: 'contact.facebook', label: 'Facebook-Name', type: 'text', default: 'Freiraumbande' },
      { key: 'contact.facebookUrl', label: 'Facebook-Link', type: 'text', default: '' },
    ],
  },
  {
    id: 'footer',
    title: 'Footer',
    fields: [
      {
        key: 'footer.tagline', label: 'Kurzbeschreibung', type: 'text',
        default: 'Dein Tischfußball-Club in Neubrandenburg.',
      },
    ],
  },
  {
    id: 'impressum',
    title: 'Impressum',
    fields: [
      { key: 'impressum.name', label: 'Name / Verein', type: 'text', default: '[Vereinsname bzw. Betreiber]' },
      {
        key: 'impressum.address', label: 'Anschrift', type: 'textarea',
        default: '[Straße und Hausnummer]\n[PLZ und Ort]',
      },
      { key: 'impressum.representative', label: 'Vertreten durch', type: 'text', default: '[Vorname Nachname]' },
      { key: 'impressum.phone', label: 'Telefon', type: 'text', default: '[Telefonnummer]' },
      { key: 'impressum.email', label: 'E-Mail', type: 'text', default: '[E-Mail-Adresse]' },
      {
        key: 'impressum.register', label: 'Registereintrag (optional)', type: 'textarea',
        default: '[Registergericht]\n[Registernummer]',
      },
      {
        key: 'impressum.responsible', label: 'Inhaltlich verantwortlich (V. i. S. d. P.)', type: 'textarea',
        default: '[Vorname Nachname]\n[Anschrift wie oben]',
      },
    ],
  },
]

export const DEFAULT_CONTENT: Record<string, string> = Object.fromEntries(
  CONTENT_SECTIONS.flatMap(section => section.fields.map(field => [field.key, field.default]))
)
