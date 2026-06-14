import { getPriorityConfig } from '../../utils/helpers'

export default function PriorityBadge({ priority }) {
  const cfg = getPriorityConfig(priority)
  return (
    <span className={`badge ${cfg.color} gap-1`}>
      {cfg.icon && <span className="text-xs">{cfg.icon}</span>}
      {cfg.label}
    </span>
  )
}
