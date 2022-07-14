import * as React from 'react';
import { RiAlarmWarningFill } from 'react-icons/ri';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <Layout>
      <Seo templateTitle='Not Found' />

      <main>
        <section>
          <div className='layout flex min-h-screen flex-col items-center justify-center text-center text-black'>
            <RiAlarmWarningFill
              size={60}
              className='drop-shadow-glow animate-flicker text-red-500'
            />
            <h1 className='mt-8 text-4xl md:text-6xl text-white'>Page Not Found</h1>

            <Link href="/"><span className='mt-10 text-[26px] text-[#161d29] cursor-pointer black bg-[#4ae288] rounded-full px-10 py-3'>Back to Home</span></Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
