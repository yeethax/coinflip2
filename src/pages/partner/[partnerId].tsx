import * as React from 'react';
import clsxm from '@/lib/clsxm';

import { AnchorProvider, BN, Program, web3 } from '@project-serum/anchor';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ConfirmOptions, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';

import Layout from '@/components/layout/Layout';
import NextImage from '@/components/NextImage';
import Table from '@/components/Table';
import Loader from '@/components/Loader';
import { Modal } from '@/components/Modal';
import { InfoModal } from '@/components/Modal/InfoModal';

import SolanaIcon from '@/assests/images/solana_icon.png';
import Coins from '@/components/CoinSlider';
import BetInput from '@/components/BetInput';
import BulletPoint from '@/assests/images/bulletPoint.png';
import CoinAnimation from '@/assests/animationVideo/giphy.gif';
import { AppContext } from '@/context/AppContext'
import { useRouter } from 'next/router';

//--------------------------------------------------------------------
// Constants
//--------------------------------------------------------------------

const idl = require('@/idl/coinflip2');

// ===> New Opts <=== //
const opts: ConfirmOptions = {
  preflightCommitment: 'processed', //"confirmed" is better but might not be strictly necessary
  commitment: 'confirmed', // "finalized is better"
};

const Api_Url = process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://justcoinflip.herokuapp.com'
const programId = new web3.PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID!);
const connection = new web3.Connection(process.env.NEXT_PUBLIC_RPC_URL!, "confirmed");
const gameAccount = new web3.PublicKey(process.env.NEXT_PUBLIC_GAME_ACCOUNT!);
const gameVault = new web3.PublicKey(process.env.NEXT_PUBLIC_GAME_VAULT!);
const deployer = new web3.PublicKey(process.env.NEXT_PUBLIC_DEPLOYER!);
const maxBetAmount = process.env.NEXT_PUBLIC_MAX_BET;

//--------------------------------------------------------------------
// Helper Function
//--------------------------------------------------------------------

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

//--------------------------------------------------------------------
// Main Function
//--------------------------------------------------------------------

