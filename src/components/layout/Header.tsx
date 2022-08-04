import * as React from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import NextImage from '@/components/NextImage';
import Image from 'next/image';

import { Popover, Transition } from '@headlessui/react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { AnchorProvider, BN, Program, web3 } from '@project-serum/anchor';
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import { AppContext } from '@/context/AppContext';

import Clipboard from '@/assests/icons/Clipboard';
import Bell from '@/assests/icons/Bell';
import WarningIcon from '@/assests/icons/Warning';
import RetryIcon from '@/assests/icons/Retry';
import { ImageModal } from '@/components/Modal/ImageModal';
import Logo from '@/assests/icons/Logo';
import { useRouter } from 'next/router';
import { ProfileSetting } from '@/components/Modal/ProfileSetting';
import Person from '@/assests/icons/Person';
import image from "@/assests/images/Eighties.png"
import CameraIcon from "@/assests/images/Camera.png"
import Camera from '@/assests/icons/Camera';
import EditIcon from '@/assests/icons/Edit';
import ProgressBar from '@/components/ProgressBar';
import GiftIcon from '@/assests/icons/Gift';
import LinkIcon from '@/assests/icons/Link';
import StatsCoin from '@/assests/icons/StatsCoin';
import ChartIcon from '@/assests/icons/Chart';
import PeoplesIcon from '@/assests/icons/Peoples';
import BookIcon from '@/assests/icons/Book';
import SimpleBar from 'simplebar-react';

const GuideLink = process.env.NEXT_PUBLIC_GUIDE_URL ? process.env.NEXT_PUBLIC_GUIDE_URL : "/"
const NftImage = process.env.NEXT_PUBLIC_GIVEAWAY_IMAGE_URL!
const NftHeading = process.env.NEXT_PUBLIC_GIVEAWAY_HEADING!
const NftSubHeading = process.env.NEXT_PUBLIC_GIVEAWAY_SUBHEADING!

