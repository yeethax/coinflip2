import * as React from 'react'
import clsxm from '@/lib/clsxm'
import useSound from 'use-sound';

import Click from "@/assests/sounds/click.mp3"

import NextImage from '@/components/NextImage';
import RandomCoinImage from '@/assests/images/randomCoin.png';
import TailCoinImage from '@/assests/images/tailsCoin.png'
import HeadCoinImage from '@/assests/images/headsCoin.png'

import RandomDuskImage from '@/assests/images/Dust_Random_Coin.png';
import TailDuskImage from '@/assests/images/Dust_Tails_Coin.png'
import HeadDuskImage from '@/assests/images/Dust_Heads_Coin.png'

import RandomCrekImage from '@/assests/images/CRECK_Random_Coin.png';
import TailCrekImage from '@/assests/images/CRECK_Tails_Coin.png'
import HeadCrekImage from '@/assests/images/CRECK_Heads_Coin.png'
import { AppContext } from '@/context/AppContext';

interface Props {
  coin: string
  setCoin: React.Dispatch<React.SetStateAction<string>>
}

const Coins: React.FC<Props> = ({ coin, setCoin }: Props) => {

  const [click, { stop: stopClick }] = useSound(Click)
  const { cryptoCurrency } = React.useContext(AppContext)
  // const [sliderValue, setSliderValue] = React.useState(50)

  // const handleSliderChange = (e: any) => {
  //   const value = e.target.value
  //   setSliderValue(value)
  // }


  // React.useEffect(() => {
  //   if (sliderValue > 0 && sliderValue <= 5) setCoin('H')
  //   if (sliderValue > 50 && sliderValue <= 55) setCoin('R')
  //   if (sliderValue > 95 && sliderValue <= 100) setCoin('T')
  // }, [setCoin, sliderValue])

  // const randomCoin = () => {
  //   const rndInt = Math.floor(Math.random() * 2) + 1;
  //   if (rndInt === 1) setCoin('H')
  //   if (rndInt === 2) setCoin('T')
  // };

  return (
    <div className='coins relative col-span-12 pt-12 sm:col-span-12 md:pb-10 lg:col-span-8 lg:rounded-br-xl lg:px-10 lg:pt-0'>
      <p className='my-6 hidden text-start text-xs font-extrabold text-primary-100 lg:inline-block'>
        Bet Mode
      </p>
      <div className='flex lg:mx-10'>
        <div
          className={clsxm(
            'm-auto select-none text-center transition ease-in-out',
            coin === 'H'
              ? 'order-2 col-span-6 lg:col-span-8'
              : 'order-1 col-span-3 pt-2 lg:pt-0 lg:col-span-2'
          )}
          onClick={() => { setCoin('H'); click() }}
        >
          {/* <HeadCoin
            className={clsxm(
              'm-auto cursor-pointer select-none',
              coin === 'H'
                ? 'h-[30vw] w-[30vw] lg:h-[300px] lg:w-[300px]'
                : 'h-[15vw] w-[15vw] lg:h-[100px] lg:w-[100px]'
            )}
          /> */}

          <NextImage
            useSkeleton
            src={cryptoCurrency === 'sol' ? HeadCoinImage : cryptoCurrency === 'dust' ? HeadDuskImage : cryptoCurrency === 'crek' ? HeadCrekImage : HeadCoinImage}
            alt='Heads coin'
            className={clsxm(
              'm-auto cursor-pointer select-none',
              coin === 'H'
                ? 'h-[30vw] w-[30vw] lg:h-[300px] lg:w-[300px]'
                : 'h-[15vw] w-[15vw] lg:h-[100px] lg:w-[100px]'
            )}
            width='100'
            height='100'
            priority
          />

          <button
            className={clsxm(
              'm-auto select-none px-6 text-xs font-extrabold lg:block lg:rounded-full lg:py-2',
              coin === 'H'
                ? 'hidden text-white lg:bg-primary-200'
                : 'mt-2 text-primary-100 lg:bg-[#566073]'
            )}
          >
            Heads
          </button>
        </div>

        <div
          className={clsxm(
            'order-2 m-auto select-none text-center transition ease-in-out',
            coin === 'H'
              ? 'order-1 col-span-3 pt-2 lg:pt-0 lg:col-span-2'
              : coin === 'T'
                ? 'order-3 col-span-3 pt-2 lg:pt-0 lg:col-span-2'
                : 'order-2 col-span-6 lg:col-span-8'
          )}
          onClick={() => { setCoin('R'); click() }}
        >
          {/* <RandomCoin
            className={clsxm(
              'm-auto cursor-pointer select-none',
              coin === 'R'
                ? 'h-[30vw] w-[30vw] lg:h-[300px] lg:w-[300px]'
                : 'h-[20vw] w-[20vw] lg:h-[120px] lg:w-[120px]'
            )}
          /> */}

          <NextImage
            useSkeleton
            src={cryptoCurrency === 'sol' ? RandomCoinImage : cryptoCurrency === 'dust' ? RandomDuskImage : cryptoCurrency === 'crek' ? RandomCrekImage : RandomCoinImage}
            alt='Random coin'
            className={clsxm(
              'm-auto cursor-pointer select-none',
              coin === 'R'
                ? 'h-[30vw] w-[30vw] lg:h-[300px] lg:w-[300px]'
                : 'h-[15vw] w-[15vw] lg:h-[100px] lg:w-[100px]'
            )}
            width='100'
            height='100'
            priority
          />

          <button
            className={clsxm(
              'm-auto select-none px-6 text-xs font-extrabold lg:block lg:rounded-full lg:py-2',
              coin === 'R'
                ? 'hidden text-white lg:block lg:bg-primary-200'
                : 'mt-2 text-primary-100 lg:bg-[#566073]'
            )}
          >
            Random
          </button>
        </div>

        <div
          className={clsxm(
            'm-auto select-none text-center transition ease-in-out',
            coin === 'T'
              ? 'order-2 col-span-6 lg:col-span-8'
              : 'order-3 col-span-3 pt-2 lg:pt-0 lg:col-span-2'
          )}
          onClick={() => { setCoin('T'); click() }}
        >
          {/* <TailCoin
            className={clsxm(
              'm-auto cursor-pointer select-none',
              coin === 'T'
                ? 'h-[30vw] w-[30vw] lg:h-[300px] lg:w-[300px]'
                : 'h-[15vw] w-[15vw] lg:h-[100px] lg:w-[100px]'
            )}
          /> */}

          <NextImage
            useSkeleton
            src={cryptoCurrency === 'sol' ? TailCoinImage : cryptoCurrency === 'dust' ? TailDuskImage : cryptoCurrency === 'crek' ? TailCrekImage : TailCoinImage}
            alt='Tails coin'
            className={clsxm(
              'm-auto cursor-pointer select-none',
              coin === 'T'
                ? 'h-[30vw] w-[30vw] lg:h-[300px] lg:w-[300px]'
                : 'h-[15vw] w-[15vw] lg:h-[100px] lg:w-[100px]'
            )}
            width='100'
            height='100'
            priority
          />


          <button
            className={clsxm(
              'm-auto select-none px-6 lg:py-2 text-xs font-extrabold lg:block lg:rounded-full',
              coin === 'T'
                ? 'hidden text-white lg:bg-primary-200'
                : 'mt-2 text-primary-100 lg:bg-[#566073]'
            )}
          >
            Tails
          </button>
        </div>
      </div>

      {/* <div className='pt-[2vw] px-[5vw]'>
        <input type="range" min="1" max="100" value={sliderValue} onChange={(e) => handleSliderChange(e)} className="slider" id="myRange" />
      </div> */}

    </div>
  )
}

export default Coins