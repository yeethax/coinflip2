import clsx from 'clsx'
import React from 'react'

interface Props {
  width?: string
}

const ProgressBar: React.FC<Props> = ({ width }: Props) => {
  return (
    <div className={clsx('custom-linear-bg-100 h-2 absolute bottom-0 left-0', width === "100%" ? 'rounded-b-lg' : 'rounded-bl-lg')} style={{ width: `${width}` }}></div >
  )
}

export default ProgressBar