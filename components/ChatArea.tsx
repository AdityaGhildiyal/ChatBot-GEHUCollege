'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from 'ai/react'
import { Send, Expand, Minimize, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { TypingAnimation } from './TypingAnimation'
import { useTheme } from './ThemeProvider'
import { formatGehuResponse } from '../utils/formatGehuResponse'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}
const floatingWords = ['Admissions', 'Courses', 'Campus', 'Faculty', 'Fees']
export function ChatArea() {
  const { theme } = useTheme()
  const [chatbotType, setChatbotType] = useState<'gemini' | 'gehu'>('gemini')
  const { messages: geminiMessages, input: geminiInput, handleInputChange: handleGeminiInputChange, handleSubmit: handleGeminiSubmit, isLoading: isGeminiLoading } = useChat()
  const [isExpanded, setIsExpanded] = useState(false)
  const [gehuMessages, setGehuMessages] = useState<Message[]>([])
  const [gehuInput, setGehuInput] = useState('')
  const [isGehuLoading, setIsGehuLoading] = useState(false)
  const [showFloatingWords, setShowFloatingWords] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement | null>(null)
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null)
  const floatingWordsTimerRef = useRef<NodeJS.Timeout | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(() => {
    scrollToBottom()
  }, [geminiMessages, gehuMessages])

  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current)
      }
      if (floatingWordsTimerRef.current) {
        clearTimeout(floatingWordsTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (chatbotType === 'gehu') {
      showFloatingWordsWithTimer()
    } else {
      setShowFloatingWords(false)
    }
  }, [chatbotType])

  const showFloatingWordsWithTimer = () => {
    setShowFloatingWords(true)
    if (floatingWordsTimerRef.current) {
      clearTimeout(floatingWordsTimerRef.current)
    }
    floatingWordsTimerRef.current = setTimeout(() => {
      setShowFloatingWords(false)
    }, 5000)
  }

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }
    inactivityTimerRef.current = setTimeout(() => {
      setIsExpanded(false)
    }, 30000)
  }
  /*for presentation*/
  const handleGehuSubmit = async (input: string) => {
    if (!input.trim()) return

    const newUserMessage: Message = { role: 'user', content: input, timestamp: new Date() }
    setGehuMessages(prev => [...prev, newUserMessage])
    setGehuInput('')
    setIsGehuLoading(true)

    try {
      const response = await fetch(`/api/GehuChatBot?type=${encodeURIComponent(input)}`, {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error('Failed to get response from GEHU chatbot')
      }

      const data = await response.json()
      const formattedContent = formatGehuResponse(data.content)
      const newAssistantMessage: Message = { role: 'assistant', content: formattedContent, timestamp: new Date() }
      setGehuMessages(prev => [...prev, newAssistantMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.', 
        timestamp: new Date() 
      }
      setGehuMessages(prev => [...prev, errorMessage])
    } finally {
      setIsGehuLoading(false)
    }
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (chatbotType === 'gemini') {
      handleGeminiSubmit(e)
    } else {
      handleGehuSubmit(gehuInput)
    }
    resetInactivityTimer()
  }

  const currentMessages = chatbotType === 'gemini' 
    ? geminiMessages.map(msg => ({ ...msg, timestamp: new Date() })) 
    : gehuMessages
  const currentInput = chatbotType === 'gemini' ? geminiInput : gehuInput
  const currentHandleInputChange = chatbotType === 'gemini' 
    ? handleGeminiInputChange 
    : (e: React.ChangeEvent<HTMLTextAreaElement>) => setGehuInput(e.target.value)
  const currentIsLoading = chatbotType === 'gemini' ? isGeminiLoading : isGehuLoading

  return (
    <motion.div 
      ref={chatContainerRef}
      className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 pb-4`}
      initial={{ height: '400px' }}
      animate={{ height: isExpanded ? '80vh' : '400px' }}
      transition={{ type: "spring", stiffness: 75, damping: 15 }}
    >
      <motion.div
        className={`${theme === 'dark' ? 'bg-[#1E1E1E]' : 'bg-white'} rounded-2xl overflow-hidden shadow-xl relative h-full`}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`absolute top-4 right-4 p-2 rounded-lg ${
            theme === 'dark'
              ? 'bg-[#2B2B2B] hover:bg-[#363636]'
              : 'bg-gray-200 hover:bg-gray-300'
          } transition-colors z-10`}
        >
          {isExpanded ? (
            <Minimize className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-black'}`} />
          ) : (
            <Expand className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-black'}`} />
          )}
        </button>

        <div className="h-full flex flex-col">
          <div className={`${theme === 'dark' ? 'bg-[#252525]' : 'bg-gray-100'} p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
            <div className="relative">
              <select
                value={chatbotType}
                onChange={(e) => setChatbotType(e.target.value as 'gemini' | 'gehu')}
                className={`appearance-none ${
                  theme === 'dark'
                    ? 'bg-[#363636] text-white'
                    : 'bg-white text-black border border-gray-300'
                } py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600`}
              >
                <option value="gemini">Gemini chatbot</option>
                <option value="gehu">GEHU chatbot</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white pointer-events-none" />
            </div>
          </div>

          <div className="flex-grow overflow-auto p-6 space-y-4 relative">
            {currentMessages.map((message, i) => (
              <div key={i} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-3`}>
                {message.role !== 'user' && (
                  <div className={`w-8 h-8 rounded-full ${theme === 'dark' ? 'bg-purple-600' : 'bg-blue-500'} flex items-center justify-center`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                )}
                <div className={`max-w-[80%] p-3 rounded-xl ${
                  message.role === 'user' 
                    ? theme === 'dark' ? 'bg-[#2B2B2B]' : 'bg-blue-100'
                    : theme === 'dark' ? 'bg-[#252525]' : 'bg-gray-200'
                }`}>
                  <pre className="whitespace-pre-wrap font-sans">
                    {message.content}
                  </pre>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'} mt-1`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-[#363636] overflow-hidden">
                    <Image
                      src="/placeholder.svg"
                      alt="User"
                      width={32}
                      height={32}
                    />
                  </div>
                )}
              </div>
            ))}
            {currentIsLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="bg-[#252525] p-3 rounded-xl flex items-center gap-2">
                  Assistant is Typing
                  <TypingAnimation />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className={`p-4 ${theme === 'dark' ? 'bg-[#1E1E1E]' : 'bg-white'} flex justify-center items-center relative`}>
            <AnimatePresence>
              {showFloatingWords && chatbotType === 'gehu' && (
                <motion.div 
                  className="absolute bottom-full left-0 right-0 flex justify-center space-x-2 p-2 mb-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ zIndex: 10 }}
                >
                  {floatingWords.map((word) => (
                    <motion.button
                      key={word}
                      className={`px-2 py-1 text-sm rounded-full ${theme === 'dark' ? 'bg-[#363636] text-white' : 'bg-gray-200 text-black'} hover:bg-opacity-80`}
                      onClick={() => handleGehuSubmit(word)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {word}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            <form onSubmit={onSubmit} className="relative flex items-center w-full max-w-3xl">
              <textarea
                value={currentInput}
                onChange={currentHandleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    onSubmit(e as any);
                  }
                }}
                onFocus={() => {
                  setIsExpanded(true);
                  resetInactivityTimer();
                  if (chatbotType === 'gehu') {
                    showFloatingWordsWithTimer();
                  }
                }}
                placeholder="Write a message..."
                className={`flex-grow ${theme === 'dark' ? 'bg-[#141414] text-white placeholder-gray-500' : 'bg-gray-100 text-gray-900 placeholder-gray-500'} rounded-xl py-3 px-4 focus:outline-none focus:ring-1 ${theme === 'dark' ? 'focus:ring-gray-700' : 'focus:ring-blue-500'} resize-none`}
                style={{ height: '50px' }}
              />
              <button
                type="submit"
                disabled={currentIsLoading}
                className={`ml-2 ${theme === 'dark' ? 'bg-[#F4C8B5] text-black hover:bg-[#FADACF]' : 'bg-blue-500 text-white hover:bg-blue-600'} px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Send className="w-4 h-4" />
                <span className="ml-2">Send</span>
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

