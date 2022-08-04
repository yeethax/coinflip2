import * as  React from 'react'
import clsxm from '@/lib/clsxm'
import NextImage from '@/components/NextImage'
import SolanaIcon from '@/assests/images/solana_icon.png';
import coinImage1 from "@/assests/images/group21@3x.png"
import coinImage2 from "@/assests/images/group22@3x.png"
import coinImage3 from "@/assests/images/group23@3x.png"
import moment from 'moment';

interface Props {
  id: number
  name: string
  time?: string
  payout: number
}

const LeaderBoard: React.FC<Props> = ({ id, name, time, payout }) => {
  const formatTime = moment(time).fromNow();

  return (
    <li className={clsxm('grid grid-cols-12 border-4 rounded-lg mb-4', id === 0 ? "border-[#ecb000]" : "border-[#6e7c95]")}>
      <div className='col-span-5 lg:col-span-4 flex items-center justify-start px-1 md:px-4 bg-[#19202c]'>
        <div>
          <NextImage
            src={id === 0 ? coinImage1 : id === 1 ? coinImage2 : coinImage3}
            alt='animation'
            className='w-[10vw] lg:w-28 select-none'
            width='14'
            height='14'
          />
        </div>
        <div className='flex flex-col justify-center'>
          <p style={{ fontFamily: "Montserrat Bold" }} className='text-white opacity-[0.81] capitalize text-[3vw] md:text-2xl'>{name}</p>
          <p className='flex items-center h-2 md:h-auto text-white opacity-[0.81] text-[1.5vw] lg:text-sm'>{formatTime}</p>
        </div>
      </div>
      <div className='col-span-7 lg:col-span-8 flex justify-between items-center px-5'>
        <div className='uppercase text-[2vw] md:text-xl flex items-center opacity-[0.81] text-white'>
          Payout
          <NextImage
            useSkeleton
            src={SolanaIcon}
            alt='Solana Icon'
            className='w-3 md:w-5 mx-3'
            width='14'
            height='14'
          />
        </div>
        <p className={clsxm('text-[3vw] md:text-4xl', id === 0 ? "text-[#ecb000]" : id === 1 ? 'text-[#c1cccf]' : "text-[#c77402]")}>{payout}&nbsp;SOL</p>
      </div>
    </li >
  )
}

export default LeaderBoard