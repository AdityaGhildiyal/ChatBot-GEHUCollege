'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GridBackground } from '@/components/grid-background'
import { ChatArea } from '@/components/ChatArea'
import { Sidebar } from '@/components/Sidebar'
import { Settings } from '@/components/Settings'
import { LogoutConfirmation } from '@/components/LogoutConfirmation'
import { ChevronRight, ChevronLeft, User } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/components/ThemeProvider'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'


export default function ChatbotUI() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { theme } = useTheme()
  const router = useRouter()
  
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const handleLogout = () => {
    
      signOut({ callbackUrl: '/login' }) 
    
  }

  return (
    <div className={`relative flex h-screen overflow-hidden ${theme === 'dark' ? 'bg-[#1E1E1E] text-white' : 'bg-gray-100 text-gray-900'}`}>
      <GridBackground />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col z-10">
        {/* Profile Option */}
        <div className="absolute top-4 right-4 z-20">
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`w-10 h-10 rounded-full ${theme === 'dark' ? 'bg-[#363636]' : 'bg-gray-200'} flex items-center justify-center`}
            >
              <img src="/placeholder.svg" alt="User" className="w-full h-full object-cover rounded-full" />
            </button>
            {isProfileOpen && (
              <div className={`absolute right-0 mt-2 w-64 ${theme === 'dark' ? 'bg-[#252525]' : 'bg-gray-100'} rounded-lg shadow-lg p-4`}>
                <div className="text-center mb-4">
                  <div className={`w-20 h-20 rounded-full ${theme === 'dark' ? 'bg-[#363636]' : 'bg-gray-200'} mx-auto mb-2 flex items-center justify-center`}>
                    <img src="/placeholder.svg" alt="User" className="w-full h-full object-cover rounded-full" />
                  </div>
                  <p className="text-lg font-semibold">Hello {session?.user?.name || 'User'}</p>
                </div>
                <div className="space-y-2">
                  <button className={`w-full text-left px-2 py-1 hover:${theme === 'dark' ? 'bg-[#363636]' : 'bg-gray-200'} rounded`}>Add another account</button>
                  <button onClick={handleLogout} className={`w-full text-left px-2 py-1 hover:${theme === 'dark' ? 'bg-[#363636]' : 'bg-gray-200'} rounded`}>Sign Out</button>
                </div>
              </div>
           )}
           </div>
         </div>

        

        {/* Social Media Links */}
        <div className="fixed left-8 bottom-8 flex flex-col gap-4 text-gray-500 z-10">
          <a href="https://x.com/Addycantmiss" className="hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
            </svg>
          </a>
          <a href="https://discordapp.com/users/922841777835237447" className="hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </a>
          <a href="https://www.instagram.com/zenith_mali/" className="hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16.98 0a6.9 6.9 0 0 1 5.08 1.98A6.94 6.94 0 0 1 24 7.02v9.96c0 2.08-.68 3.87-1.98 5.13A7.14 7.14 0 0 1 16.94 24H7.06a7.06 7.06 0 0 1-5.03-1.89A6.96 6.96 0 0 1 0 16.94V7.02C0 2.8 2.8 0 7.02 0h9.96zm.05 2.23H7.06c-1.45 0-2.7.43-3.53 1.25a4.82 4.82 0 0 0-1.3 3.54v9.92c0 1.5.43 2.7 1.3 3.58a5 5 0 0 0 3.53 1.25h9.88a5 5 0 0 0 3.53-1.25 4.73 4.73 0 0 0 1.4-3.54V7.02a5 5 0 0 0-1.3-3.49 4.82 4.82 0 0 0-3.54-1.3zM12 5.76c3.39 0 6.2 2.8 6.2 6.2a6.2 6.2 0 0 1-12.4 0 6.2 6.2 0 0 1 6.2-6.2zm0 2.22a3.99 3.99 0 0 0-3.97 3.97A3.99 3.99 0 0 0 12 15.92a3.99 3.99 0 0 0 3.97-3.97A3.99 3.99 0 0 0 12 7.98z" />
            </svg>
          </a>
        </div>

        {/* Header */}
        <div className="text-center mb-12 pt-12">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className={`inline-block p-2 rounded-lg ${theme === 'dark' ? 'bg-[#2B2B2B]' : 'bg-gray-200'} mb-6`}
          >
            <svg className={`w-6 h-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </motion.div>
          <h1 className={`text-6xl font-bold mb-4 ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-[#FADACF] via-[#F4C8B5] to-[#FADACF] bg-clip-text text-transparent'
              : 'text-black'
          }`}>
            Your Personal
          </h1>
          <h1 className={`text-6xl font-bold mb-6 ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-[#FADACF] via-[#F4C8B5] to-[#FADACF] bg-clip-text text-transparent'
              : 'text-black'
          }`}>
            GEHU Advisor
          </h1>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} max-w-lg mx-auto`}>
            Graphic Era Hill University has a lot to offer! Ask me about it...
          </p>
        </div>

        <ChatArea />

        {/* Progress Dots */}
        <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-10">
          <div className={`w-3 h-3 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`} />
          <div className={`w-3 h-3 rounded-full ${theme === 'dark' ? 'bg-purple-600' : 'bg-purple-300'}`} />
          <div className={`w-3 h-3 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`} />
        </div>

        {/* Terms of Service Link */}
        <div className="absolute bottom-4 right-4 text-sm">
          <Link 
            href="/terms-of-service" 
            className={`${
              theme === 'dark' 
                ? 'text-gray-500 hover:text-white' 
                : 'text-gray-600 hover:text-black'
            } transition-colors`}
          >
            Terms of Service
          </Link>
        </div>
      </div>

      {/* Sidebar */}
      <motion.div
        className={`fixed left-0 top-0 h-full ${theme === 'dark' ? 'bg-[#252525]' : 'bg-gray-100'} z-50 overflow-hidden`}
        initial={{ width: 0 }}
        animate={{ width: isSidebarOpen ? 256 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25, duration: 0.5 }}
      >
        {isSidebarOpen && (
          <Sidebar 
            onSettingsClick={() => setShowSettings(true)}
            onLogoutClick={() => setShowLogoutConfirmation(true)}
          />
        )}
      </motion.div>

      {/* Toggle Sidebar Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`fixed left-0 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'bg-[#363636]' : 'bg-gray-200'} p-2 rounded-r-md z-50`}
        title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        {isSidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>

      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
      {showLogoutConfirmation && (
        <LogoutConfirmation 
          onConfirm={() => {
            setShowLogoutConfirmation(false)
          }}
          onCancel={() => setShowLogoutConfirmation(false)}
        />
      )}
    </div>
  )
}

