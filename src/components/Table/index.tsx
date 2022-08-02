import React from 'react'
import clsxm from '@/lib/clsxm';
import Clipboard from '@/assests/icons/Clipboard';
import NextImage from '@/components/NextImage';
import SolImage from "@/assests/images/solana_icon.png"
import CrekImage from "@/assests/images/Creck_Icon_PNG.png"
import DustImage from "@/assests/images/Dust_Icon.png"
import moment from 'moment';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import TableSkeleton from '@/components/Table/TableSkeleton';
import { AppContext } from '@/context/AppContext';

interface Props {
  data: Player[]
  wallet?: boolean
}

type Account = {
  amount: number | string | any;
  choice: string;
  gambler: number | string;
  initialized: boolean;
  odds: number;
  outcome: string;
  partner: string;
  settled: boolean;
  timestamp: number | string | any;
};

type Player = {
  publicKey: number | string | any;
  account: Account;
  date?: number | string | any;
};

const Table: React.FC<Props> = ({ data, wallet }: Props) => {
  const { cryptoCurrency } = React.useContext(AppContext)
  return (
    <div className='col-span-12 mb-40 mt-5'>
      <div className='lgpx-4 relative overflow-x-auto rounded-lg bg-primary-700 py-3 px-2 shadow-md lg:py-5'>
        <table className='w-full text-left text-sm text-primary-100'>
          <thead className='bg-inherit text-sm font-extrabold capitalize text-primary-100'>
            <tr>
              <th scope='col' className='px-6 py-3'>
                Player
              </th>
              <th scope='col' className='px-6 py-3'>
                Multiplier
              </th>
              <th scope='col' className='px-6 py-3 lg:table-cell'>
                Mode
              </th>
              <th scope='col' className='px-6 py-3 lg:table-cell'>
                Time
              </th>
              <th
                scope='col'
                className='md:py-3 pl-12 md:pl-6 pr-12 md:pr-5 text-end lg:pr-20'
              >
                Payout
              </th>
            </tr>
          </thead>
          {!data ? <TableSkeleton />
            :
            (<tbody>
              {data?.map((player: Player, i: number) => {
                const betAmountFromApi = player?.account.amount.toString();
                const multiplier = player?.account.odds === 40 ? 2.5 : player?.account.odds === 50 ? 2 : player?.account.odds === 60 ? 1.66 : 1;
                const winAmount = parseInt(betAmountFromApi.toString()) * multiplier / LAMPORTS_PER_SOL;
                var amount = winAmount;
                const lossAmount = parseInt(betAmountFromApi.toString()) / LAMPORTS_PER_SOL;
                // const amount = parseInt(formattedAmount)
                const gamblerId = player?.account.gambler.toString().substring(0, 4);
                const mode = player?.account.choice;
                const time = player?.account.timestamp.toString();
                const theDate = new Date(time * 1000);
                const dateString = theDate.toUTCString();
                const formatTime = moment(dateString).fromNow();

                return (
                  <tr
                    key={i}
                    className='odd:bg-primary-800 even:bg-primary-700'
                  >
                    <th
                      scope='row'
                      className='whitespace-nowrap px-2 py-4 font-medium text-primary-100 lg:px-6'
                    >
                      <div className='flex'>
                        <Clipboard className='text-primary-100' />
                        &nbsp;
                        <span className='font-extrabold uppercase'>
                          {gamblerId}
                        </span>
                      </div>
                    </th>
                    <td className='px-2 py-4 text-center font-extrabold lg:px-6 lg:text-start'>
                      <p className='text-xs md:text-sm'>
                        {multiplier}X
                      </p>
                    </td>
                    <td className='px-2 py-4 lg:table-cell lg:px-6'>
                      <p
                        className={clsxm(
                          'w-24 rounded-full px-3 py-1 text-center font-extrabold capitalize text-white',
                          mode?.includes('R') && 'bg-primary-200',
                          mode?.includes('H') && 'bg-[#51B97C]',
                          mode?.includes('T') && 'bg-[#594ff5]'
                        )}
                      >
                        {mode === 'H' ? 'Heads' : mode === 'T' ? 'Tails' : 'Random'}
                      </p>
                    </td>
                    <td className='min-w-[150px] px-2 py-4 font-extrabold lg:table-cell lg:px-6'>
                      {formatTime}
                    </td>
                    <td className='px-2 py-4 lg:px-6'>
                      <div
                        className={clsxm(
                          'flex min-w-[75px] items-center justify-end lg:mr-12',
                          player.account.choice === player.account.outcome && amount * multiplier !== 0 &&
                          'font-extrabold text-primary-50'
                        )}
                      >
                        <span className='text-[3vw] md:text-xs lg:text-sm'>
                          {player.account.choice === player.account.outcome ? "+" : '-'} {
                            player.account.choice === player.account.outcome ? winAmount.toString().slice(0, winAmount.toString().indexOf('.') + 5) :
                              lossAmount.toString().slice(0, lossAmount.toString().indexOf('.') + 5)} <span className='uppercase'>{cryptoCurrency}</span>
                        </span>
                        &nbsp;&nbsp;
                        <NextImage
                          useSkeleton
                          src={cryptoCurrency === 'sol' ? SolImage : cryptoCurrency === 'dust' ? DustImage : cryptoCurrency === 'crek' ? CrekImage : SolImage}
                          alt='Solana Icon'
                          className='w-6'
                          width='26'
                          height='26'
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            )}
        </table>
      </div>
    </div>
  )
}

export default Table