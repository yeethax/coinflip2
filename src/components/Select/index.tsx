/* This example requires Tailwind CSS v2.0+ */
import * as React from 'react'
import { Listbox, Transition } from '@headlessui/react'
import ArrowDownIcon from '@/assests/icons/ArrowDown'
import TickIcon from '@/assests/icons/Tick'
import clsx from 'clsx'
import NextImage from '@/components/NextImage'
import SolImage from "@/assests/images/solana_icon.png"
import CrekImage from "@/assests/images/Creck_Icon_PNG.png"
import DustImage from "@/assests/images/Dust_Icon.png"
import ForgeImage from "@/assests/images/Forge_Symbol.png"
import { AppContext } from '@/context/AppContext'

const cryptos = [
  {
    id: 1,
    name: 'SOL',
    avatar: SolImage,
  },
  {
    id: 2,
    name: 'DUST',
    avatar: DustImage,
  },
  {
    id: 3,
    name: 'CREK',
    avatar: CrekImage,
  },
  {
    id: 3,
    name: 'FORGE',
    avatar: ForgeImage,
  },
]

export default function Select() {
  const [selected, setSelected] = React.useState({
    id: 1,
    name: 'SOL',
    avatar: SolImage,
  })

  const { setCryptoCurrency } = React.useContext(AppContext)

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium text-gray-700"></Listbox.Label>
          <div className="mt-1 relative">
            <Listbox.Button className="relative w-full bg-[#111924] h-12 rounded-full shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer outline-none focus:outline-none sm:text-sm">
              <span className="flex items-center">
                <NextImage
                  useSkeleton
                  src={selected?.avatar}
                  alt={selected?.name}
                  className='w-8 select-none'
                  width='100'
                  height='100'
                  priority
                />
                <span className="ml-3 block text-[#4ae288] truncate uppercase">${selected?.name}</span>
              </span>
              <span className="m-3 absolute inset-y-0 right-0 flex items-center pointer-events-none">
                <span className='bg-[#4ae288] rounded-full p-2'>
                  <ArrowDownIcon className="h-5 w-5" color='black' />
                </span>
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={React.Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-[#111924] shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {cryptos.map((person) => (
                  <Listbox.Option
                    key={person?.id}
                    className={({ active }) =>
                      clsx(
                        active ? 'text-white hover:bg-gray-700' : 'text-white',
                        'cursor-default select-none relative py-2 pl-3 pr-9 mx-2 border-[#3e4e67] border-b-2 last:border-b-0'
                      )
                    }
                    value={person}
                    onClick={() => setCryptoCurrency(person.name)}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <NextImage width='100' height='100' priority useSkeleton src={person?.avatar} alt={person?.name} className="w-8 select-none" imgClassName='rounded-full' />
                          <span
                            className={clsx(selected ? 'font-semibold' : 'font-normal', 'ml-3 block uppercase truncate')}
                          >
                            ${person?.name}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={clsx(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <TickIcon className="h-5 w-5" color='#4ae288' />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}
