import type { Metadata } from 'next';
import { Albert_Sans } from 'next/font/google'; // Import the new font
import './globals.css';

// Configure the font
const albert = Albert_Sans({ 
  subsets: ['latin'],
  variable: '--font-albert',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Taldo | German Career Simulator',
  description: 'Calculate your exact salary potential in Germany.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`scroll-smooth ${albert.variable}`}>
      <body className={albert.className}>{children}</body>
    </html>
  );
}