import { X } from 'lucide-react'
import { useTheme } from './ThemeProvider'

interface SettingsProps {
  onClose: () => void
}

export function Settings({ onClose }: SettingsProps) {
  const { theme, setTheme } = useTheme()

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
              value={theme}
              onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'} mb-1`}>
              Language
            </label>
            <select className={`w-full ${theme === 'dark' ? 'bg-[#363636] text-white' : 'bg-gray-100 text-gray-900'} rounded p-2`}>
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'} mb-1`}>
              Notifications
            </label>
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Enable notifications</span>
            </div>
          </div>
        </div>
        <button className={`mt-6 w-full ${theme === 'dark' ? 'bg-[#F4C8B5] text-black hover:bg-[#FADACF]' : 'bg-blue-500 text-white hover:bg-blue-600'} py-2 rounded-lg font-medium transition-colors`}>
          Save Changes
        </button>
      </div>
    </div>
  )
}

