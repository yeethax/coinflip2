import * as React from "react";
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use';

import Winner from '../../assests/images/Coin_Winner_Icon.png';
import Lose from '../../assests/images/GG_Coin.png';
import NextImage from "@/components/NextImage";


interface Props {
  showModal: boolean
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  winner?: boolean
  text: string
  InfoText?: string
}

export const Modal: React.FC<Props> = ({ showModal, setShowModal, winner, text, InfoText }: Props) => {
  const { width, height } = useWindowSize();


  const handleModalClose = () => {
    setShowModal(false)
  }

  return (
    showModal ? (
      <>
        {winner && <Confetti numberOfPieces={300} opacity={0.8} width={width - 10} height={height} />}
        <div
          className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          onClick={handleModalClose}
        >
          <div className="relative w-auto my-6 mx-4 md:mx-auto max-w-3xl">
            <div className="border-8 border-[#ffffff42] rounded-[44px] shadow-lg relative flex flex-col w-full bg-primary-700 outline-none focus:outline-none">
              <div className="relative px-10 py-6 min-w-[260px] lg:min-w-[600px]">
                <div>
                  <NextImage
                    useSkeleton
                    src={winner ? Winner : Lose}
                    alt='result coin'
                    className='absolute w-[250px] -top-1.5 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
                    width='14'
                    height='14'
                  />
                </div>
                <p className="black uppercase mt-10 text-center font-extrabold text-[30px] text-white my-4 leading-relaxed">
                  {winner ? 'Winner!' : 'GG!'}
                </p>
                <p className="text-center max-w-xs md:max-w-2xl md:px-14 opacity-95 font-bold text-[20px] text-white my-4 leading-relaxed">
                  {text}
                </p>
                {InfoText &&
                  <p className="text-center max-w-xs md:max-w-2xl md:px-14 opacity-95 text-[15px] text-white my-4 leading-relaxed">
                    {InfoText}
                  </p>
                }
              </div>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </>
    ) : null
  );
}