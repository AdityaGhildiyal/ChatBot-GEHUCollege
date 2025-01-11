'use client'

import { useState, useEffect } from 'react'
import { Settings, LogOut } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { signOut, useSession } from 'next-auth/react'
import { LogoutConfirmation } from './LogoutConfirmation'

interface SidebarProps {
  onSettingsClick: () => void
  onLogoutClick: () => void
}

export function Sidebar({ onSettingsClick, onLogoutClick }: SidebarProps) {
  const { data: session } = useSession()
  const { theme } = useTheme()
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)

  const userName = session?.user?.name || 'Your Name'

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true)
  }

  const handleLogoutConfirm = () => {
    signOut({
      callbackUrl: '/',
    })
    setShowLogoutConfirmation(false)
  }

  const handleLogoutCancel = () => {
    setShowLogoutConfirmation(false)
  }

  return (
    <div className={`w-64 ${theme === 'dark' ? 'bg-[#252525] text-white' : 'bg-white text-gray-900'} flex flex-col h-full overflow-y-auto`}>
      {/* User Profile Section */}
      <div className={`p-4 ${theme === 'dark' ? 'bg-[#1E1E1E]' : 'bg-gray-100'} text-center`}>
        <h2 className="text-xl font-bold">{userName}</h2> {/* Display the fetched user name from session */}
      </div>

      {/* Sidebar Action Buttons */}
      <div className="mt-auto space-y-2">
        <button
          onClick={onSettingsClick}
          className={`w-full flex items-center justify-between p-2 ${theme === 'dark' ? 'hover:bg-[#363636]' : 'hover:bg-gray-200'} rounded`}
        >
          <span>Settings</span>
          <Settings size={18} />
        </button>
        <button
          onClick={handleLogoutClick}
          className={`w-full flex items-center justify-between p-2 ${theme === 'dark' ? 'hover:bg-[#363636]' : 'hover:bg-gray-200'} rounded`}
        >
          <span>Log Out</span>
          <LogOut size={18} />
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirmation && (
        <LogoutConfirmation
          onConfirm={handleLogoutConfirm}
          onCancel={handleLogoutCancel}
        />
      )}
    </div>
  )
}
