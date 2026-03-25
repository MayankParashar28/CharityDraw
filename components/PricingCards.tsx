'use client'

import { useState } from 'react'
import { Target, Heart, Gift } from 'lucide-react'

interface PricingCardsProps {
  isLoggedIn: boolean
}

export default function PricingCards({ isLoggedIn }: PricingCardsProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (priceId: string) => {
    if (!isLoggedIn) {
      window.location.href = '/login'
      return
    }
    setLoading(priceId)
    try {
      const res = await fetch('/api/stripe/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      alert('Failed to connect to server. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
      <div className="skeuo-card rounded-3xl p-6 sm:p-10 flex flex-col pt-8 sm:pt-12 relative overflow-hidden">
        <h3 className="text-xl sm:text-3xl font-black text-gray-700 mb-2 uppercase tracking-widest text-left">Monthly Supply</h3>
        <div className="text-4xl sm:text-6xl font-black text-gray-800 mb-6 sm:mb-8 text-left">$10<span className="text-xl sm:text-2xl text-gray-400 font-bold ml-2">/mo</span></div>
        <div className="skeuo-inset rounded-2xl p-4 sm:p-6 mb-6 sm:mb-10 flex-1">
          <ul className="space-y-4 sm:space-y-6 text-gray-600 text-left font-bold text-sm sm:text-lg">
            <li className="flex items-center"><Target className="w-6 h-6 text-gray-400 mr-4"/> Access to 4 weekly cycles</li>
            <li className="flex items-center"><Heart className="w-6 h-6 text-gray-400 mr-4"/> Native charity offloading</li>
            <li className="flex items-center"><Gift className="w-6 h-6 text-gray-400 mr-4"/> Full jackpot eligibility</li>
          </ul>
        </div>
        <button
          onClick={() => handleSubscribe('price_1TEjOn2KM38905tQwbPUFUYy')}
          disabled={loading === 'price_1TEjOn2KM38905tQwbPUFUYy'}
          className="w-full skeuo-button py-4 sm:py-5 rounded-2xl font-black uppercase tracking-widest text-gray-700 text-sm sm:text-lg disabled:opacity-50"
        >
          {loading === 'price_1TEjOn2KM38905tQwbPUFUYy' ? 'Connecting...' : 'Initialize Monthly'}
        </button>
      </div>
      
      <div className="skeuo-card rounded-3xl p-6 sm:p-10 flex flex-col pt-8 sm:pt-12 relative overflow-hidden ring-4 ring-transparent hover:ring-blue-300 transition-all border-blue-300/50">
        <div className="absolute top-0 right-0 py-2 px-4 sm:px-6 bg-blue-500 text-white font-black uppercase text-[10px] sm:text-xs tracking-widest rounded-bl-3xl shadow-lg">Primary Array</div>
        <h3 className="text-xl sm:text-3xl font-black text-blue-700 mb-2 uppercase tracking-widest text-left">Annual Core</h3>
        <div className="text-4xl sm:text-6xl font-black text-blue-800 mb-6 sm:mb-8 text-left">$100<span className="text-xl sm:text-2xl text-blue-400 font-bold ml-2">/yr</span></div>
        <div className="skeuo-inset rounded-2xl p-4 sm:p-6 mb-6 sm:mb-10 flex-1 bg-blue-50/10">
          <ul className="space-y-4 sm:space-y-6 text-gray-700 text-left font-bold text-sm sm:text-lg">
            <li className="flex items-center"><Target className="w-6 h-6 text-blue-500 mr-4"/> 12 months contiguous access</li>
            <li className="flex items-center"><Heart className="w-6 h-6 text-blue-500 mr-4"/> Maximum charity throughput</li>
            <li className="flex items-center"><Gift className="w-6 h-6 text-blue-500 mr-4"/> Extract 2 free power cycles</li>
          </ul>
        </div>
        <button
          onClick={() => handleSubscribe('price_1TEjOn2KM38905tQwbPUFUYy')}
          disabled={loading === 'price_1TEjOn2KM38905tQwbPUFUYy'}
          className="w-full skeuo-button py-4 sm:py-5 rounded-2xl font-black uppercase tracking-widest text-blue-700 border-blue-300 text-sm sm:text-lg disabled:opacity-50"
        >
          {loading === 'price_1TEjOn2KM38905tQwbPUFUYy' ? 'Connecting...' : 'Initialize Array'}
        </button>
      </div>
    </div>
  )
}
