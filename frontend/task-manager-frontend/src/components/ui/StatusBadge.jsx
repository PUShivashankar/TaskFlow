import { getStatusConfig } from '../../utils/helpers'

export default function StatusBadge({ status }) {
  const cfg = getStatusConfig(status)
  return (
    <span className={`badge ${cfg.color} gap-1.5`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}
