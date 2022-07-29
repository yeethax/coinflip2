import * as  React from 'react'

interface Props {
  title: string
}

const BulletHeading: React.FC<Props> = ({ title }: Props) => {
  return (
    <p className='flex w-max items-center justify-between rounded-full bg-primary-700 py-2 px-5 text-center font-extrabold text-white'>
      {title}
      <span className='dot ml-3'></span>
    </p>
  )
}

export default BulletHeading