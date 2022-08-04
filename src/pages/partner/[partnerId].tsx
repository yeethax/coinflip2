
import * as React from 'react';
import clsxm from '@/lib/clsxm';

import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
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

import SolImage from "@/assests/images/solana_icon.png"
import CrekImage from "@/assests/images/Creck_Icon_PNG.png"
import DustImage from "@/assests/images/Dust_Icon.png"
import ForgeImage from "@/assests/images/Forge_Symbol.png"
import Coins from '@/components/CoinSlider';
import BetInput from '@/components/BetInput';
import BulletPoint from '@/assests/images/bulletPoint.png';
import CoinAnimation from '@/assests/animationVideo/giphy.gif';
import { AppContext } from '@/context/AppContext'
import { useRouter } from 'next/router';
import BulletHeading from '@/components/BulletHeading';
import image from "@/assests/images/7779214.jpg"
import image2 from "@/assests/images/Eighties.png"
import { chatData, leaderBoard } from '@/data';
import Message from '@/components/Message';
import SimpleBar from 'simplebar-react';
import Clipboard from '@/assests/icons/Clipboard';
import LeaderBoard from '@/components/LeaderBoard';
import Dots from '@/components/Loader/Dots';
import Select from '@/components/Select';


//--------------------------------------------------------------------
// Constants
//--------------------------------------------------------------------

const idl = require('@/idl/coinflip2');
const idlSpl = require('@/idl/coinflip2Spl');

// ===> New Opts <=== //
const opts: ConfirmOptions = {
  //preflightCommitment: 'processed', //"confirmed" is better but might not be strictly necessary
  commitment: 'confirmed', // "finalized is better"
};

