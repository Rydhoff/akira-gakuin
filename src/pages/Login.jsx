import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import logo from '/Logo LPK Akira Gakuin.png'

import bg1 from '../assets/login/bg1.jpeg'
import bg2 from '../assets/login/bg2.jpeg'
import bg3 from '../assets/login/bg3.jpeg'

const backgrounds = [bg1, bg2, bg3]

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()

  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [err, setErr] = useState('')
  const [activeBg, setActiveBg] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBg(prev => (prev + 1) % backgrounds.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    const { error } = await login(email, pwd)
    if (error) {
      setErr(error.message || 'Gagal login')
      return
    }
    nav('/')
  }

  return (
    <div className="min-h-screen grid grid-cols-[1.8fr_1fr]">

      {/* ================= LEFT : FOTO ================= */}
      <div className="hidden md:block relative overflow-hidden">
        {backgrounds.map((bg, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-all duration-[1200ms] ease-in-out
            ${i === activeBg ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}
          `}
            style={{
              backgroundImage: `url(${bg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(1.05)',
            }}
          />
        ))}

        {/* overlay super tipis */}
        <div className="absolute inset-0" />
      </div>

      {/* ================= RIGHT : LOGIN ================= */}
      <div className="flex items-center justify-center bg-white px-8">
        <div className="w-full max-w-sm">

          {/* Logo */}
          <div className="mb-2">
            <img src={logo} alt="Akira Logo" className="h-18 mx-auto" />
          </div>

          <div className="mb-6 text-center">
            <div className="text-lg font-bold text-gray-900">
              Akira Gakuin
            </div>
            <div className="text-md text-gray-500">
              Management System
            </div>
          </div>


          {err && (
            <div className="text-red-600 bg-red-50 p-2 rounded mb-4 border border-red-200">
              {err}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B30707] focus:outline-none"
                type="email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                value={pwd}
                onChange={e => setPwd(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B30707] focus:outline-none"
                type="password"
                required
              />
            </div>

            <button
              className="w-full bg-[#B30707] hover:bg-[#8d0606] text-white p-3 rounded-lg font-semibold transition"
            >
              Login
            </button>
          </form>

        </div>
      </div>

    </div>
  )
}
