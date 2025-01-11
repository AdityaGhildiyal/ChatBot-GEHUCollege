'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from '@/components/ThemeProvider'
import { GridBackground } from '@/components/grid-background'
import { Eye, EyeOff, Mail, User, Lock } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState('signup')
  const [error, setError] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const router = useRouter()
  const { theme } = useTheme()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (isLoggedIn === 'true') {
      router.push('/')
    }
  }, [router])

  const requestOtp = async () => {
    setError('')
    try {
      const response = await fetch('/api/sendOtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setStep('otp')
      } else {
        const { message } = await response.json()
        setError(message || 'Failed to send OTP. Please try again.')
      }
    } catch (err) {
      setError('An error occurred while sending the OTP. Please try again later.')
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (step === 'signup') {
      await requestOtp()
    } else {
      try {
        const response = await fetch('/api/verifyOtp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp, name, password }),
        })

        if (response.ok) {
          const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
          })

          if (result?.error) {
            setError(result.error)
          } else {
            router.push('/')
          }
        } else {
          const { message } = await response.json()
          setError(message || 'Invalid OTP. Please try again.')
        }
      } catch (err) {
        setError('An error occurred during signup. Please try again later.')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      <GridBackground />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-8 rounded-lg shadow-lg relative z-10`}
      >
        <h2 className={`text-3xl font-bold text-center mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {step === 'signup' ? 'Create your account' : 'Enter OTP'}
        </h2>
        <form onSubmit={handleSignup} className="space-y-6">
          {step === 'signup' && (
            <>
              <div>
                <label htmlFor="name" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className={`block w-full pl-10 pr-3 py-3 text-base rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="UserName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className={`block w-full pl-10 pr-3 py-3 text-base rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="you@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={passwordVisible ? 'text' : 'password'}
                    required
                    className={`block w-full pl-10 pr-10 py-3 text-base rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="focus:outline-none"
                    >
                      {passwordVisible ? (
                        <EyeOff className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                      ) : (
                        <Eye className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 'otp' && (
            <div>
              <label htmlFor="otp" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                OTP
              </label>
              <div className="mt-1">
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  className={`block w-full px-3 py-3 text-base rounded-md ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {step === 'signup' ? 'Request OTP' : 'Verify & Sign up'}
            </motion.button>
          </div>
        </form>
        <p className={`mt-8 text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Already have an account?{' '}
          <Link href="/login" className={`font-medium ${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'}`}>
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

