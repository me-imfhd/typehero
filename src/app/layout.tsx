import { Providers } from './providers';

import '../styles/globals.css';

import { Inter } from 'next/font/google';
import { Navigation } from '~/components/ui/navigation';

const inter = Inter({ subsets: ['latin'] });
export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head />
      <body>
        <Providers>
          <Navigation />
          <main className={`${inter.className} bg-white dark:bg-neutral-900`}>{children}</main>
        </Providers>
      </body>
    </html>
  );
}