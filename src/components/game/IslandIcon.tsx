import React from 'react'

interface IslandIconProps {
  type: 'normal' | 'boss' | 'hidden' | 'treasure'
  size?: number
  className?: string
}

const ICON_IDS = {
  normal: '#island-icon-normal',
  boss: '#island-icon-boss',
  hidden: '#island-icon-hidden',
  treasure: '#island-icon-treasure',
} as const

export const IslandIcon: React.FC<IslandIconProps> = ({ type, size = 24, className }) => {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <use href={ICON_IDS[type]} />
    </svg>
  )
}