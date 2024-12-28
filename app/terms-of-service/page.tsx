'use client'

import Link from 'next/link'
import { useTheme } from '@/components/ThemeProvider'

export default function TermsOfService() {
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#1E1E1E] text-white' : 'bg-white text-black'} p-8`}>
      <div className="max-w-3xl mx-auto">
        <h1 className={`text-4xl font-bold mb-8 ${theme === 'dark' ? 'text-[#F4C8B5]' : 'text-black'}`}>Terms of Service</h1>
        
        <section className="mb-8">
          <h2 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-[#FADACF]' : 'text-gray-800'}`}>Project Information</h2>
          <p className="mb-4">
            This project, &quot;Your Personal AI Advisor,&quot; was developed for Semester 3 by Aditya Ghildiyal.
          </p>
        </section>

        <section className="mb-8">
          <h2 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-[#FADACF]' : 'text-gray-800'}`}>Project Details</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Purpose: To create an AI-powered chatbot that can provide personalized advice and information.</li>
            <li>Technologies Used: Next.js, React, Tailwind CSS, Framer Motion, and AI integration.</li>
            <li>Features:
              <ul className="list-circle pl-6 mt-2 space-y-1">
                <li>Interactive chat interface</li>
                <li>Multiple AI models (Gemini and GEHU)</li>
                <li>Responsive design</li>
                <li>User authentication system</li>
              </ul>
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-[#FADACF]' : 'text-gray-800'}`}>Usage Guidelines</h2>
          <p className="mb-4">
            This project is for educational purposes only. Users are expected to use the AI advisor responsibly and not for any malicious purposes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-[#FADACF]' : 'text-gray-800'}`}>Disclaimer</h2>
          <p className="mb-4">
            The AI responses provided by this project are generated based on available data and algorithms. Users should not rely solely on this information for critical decisions and should verify important information from authoritative sources.
          </p>
        </section>

        <div className="mt-12">
          <Link href="/" className={`${theme === 'dark' ? 'text-[#F4C8B5] hover:text-white' : 'text-blue-600 hover:text-blue-800'}`}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

