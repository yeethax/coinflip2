import * as  React from 'react'
import clsxm from '@/lib/clsxm';

import NextImage from '@/components/NextImage';
import SolImage from "@/assests/images/solana_icon.png"
import CrekImage from "@/assests/images/Creck_Icon_PNG.png"
import DustImage from "@/assests/images/Dust_Icon.png"
import ForgeImage from "@/assests/images/Forge_Symbol.png"
import { AppContext } from '@/context/AppContext';

interface Props {
  label: string
  value: number
  setValue: React.Dispatch<React.SetStateAction<number>>
  onChange: (e: any) => void
}

const BetInput: React.FC<Props> = ({ value, setValue, onChange, label }) => {
  const inputRef = React.useRef<any>();
  const { cryptoCurrency } = React.useContext(AppContext)

  // Foucs on the input on page load
  React.useEffect(() => {
    focusInput();
  }, []);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div className='my-3 mx-1 justify-between rounded-lg bg-[#111924] py-2 lg:mx-5'>
      <p className='ml-3 text-xs text-primary-100'>{label}</p>
      <div className='relative mx-3 grid h-10 grid-cols-12 lg:h-11'>
        <div className='col-span-1 flex items-center'>
          <NextImage
            useSkeleton
            src={cryptoCurrency === 'SOL' ? SolImage : cryptoCurrency === 'DUST' ? DustImage : cryptoCurrency === 'CREK' ? CrekImage : cryptoCurrency === "FORGE" ? ForgeImage : SolImage}
            alt='Solana Icon'
            className='w-6'
            width='26'
            height='26'
          />
        </div>
        <div className='col-span-7 flex items-center'>
          <input
            className={clsxm(
              'h-6 border-none bg-inherit text-white outline-none outline-0 focus:outline-none focus:outline-offset-0'
            )}
            ref={inputRef}
            value={value}
            onChange={onChange}
            type='number'
            autoFocus
            max={1}
            maxLength={10}
          />
        </div>
        <div className='absolute top-0 right-0 col-span-4 flex items-center'>
          <button
            className='mx-1 w-[41px] rounded-md bg-primary-700 p-2 font-extrabold text-white'
            onClick={() => {
              const newValue = value * 2;
              setValue(newValue);
            }}
          >
            2x
          </button>
          <button
            className='mx-1 w-[41px] rounded-md bg-primary-700 p-2 font-extrabold text-white'
            onClick={() => {
              const newValue = value / 2;
              setValue(newValue);
            }}
          >
            ½
          </button>
        </div>
      </div>
    </div>
  )
}

export default BetInput