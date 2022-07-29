import * as React from 'react'
import clsxm from '@/lib/clsxm'
import NextImage from '@/components/NextImage'
import Image from 'next/image'
import moment from 'moment'

interface Props {
  image: any
  username: string
  message: string
  time: string
  user?: boolean
}

const Message: React.FC<Props> = ({ image, username, message, time, user }: Props) => {
  // const utcDate = new Date().toUTCString();
  const formatTime = moment(time).fromNow();
  return (
    <div className='grid grid-cols-12 py-2'>
      <div className={clsxm('col-span-1 min-h-[30px]', user ? "order-2" : "order-1")}>
        <Image
          src={image}
          alt='Avatar'
          className='rounded-full border-2 border-white'
          width={45}
          height={45}
        />
      </div>
      <div className={clsxm('col-span-11 px-4 py-2 border-[#ffffff1c] border rounded-b-2xl', user ? "order-1 mr-4 bg-[#2088ff] rounded-tr-md rounded-tl-2xl" : "order-2 ml-4 rounded-tl-md rounded-tr-2xl bg-gradient-to-t from-[#1d1a31] to-[#242e3e00]")}>
        {!user && <p style={{ fontFamily: "Montserrat" }} className='text-[white] text-[14px] font-bold tracking-wide break-words'>{username}</p>}
        <p style={{ fontFamily: "Montserrat" }} className={clsxm('text-sm font-extrabold tracking-wide break-words opacity-[0.84]', user ? "text-white" : "text-[#8191ad]")}>{message}</p>
        <p style={{ fontFamily: "Montserrat Simple" }} className={clsxm('text-[10px] font-bold tracking-wide opacity-[0.66] float-right', user ? "text-white" : "text-[#707f99]")}>{formatTime}</p>
      </div>
    </div>
  )
}

export default Message