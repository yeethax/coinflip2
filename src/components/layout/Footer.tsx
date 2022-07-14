import * as React from 'react';

import Discord from '@/assests/icons/Discord';
import Facebook from '@/assests/icons/Facebook';
import Twitter from '@/assests/icons/Twitter';

const twitterLink = process.env.NEXT_PUBLIC_TWITTER_URL
const discordLink = process.env.NEXT_PUBLIC_DISCORD_URL

export default function Footer() {
  const [solPrice, setSolPrice] = React.useState<string>('')

  React.useEffect(() => {
    getSoltoUsd()
    setInterval(getSoltoUsd, 30000);
  }, [])

  const getSoltoUsd = async () => {
    try {
      const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT');
      const resultData = await response.json();
      const price = resultData?.price.slice(0, (resultData?.price.indexOf(".")) + 3)
      setSolPrice(price)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <footer className='footer '>
      <div className='container mx-auto grid grid-cols-12 gap-5 md:gap-0'>
        <div className='col-span-12 flex justify-center md:col-span-2 md:justify-start'>
          <span className='logoText mb-2 flex cursor-pointer select-none text-5xl'>
            CoinFlip
          </span>
        </div>
        <div className='col-span-12 flex justify-center md:col-span-4 md:justify-start'>
          <span className='footerText text-[4vw] lg:text-base flex items-center'>
            © 2022 coinflip.com | All Rights Reserved.
          </span>
        </div>
        <div className='col-span-12 flex justify-center md:col-span-4 md:justify-start'>
          <span className='footerText flex items-center'>1 SOL = ${solPrice}</span>
        </div>
        <div className='col-span-12 flex justify-center md:col-span-2 md:justify-start'>
          <div className='social-icon-cn flex justify-evenly'>
            <a href={twitterLink} target="_blank" rel="noreferrer">
              <span>
                <Twitter className='mx-2 pb-1' />
              </span>
            </a>
            <a href={discordLink} target="_blank" rel="noreferrer">
              <span>
                <Discord className='mx-2 pb-1' />
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
