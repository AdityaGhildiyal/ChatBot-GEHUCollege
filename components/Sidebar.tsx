import { useState } from 'react'
import { Settings, LogOut } from 'lucide-react'
import { useTheme } from './ThemeProvider'

interface SidebarProps {
  onSettingsClick: () => void
  onLogoutClick: () => void
}

export function Sidebar({ onSettingsClick, onLogoutClick }: SidebarProps) {
  const [sessions] = useState([
    'Session 1',
    'Session 2',
    'Session 3',
    'Session 4',
    'Session 5',
  ])
  const { theme } = useTheme()

  return (
    <div className={`w-64 ${theme === 'dark' ? 'bg-[#252525] text-white' : 'bg-white text-gray-900'} flex flex-col h-full overflow-y-auto`}>
      <div className={`p-4 ${theme === 'dark' ? 'bg-[#1E1E1E]' : 'bg-gray-100'} text-center`}>
        <h2 className="text-xl font-bold">Your Name</h2>
      </div>
      <div className="flex-grow p-4">
        <h3 className="text-lg font-semibold mb-2">Recent Sessions</h3>
        <ul className="space-y-2">
          {sessions.map((session, index) => (
            <li key={index} className={`cursor-pointer hover:bg-${theme === 'dark' ? '[#363636]' : 'gray-200'} p-2 rounded`}>
              {session}
            </li>
          ))}
        </ul>
        <button className={`mt-4 text-${theme === 'dark' ? '[#F4C8B5]' : 'gray-600'} hover:underline`}>View All</button>
      </div>
      <div className="mt-auto space-y-2">
        <button
          onClick={onSettingsClick}
          className={`w-full flex items-center justify-between p-2 ${theme === 'dark' ? 'hover:bg-[#363636]' : 'hover:bg-gray-200'} rounded`}
        >
          <span>Settings</span>
          <Settings size={18} />
        </button>
        <button
          onClick={onLogoutClick}
          className={`w-full flex items-center justify-between p-2 ${theme === 'dark' ? 'hover:bg-[#363636]' : 'hover:bg-gray-200'} rounded`}
        >
          <span>Log Out</span>
          <LogOut size={18} />
        </button>
      </div>
    </div>
  )
}

