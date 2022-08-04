//@ts-nocheck

import * as React from "react";
import base58 from "bs58";
import useSound from "use-sound";
import { AnchorProvider, Program, web3 } from "@project-serum/anchor";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { ConfirmOptions, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

import FlipSound from "@/assests/sounds/flipSound.mp3"
import WinSound from "@/assests/sounds/winSound.mp3"
import LossSound from "@/assests/sounds/lossSound.mp3"
import { PlayFunction } from "use-sound/dist/types";

const idl = require('@/idl/coinflip2');
const idlSpl = require('@/idl/coinflip2Spl');

interface Prop {
  children: React.ReactNode;
}

type FailedBet = {
  gameId: string;
  gambler: string;
  amount: number;
};

type Player = {
  publicKey?: number | string | any;
  account: Account;
  date?: number | string | any;
};

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

interface IAppContext {
  showBalance: boolean; setShowBalance: React.Dispatch<React.SetStateAction<boolean>>;
  infoMOdal: boolean; setInfoMOdal: React.Dispatch<React.SetStateAction<boolean>>;
  openGiveAwayModal: boolean; setOpenGiveAwayModal: React.Dispatch<React.SetStateAction<boolean>>;
  openProfileSetting: boolean; setOpenProfileSetting: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean; setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showNotification: boolean; setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
  flippingCoin: boolean; setFlippingCoin: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean; setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  winner: boolean; setWinner: React.Dispatch<React.SetStateAction<boolean>>;
  retryBet: boolean; setRetryBet: React.Dispatch<React.SetStateAction<boolean>>;
  data: any; setData: React.Dispatch<React.SetStateAction<any>>
  tableDatafromApi: any; setTableData: React.Dispatch<React.SetStateAction<any>>;
  notifications: any; setNotifications: React.Dispatch<React.SetStateAction<any>>;
  loadingIndex: number | null; setLoadingIndex: React.Dispatch<React.SetStateAction<number | null>>;
  balance: number | null; setBalance: React.Dispatch<React.SetStateAction<number | null>>;
  playerATokStr: string; setplayerATokStr: React.Dispatch<React.SetStateAction<string>>
  infoMOdalMessage: string; setInfoMOdalMessage: React.Dispatch<React.SetStateAction<string>>
  cryptoCurrency: string; setCryptoCurrency: React.Dispatch<React.SetStateAction<string>>
  modalMessage: string; setModalMessage: React.Dispatch<React.SetStateAction<string>>
  modalInfoMessage: string; setModalInfoMessage: React.Dispatch<React.SetStateAction<string>>
  playFlippingSound: PlayFunction; stopFlippingSound: (id?: string | undefined) => void
  playWinSound: PlayFunction; stopWinSound: (id?: string | undefined) => void
  playLossSound: PlayFunction; stopLossSound: (id?: string | undefined) => void
  getBalance: () => void;
  getBalanceSpl: () => void;
  getPlayerAToStr: (currency: string) => void;
  handleClose: () => void;
  closeBetModals: () => void;
  closeLoader: () => void;
  sendToDiscord: () => void;
  fetchAllSettledGames: () => void;
  fetchAllSettledGamesSpl: (currency: string) => void;
  fetchFailedGamesByUserSpl: (currency: string) => void
  fetchFailedGamesByUser: (user?: PublicKey) => void
  retryFailedBet: (gameId: string, gambler: string, amount: number, multiplier: number, odds: number) => void
  retryFailedBetSpl: (gameId: string, gambler: string, amount: number, multiplier: number, odds: number, currency: string) => void
  winImageURL: string
  lossImageURL: string
  notifyRef: React.MutableRefObject<any>
}

export const AppContext = React.createContext<IAppContext>({} as IAppContext);

// ===> New Opts <=== //
const opts: ConfirmOptions = {
  commitment: 'confirmed', // "finalized is better"
};

// const Api_Url = process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://justcoinflip.herokuapp.com'
const Api_Url = 'https://justcoinflip-test.herokuapp.com'
const programId = new web3.PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID!);
const programIdSpl = new web3.PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID_SPL!);

