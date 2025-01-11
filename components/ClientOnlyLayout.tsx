'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/components/ThemeProvider'

export default function ClientOnlyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </SessionProvider>
  )
}
