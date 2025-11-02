import { Metadata } from 'next';
import { Baloo_Thambi_2 } from 'next/font/google';
import './globals.css';

const baloo_thambi_2 = Baloo_Thambi_2({
  variable: '--font-baloo-thambi-2',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'The Weather Man',
  description: 'A simple weather app',
  manifest: '/favicon/site.webmanifest',
  icons: {
    apple: '/favicon/apple-touch-icon.png',
    icon: [
      {
        url: '/favicon/favicon-32x32.webp',
        sizes: '32x32',
        type: 'image/webp',
      },
      {
        url: '/favicon/favicon-16x16.webp',
        sizes: '16x16',
        type: 'image/webp',
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: 'The Weather Man',
    startupImage: '/favicon/apple-touch-icon.png',
    statusBarStyle: 'default',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${baloo_thambi_2.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
