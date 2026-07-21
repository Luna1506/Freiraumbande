import { Member } from '../../types'
import { GlassCard } from '../ui/GlassCard'
import { GlassButton } from '../ui/GlassButton'

interface MemberGridProps {
  members: Member[]
  isAdmin?: boolean
  onEdit?: (member: Member) => void
  onDelete?: (id: number) => void
}

/** Mitglieder-Kacheln: Foto, Name und optionale Rolle — mit Admin-Aktionen. */
export function MemberGrid({ members, isAdmin, onEdit, onDelete }: MemberGridProps) {
  if (members.length === 0) {
    return (
      <GlassCard className="p-6 text-white/50 text-center">
        Noch keine Mitglieder eingetragen.
      </GlassCard>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {members.map(member => (
        <GlassCard key={member.id} className="p-5 text-center">
          {member.imageUrl ? (
            <img
              src={member.imageUrl}
              alt={member.name}
              className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover mx-auto mb-3 border border-white/25"
            />
          ) : (
            <div
              aria-hidden="true"
              className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/10 border border-white/25 mx-auto mb-3 flex items-center justify-center text-white/60 text-4xl font-display font-bold"
            >
              {member.name.trim().charAt(0).toUpperCase()}
            </div>
          )}
          <h3 className="text-white font-semibold leading-snug">{member.name}</h3>
          {member.role && (
            <p className="text-white/55 text-sm mt-1 leading-snug">{member.role}</p>
          )}
          {isAdmin && (
            <div className="flex justify-center gap-2 mt-3">
              <GlassButton className="text-xs px-3 py-1.5" onClick={() => onEdit?.(member)}>
                Bearbeiten
              </GlassButton>
              <GlassButton
                variant="danger"
                className="text-xs px-3 py-1.5"
                onClick={() => onDelete?.(member.id)}
              >
                Löschen
              </GlassButton>
            </div>
          )}
        </GlassCard>
      ))}
    </div>
  )
}