export default function Header() {
  const wallet = useAnchorWallet();
  const router = useRouter()

  // AppContext
  const { showNotification, notifyRef, handleClose, notifications, cryptoCurrency, setShowNotification, openGiveAwayModal, openProfileSetting, setOpenProfileSetting, setOpenGiveAwayModal, fetchFailedGamesByUser, retryFailedBet, retryFailedBetSpl, setRetryBet, loadingIndex, setLoadingIndex } = React.useContext(AppContext);

  const [isOpen, setIsOpen] = React.useState(false);


  const base58 = React.useMemo(() => wallet?.publicKey?.toBase58(), [wallet]);

  // Changing Button Text from Select Wallet => Connect Wallet
  React.useEffect(() => {
    if (!wallet) {
      const DesktopwalletButton = document.querySelector('.header-connectBtn') as HTMLElement | null;
      if (DesktopwalletButton !== null) DesktopwalletButton.innerText = 'Connect';
    }
  }, [wallet]);

  React.useEffect(() => {
    if (wallet) {
      fetchFailedGamesByUser()
      setTimeout(fetchFailedGamesByUser, 30000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

  const content = React.useMemo(() => {
    if (!wallet || !base58) return null;
    return base58.slice(0, 4) + '..' + base58.slice(-4);
  }, [wallet, base58]);

  const handleRetryBet = async (notification: any, i: number) => {
    const { gameId, gambler, amount, odds } = notification
    const currency = cryptoCurrency
    let multiplierMap: any = { 40: 2.5, 50: 2, 60: 1.66 };
    var multiplier = multiplierMap[odds];
    setLoadingIndex(i)
    setRetryBet(true)
    if (cryptoCurrency === "SOL") await retryFailedBet(gameId, gambler, amount, multiplier, odds);
    else await retryFailedBetSpl(gameId, gambler, amount, multiplier, odds, currency);
  }



  return (
    <nav className='navbar sticky top-0 z-20 mx-auto bg-gray-800'>
      <div className='mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='container mx-auto flex h-16 items-center justify-between'>
          <div className='flex items-center justify-between'>
            {/* Logo */}
            <div className='flex-shrink-0 cursor-pointer select-none' onClick={() => router.push("/")}>
              <Logo className='py-1 w-40 md:w-64' />
            </div>
          </div>

          {/* mobile screen Links */}
          <div className='-mr-2 flex lg:hidden items-center'>

            {/* Notification Mobile Screen */}

            {
              wallet &&
              <Popover>
                {({ open }) => (
                  <>
                    <Popover.Button
                      className="group flex items-center rounded-md text-base font-medium text-white hover:text-opacity-100 focus:outline-none"
                    >
                      <button className='relative'
                        id='notify'
                        ref={notifyRef}
                        onClick={() => { setShowNotification(true); setOpenProfileSetting(false) }}>
                        <Bell className='h-6 w-8 fill-white cursor-pointer' />
                        {notifications?.length > 0 && <span className="inline-block absolute top-0 -right-1 w-2 h-2 mr-2 bg-red-600 rounded-full"></span>}
                      </button>
                    </Popover.Button>
                    <Transition
                      show={!openProfileSetting && showNotification}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <Popover.Panel static className="bg-[#283345] shadow-[0_3px_19px_0_rgba(0, 0, 0, 0.23)] absolute -right-[5em] lg:-left-[6em] lg:top-10 rounded-xl z-10 mt-3 min-w-[95vw] lg:min-w-[460px] max-w-[460px] px-4 sm:px-0">
                        {wallet &&
                          <div>
                            <div className='py-3 lg:p-5'>
                              <p className='text-center mb-2 text-[#e9cb70]'>Notifications</p>
                              {notifications?.length > 0 &&
                                <SimpleBar timeout={500} clickOnTrack={false} className="max-h-[400px]">
                                  {notifications?.map((n: any, i: number) =>
                                    <div key={n?.gameId} className='bg-[#344258] px-3 my-4 rounded-3xl py-6 grid grid-cols-12 justify-between items-center'>
                                      <div className='col-span-1'>
                                        <WarningIcon className='h-8 w-8 fill-[#4ae288]' />
                                      </div>
                                      <div className='col-span-10 px-4'>
                                        <p className='lg:text-sm text-[3vw] leading-5 lg:leading-6 text-white font-extrabold'>Failed pending bet for {n?.amount} $SOL</p>
                                        <p className='lg:text-sm semi-bold text-white text-[9px] leading-3 lg:leading-6'>Solana network failed transaction. Dont worry! Click retry to try again 👉</p>
                                      </div>
                                      <div className='col-span-1'>
                                        {loadingIndex !== i ?
                                          <span onClick={() => handleRetryBet(n, i)}>
                                            <RetryIcon className='h-7 w-7 lg:h-8 lg:w-8 cursor-pointer'
                                            />
                                          </span>
                                          : <p className='dot-typing'></p>
                                        }
                                        {/* {loadingIndex === i && } */}
                                      </div>
                                    </div>
                                  )}
                                </SimpleBar>
                              }
                              <div className={clsx('flex justify-center items-center', notifications?.length === 0 && "mt-8")}>
                                <Popover.Button className='bg-[#344258] px-6 py-2 my-4 text-white rounded-full' onClick={handleClose}>Close</Popover.Button>
                              </div>
                            </div>
                          </div>
                        }
                      </Popover.Panel>
                    </Transition>
                  </>
                )}
              </Popover>
            }

            {/* Profile Mobile Screen */}

            {
              wallet &&
              <Popover>
                <>
                  <Popover.Button
                    className="group flex items-center rounded-md text-base font-medium text-white hover:text-opacity-100 focus:outline-none"
                  >
                    <button className='relative'
                      onClick={() => { setOpenProfileSetting(true); setShowNotification(false) }}>
                      <Person className='h-6 w-8 fill-white cursor-pointer' />
                    </button>
                  </Popover.Button>

                  <Transition
                    as={React.Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel static className="bg-[#283345] shadow-[0_3px_19px_0_rgba(0, 0, 0, 0.23)] absolute left-[1em] lg:left-[70%] lg:top-10 rounded-xl z-10 mt-3 w-[96vw] lg:max-w-sm px-4">
                      {wallet &&
                        <div>
                          <div className='py-3 lg:p-5'>
                            <div className='hidden bg-primary-900 rounded-xl relative py-4'>
                              <div className='grid grid-cols-12 py-3 px-4 items-center'>
                                <div className='flex col-span-8'>
                                  <div className="relative flex items-center">
                                    <Image
                                      src={image}
                                      alt='Avatar'
                                      id='ProflieAvatar'
                                      className='rounded-full'
                                      width={65}
                                      height={65}
                                    />
                                    <div className='absolute top-0 -right-1 cursor-pointer bg-[#d2d2d2] rounded-full flex justify-center '>
                                      <Camera className="h-3 w-3 m-1" />
                                    </div>
                                  </div>

                                  <div className='ml-3 flex flex-col m-auto'>
                                    <div className='flex items-center'>
                                      <p className='black text-white font-bold text-lg'>Username</p>
                                      <EditIcon className='text-white ml-2 h-3 w-3 cursor-pointer' />
                                    </div>
                                    <div className='flex items-center'>
                                      <p className='black text-white opacity-[0.72] text-[10px] font-bold h-4 flex items-center'>LEVEL 19 <span className='text-[#fff77c] ml-2'>250/350</span></p>
                                    </div>
                                  </div>
                                </div>
                                <div className='col-span-4'>
                                  <button className='bg-primary-700 text-white px-6 py-2 rounded-full'>
                                    Logout
                                  </button>
                                </div>
                              </div>
                              <ProgressBar width={`80%`} />
                            </div>
                            {NftImage && NftHeading && NftSubHeading &&
                              <div className='flex py-3 items-center border-b-2 cursor-pointer border-[#3e4e67]' onClick={() => setOpenGiveAwayModal(true)}>
                                <GiftIcon color='#bfb765' className='h-7 w-7' />
                                <p className='ml-2 px-3 py-1 rounded-lg text-white hover:bg-gray-700 text-base font-bold flex items-center'>Enter Giveaway</p>
                              </div>
                            }
                            {/* <div className='flex py-3 items-center border-b-2 cursor-pointer border-[#3e4e67]'>
                              <LinkIcon color='#6566bf' className='h-7 w-7' />
                              <p className='mt-1 ml-2 px-3 py-1 rounded-lg text-white hover:bg-gray-700 text-base font-bold flex items-center'>Affilate</p>
                            </div> */}
                            <Link href="/stats">
                              <div className='flex py-3 items-center border-b-2 cursor-pointer border-[#3e4e67]'>
                                <ChartIcon color='#65bf9b' className='h-7 w-7' />
                                <p className='mt-1 ml-2 px-3 py-1 rounded-lg text-white hover:bg-gray-700 text-base font-bold flex items-center'>Statistics</p>
                              </div>
                            </Link>
                            <a href="https://forms.gle/6FgSSYbkFQ1UEYfP9" target="_blank" rel="noreferrer" >
                              <div className='flex py-3 items-center border-b-2 cursor-pointer border-[#3e4e67] '>
                                <PeoplesIcon color='#b7c0d8' className='h-7 w-7' />
                                <p className='mt-1 ml-2 px-3 py-1 rounded-lg text-white hover:bg-gray-700 text-base font-bold flex items-center'>Collab</p>
                              </div>
                            </a>
                            <a href={GuideLink} target="_blank" rel="noreferrer" >
                              <div className='flex py-3 items-center cursor-pointer'>
                                <BookIcon color='#4ae288' className='h-7 w-7' />
                                <p className='mt-1 ml-2 px-3 py-1 rounded-lg text-white hover:bg-gray-700 text-base font-bold flex items-center'>Guide</p>
                              </div>
                            </a>
                          </div>
                        </div>
                      }
                    </Popover.Panel>
                  </Transition>
                </>
              </Popover>
            }

            <button
              onClick={() => setIsOpen(!isOpen)}
              type='button'
              className='inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
              aria-controls='mobile-menu'
              aria-expanded='false'
            >
              <span className='sr-only'>Open main menu</span>
              {!isOpen ? (
                <svg
                  className='block h-6 w-6'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  aria-hidden='true'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                </svg>
              ) : (
                <svg
                  className='block h-6 w-6'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  aria-hidden='true'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop screen Links */}
          <div className='hidden lg:block'>
            <div className='ml-10 flex items-center space-x-4'>

              {/* Desktop screen  Notification */}

              {
                wallet &&
                <Popover>
                  {({ open }) => (
                    <>
                      <Popover.Button
                        className="group flex items-center rounded-md text-base font-medium text-white hover:text-opacity-100 focus:outline-none"
                      >
                        <button className='relative'
                          id='notify'
                          ref={notifyRef}
                          onClick={() => { setShowNotification(true); setOpenProfileSetting(false) }}>
                          <Bell className='h-6 w-8 fill-white cursor-pointer' />
                          {notifications?.length > 0 && <span className="inline-block absolute top-0 -right-1 w-2 h-2 mr-2 bg-red-600 rounded-full"></span>}
                        </button>
                      </Popover.Button>

                      <Transition
                        show={showNotification && !openProfileSetting}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <Popover.Panel static className="bg-[#283345] shadow-[0_3px_19px_0_rgba(0, 0, 0, 0.23)] absolute -left-[6em] lg:top-10 rounded-xl z-10 mt-3 min-w-[100vw] lg:min-w-[460px] max-w-[460px] px-4 sm:px-0">
                          {wallet &&
                            <div>
                              <div className='py-3 lg:p-5'>
                                <p className='text-center mb-2 text-[#e9cb70]'>Notifications</p>
                                {notifications?.length > 0 &&
                                  <SimpleBar timeout={500} clickOnTrack={false} className="max-h-[500px]">
                                    {notifications?.map((n: any, i: number) =>
                                      <div key={n?.gameId} className='bg-[#344258] px-3 my-4 rounded-3xl py-6 grid grid-cols-12 justify-between items-center'>
                                        <div className='col-span-1'>
                                          <WarningIcon className='h-8 w-8 fill-[#4ae288]' />
                                        </div>
                                        <div className='col-span-10 px-4'>
                                          <p className='lg:text-sm text-[3vw] leading-5 lg:leading-6 text-white font-extrabold'>Failed pending bet for {n?.amount} ${cryptoCurrency}</p>
                                          <p className='lg:text-sm semi-bold text-white text-[9px] leading-3 lg:leading-6'>Solana network failed transaction. Dont worry! Click retry to try again 👉</p>
                                        </div>
                                        <div className='col-span-1'>
                                          {loadingIndex !== i ?
                                            <span onClick={() => handleRetryBet(n, i)}>
                                              <RetryIcon className='h-7 w-7 lg:h-8 lg:w-8 cursor-pointer'
                                              />
                                            </span>
                                            : <p className='dot-typing'></p>
                                          }
                                          {/* {loadingIndex === i && } */}
                                        </div>
                                      </div>
                                    )}
                                  </SimpleBar>
                                }
                                <div className={clsx('flex justify-center items-center', notifications?.length === 0 && "mt-8")}>
                                  <Popover.Button className='bg-[#344258] px-6 py-2 my-4 text-white rounded-full' onClick={handleClose}>Close</Popover.Button>
                                </div>
                              </div>
                            </div>
                          }
                        </Popover.Panel>
                      </Transition>
                    </>
                  )}
                </Popover>
              }

              {/* Profile Desktop Screen */}

              {
                wallet &&
                <Popover>
                  <>
                    <Popover.Button
                      className="group flex items-center rounded-md text-base font-medium text-white hover:text-opacity-100 focus:outline-none"
                    >
                      <button className='relative'
                        onClick={() => { setOpenProfileSetting(true); setShowNotification(false) }}>
                        <Person className='h-6 w-8 fill-white cursor-pointer' />
                      </button>
                    </Popover.Button>

                    <Transition
                      as={React.Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <Popover.Panel static className="bg-[#283345] shadow-[0_3px_19px_0_rgba(0, 0, 0, 0.23)] absolute left-[70%] lg:top-16 rounded-xl z-10 mt-3 w-screen lg:max-w-sm px-4 sm:px-0">
                        {wallet &&
                          <div>
                            <div className='py-3 lg:p-5'>
                              <div className='hidden bg-primary-900 rounded-xl relative py-4'>
                                <div className='grid grid-cols-12 py-3 px-4 items-center'>
                                  <div className='flex col-span-8'>
                                    <div className="relative flex items-center">
                                      <Image
                                        src={image}
                                        alt='Avatar'
                                        id='ProflieAvatar'
                                        className='rounded-full'
                                        width={65}
                                        height={65}
                                      />
                                      <div className='absolute top-0 -right-1 cursor-pointer bg-[#d2d2d2] rounded-full flex justify-center '>
                                        <Camera className="h-3 w-3 m-1" />
                                      </div>
                                    </div>

                                    <div className='ml-3 flex flex-col m-auto'>
                                      <div className='flex items-center'>
                                        <p className='black text-white font-bold text-lg'>Username</p>
                                        <EditIcon className='text-white ml-2 h-3 w-3 cursor-pointer' />
                                      </div>
                                      <div className='flex items-center'>
                                        <p className='black text-white opacity-[0.72] text-[10px] font-bold h-4 flex items-center'>LEVEL 19 <span className='text-[#fff77c] ml-2'>250/350</span></p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className='col-span-4'>
                                    <button className='bg-primary-700 text-white px-6 py-2 rounded-full'>
                                      Logout
                                    </button>
                                  </div>
                                </div>
                                <ProgressBar width={`80%`} />
                              </div>
                              {NftImage && NftHeading && NftSubHeading &&
                                <div className='flex py-3 items-center border-b-2 cursor-pointer border-[#3e4e67]' onClick={() => setOpenGiveAwayModal(true)}>
                                  <GiftIcon color='#bfb765' className='h-7 w-7' />
                                  <p className='ml-2 px-3 py-1 rounded-lg text-white hover:bg-gray-700 text-base font-bold flex items-center'>Enter Giveaway</p>
                                </div>
                              }
                              {/* <div className='flex py-3 items-center border-b-2 cursor-pointer border-[#3e4e67]'>
                                <LinkIcon color='#6566bf' className='h-7 w-7' />
                                <p className='mt-1 ml-2 px-3 py-1 rounded-lg text-white hover:bg-gray-700 text-base font-bold flex items-center'>Affilate</p>
                              </div> */}
                              <Link href="/stats">
                                <div className='flex py-3 items-center border-b-2 cursor-pointer border-[#3e4e67]'>
                                  <ChartIcon color='#65bf9b' className='h-7 w-7' />
                                  <p className='mt-1 ml-2 px-3 py-1 rounded-lg text-white hover:bg-gray-700 text-base font-bold flex items-center'>Statistics</p>
                                </div>
                              </Link>
                              <a href="https://forms.gle/6FgSSYbkFQ1UEYfP9" target="_blank" rel="noreferrer" >
                                <div className='flex py-3 items-center border-b-2 cursor-pointer border-[#3e4e67] '>
                                  <PeoplesIcon color='#b7c0d8' className='h-7 w-7' />
                                  <p className='mt-1 ml-2 px-3 py-1 rounded-lg text-white hover:bg-gray-700 text-base font-bold flex items-center'>Collab</p>
                                </div>
                              </a>
                              <a href={GuideLink} target="_blank" rel="noreferrer" >
                                <div className='flex py-3 items-center cursor-pointer'>
                                  <BookIcon color='#4ae288' className='h-7 w-7' />
                                  <p className='mt-1 ml-2 px-3 py-1 rounded-lg text-white hover:bg-gray-700 text-base font-bold flex items-center'>Guide</p>
                                </div>
                              </a>
                            </div>
                          </div>
                        }
                      </Popover.Panel>
                    </Transition>
                  </>
                </Popover>
              }


              {/* <button id="check" onClick={() => alert("it works")}>check</button> */}

              {!wallet && (
                <div>
                  <WalletMultiButton className='header-connectBtn rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white' />
                </div>
              )}

              {wallet && (
                <div>
                  <WalletDisconnectButton className='disconnectWallet rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white' />
                </div>
              )}

              {wallet && base58 && (
                <div className='float-right flex items-center rounded-full bg-primary-800 px-4 py-2 font-extrabold text-white'>
                  &nbsp;
                  <div>
                    <Clipboard />
                  </div>
                  <p className='w-24 overflow-hidden text-ellipsis'>
                    {content}
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      <ImageModal showModal={openGiveAwayModal} setShowModal={setOpenGiveAwayModal} image={NftImage} heading={NftHeading} subHeading={NftSubHeading} />
      {/* <ProfileSetting showModal={openProfileSetting} setShowModal={setOpenProfileSetting} image={NftImage} heading={NftHeading} subHeading={NftSubHeading} /> */}

      <Transition
        show={isOpen}
        enter='transition ease-out duration-100 transform'
        enterFrom='opacity-0 scale-95'
        enterTo='opacity-100 scale-100'
        leave='transition ease-in duration-75 transform'
        leaveFrom='opacity-100 scale-100'
        leaveTo='opacity-0 scale-95'
      >
        {(ref) => (
          <div className='lg:hidden' id='mobile-menu'>
            <div ref={ref} className='space-y-1 px-2 pt-2 pb-3 sm:px-3'>

              {wallet && base58 && (
                <a
                  href='#'
                  className='disconnectWallet block rounded-md px-3 py-2 text-base font-medium '
                >
                  <span className='flex justify-center'>
                    <span>
                      <Clipboard />
                    </span>
                    <span className='overflow-hidden text-ellipsis'>
                      {content}
                    </span>
                  </span>
                </a>
              )}

              {!wallet && (
                <div className='flex justify-center'>
                  <WalletMultiButton className='mobile-connectBtn rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white' />
                </div>
              )}

              {wallet && (
                <div className='flex justify-center'>
                  <WalletDisconnectButton className='disconnectWallet rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white' />
                </div>
              )}
            </div>
          </div>
        )}
      </Transition>
    </nav >
  );
}
