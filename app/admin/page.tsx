'use client'

import { useEffect, useRef, useState } from 'react'
import type { RSVP } from '@/lib/types'
import { LogOut, Download, Users, UserPlus, BarChart2 } from 'lucide-react'

export default function AdminPage() {
  const [authed, setAuthed]           = useState(false)
  const [password, setPassword]       = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [rsvps, setRsvps]             = useState<RSVP[]>([])
  const [dataLoading, setDataLoading] = useState(false)
  // Store password in a ref so loadRSVPs can use it without re-renders
  const tokenRef = useRef('')

  useEffect(() => {
    const saved = sessionStorage.getItem('admin_token')
    if (saved) {
      tokenRef.current = saved
      setAuthed(true)
      loadRSVPs(saved)
    }
  }, [])

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        sessionStorage.setItem('admin_token', password)
        tokenRef.current = password
        setAuthed(true)
        setPassword('')
        loadRSVPs(password)
      } else {
        const d = await res.json()
        alert(d.message ?? 'Incorrect password')
        setPassword('')
      }
    } finally {
      setLoginLoading(false)
    }
  }

  const loadRSVPs = async (token?: string) => {
    setDataLoading(true)
    try {
      const res = await fetch('/api/admin/rsvps', {
        headers: { 'x-admin-token': token ?? tokenRef.current },
      })
      if (res.ok) {
        const data: RSVP[] = await res.json()
        setRsvps(data)
      } else if (res.status === 401) {
        logout()
      }
    } finally {
      setDataLoading(false)
    }
  }

  const logout = () => {
    sessionStorage.removeItem('admin_token')
    tokenRef.current = ''
    setAuthed(false)
    setRsvps([])
  }

  const sanitizeCSV = (val: string) => {
    // Neutralise formula injection: prefix dangerous-start chars with a tab
    const safe = /^[=+\-@\t\r]/.test(val) ? `\t${val}` : val
    return `"${safe.replace(/"/g, '""')}"`
  }

  const exportCSV = () => {
    const rows = [
      ['"Name"', '"Plus-Ones"', '"Message"', '"Date"'],
      ...rsvps.map((r) => [
        sanitizeCSV(r.name),
        sanitizeCSV(String(r.plus_ones)),
        sanitizeCSV(r.message || ''),
        sanitizeCSV(new Date(r.created_at).toLocaleDateString('en-IN')),
      ]),
    ]
    const csv = rows.map((r) => r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = `rsvps-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0D0600' }}>
        <div className="glass-gold rounded-2xl p-8 w-full max-w-sm">
          <h1 className="text-2xl font-light text-center mb-8" style={{ color: '#C49A28', letterSpacing: '0.08em' }}>N ✦ P</h1>
          <form onSubmit={login} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition"
              style={{ border: '1px solid rgba(196,154,40,0.2)', background: 'rgba(255,253,246,0.7)', color: '#5C3A2E', '--tw-ring-color': 'rgba(196,154,40,0.4)' } as React.CSSProperties}
              placeholder="Password"
              disabled={loginLoading}
            />
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full disabled:opacity-50 py-3 rounded-xl text-sm font-bold tracking-widest uppercase transition-opacity"
              style={{ background: 'linear-gradient(135deg, #B8850A, #E8C547, #C49A28)', color: '#2A1200' }}
            >
              {loginLoading ? 'Checking…' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  const totalPlusOnes = rsvps.reduce((s, r) => s + r.plus_ones, 0)
  const totalGuests = rsvps.length + totalPlusOnes

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-light">Wedding Admin</h1>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-slate-600 hover:text-red-600 text-sm transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Users, label: 'RSVPs', value: rsvps.length, color: 'text-purple-600', bg: 'bg-purple-50' },
            { icon: UserPlus, label: 'Plus-Ones', value: totalPlusOnes, color: 'text-blue-600', bg: 'bg-blue-50' },
            { icon: BarChart2, label: 'Total Guests', value: totalGuests, color: 'text-green-600', bg: 'bg-green-50' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="bg-white p-6 rounded-2xl shadow-sm">
              <div className={`inline-flex p-2.5 ${bg} rounded-xl mb-3`}>
                <Icon className={color} size={20} />
              </div>
              <p className="text-3xl font-light mb-1">{value}</p>
              <p className="text-slate-500 text-sm">{label}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={exportCSV}
            disabled={rsvps.length === 0}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-4 py-2 rounded-xl text-sm transition-colors disabled:opacity-50"
          >
            <Download size={16} /> Export CSV
          </button>
          <button
            onClick={() => loadRSVPs()}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-4 py-2 rounded-xl text-sm transition-colors"
          >
            Refresh
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Name', '+Guests', 'Message', 'Date'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs uppercase tracking-widest text-slate-400 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {dataLoading ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">Loading…</td></tr>
                ) : rsvps.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">No RSVPs yet</td></tr>
                ) : (
                  rsvps.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{r.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-900 text-center">{r.plus_ones}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 max-w-xs">
                        <span className="line-clamp-2">{r.message || '—'}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400 whitespace-nowrap">
                        {new Date(r.created_at).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
