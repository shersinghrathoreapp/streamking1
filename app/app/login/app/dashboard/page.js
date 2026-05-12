'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabaseUrl = 'https://shgsslbrlogcnenzuvda.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoZ3NzbGJybG9nY25lbnp1dmRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1Nzk2OTQsImV4cCI6MjA5NDE1NTY5NH0.d5S11ILkrrYEFDz_La8fLVfS49cOIMa3jqv-BeJYi-k'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [streams, setStreams] = useState([{ id: 1, youtubeLink: '', streamKey: '' }])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => { getUser() }, [])
  useEffect(() => { if (user) getStreams() }, [user])

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) router.push('/login')
    else setUser(user)
  }

  const getStreams = async () => {
    const { data } = await supabase.from('user_streams').select('*').eq('user_id', user.id)
    if (data && data.length > 0) {
      setStreams(data.map((s, idx) => ({
        id: idx + 1,
        youtubeLink: s.youtube_link || '',
        streamKey: s.stream_key || ''
      })))
    }
  }

  const addChannel = () => setStreams([...streams, { id: Date.now(), youtubeLink: '', streamKey: '' }])

  const removeChannel = (id) => {
    if (streams.length === 1) return alert('Kam se kam 1 channel rakhna padega')
    setStreams(streams.filter(s => s.id!== id))
  }

  const updateStream = (id, field, value) => {
    setStreams(streams.map(s => s.id === id? {...s, [field]: value } : s))
  }

  const saveAllStreams = async () => {
    setLoading(true)
    await supabase.from('user_streams').delete().eq('user_id', user.id)
    const streamsToInsert = streams.filter(s => s.youtubeLink || s.streamKey).map(s => ({
      user_id: user.id,
      youtube_link: s.youtubeLink,
      stream_key: s.streamKey
    }))
    if (streamsToInsert.length > 0) {
      const { error } = await supabase.from('user_streams').insert(streamsToInsert)
      if (error) alert('Error: ' + error.message)
      else alert('Save ho gaya! Ab live kar sakta hai')
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) return <div className="bg-black text-white min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold">StreamKing 👑</h1>
            <p className="text-gray-400">{user.email}</p>
          </div>
          <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700">Logout</button>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">🎥 Apne YouTube Channels</h2>
            <button onClick={addChannel} className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700">+ Add Channel</button>
          </div>

          {streams.map((stream, index) => (
            <div key={stream.id} className="bg-gray-800 p-5 rounded-lg mb-4 border border-gray-700">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-purple-400">Channel #{index + 1}</h3>
                {streams.length > 1 && (
                  <button onClick={() => removeChannel(stream.id)} className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700">Delete</button>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm mb-2 text-gray-400">YouTube Video Link</label>
                  <input
                    type="text"
                    value={stream.youtubeLink}
                    onChange={(e) => updateStream(stream.id, 'youtubeLink', e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full bg-gray-700 p-3 rounded text-white border border-gray-600 focus:border-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-gray-400">Stream Key</label>
                  <input
                    type="password"
                    value={stream.streamKey}
                    onChange={(e) => updateStream(stream.id, 'streamKey', e.target.value)}
                    placeholder="xxxx-xxxx-xxxx-xxxx"
                    className="w-full bg-gray-700 p-3 rounded text-white border border-gray-600 focus:border-purple-500 outline-none"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={saveAllStreams}
            disabled={loading}
            className="w-full bg-blue-600 py-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-600 font-bold text-lg mt-4"
          >
            {loading? 'Saving...' : '💾 Sab Save Karo'}
          </button>
        </div>
      </div>
    </div>
  )
}
