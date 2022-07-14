import * as React from 'react';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import Seo from '@/components/Seo';

interface Props {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title }: Props) {
  // Put Header or Footer Here
  return (
    <>
      <Seo templateTitle={title} />

      <Header />
      <div className='container mx-auto'>{children}</div>
      <Footer />
    </>
  );
}
