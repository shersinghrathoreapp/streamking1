'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabaseUrl = 'https://shgsslbrlogcnenzuvda.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoZ3NzbGJybG9nY25lbnp1dmRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1Nzk2OTQsImV4cCI6MjA5NDE1NTY5NH0.d5S11ILkrrYEFDz_La8fLVfS49cOIMa3jqv-BeJYi-k'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()

  const handleAuth = async () => {
    if (!email ||!password) return alert('Email password daal bhai')
    setLoading(true)

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) alert('Error: ' + error.message)
      else {
        alert('Account ban gaya! Ab login karo')
        setIsSignUp(false)
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) alert('Error: ' + error.message)
      else router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md border border-gray-800">
        <h1 className="text-4xl font-bold mb-2 text-center">StreamKing 👑</h1>
        <p className="text-gray-400 text-center mb-6">{isSignUp? 'Naya Account Banao' : 'Apne Account me Login Karo'}</p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email daale"
          className="w-full bg-gray-800 p-3 rounded-lg mb-3 text-white border border-gray-700 focus:border-purple-500 outline-none"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password daale"
          className="w-full bg-gray-800 p-3 rounded-lg mb-4 text-white border border-gray-700 focus:border-purple-500 outline-none"
          onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
        />

        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-purple-600 py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-600 font-bold mb-4"
        >
          {loading? 'Ruko...' : isSignUp? 'Sign Up Karo' : 'Login Karo'}
        </button>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full text-gray-400 text-sm hover:text-white"
        >
          {isSignUp? 'Pehle se account hai? Login karo' : 'Naya hai? Sign Up karo'}
        </button>
      </div>
    </div>
  )
}