// const Api_Url = process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://justcoinflip.herokuapp.com'
const Api_Url = 'https://justcoinflip-test.herokuapp.com'
const programId = new web3.PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID!);
const programIdSpl = new web3.PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID_SPL!);
const connection = new web3.Connection(process.env.NEXT_PUBLIC_RPC_URL!, "confirmed");
const deployer = new web3.PublicKey(process.env.NEXT_PUBLIC_DEPLOYER!);
const partner = 'HOUSE';
const maxBetAmountSol = process.env.NEXT_PUBLIC_MAX_BET;
const maxBetAmountDust = process.env.NEXT_PUBLIC_MAX_BET_DUST;
const maxBetAmountCrek = process.env.NEXT_PUBLIC_MAX_BET_CREK;
const maxBetAmountForge = process.env.NEXT_PUBLIC_MAX_BET_FORGE;
const minBetAmountSol = process.env.NEXT_PUBLIC_MIN_BET
const minBetAmountSpl = process.env.NEXT_PUBLIC_MIN_BET_SPL
const SplTokens: any = { "DUST": process.env.NEXT_PUBLIC_DUST!, "CREK": process.env.NEXT_PUBLIC_CREK!, "FORGE": process.env.NEXT_PUBLIC_FORGE! };
const GameVaultSplTokens: any = { "DUST": process.env.NEXT_PUBLIC_GAME_VAULT_DUST!, "CREK": process.env.NEXT_PUBLIC_GAME_VAULT_CREK!, "FORGE": process.env.NEXT_PUBLIC_GAME_VAULT_FORGE! };
const GameVaultSplTokensATok: any = { "DUST": process.env.NEXT_PUBLIC_GAME_VAULT_ATOK_DUST!, "CREK": process.env.NEXT_PUBLIC_GAME_VAULT_ATOK_CREK!, "FORGE": process.env.NEXT_PUBLIC_GAME_VAULT_ATOK_FORGE! };
const GameAccountSplTokens: any = { "DUST": process.env.NEXT_PUBLIC_GAME_ACCOUNT_DUST!, "CREK": process.env.NEXT_PUBLIC_GAME_ACCOUNT_CREK!, "FORGE": process.env.NEXT_PUBLIC_GAME_ACCOUNT_FORGE! };

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
    fetchFailedGamesByUser, loading, balance, flippingCoin, setFlippingCoin,
    infoMOdal, setInfoMOdal,
    infoMOdalMessage, setInfoMOdalMessage,
    modalMessage, modalInfoMessage, showBalance, showModal, setShowModal,
    winner, data, setData,
    cryptoCurrency, getBalanceSpl,
    playFlippingSound, playerATokStr, closeLoader, tableDatafromApi } = React.useContext(AppContext)

  //--------------------------------------------------------------------
  // Max - Min Bet Amount
  //--------------------------------------------------------------------

  const min = cryptoCurrency === "SOL" ? Number(minBetAmountSol) : Number(minBetAmountSpl);
  const max = cryptoCurrency === "SOL" ? Number(maxBetAmountSol) : cryptoCurrency === "DUST" ? Number(maxBetAmountDust) : cryptoCurrency === "CREK" ? Number(maxBetAmountCrek) : cryptoCurrency === "FORGE" ? Number(maxBetAmountForge) : Number(maxBetAmountSol);

  //--------------------------------------------------------------------
  // Local States
  //--------------------------------------------------------------------

  const [multiplier, setMultipler] = React.useState<number>(2.5);
  const [error, setError] = React.useState<boolean>(false);
  const [choice, setChoice] = React.useState<string>('R'); //value
  const [amount, setAmount] = React.useState<number>(0); //value

  const [randomChoice, setRandomChoice] = React.useState<string | undefined>('');


  const [messagesList, setMessagesList] = React.useState(chatData);
  const [newMessage, setNewMessage] = React.useState('');

  const inputRef = React.useRef<any>(null);

  const scrollRef = React.useRef<HTMLDivElement>(null);

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

  React.useEffect(() => {

    scrollMessagesToBottom();
  }, [messagesList]);

  //--------------------------------------------------------------------
  // Callbacks
  //--------------------------------------------------------------------

  const scrollMessagesToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleScroll = (e: any) => {
    let element = e.target;
    if (element.scrollTop === 0) {
      //fetch messages
      console.log("hi")
    }
  }

  const handleOnChange = (e: any) => {
    setNewMessage(e.target.value);
  };

  const handleOnSubmit = (e: any) => {
    e.preventDefault();
    const trimmedMessage = {
      id: "1",
      username: "Moe",
      text: newMessage.trim(),
      time: new Date().toUTCString()
    };

    setMessagesList((prev: any) => { return [...prev, trimmedMessage] })
    setNewMessage('');
    // if (db) {
    //   // Add new message in Firestore
    //   messagesRef.add({
    //     text: trimmedMessage,
    //     createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    //     uid,
    //     displayName,
    //     photoURL,
    //   });
    //   // Clear input field
    //   setNewMessage('');
    //   // Scroll down to the bottom of the list
    // }
  };

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
      const gameAccount = new web3.PublicKey(process.env.NEXT_PUBLIC_GAME_ACCOUNT!);
      const gameVault = new web3.PublicKey(process.env.NEXT_PUBLIC_GAME_VAULT!);
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
      let currency = "SOL";
      const response = await fetch(`${Api_Url}/makeBet`, {
        method: 'POST',
        body: JSON.stringify({ gameIdStr, gambler, optsStr, amount, multiplier, odds, currency: cryptoCurrency, playerATokStr }),
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
      setTimeout(fetchFailedGamesByUser, 5000);
      console.log(error);
    }
  };

  // for custom token
  const makeBetSpl = async (randomValue?: string) => {
    // currency is either "DUST" or "CREK" for now
    //--------------------------------------------------------------------
    // BEGINNING OF MODIFICATION sending the bet on blockchain
    //--------------------------------------------------------------------
    try {
      console.log('In makeBetSpl');
      if (!wallet) {
        return;
      }
      console.log("makeBetSpl")
      setFlippingCoin(true);
      playFlippingSound()
      const currency = cryptoCurrency
      const selectedChoice = randomValue ?? choice;
      const provider = new AnchorProvider(connection, wallet, opts);
      const program = new Program(idlSpl, programIdSpl, provider);
      //program and provider should be the ones initialised with initialisedEnv using the user wallet
      const gameId = web3.Keypair.generate();
      let multiplierMap: any = { 2.5: 40, 2: 50, 1.66: 60 };
      let odds = multiplierMap[multiplier];
      let mint = new web3.PublicKey(SplTokens[currency]);
      const gameVault = new web3.PublicKey(GameVaultSplTokens[currency]);
      const gameVaultATok = new web3.PublicKey(GameVaultSplTokensATok[currency]);
      const gameAccount = new web3.PublicKey(GameAccountSplTokens[currency]);
      var txBet = await program.methods
        .makeBetSpl(
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
          tokenProgram: TOKEN_PROGRAM_ID,
          mint: mint,
          gamblerAtokenacc: new web3.PublicKey(playerATokStr),
          gameVaultAtokenacc: gameVaultATok
        })
        .signers([gameId])
        .rpc();

      console.log('tx hsould be sent');

      let gameIdStr = gameId.publicKey.toBase58();
      let gambler = provider.wallet.publicKey.toBase58() //TODO remove this string
      let optsStr = 'confirmed';

      const response = await fetch(`${Api_Url}/makeBet`, {
        method: 'POST',
        body: JSON.stringify({ gameIdStr, gambler, optsStr, amount, multiplier, odds, currency: cryptoCurrency, playerATokStr }),
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
      setTimeout(fetchFailedGamesByUser, 5000);
      console.log(error);
    }
  };

  const flipCoin = async () => {
    if (!(amount > max) && amount !== 0 && choice !== 'R') {
      console.log({ cryptoCurrency })
      if (cryptoCurrency === "SOL") {
        makeBet();
      } else {
        console.log(choice)
        makeBetSpl();
      }
    }
    else if (amount > max) {
      setInfoMOdal(true);
      setInfoMOdalMessage(`Maximum Bet Amount = ${max}`);
    }
    else if (amount < min) {
      setInfoMOdal(true);
      setInfoMOdalMessage(`Enter Bet Amount more than ${min}`);
    }
    else if (choice === 'R') {
      // setting the random value in makebet function
      let randomCoinChoice = randomCoin();
      setRandomChoice(randomCoinChoice);
      console.log({ cryptoCurrency })
      if (cryptoCurrency === "SOL") {
        makeBet(randomCoinChoice);
      } else {
        console.log(randomCoinChoice)
        makeBetSpl(randomCoinChoice);
      }
    }
  };


  return (
    <Layout title="Partner">

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
          showTweet={data?.won}
          tweetTitle={`Won ${data?.payout} ${cryptoCurrency} on @justcoinflip 🎉 2.5X your Solana here: justcoinflip.xyz`}
          tweetImage="pic.twitter.com/yJ4XWbDI3Q"
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
                    src={cryptoCurrency === 'SOL' ? SolImage : cryptoCurrency === 'DUST' ? DustImage : cryptoCurrency === 'CREK' ? CrekImage : cryptoCurrency === "FORGE" ? ForgeImage : SolImage}
                    alt='Solana Icon'
                    className='w-5'
                    width='14'
                    height='14'
                  />
                  &nbsp;
                  <span className='text-[2vw] lg:text-sm'>{balance?.toString().slice(0, balance?.toString().indexOf('.') + 5)} {cryptoCurrency}</span>
                </div>
              )}
              <div className='lg:hidden'>
                <button
                  className={clsxm(
                    'w-[16vw] m-auto mx-1 select-none rounded-full bg-primary-200 px-3 py-1 text-[2vw] font-extrabold text-white md:py-3 lg:px-4 lg:py-2 lg:text-sm'
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

              <div className='mx-1 my-3 lg:mx-5'>
                <Select />
              </div>

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
                <p className='mx-5 text-red-600'>Maximum Bet Limit = {max}</p>
              )}
              {error && amount < min && (
                <p className='mx-5 text-red-600'>Minimum Bet Limit = {min}</p>
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
                      disabled={amount < min || amount > max}
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



        {/* ========================================= */}
        {/* ==========Chat and leaderboards========== */}
        {/* ========================================= */}

        {/* Hidden For Now Because Firebase is not functional yet */}

        <div className='hidden my-10'>

          <div className='grid grid-cols-12 gap-4'>
            <div className='col-span-12 order-first lg:col-span-4'>
              <BulletHeading title='Global Chat' />

              {/* ======= Chat Section ========== */}

              <div className='bg-primary-600 mt-3 pt-4 rounded-xl'>
                <div className='flex flex-col h-full'>
                  <div className='px-2 max-w-screen-lg h-full overflow-hidden flex-1 m-2'>
                    <SimpleBar timeout={500} scrollableNodeProps={{ ref: scrollRef }} clickOnTrack={false} className={clsxm(wallet ? "max-h-[398px]" : "max-h-[485px]")}>
                      {messagesList.map((user, i) =>
                        <div key={i}>
                          <Message image={user?.id === "1" ? image2 : image} message={user.text} username={user.username} time={user.time} user={user?.id === "1" ? true : false} />
                        </div>
                      )}
                    </SimpleBar>
                  </div>
                  {wallet &&
                    <div className='bg-primary-800 mt-2 rounded-b-xl p-3'>
                      <form
                        onSubmit={handleOnSubmit}
                        className='bg-primary-700 h-14 rounded-xl px-4 pt-3 z-10 max-w-screen-lg mx-auto shadow-md'
                      >
                        <div className='grid grid-cols-12 justify-between'>
                          {/* <div className='col-span-1 hidden md:block'><EmojiPicker value={newMessage} setValue={setNewMessage} /></div> */}
                          <div className='col-span-10'>
                            <input
                              className='flex-1 border-none bg-primary-700 w-full text-white outline-none outline-0 focus:outline-none focus:outline-offset-0'
                              ref={inputRef}
                              type='text'
                              value={newMessage}
                              onChange={handleOnChange}
                              placeholder='Type message '
                            />
                          </div>
                          <div className='col-span-2 flex justify-end'>
                            <span className='border-[#ffffff26] border-l-[1px] h-full mr-3'></span>
                            <button
                              type='submit'
                              disabled={!newMessage}
                              className='text-white cursor-pointer flex justify-center border-[rgba(255, 255, 255, 0.15)]'
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mb-2 rotate-45" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>}
                </div>
              </div>
            </div>

            {/* ======= Leader Board Section ======= */}

            <div className='col-span-12 order-last lg:col-span-8'>
              <BulletHeading title='Highest Wins' />

              <div className='bg-primary-600 mt-3 pt-4 rounded-xl'>
                <div className='flex justify-between items-center border-b-2 border-[#3e4e67] py-3 mx-8'>
                  <p className='text-white text-lg flex items-center'>Leaderboard</p>
                  <button className='flex items-center rounded-full bg-primary-800 py-1 md:py-2 px-2 md:px-3 font-extrabold text-white'>
                    <div>
                      <Clipboard className='m-0 h-4 w-4' />
                    </div>
                    <p className='text-[2vw] mx-1 md:text-xs'>
                      View all
                    </p>
                  </button>
                </div>

                <ul className='p-1 mt-2 md:mt-1 mx-4 md:p-4 md:mx-8'>
                  <SimpleBar timeout={500} clickOnTrack={false} className="max-h-[410px]">
                    {leaderBoard.map((user, i) => <div key={i}><LeaderBoard id={i} name={user?.name} payout={user?.payout} /></div>)}
                  </SimpleBar>
                </ul>
              </div>
            </div>
          </div>
        </div>



        {/* ========================================= */}
        {/* ==========All Bets Detail Table========== */}
        {/* ========================================= */}

        <div className='grid grid-cols-12' id="latestBets">
          {/* ======= Headings ======= */}
          <div className='col-span-2'>
            <BulletHeading title='Latest Bets' />
          </div>

          {/* ===================== */}
          {/* ======= Table ======= */}
          {/* ===================== */}

          {tableDatafromApi ? <Table data={tableDatafromApi} wallet={Boolean(wallet)} /> : <Dots />}

        </div>
      </div>
    </Layout>
  );
}
