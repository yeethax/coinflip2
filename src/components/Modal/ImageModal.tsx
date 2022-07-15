import * as React from "react";
import { useRouter } from 'next/router'

import BulletPoint from '@/assests/images/greenBulletPoint.png';
import NextImage from "@/components/NextImage";
import CloseIcon from "@/assests/icons/Close";


interface Props {
  showModal: boolean
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  heading?: string | undefined
  subHeading?: string | undefined
  image?: string | undefined | any
}

export const ImageModal: React.FC<Props> = ({ showModal, setShowModal, heading, subHeading, image }: Props) => {
  const router = useRouter()

  const handleClick = (e: any) => {
    e.preventDefault()
    router.push("/")
    setShowModal(false)
  }
  return (
    showModal ? (
      <>
        <div
          className="fixed glassGiveAway top-4 lg:top-16 left-0 right-0 bottom-0 z-50 flex h-screen w-full flex-col items-center justify-center overflow-hidden"
        >
          <div className="relative w-auto mt-12 lg:mt-6 mb-20 mx-2 lg:mx-4 md:mx-auto max-w-3xl">
            <div className="border-4 bg-[#3e4c63]  border-[#ffffff42] rounded-3xl shadow-lg relative flex flex-col lg:w-full outline-none focus:outline-none">
              <div className="relative  min-w-[260px] md:min-w-[500px]">
                <div className='relative my-2 mx-3 flex items-center justify-between'>
                  <div className="flex items-center ">
                    <NextImage
                      src={BulletPoint}
                      alt='diamond bullet point'
                      className='w-3 lg:w-5'
                      width='5'
                      height='5'
                    />
                    <p className='text-sm font-extrabold text-[#4ae288] lg:text-lg'>
                      &nbsp;&nbsp;&nbsp;Active Giveaway
                    </p>
                  </div>

                  <CloseIcon className="float-right w-8 h-8 cursor-pointer" onClick={() => setShowModal(false)} />
                </div>
                <div className="grid grid-cols-12 bg-primary-700 px-4 py-4 md:p-16 lg:px-4 lg:py-6 rounded-b-3xl">
                  <div className="col-span-12 lg:col-span-5 rounded-3xl min-h-[70vw] lg:min-h-full"
                    style={{
                      backgroundImage: `url(${image})`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "top center",
                      backgroundSize: "cover"
                    }}>
                  </div>
                  <div className="col-span-12 lg:col-span-7 px-4 py-2">
                    <p className="nft-heading text-white text-[5vw] lg:text-[50px] max-w-full">{heading}</p>
                    <p className="text-[#f3f8ff] text-[3vw] lg:text-2xl mt-2 nft-subHeading">{subHeading}</p>

                    <div className="mt-2">
                      <p className="text-[#f3f8ff] text-[2.5vw] lg:text-2xl nft-subHeading tracking-tighter">1️⃣ Flip a coin</p>
                      <p className="text-[#f3f8ff] text-[2.5vw] lg:text-2xl nft-subHeading">2️⃣ Post your result + wallet</p>
                      <p className="text-[#f3f8ff] text-[2.5vw] lg:text-2xl nft-subHeading">3️⃣ Tag @JustCoinFlip</p>
                    </div>

                    {/* ======> Play Now Button <====== */}
                    <button className='w-full mt-3 text-[5vw] lg:text-[26px] text-[#1b2838] cursor-pointer black bg-[#4ae288] rounded-xl px-10 py-5 uppercase' onClick={handleClick}>Flip a coin</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="opacity-25 fixed inset-0 z-40 bg-black"></div> */}
      </>
    ) : null
  );
}