export default function HomePage() {
  const wallet = useAnchorWallet();
  const router = useRouter()
  const { partnerId } = router.query

  const partner = partnerId?.toString().slice(partnerId.length - 5)
  console.log(partner);

  //--------------------------------------------------------------------
  // Context
  //--------------------------------------------------------------------

  const {
    fetchFailedGamesByUser, setShowNotification,
    loading, setLoading,
    balance, setBalance,
    flippingCoin, setFlippingCoin,
    infoMOdal, setInfoMOdal,
    infoMOdalMessage, setInfoMOdalMessage,
    modalMessage, setModalMessage,
    modalInfoMessage, setModalInfoMessage,
    showBalance, setShowBalance,
    showModal, setShowModal,
    winner, setWinner,
    data, setData,
    playFlippingSound, stopFlippingSound,
    playWinSound, playLossSound,
    getBalance, sendToDiscord, fetchAllSettledGames,
    closeBetModals, closeLoader, tableDatafromApi
  } = React.useContext(AppContext)

  //--------------------------------------------------------------------
  // Max - Min Bet Amount
  //--------------------------------------------------------------------

  const min = 0;
  const max = Number(maxBetAmount);

  //--------------------------------------------------------------------
  // Local States
  //--------------------------------------------------------------------

  const [multiplier, setMultipler] = React.useState<number>(2.5);
  const [error, setError] = React.useState<boolean>(false);
  const [choice, setChoice] = React.useState<string>('R'); //value
  const [amount, setAmount] = React.useState<number>(0); //value

  const [randomChoice, setRandomChoice] = React.useState<string | undefined>('');

  //--------------------------------------------------------------------
  // Side Effects
  //--------------------------------------------------------------------

  // changing the coin to random
  React.useEffect(() => {
    if (data?.won === true) {
      setChoice('R')
    } else if (data?.won === false) {
      setChoice('R')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  //--------------------------------------------------------------------
  // Callbacks
  //--------------------------------------------------------------------

  const handleAmountChange = (event: any) => {
    const value = event.target.value;
    if (value > max || value <= min) setError(true);
    else setError(false);
    setAmount(value);
    console.log(error);
  };

  const randomCoin = () => {
    const rndInt = Math.floor(Math.random() * (50 - 1 + 1) + 1);
    if (rndInt % 2 == 0) return 'T';
    else return 'H';
  };

  const makeBet = async (randomValue?: string) => {
    //--------------------------------------------------------------------
    // BEGINNING OF MODIFICATION sending the bet on blockchain
    //--------------------------------------------------------------------
    try {
      console.log('In make bet');
      if (!wallet) {
        return;
      }
      setFlippingCoin(true);
      playFlippingSound()
      const selectedChoice = randomValue ?? choice;
      const provider = new AnchorProvider(connection, wallet, opts);
      const program = new Program(idl, programId, provider);
      //program and provider should be the ones initialised with initialisedEnv using the user wallet
      const gameId = web3.Keypair.generate();
      let multiplierMap: any = { 2.5: 40, 2: 50, 1.66: 60 };
      let odds = multiplierMap[multiplier];
      var txBet = await program.methods
        .makeBet(
          new BN(odds),
          selectedChoice,
          new BN(amount * LAMPORTS_PER_SOL),
          partner
        )
        .accounts({
          gambler: provider.wallet.publicKey,
          gameAccount: gameAccount,
          gameVault: gameVault,
          gameId: gameId.publicKey,
          manager: deployer,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([gameId])
        .rpc();

      console.log('tx hsould be sent');

      let gameIdStr = gameId.publicKey.toBase58();
      let gambler = provider.wallet.publicKey.toBase58() //TODO remove this string
      let optsStr = 'confirmed';
      const response = await fetch(`${Api_Url}/makeBet`, {
        method: 'POST',
        body: JSON.stringify({ gameIdStr, gambler, optsStr, amount, multiplier, odds }),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });

      const resultData = await response.json();
      setData(resultData);
    } catch (error) {
      setFlippingCoin(false);
      setTimeout(closeLoader, 500);
      setTimeout(fetchFailedGamesByUser, 1500);
      console.log(error);
    }
  };

  const flipCoin = async () => {
    if (!(amount > max) && amount !== 0 && choice !== 'R') {
      makeBet()
    }
    else if (amount > max) {
      setInfoMOdal(true);
      setInfoMOdalMessage('Maximum Bet Amount = 1');
    }
    else if (amount <= min) {
      setInfoMOdal(true);
      setInfoMOdalMessage('Enter Bet Amount');
    }
    else if (choice === 'R') {
      // setting the random value in makebet function
      let randomCoinChoice = randomCoin();
      setRandomChoice(randomCoinChoice);
      makeBet(randomCoinChoice);
    }
  };

  return (
    <Layout title='Partner'>

      <div className='container flex min-h-screen flex-col px-4 sm:px-6'>
        {/* ===================================== */}
        {/* ======= Informational Modals ======== */}
        {/* ===================================== */}

        {flippingCoin && (
          <div className='loadingScreen fixed top-16 left-0 right-0 bottom-0 z-50 flex h-screen w-full flex-col items-center justify-center overflow-hidden'>
            <NextImage
              src={CoinAnimation}
              alt='animation'
              className='w-48 select-none'
              width='14'
              height='14'
            />
            <h2 className='black h-14 select-none text-center text-xl font-black uppercase text-white md:text-[57px]'>
              Flipping coin
            </h2>
            <div className='flex min-w-fit justify-between rounded-full bg-[#111924]'>
              <span className='select-none max-w-40 m-2 min-w-[50px] rounded-full bg-[#4ae288] px-10 py-2 lg:text-3xl font-black text-[#1b2838]'>
                {multiplier}X
              </span>
              <span className='select-none max-w-40 m-2 min-w-[50px] rounded-full bg-[#1b2838] px-10 py-2 lg:text-3xl font-black text-white'>
                {choice === 'H'
                  ? 'Heads'
                  : choice === 'T'
                    ? 'Tails'
                    : randomChoice === 'H'
                      ? 'Heads'
                      : randomChoice === 'T'
                        ? 'Tails'
                        : ''}
              </span>
            </div>
            <div className='bouncing-loader mt-5'>
              <p className='select-none text-center text-lg capitalize text-white opacity-60'>
                Please wait &nbsp;
              </p>
              {/* loadind Dots */}
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        )}

        <InfoModal
          showModal={infoMOdal}
          setShowModal={setInfoMOdal}
          text={infoMOdalMessage}
        />
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          winner={winner}
          text={modalMessage}
          InfoText={modalInfoMessage}
        />

        {/* ======= Heading of Container ======== */}

        <div className='my-10'>
          <div className='grid grid-cols-12 rounded-t-xl bg-primary-700 py-2 px-3 lg:px-5'>
            <div className='relative col-span-5 flex items-center md:col-span-6'>
              <NextImage
                src={BulletPoint}
                alt='diamond bullet point'
                className='w-3 md:w-5'
                width='5'
                height='5'
              />
              <p className='text-[3vw] font-extrabold text-white md:text-lg'>
                &nbsp;&nbsp;&nbsp;Coin Flip Game
              </p>
            </div>
            <div className='col-span-7 flex justify-end md:col-span-6'>
              {wallet && showBalance && (
                <div className='flex w-max items-center rounded-full bg-primary-900 px-2 py-1 font-extrabold text-white lg:px-4 lg:py-2'>
                  <NextImage
                    useSkeleton
                    src={SolanaIcon}
                    alt='Solana Icon'
                    className='w-5'
                    width='14'
                    height='14'
                  />
                  &nbsp;
                  <span className='text-[2vw] lg:text-sm'>{balance?.toString().slice(0, balance?.toString().indexOf('.') + 5)} SOL</span>
                </div>
              )}
              <div className='lg:hidden'>
                <button
                  className={clsxm(
                    'w-[16vw] m-auto mx-1 select-none rounded-full bg-primary-200 px-3 py-1 text-[7px] font-extrabold text-white md:py-3 lg:px-4 lg:py-2 lg:text-sm'
                  )}
                >
                  {choice === 'H'
                    ? 'Heads'
                    : choice === 'T'
                      ? 'Tails'
                      : 'Random'}
                </button>
              </div>
            </div>
          </div>

          {/* ============================================== */}
          {/* ======= container with input and coins ======= */}
          {/* ============================================== */}
          <div className='grid grid-cols-12'>
            <div className='order-last col-span-12 rounded-b-xl bg-primary-600 p-3 md:rounded-bl-xl md:rounded-br-none lg:order-first lg:col-span-4'>
              {/* ======= Heading ======== */}
              <p className='my-6 text-center text-lg font-extrabold text-white'>
                Bet Settings
              </p>

              {/* ======= Muliplier Tabs ======== */}
              <div className='mx-1 lg:mx-5'>
                <p className='ml-5 text-xs text-primary-100'>Multiplier</p>
                <div className='my-2 flex justify-between rounded-full bg-[#111924] px-2'>
                  <button
                    className={clsxm(
                      'text-[3vw] md:text-base mx-2 my-3 cursor-pointer rounded-full bg-inherit px-[5vw] py-[1vw] lg:px-6 lg:py-1 font-extrabold text-white transition duration-150 ease-in-out hover:bg-primary-700',
                      multiplier === 2.5 && 'bg-primary-700'
                    )}
                    onClick={() => setMultipler(2.5)}
                  >
                    2.5X
                  </button>
                  <button
                    className={clsxm(
                      'text-[3vw] md:text-base mx-2 my-3 cursor-pointer rounded-full bg-inherit px-[5vw] py-[1vw] lg:px-6 lg:py-1 font-extrabold text-white transition duration-150 ease-in-out hover:bg-primary-700',
                      multiplier === 2 && 'bg-primary-700'
                    )}
                    onClick={() => setMultipler(2)}
                  >
                    2X
                  </button>
                  <button
                    className={clsxm(
                      'text-[3vw] md:text-base mx-2 my-3 cursor-pointer rounded-full bg-inherit px-[5vw] py-[1vw] lg:px-6 lg:py-1 font-extrabold text-white transition duration-150 ease-in-out hover:bg-primary-700',
                      multiplier === 1.66 && 'bg-primary-700'
                    )}
                    onClick={() => setMultipler(1.66)}
                  >
                    1.66X
                  </button>
                </div>
              </div>

              {/* ================================ */}
              {/* ======= Muliplier Input ======== */}
              {/* ================================ */}
              <BetInput
                label='Bet Amount'
                value={amount}
                setValue={setAmount}
                onChange={handleAmountChange}
              />

              {error && amount > max && (
                <p className='mx-5 text-red-600'>Maximum Bet Limit = 1</p>
              )}
              {error && amount <= min && (
                <p className='mx-5 text-red-600'>Enter Bet Amount</p>
              )}

              {/* ===================================== */}
              {/* ======= Main Flip Coin button ======= */}
              {/* ===================================== */}
              <div className='grid grid-cols-12'>
                <div className='col-span-12 my-3 mx-5' id='flipCoinDiv'>
                  {!wallet ? (
                    <WalletMultiButton className='connectBtn' />
                  ) : (
                    <button
                      className={clsxm(
                        loading
                          ? 'w-full justify-between rounded-full text-center text-2xl font-black disabled:bg-slate-600'
                          : 'h-16 w-full justify-between rounded-lg  bg-primary-50 text-center text-2xl font-black disabled:bg-slate-600'
                      )}
                      type='button'
                      onClick={flipCoin}
                      disabled={amount <= min || amount > max}
                    >
                      {!loading && <span>Flip Coin</span>}
                      {/* {loading && <span className='text-lg'>Flipping coin for {choice === 'H' ? "Heads" : choice === "T" ? "Tails" : randomChoice === "H" ? "Heads" : randomChoice === "T" ? "Tails" : ""} {multiplier}x</span>} */}
                      {loading && (
                        <Loader
                          width='100%'
                          text={`Flipping coin for ${choice === 'H'
                            ? 'Heads'
                            : choice === 'T'
                              ? 'Tails'
                              : randomChoice === 'H'
                                ? 'Heads'
                                : randomChoice === 'T'
                                  ? 'Tails'
                                  : ''
                            } ${multiplier}x`}
                        />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* <button type='button' onClick={() => playFlippingSound()}>Play</button> */}

              <p className='m-2 text-center text-base font-medium text-primary-100'>
                {multiplier === 2.5 ? `${multiplier}X odds (40%)` : multiplier === 2 ? `${multiplier}X odds (50%)` : multiplier === 1.66 ? `${multiplier}X odds (60%)` : null}
              </p>
            </div>

            {/* =============================== */}
            {/* ======= Coins Selection ======= */}
            {/* =============================== */}
            <Coins coin={choice} setCoin={setChoice} />
          </div>
        </div>

        {/* ==================================== */}
        {/* ==========All Bets Details========== */}
        {/* ==================================== */}

        <div className='grid grid-cols-12' id="latestBets">
          {/* ======= Headings ======= */}
          <div className='col-span-2'>
            <p className='flex w-max items-center justify-between rounded-full bg-primary-700 py-2 px-5 text-center font-extrabold text-white'>
              Latest Bets
              <span className='dot ml-3'></span>
            </p>
          </div>

          {/* ===================== */}
          {/* ======= Table ======= */}
          {/* ===================== */}
          {tableDatafromApi ? (<Table data={tableDatafromApi} wallet={Boolean(wallet)} />) : (
            <div className='bouncing-loader mt-5 col-span-12 mb-40'>

              {/* loadind Dots */}
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}
