import type { Metadata } from 'next'
import { Newsreader, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const serif = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-serif',
})

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.samuellittlefield.com'),
  title: {
    default: 'Samuel Littlefield',
    template: '%s · Samuel Littlefield',
  },
  description:
    'Product manager building small, careful tools out of public data: federal energy permitting, residential electricity rates and election polling.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