const connection = new web3.Connection(process.env.NEXT_PUBLIC_RPC_URL!, "confirmed");

const SplTokens: any = { "DUST": process.env.NEXT_PUBLIC_DUST!, "CREK": process.env.NEXT_PUBLIC_CREK!, "FORGE": process.env.NEXT_PUBLIC_FORGE! };
const GameVaultSplTokens: any = { "DUST": process.env.NEXT_PUBLIC_GAME_VAULT_DUST!, "CREK": process.env.NEXT_PUBLIC_GAME_VAULT_CREK!, "FORGE": process.env.NEXT_PUBLIC_GAME_VAULT_FORGE! };
const GameVaultSplTokensATok: any = { "DUST": process.env.NEXT_PUBLIC_GAME_VAULT_ATOK_DUST!, "CREK": process.env.NEXT_PUBLIC_GAME_VAULT_ATOK_CREK!, "FORGE": process.env.NEXT_PUBLIC_GAME_VAULT_ATOK_FORGE! };
const GameAccountSplTokens: any = { "DUST": process.env.NEXT_PUBLIC_GAME_ACCOUNT_DUST!, "CREK": process.env.NEXT_PUBLIC_GAME_ACCOUNT_CREK!, "FORGE": process.env.NEXT_PUBLIC_GAME_ACCOUNT_FORGE! };


