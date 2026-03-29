import { motion } from 'framer-motion'

interface ProgressBarProps {
  percent: number
  className?: string
}

export function ProgressBar({ percent, className = '' }: ProgressBarProps) {
  return (
    <div className={`progress-track ${className}`}>
      <motion.div
        className="progress-fill"
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{
          type: 'spring',
          stiffness: 90,
          damping: 18,
          mass: 0.8,
        }}
      />
    </div>
  )
}
