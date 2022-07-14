//@ts-nocheck
import * as React from 'react';

import * as anchor from '@project-serum/anchor';
import { AnchorProvider, Program, web3 } from '@project-serum/anchor';
import { ConfirmOptions, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import bs58 from 'bs58';

import Layout from '@/components/layout/Layout';
import NextImage from '@/components/NextImage';
import BulletPoint from '../assests/images/bulletPoint.png';
import { PieChart } from 'react-minimal-pie-chart';
import BarChart from '@/components/Chart/BarChart';
import StatsCoin from '@/assests/icons/StatsCoin';
import Link from 'next/link';

//--------------------------------------------------------------------
// Constants
//--------------------------------------------------------------------

const idl = require('@/idl/coinflip2');

const opts: ConfirmOptions = {
  preflightCommitment: 'confirmed',
};

const programId = new web3.PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID!);
const connection = new web3.Connection(process.env.NEXT_PUBLIC_RPC_URL!);

export default function Stats() {
  //--------------------------------------------------------------------
  // Local States
  //--------------------------------------------------------------------

  const [stats, setStats] = React.useState<any>();

  //--------------------------------------------------------------------
  // Side Effects
  //--------------------------------------------------------------------

  // Get All Stats on Load of component
  React.useEffect(() => {
    getAllStats();
    setInterval(getAllStats, 60000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //--------------------------------------------------------------------
  // Bet Stats Data From blockchain
  //--------------------------------------------------------------------

  const fetchAllSettledGamesNoFormatting = async () => {
    const provider2 = new AnchorProvider(connection, Keypair.generate(), opts);
    const program2 = new Program(idl, programId, provider2);
    let result = await program2.account.gameId.all([
      {
        memcmp: {
          offset:
            8 + // Discriminator.
            +32 + //pubkey,
            1 + // u8
            4 +
            1 + //string prefix and one character
            4 +
            1, //string prefix and one character
          bytes: bs58.encode([1]),
        },
      },
    ]);
    return result;
  };

  const getAllStats = async () => {
    var games = await fetchAllSettledGamesNoFormatting();
    var now = new Date().getTime();
    var yesterday = now / 1000 - 24 * 60 * 60;
    var gamesDay = games?.filter(
      (game) => game?.account?.timestamp.toNumber() > yesterday
    );

    var Odds40 = games?.filter((game) => game?.account?.odds == 40);
    var Odds50 = games?.filter((game) => game?.account?.odds == 50);
    var Odds60 = games?.filter((game) => game?.account?.odds == 60);

    var winRatio40 =
      Odds40?.filter((game) => game?.account?.choice == game?.account?.outcome)
        .length / Odds40?.length;
    var winRatio50 =
      Odds50?.filter((game) => game?.account?.choice == game?.account?.outcome)
        .length / Odds50?.length;
    var winRatio60 =
      Odds60?.filter((game) => game?.account?.choice == game?.account?.outcome)
        .length / Odds60?.length;
    var winRatioHarr = games?.filter((game) => game?.account?.outcome == 'H');
    var winRatioTarr = games?.filter((game) => game?.account?.outcome == 'T');
    var n = winRatioHarr?.length + winRatioTarr?.length;

    var amountFlipped = games?.reduce(
      (acc, game) => acc + game?.account?.amount.toNumber() / LAMPORTS_PER_SOL,
      0
    );
    var nGames = games?.length;

    var Odds40Day = gamesDay?.filter((game) => game?.account.odds == 40);
    var Odds50Day = gamesDay?.filter((game) => game?.account.odds == 50);
    var Odds60Day = gamesDay?.filter((game) => game?.account.odds == 60);

    var winRatioHarrDay = gamesDay?.filter((game) => game?.account.outcome == 'H');
    var winRatioTarrDay = gamesDay?.filter((game) => game?.account.outcome == 'T');

    var nDay = winRatioHarrDay?.length + winRatioTarrDay?.length;

    var winRatio40Day =
      Odds40Day?.filter(
        (game) => game?.account?.choice == game?.account?.outcome
      ).length / Odds40Day?.length;
    var winRatio50Day =
      Odds50Day?.filter(
        (game) => game?.account?.choice == game?.account?.outcome
      ).length / Odds50Day?.length;
    var winRatio60Day =
      Odds60Day?.filter(
        (game) => game?.account?.choice == game?.account?.outcome
      ).length / Odds60Day?.length;

    var amountFlippedDay = gamesDay?.reduce(
      (acc, game) => acc + game?.account?.amount.toNumber() / LAMPORTS_PER_SOL,
      0
    );
    var nGamesDay = gamesDay?.length;

    var PlayerWinnings = { x: -1000 };
    gamesDay?.forEach((game) => {
      let player = game?.account?.gambler.toBase58();
      let outcome = game?.account?.outcome;
      let choice = game?.account.choice;
      let winner = choice == outcome;
      var amount = game?.account.amount.div(new anchor.BN(LAMPORTS_PER_SOL));
      let odds = game?.account.odds;
      let net_win_amount = ((amount * 1) / odds) * 100 - amount;
      if (player in PlayerWinnings) {
        if (winner) {
          PlayerWinnings[player] += Math.trunc(net_win_amount * 100) / 100;
        } else {
          PlayerWinnings[player] -= Math.trunc(amount * 100) / 100;
        }
      } else {
        if (winner) {
          PlayerWinnings[player] = Math.trunc(net_win_amount * 100) / 100;
        } else {
          PlayerWinnings[player] = -Math.trunc(amount * 100) / 100;
        }
      }
    });

    let winnings = Object.values(PlayerWinnings);
    var biggestWin = Math.max(...winnings);
    biggestWin = Math.trunc(biggestWin * 100) / 100;

    var output = {
      winRatio40: winRatio40,
      winRatio50: winRatio50,
      winRatio60: winRatio60,
      amountFlipped: amountFlipped,
      nGames: nGames,
      winPercH: winRatioHarr?.length / n,
      winPercT: winRatioTarr?.length / n,

      winRatio40Day: winRatio40Day,
      winRatio50Day: winRatio50Day,
      winRatio60Day: winRatio60Day,
      amountFlippedDay: amountFlippedDay,
      nGamesDay: nGamesDay,
      biggestWinnerDay: biggestWin,
      winPercHDay: winRatioHarrDay?.length / nDay,
      winPercTDay: winRatioTarrDay?.length / nDay,
    };
    setStats(output);
    return output;
  };

  const nFormatter = (num, digits) => {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function (item) {
      return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
  }

  // const ratio40 = stats?.winRatio40Day * 100
  // const ratio50 = stats?.winRatio50Day * 100
  // const ratio60 = stats?.winRatio60Day * 100

  // console.log(ratio40, ratio50, ratio60)
  return (
    <Layout title='Stats'>
      {/* ========================================== */}
      {/* Today Stats=============================== */}
      {/* ========================================== */}

      <div className='container flex min-h-screen flex-col px-4 sm:px-6'>
        <div className='my-10 flex flex-col rounded-xl bg-primary-700 py-2 px-2 lg:px-2'>
          {/* --------------Heading of Stats Container-------------- */}

          <div className='relative col-span-4 ml-2 mb-3 flex items-center lg:col-span-6'>
            <NextImage
              src={BulletPoint}
              alt='diamond bullet point'
              className='w-3 lg:w-5'
              width='5'
              height='5'
            />
            <p className='text-sm font-extrabold text-white lg:text-lg'>
              &nbsp;&nbsp;&nbsp;Coin Flip Stats For Today
            </p>
          </div>

          {/* --------------Cards of Stats Container-------------- */}

          {/* ======> Row 1 <====== */}
          <div className='order-2 grid grid-cols-12 gap-2 lg:order-1'>
            <div className='max-h-[433px] col-span-12 min-h-[300px] rounded-md bg-primary-600 pt-8 lg:col-span-4 lg:rounded-none'>
              <p className='statsHeadingWhite'>Game Result</p>
              <div className='my-3 flex items-center justify-center'>
                <div className='flex w-20 items-center justify-center'>
                  <span className='smalldot bg-[#9401ea]'></span>
                  <p className='ml-2 text-white'>Head</p>
                </div>
                <div className='flex w-20 items-center justify-center'>
                  <span className='smalldot bg-[#4a68e2]'></span>
                  <p className='ml-2 text-white'>Tails</p>
                </div>
              </div>

              <div className='mx-10 my-6 h-[250px]'>
                {
                  stats && stats?.winPercHDay !== NaN && stats?.winPercTDay !== NaN ?
                    <PieChart
                      // your data
                      data={[
                        {
                          title: 'One',
                          value: stats?.winPercHDay,
                          color: '#9401ea',
                        },
                        {
                          title: 'Two',
                          value: stats?.winPercTDay,
                          color: '#544af1',
                        },
                      ]}
                      // width and height of the view box
                      viewBoxSize={[100, 100]}
                    /> :
                    <div className='relative mx-10 my-6 h-[200px]'>
                      <p className='absolute top-1/2 left-0 right-0 ml-auto mr-auto text-center text-white m-auto'>No Result Yet</p>
                    </div>
                }
              </div>
            </div>
            <div className='relative col-span-12 min-h-[300px] rounded-md bg-primary-600 pt-8  lg:col-span-4 lg:rounded-none'>
              <p className='statsHeadingWhite'>Multiplier Win %</p>
              <div className='my-3 flex items-center justify-center'>
                <div className='flex w-20 items-center justify-center'>
                  <span className='smalldot bg-[#4ae288]'></span>
                  <p className='ml-2 text-white'>2.5X</p>
                </div>
                <div className='flex w-20 items-center justify-center'>
                  <span className='smalldot bg-[#9401ea]'></span>
                  <p className='ml-2 text-white'>2X</p>
                </div>
                <div className='flex w-20 items-center justify-center'>
                  <span className='smalldot bg-[#4a68e2]'></span>
                  <p className='ml-2 text-white'>1.66X</p>
                </div>
              </div>

              <div className='bg-primary-700 rounded-2xl lg:min-h-[250px] mx-14 my-6 py-6 px-3'>
                {
                  stats && stats?.winRatio40Day !== NaN && stats?.winRatio50Day !== NaN && stats?.winRatio60Day !== NaN ?
                    <BarChart
                      showLabel={true}
                      radius={{ topLeft: 12, topRight: 12, bottomLeft: 12, bottomRight: 12 }}
                      width={80}
                      dpadding={50}
                      padding={{ top: 0, bottom: 0, left: 60, right: 60 }}
                      data={[
                        { x: "2.5", y: stats?.winRatio40Day * 100, z: `${(stats?.winRatio40Day * 100).toFixed(0)}%` },
                        { x: "2", y: stats?.winRatio50Day * 100, z: `${(stats?.winRatio50Day * 100).toFixed(0)}%` },
                        { x: "1.66", y: stats?.winRatio60Day * 100, z: `${(stats?.winRatio60Day * 100).toFixed(0)}%` },
                      ]} />
                    :
                    <div className='relative mx-10 my-6 h-[200px]'>
                      <p className='absolute top-1/2 left-0 right-0 ml-auto mr-auto text-center text-white m-auto'>No Result Yet</p>
                    </div>
                }
              </div>


            </div>
            <div className='relative max-h-[433px] pt-8 col-span-12 min-h-[300px] rounded-md bg-primary-600 lg:col-span-4 lg:rounded-none'>
              <p className='statsHeadingWhite'>Games Played</p>
              {
                stats && stats?.nGamesDay !== NaN ?
                  <div className='max-h-[200px] mx-14 my-6 py-6 px-3'>
                    <p className='mt-10 black d-flex min-h-[60px] mb-5 text-center text-[#4ae288] text-[100px]'>{nFormatter(`${stats?.nGamesDay}`, 1)}</p>
                    <p className='text-center text-[#4ae288] text-lg'>Coins Flipped</p>
                  </div>
                  :
                  <div className='relative mx-10 my-6 h-[200px]'>
                    <p className='absolute top-1/2 left-0 right-0 ml-auto mr-auto text-center text-white m-auto'>No Result Yet</p>
                  </div>
              }

              <p className='absolute text-center bottom-3 w-max left-0 right-0 ml-auto mr-auto text-white text-md'>Today</p>
            </div>
          </div>

          {/* ======> Row 2 <====== */}
          <div className='order-1 grid grid-cols-12 gap-2 lg:order-2 lg:mt-2'>
            <div className='relative max-h-[433px] pt-8 col-span-12 min-h-[350px] rounded-md bg-primary-600 lg:col-span-4 lg:rounded-none'>
              <p className='statsHeadingWhite'>$SOL Flipped</p>
              {
                stats && stats?.amountFlippedDay !== NaN ?
                  <div className='max-h-[200px] mx-14 my-6 py-6 px-3'>
                    <p className='mt-12 black d-flex min-h-[60px] mb-5 text-center text-[#4ae288] text-[100px]'>{nFormatter(`${stats?.amountFlippedDay}`, 1)}</p>
                    <p className='text-center text-[#4ae288] text-lg'>$SOL Flipped</p>
                  </div>
                  :
                  <div className='relative mx-10 my-6 h-[200px]'>
                    <p className='absolute top-1/2 left-0 right-0 ml-auto mr-auto text-center text-white m-auto'>No Result Yet</p>
                  </div>
              }
              <p className='absolute text-center bottom-3 w-max left-0 right-0 ml-auto mr-auto text-white text-md'>Today</p>
            </div>

            <div className='max-h-[433px] col-span-12 min-h-[390px] mb-2 lg:mb-0 rounded-md bg-primary-600 lg:col-span-8 lg:rounded-none'>
              <div className="grid grid-cols-12 mt-16 lg:mx-9">
                <div className='col-span-12  lg:col-span-8'>
                  <p className='text-start d-flex lg:d-flex-start h-[60px] text-[#4ae288] text-3xl'>Today</p>
                  <p className='black d-flex lg:d-flex-start min-h-[70px] text-start text-white text-[10vw] lg:text-[60px]'>Biggest Win</p>
                  {stats && stats?.biggestWinnerDay !== NaN ?
                    <p className='biggestWin d-flex lg:d-flex-start min-h-[100px] text-start text-[#4ae288] text-[15vw] lg:text-[85px]'>{stats?.biggestWinnerDay.toFixed(2)} $SOL</p>
                    :
                    <div className='relative mx-10 my-6'>
                      <p className='absolute top-1/2 left-0 right-0 ml-auto mr-auto text-center text-white m-auto'>No Result Yet</p>
                    </div>
                  }
                </div>
                <div className='col-span-12 hidden lg:block lg:col-span-4'>
                  <StatsCoin width={260} height={300} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* OverAll Stats============================= */}
        {/* ========================================== */}

        <div className='mb-10 flex flex-col py-2 px-2 lg:px-2'>
          {/* --------------Cards of Stats Container-------------- */}

          {/* ======> All Time Wins <====== */}
          <div className='grid grid-cols-12 gap-6'>
            <div className='max-h-[290px] col-span-12 rounded-2xl bg-primary-600 pt-8 lg:col-span-3'>
              <p className='statsHeading'>All Time Wins</p>

              <div className='px-10 my-6'>
                {
                  stats && stats?.winPercH !== NaN && stats?.winPercT !== NaN ?
                    <div className="flex justify-between">
                      <div>
                        <p className='black text-center text-2xl text-white'>{(stats?.winPercH * 100).toFixed(1)}%</p>
                        <p className='text-center text-2xl text-[#9401ea]'>Heads</p>
                      </div>
                      <div>
                        <p className='black text-center text-2xl text-white'>{(stats?.winPercT * 100).toFixed(1)}%</p>
                        <p className='text-center text-2xl text-[#9401ea]'>Tails</p>
                      </div>
                    </div>
                    :
                    <div className='relative mx-10 my-6 h-[200px]'>
                      <p className='absolute top-1/2 left-0 right-0 ml-auto mr-auto text-center text-white m-auto'>No Result Yet</p>
                    </div>
                }
              </div>
            </div>

            {/* ======> All Time Games <====== */}
            <div className='max-h-[290px] col-span-12 rounded-2xl bg-primary-600 pt-8 lg:col-span-2'>
              <p className='statsHeading'>All Time Games</p>

              <div className='px-10 my-6'>
                {
                  stats && stats?.nGames !== NaN ?
                    <div className="">
                      <p className='mt-5 black d-flex min-h-[60px] mb-5 text-center text-[#4ae288] text-[65px]'>{nFormatter(`${stats?.nGames}`, 1)}</p>
                      <p className='text-center text-[#4ae288] text-sm'>Coins Flipped</p>
                    </div>
                    :
                    <div className='relative mx-10 my-6 h-[200px]'>
                      <p className='absolute top-1/2 left-0 right-0 ml-auto mr-auto text-center text-white m-auto'>No Result Yet</p>
                    </div>
                }
              </div>
            </div>

            {/* ======> All Time Multiplier Win % <====== */}
            <div className='max-h-[290px] col-span-12 rounded-2xl bg-primary-600 pt-8 lg:col-span-4'>
              <p className='statsHeading'>All Time Multiplier Win %</p>

              <div className='px-10 my-6'>
                {
                  stats && stats?.winRatio40 !== NaN && stats?.winRatio50 !== NaN && stats?.winRatio60 !== NaN ?
                    <div className="flex justify-between">
                      <div>
                        <p className='black text-center text-[5vw] lg:text-2xl text-white'>{(stats?.winRatio40 * 100).toFixed(1)}%</p>
                        <p className='text-center text-[5vw] lg:text-2xl text-[#4ae288]'>2.5X</p>
                      </div>
                      <div>
                        <p className='black text-center text-[5vw] lg:text-2xl text-white'>{(stats?.winRatio50 * 100).toFixed(1)}%</p>
                        <p className='text-center text-[5vw] lg:text-2xl text-[#9401ea]'>2X</p>
                      </div>
                      <div>
                        <p className='black text-center text-[5vw] lg:text-2xl text-white'>{(stats?.winRatio60 * 100).toFixed(1)}%</p>
                        <p className='text-center text-[5vw] lg:text-2xl text-[#4a68e2]'>1.66X</p>
                      </div>
                    </div>
                    :
                    <div className='relative mx-10 my-6 h-[200px]'>
                      <p className='absolute top-1/2 left-0 right-0 ml-auto mr-auto text-center text-white m-auto'>No Result Yet</p>
                    </div>
                }
              </div>
            </div>

            {/* ======> All Time $SOL <====== */}
            <div className='max-h-[290px] col-span-12 rounded-2xl bg-primary-600 pt-8 lg:col-span-3'>
              <p className='statsHeading'>All Time $SOL</p>
              <div className='px-10 my-6'>
                {
                  stats && stats?.amountFlipped !== NaN ?
                    <div className="">
                      <p className='mt-5 black d-flex min-h-[60px] mb-5 text-center text-[#4ae288] text-[65px]'>{nFormatter(`${stats?.amountFlipped}`, 1)}</p>
                      <p className='text-center text-[#4ae288] text-sm'>$SOL Flipped</p>
                    </div>
                    :
                    <div className='relative mx-10 my-6 h-[200px]'>
                      <p className='absolute top-1/2 left-0 right-0 ml-auto mr-auto text-center text-white m-auto'>No Result Yet</p>
                    </div>
                }
              </div>
            </div>

          </div>
        </div>

        {/* ======> Play Now Button <====== */}
        <div className='text-center mt-10 h-40'>
          <Link href="/"><span className='w-[260px] text-[26px] text-[#161d29] cursor-pointer black bg-[#4ae288] rounded-full px-10 py-3'>Play Now</span></Link>
        </div>

      </div>
    </Layout >
  );
}
