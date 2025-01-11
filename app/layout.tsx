import './globals.css'
import { Inter } from 'next/font/google'
import ClientOnlyLayout from '@/components/ClientOnlyLayout' 

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientOnlyLayout>{children}</ClientOnlyLayout>
      </body>
    </html>
  )
}
