'use client'

import { useTheme } from './ThemeProvider'

interface LogoutConfirmationProps {
  onConfirm: () => void
  onCancel: () => void
}

export function LogoutConfirmation({ onConfirm, onCancel }: LogoutConfirmationProps) {
  const { theme } = useTheme()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${theme === 'dark' ? 'bg-[#252525] text-white' : 'bg-white text-black'} rounded-lg p-6 w-96`}>
        <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Confirm Logout</h2>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-6`}>Are you sure you want to log out?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className={`px-4 py-2 ${
              theme === 'dark'
                ? 'bg-[#363636] text-white hover:bg-[#454545]'
                : 'bg-gray-200 text-black hover:bg-gray-300'
            } rounded-lg transition-colors`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 ${
              theme === 'dark'
                ? 'bg-[#F4C8B5] text-black hover:bg-[#FADACF]'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            } rounded-lg font-medium transition-colors`}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

