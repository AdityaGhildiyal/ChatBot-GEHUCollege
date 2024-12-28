'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from 'ai/react'
import { Send, Expand, Minimize, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { TypingAnimation } from './TypingAnimation'

export function ChatArea() {
  const [chatbotType, setChatbotType] = useState<'gemini' | 'gehu'>('gemini')
  const { messages, input, handleInputChange, handleSubmit: handleGeminiSubmit, isLoading } = useChat()
  const [isExpanded, setIsExpanded] = useState(false)
  const [gehuMessages, setGehuMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([])
  const [gehuInput, setGehuInput] = useState('')
  const [isGehuLoading, setIsGehuLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement | null>(null)
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, gehuMessages])

  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current)
      }
    }
  }, [])

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }
    inactivityTimerRef.current = setTimeout(() => {
      setIsExpanded(false)
    }, 30000)
  }

  const handleGehuSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!gehuInput.trim()) return;
  
    setIsGehuLoading(true);
    setGehuMessages(prev => [...prev, { role: 'user', content: gehuInput }]);
    setGehuInput('');
  
    try {
      // Check that gehuInput is being passed correctly
      console.log('Sending request with query:', gehuInput);
      
      const response = await fetch(`/api/GehuChatBot?type=${encodeURIComponent(gehuInput)}`, {
        method: 'GET',
      });
  
      if (!response.ok) {
        throw new Error('Failed to get response from GEHU chatbot');
      }
  
      const data = await response.json();
      setGehuMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error) {
      console.error('Error:', error);
      setGehuMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsGehuLoading(false);
    }
  };
  

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (chatbotType === 'gemini') {
      handleGeminiSubmit(e)
    } else {
      handleGehuSubmit(e)
    }
    resetInactivityTimer()
  }

  const currentMessages = chatbotType === 'gemini' ? messages : gehuMessages
  const currentInput = chatbotType === 'gemini' ? input : gehuInput
  const currentHandleInputChange = chatbotType === 'gemini' 
    ? handleInputChange 
    : (e: React.ChangeEvent<HTMLTextAreaElement>) => setGehuInput(e.target.value)
  const currentIsLoading = chatbotType === 'gemini' ? isLoading : isGehuLoading

  return (
    <motion.div 
      ref={chatContainerRef}
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 pb-4"
      initial={{ height: '400px' }}
      animate={{ height: isExpanded ? '80vh' : '400px' }}
      transition={{ type: "spring", stiffness: 75, damping: 15 }}
    >
      <motion.div
        className="bg-[#1E1E1E] rounded-2xl overflow-hidden shadow-xl relative h-full"
      >
        {/* Expand/Minimize Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute top-4 right-4 p-2 rounded-lg bg-[#2B2B2B] hover:bg-[#363636] transition-colors z-10"
        >
          {isExpanded ? (
            <Minimize className="w-5 h-5" />
          ) : (
            <Expand className="w-5 h-5" />
          )}
        </button>

        <div className="h-full flex flex-col">
          <AnimatePresence>
            {isExpanded && (
              <motion.div 
                className="bg-[#252525] p-4 border-b border-gray-700 flex justify-between items-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-xl font-semibold text-white">Chat with AI Advisor</h2>
                <div className="relative">
                  <select
                    value={chatbotType}
                    onChange={(e) => setChatbotType(e.target.value as 'gemini' | 'gehu')}
                    className="appearance-none bg-[#363636] text-white py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="gemini">Gemini chatbot</option>
                    <option value="gehu">GEHU chatbot</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white pointer-events-none" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-grow overflow-auto p-6 space-y-4">
            {currentMessages.map((message, i) => (
              <div key={i} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-3`}>
                {message.role !== 'user' && (
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                )}
                <div className={`max-w-[80%] p-3 rounded-xl ${
                  message.role === 'user' 
                    ? 'bg-[#2B2B2B]' 
                    : 'bg-[#252525]'
                }`}>
                  {message.content}
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                  AI is typing
                  <TypingAnimation />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 bg-[#1E1E1E] flex justify-center items-center">
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
                }}
                placeholder="Write a message..."
                className="flex-grow bg-[#141414] rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-700 resize-none"
                style={{ height: '50px' }}
              />
              <button
                type="submit"
                disabled={currentIsLoading}
                className="ml-2 bg-[#F4C8B5] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#FADACF] transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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

