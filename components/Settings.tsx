'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useTheme } from './ThemeProvider'

interface SettingsProps {
  onClose: () => void
}

export function Settings({ onClose }: SettingsProps) {
  const { theme, setTheme } = useTheme()
  
  // State for the settings form
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark'>(theme)
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English')
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true)

  // Function to handle saving the settings
  const handleSaveChanges = () => {
    setTheme(selectedTheme)  // Update the global theme using the provided setTheme function
    // Here, you could also save other settings like language or notifications to a backend or local storage.
    console.log('Settings saved:', { selectedTheme, selectedLanguage, notificationsEnabled })
    onClose() // Close the settings modal after saving
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${theme === 'dark' ? 'bg-[#252525]' : 'bg-white'} rounded-lg p-6 w-96`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Settings</h2>
          <button onClick={onClose} className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'} mb-1`}>
              Theme
            </label>
            <select 
              className={`w-full ${theme === 'dark' ? 'bg-[#363636] text-white' : 'bg-gray-100 text-gray-900'} rounded p-2`}
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value as 'light' | 'dark')}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'} mb-1`}>
              Language
            </label>
            <select 
              className={`w-full ${theme === 'dark' ? 'bg-[#363636] text-white' : 'bg-gray-100 text-gray-900'} rounded p-2`}
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'} mb-1`}>
              Notifications
            </label>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="mr-2"
              />
              <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Enable notifications</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleSaveChanges}
          className={`mt-6 w-full ${theme === 'dark' ? 'bg-[#F4C8B5] text-black hover:bg-[#FADACF]' : 'bg-blue-500 text-white hover:bg-blue-600'} py-2 rounded-lg font-medium transition-colors`}
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}