export const AppProvider = ({ children }: Prop) => {

  const wallet = useAnchorWallet();

  if (wallet) {
    const provider = new AnchorProvider(connection, wallet, opts);
    const program = new Program(idl, programId, provider);
  }

  const notifyRef = React.useRef<any>(null);

  const [showNotification, setShowNotification] = React.useState<boolean>(false);
  const [notifications, setNotifications] = React.useState<any>([])

  const [balance, setBalance] = React.useState<number | null>(null);
  const [showBalance, setShowBalance] = React.useState<boolean>(false);
  const [data, setData] = React.useState<any>();
  const [tableDatafromApi, setTableData] = React.useState<any>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [flippingCoin, setFlippingCoin] = React.useState<boolean>(false);
  const [dataDiscord, setDataDiscord] = React.useState<any>();
  const [playerATokStr, setplayerATokStr] = React.useState<string>('');

  const [infoMOdal, setInfoMOdal] = React.useState<boolean>(false);
  const [infoMOdalMessage, setInfoMOdalMessage] = React.useState<string>('');

  const [retryBet, setRetryBet] = React.useState<boolean>(false);
  const [loadingIndex, setLoadingIndex] = React.useState<number | null>(null);
  const [winner, setWinner] = React.useState<boolean>(false);
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [openGiveAwayModal, setOpenGiveAwayModal] = React.useState<boolean>(false);
  const [openProfileSetting, setOpenProfileSetting] = React.useState<boolean>(false);
  const [modalMessage, setModalMessage] = React.useState<string>('');
  const [modalInfoMessage, setModalInfoMessage] = React.useState<string>('');
  const [cryptoCurrency, setCryptoCurrency] = React.useState<string>('SOL');

  //--------------------------------------------------------------------
  // Sound States
  //--------------------------------------------------------------------

  const [playFlippingSound, { stop: stopFlippingSound }] = useSound(FlipSound)
  const [playWinSound, { stop: stopWinSound }] = useSound(WinSound)
  const [playLossSound, { stop: stopLossSound }] = useSound(LossSound)


  //--------------------------------------------------------------------
  // Url Images to Embed
  //--------------------------------------------------------------------

  const winImageURL: string = "https://i.ibb.co/YdKBtBB/Whats-App-Image-2022-07-04-at-23-59-15.jpg"
  const lossImageURL: string = "https://i.ibb.co/FVfQnjT/Whats-App-Image-2022-07-04-at-23-59-15-1.jpg"

  //--------------------------------------------------------------------
  // Side Effects
  //--------------------------------------------------------------------

  // Changing Button Text from Select Wallet => Connect Wallet
  React.useEffect(() => {
    if (!wallet) {
      const walletButton = document.querySelector('.connectBtn') as HTMLElement | null;
      if (walletButton !== null) walletButton.innerText = 'Connect Wallet';
      fetchGamesData()
    } else if (wallet) {
      if (cryptoCurrency === "SOL") getBalance()
      if (cryptoCurrency !== "SOL") getBalanceSpl(cryptoCurrency);
      fetchGamesData()
      fetchFailedGamesData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet, cryptoCurrency]);

  // Show Modal on Win | Loss
  React.useEffect(() => {
    if (data?.won === true) {
      playWinSound()
      setFlippingCoin(false);
      setShowModal(true);
      setWinner(true);
      setModalMessage(data?.message);
      setModalInfoMessage("Your balance may take a few seconds to adjust on the blockchain")
      setTimeout(closeBetModals, 20000);
      sendToDiscord()
      fetchGamesData()
      setTimeout(fetchFailedGamesData, 15000);
      setShowNotification(false)
      if (cryptoCurrency === "SOL") getBalance()
      if (cryptoCurrency !== "SOL") getBalanceSpl(cryptoCurrency);
    } else if (data?.won === false) {
      playLossSound()
      setFlippingCoin(false);
      setShowModal(true);
      setWinner(false);
      setModalMessage(data?.message);
      setModalInfoMessage("Your balance may take a few seconds to adjust on the blockchain")
      setTimeout(closeBetModals, 5000);
      sendToDiscord()
      fetchGamesData()
      setTimeout(fetchFailedGamesData, 3000);
      setShowNotification(false)
      if (cryptoCurrency === "SOL") getBalance()
      if (cryptoCurrency !== "SOL") getBalanceSpl(cryptoCurrency);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Show modal if data return error
  React.useEffect(() => {
    if (data?.result.includes("Error") || data?.result.status === 404) {
      closeLoader()
      stopFlippingSound()
      setShowNotification(false)
      setTimeout(fetchFailedGamesData, 15000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Fetch Balance after data result
  React.useEffect(() => {
    if (data?.won === true || false) {
      setTimeout(getBalance, 10000);
      setTimeout(fetchGamesData, 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.reslt]);

  // // showing notification badge
  React.useEffect(() => {
    if (notifications?.length > 0 && !showModal) {
      setShowNotification(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications])

  // changing the playerString Based on currency
  React.useEffect(() => {
    getPlayerAToStr(cryptoCurrency)
    getBalanceSpl(cryptoCurrency)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet, cryptoCurrency]);


  // const notifyMe = () => { notifyRef?.current?.click(); setTriggerNotification(true) }

  //--------------------------------------------------------------------
  // Callbacks
  //--------------------------------------------------------------------

  const findAssociatedTokenAddress = async (walletAddress: web3.PublicKey, tokenMintAddress: web3.PublicKey): Promise<string> => {
    const ASSOCIATED_TOKEN_PROGRAM_ID = await new web3.PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
    let programAddress = await web3.PublicKey.findProgramAddress([walletAddress?.toBuffer(), TOKEN_PROGRAM_ID?.toBuffer(), tokenMintAddress?.toBuffer(),], ASSOCIATED_TOKEN_PROGRAM_ID)
    programAddress = programAddress[0].toString()
    return programAddress
  }

  const getPlayerAToStr = async (currency: string) => {
    if (cryptoCurrency !== "SOL") {
      const tokenAddress = await findAssociatedTokenAddress(wallet?.publicKey, new web3.PublicKey(SplTokens[currency]))
      setplayerATokStr(tokenAddress)
    }
  }

  const fetchGamesData = () => {
    if (cryptoCurrency === "SOL") fetchAllSettledGames()
    else fetchAllSettledGamesSpl(cryptoCurrency)
  }

  const fetchFailedGamesData = () => {
    if (cryptoCurrency === "SOL") fetchFailedGamesByUser()
    else fetchFailedGamesByUserSpl(cryptoCurrency)
  }

  const fetchFailedGamesByUserSpl = async (currency: string) => {
    if (!wallet && currency === "SOL") {
      return;
    }
    const provider = new AnchorProvider(new web3.Connection(process.env.NEXT_PUBLIC_RPC_URL!, "confirmed"), wallet, opts);
    const program = new Program(idlSpl, programIdSpl, provider);
    const user = wallet?.publicKey
    const mint = new web3.PublicKey(SplTokens[currency])
    var result: any[] = await program?.account.gameIdSpl.all([
      //choice should be either H or T
      {
        memcmp: {
          offset: 8, // Discriminator.
          bytes: user?.toBase58(),
        }
      },
      {
        memcmp: {
          offset: 8 + // Discriminator.
            + 32 //pubkey,
            + 1// u8
            + 4 + 1//string prefix and one character
            + 4 + 1//string prefix and one character
            + 2 //2 bool
            + 16 //2 u64
          ,
          bytes: mint.toBase58(),
        }
      },
      {
        memcmp: {
          offset: 8 + // Discriminator.
            + 32 //pubkey,
            + 1// u8
            + 4 + 1//string prefix and one character
            + 4 + 1//string prefix and one character
          ,
          bytes: base58?.encode([0]), //not settled
        }
      },
    ]);


    var result: any[] = result.map((obj) => {
      let r: FailedBet = {
        gameId: obj?.publicKey?.toBase58(), gambler: obj?.account.gambler.toBase58(), amount: obj?.account.amount.toNumber() / LAMPORTS_PER_SOL,
        odds: obj?.account.odds,

      }
      return r
    })

    // return result
    console.log({ result })
    setNotifications(result)
  }

  const fetchFailedGamesByUser = async () => {
    if (!wallet) {
      return;
    }
    const provider = new AnchorProvider(new web3.Connection(process.env.NEXT_PUBLIC_RPC_URL!, "confirmed"), wallet, opts);
    const program = new Program(idl, programId, provider);
    const user = wallet?.publicKey
    var result: any[] = await program?.account.gameId.all([
      //choice should be either H or T
      {
        memcmp: {
          offset: 8, // Discriminator.
          bytes: user?.toBase58(),
        }
      },
      {
        memcmp: {
          offset: 8 + // Discriminator.
            + 32 //pubkey,
            + 1// u8
            + 4 + 1//string prefix and one character
            + 4 + 1//string prefix and one character
          ,
          bytes: base58?.encode([0]), //not settled
        }
      },
    ]);


    var result: any[] = result.map((obj) => {
      let r: FailedBet = {
        gameId: obj?.publicKey?.toBase58(), gambler: obj?.account.gambler.toBase58(), amount: obj?.account.amount.toNumber() / LAMPORTS_PER_SOL,
        odds: obj?.account.odds
      }
      return r
    })

    // return result
    setNotifications(result)
  }

  const retryFailedBet = async (gameId: string, gambler: string, amount: number, multiplier: number, odds: number) => {

    try {
      console.log('Retrying bet');
      setShowNotification(false)
      //program and provider should be the ones initialised with initialisedEnv using the user wallet

      let gameIdStr = gameId;
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
      setLoadingIndex(null)
      setData(resultData);
      setShowNotification(true)
      setTimeout(fetchFailedGamesByUser, 2000);
      setTimeout(fetchAllSettledGames, 2000);
      setRetryBet(false)
    } catch (error) {
      setTimeout(closeLoader, 500);
      setTimeout(fetchFailedGamesByUser, 2000);
      setTimeout(fetchAllSettledGames, 2000);
      console.log(error);
    }
  };

  const retryFailedBetSpl = async (gameId: string, gambler: string, amount: number, multiplier: number, odds: number, currency: string) => {

    try {
      console.log('Retrying bet');
      setShowNotification(false)
      //program and provider should be the ones initialised with initialisedEnv using the user wallet

      let gameIdStr = gameId;
      let optsStr = 'confirmed';
      let mint = new web3.PublicKey(SplTokens[currency]);
      let playerATokStr = await findAssociatedTokenAddress(wallet?.publicKey, mint);
      const response = await fetch(`${Api_Url}/makeBet`, {
        method: 'POST',
        body: JSON.stringify({ gameIdStr, gambler, optsStr, amount, multiplier, odds, currency, playerATokStr }),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });

      const resultData = await response.json();
      setLoadingIndex(null)
      setData(resultData);
      setShowNotification(true)
      setTimeout(fetchFailedGamesByUser, 2000);
      setTimeout(fetchAllSettledGames, 2000);
      setRetryBet(false)
    } catch (error) {
      setTimeout(closeLoader, 500);
      setTimeout(fetchFailedGamesByUser, 2000);
      setTimeout(fetchAllSettledGames, 2000);
      console.log(error);
    }
  };

  //--------------------------------------------------------------------
  // Bet Data From blockchain
  //--------------------------------------------------------------------

  const fetchAllSettledGames = async () => {
    const provider2 = new AnchorProvider(connection, Keypair.generate(), opts);
    const program2 = new Program(idl, programId, provider2);
    let result = await program2.account?.gameId?.all([
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

          bytes: base58.encode([1]),
        },
      },
    ]);

    // converting date
    let formatedData = result?.map((user: any, i: number) => {
      const time = user?.account.timestamp.toString();
      const date = new Date(time * 1000);
      return { ...user, date };
    });
    //sortign array based on dateF
    formatedData.sort(function (a, b) {
      var dateA: any = new Date(a.date),
        dateB: any = new Date(b.date);
      return dateB - dateA;
    });

    const multiplier = (value: number) => {
      if (value === 40) return 2.5
      if (value === 50) return 2
      if (value === 60) return 1.66
    }

    let filterOutZeroBets = formatedData?.slice(0, 10).filter((user: Player) => {
      const multiply: any = multiplier(user.account.odds)
      if ((user.account.amount.toString() * multiply) / LAMPORTS_PER_SOL !== 0) {
        return user
      }
    })

    setTableData(filterOutZeroBets);
  };

  const fetchAllSettledGamesSpl = async (currency: string) => {
    const provider2 = new AnchorProvider(connection, Keypair.generate(), opts);
    const program2 = new Program(idlSpl, programIdSpl, provider2);
    const mint = new web3.PublicKey(SplTokens[currency]);
    let result = await program2.account?.gameIdSpl?.all([
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

          bytes: base58.encode([1]),
        },
      },
      {
        memcmp: {
          offset: 8 + // Discriminator.
            + 32 //pubkey,
            + 1// u8
            + 4 + 1//string prefix and one character
            + 4 + 1//string prefix and one character
            + 2 //2 bool
            + 16 //2 u64
          ,
          bytes: mint.toBase58(),
        }
      }
    ]);

    // converting date
    let formatedData = result?.map((user: any, i: number) => {
      const time = user?.account.timestamp.toString();
      const date = new Date(time * 1000);
      return { ...user, date };
    });
    //sortign array based on dateF
    formatedData.sort(function (a, b) {
      var dateA: any = new Date(a.date),
        dateB: any = new Date(b.date);
      return dateB - dateA;
    });

    const multiplier = (value: number) => {
      if (value === 40) return 2.5
      if (value === 50) return 2
      if (value === 60) return 1.66
    }

    let filterOutZeroBets = formatedData?.slice(0, 10).filter((user: Player) => {
      const multiply: any = multiplier(user.account.odds)
      if ((user.account.amount.toString() * multiply) / LAMPORTS_PER_SOL !== 0) {
        return user
      }
    })

    setTableData(filterOutZeroBets);
  };

  const getBalance = async () => {
    const balance = await connection.getBalance(wallet?.publicKey);
    setBalance(balance / LAMPORTS_PER_SOL);
    setShowBalance(true);
  }

  const getBalanceSpl = async (currency) => {
    console.log(currency)
    if (currency !== "SOL") {
      const tokenAddress = await findAssociatedTokenAddress(wallet?.publicKey, new web3.PublicKey(SplTokens[currency]))
      console.log("playerATokStr", tokenAddress)
      if (tokenAddress !== '') {
        const playerValue = await new PublicKey(tokenAddress);
        console.log(playerValue)
        let newbalance = await connection.getTokenAccountBalance(playerValue);
        console.log({ balance })
        newbalance = parseInt(newbalance.value.amount) / LAMPORTS_PER_SOL
        setBalance(newbalance);
        setShowBalance(true);
      }
    }
  }

  const closeBetModals = async () => {
    fetchAllSettledGames()
    getBalance()
    setShowModal(false);
    stopWinSound()
    stopLossSound()
  };

  const closeLoader = async () => {
    await setFlippingCoin(false);
    await stopFlippingSound();
    setLoading(false);
    await fetchAllSettledGames()
    await fetchFailedGamesByUser()
    await getBalance()
    const showErrorMessage = () => {
      setInfoMOdal(true);
      setInfoMOdalMessage('Ooops! Something Went Wrong');
    };
    setTimeout(showErrorMessage, 500);
  };

  const handleClose = () => {
    setShowNotification(!showNotification);
  };

  const sendToDiscord = async () => {
    var title = 'New Flip :coin:'
    let message = data?.message
    let payOut = data?.payout
    const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/993000533751242832/bL5u27D9W1dXVjBJ_4AJ37QgD-daU201PhICCKyAxB5nD0qqKNniNrT6XLdrNy54WO6K'

    const embeds = {
      "embeds": [
        {
          "title": title,
          "description": message,
          "thumbnail": {
            "url": data?.won === true ? winImageURL : lossImageURL
          },
          "fields": [{
            "name": "Payout",
            "value": `${payOut} SOL`,
            "inline": true,
          }],
        }
      ]
    }

    try {
      let res = await fetch('https://discord.com/api/webhooks/993000533751242832/bL5u27D9W1dXVjBJ_4AJ37QgD-daU201PhICCKyAxB5nD0qqKNniNrT6XLdrNy54WO6K' + "?wait=true", {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: "cors",
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
        },
        body: JSON.stringify(embeds),
      })

      const result = await res.json()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AppContext.Provider
      value={{
        data, setData,
        balance, setBalance,
        flippingCoin, setFlippingCoin,
        tableDatafromApi, setTableData,
        showBalance, setShowBalance,
        loading, setLoading,
        showNotification, setShowNotification,
        openGiveAwayModal, setOpenGiveAwayModal,
        openProfileSetting, setOpenProfileSetting,
        infoMOdalMessage, setInfoMOdalMessage,
        notifications, setNotifications,
        infoMOdal, setInfoMOdal,
        winner, setWinner,
        retryBet, setRetryBet,
        showModal, setShowModal,
        modalMessage, setModalMessage,
        modalInfoMessage, setModalInfoMessage,
        cryptoCurrency, setCryptoCurrency,
        loadingIndex, setLoadingIndex,
        playerATokStr, setplayerATokStr,
        playFlippingSound, stopFlippingSound,
        playWinSound, stopWinSound,
        playLossSound, stopLossSound,
        handleClose,
        fetchAllSettledGames, fetchAllSettledGamesSpl,
        fetchFailedGamesByUser, fetchFailedGamesByUserSpl,
        retryFailedBet, retryFailedBetSpl, getPlayerAToStr,
        closeBetModals,
        closeLoader,
        getBalance, getBalanceSpl,
        sendToDiscord,
        winImageURL,
        lossImageURL,
        notifyRef
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
