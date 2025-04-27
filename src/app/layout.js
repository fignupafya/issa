import { Inter } from 'next/font/google';
import Providers from '@/components/Providers';
import Navigation from '@/components/Navigation';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Agriculture IoT Dashboard',
  description: 'Monitor your farm areas with real-time sensor data',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}
