import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MedVoice AI - Medical Voice Documentation Platform',
  description:
    'AI-powered medical voice documentation system with real-time transcription, SOAP notes generation, and intelligent prescription management.',
  keywords: ['medical', 'healthcare', 'AI', 'voice documentation', 'EMR', 'EHR', 'transcription'],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0066CC',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} bg-background`}>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
      {process.env.NODE_ENV === 'production' && <Analytics />}
    </html>
  )
}
