'use client'

import { useState } from 'react'

interface SubscribeButtonProps {
  label?: string
  priceId?: string
  className?: string
}

export default function SubscribeButton({ 
  label = 'Subscribe Now', 
  priceId,
  className = ''
}: SubscribeButtonProps) {
  const [loading, setLoading] = useState(false)
  const [showPlans, setShowPlans] = useState(false)

  const handleSubscribe = async (selectedPriceId: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: selectedPriceId }),
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
      setLoading(false)
    }
  }

  // If a specific priceId is given, just show a single button
  if (priceId) {
    return (
      <button
        onClick={() => handleSubscribe(priceId)}
        disabled={loading}
        className={`skeuo-button font-black uppercase tracking-widest text-xs disabled:opacity-50 ${className}`}
      >
        {loading ? 'Connecting...' : label}
      </button>
    )
  }

  // Otherwise show plan picker
  return (
    <div className="relative">
      {!showPlans ? (
        <button
          onClick={() => setShowPlans(true)}
          className={`skeuo-button font-black uppercase tracking-widest text-xs ${className}`}
        >
          {label}
        </button>
      ) : (
        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            onClick={() => handleSubscribe('price_1TEjOn2KM38905tQwbPUFUYy')}
            disabled={loading}
            className="skeuo-button px-4 py-2.5 rounded-xl font-bold text-xs text-gray-700 disabled:opacity-50"
          >
            {loading ? 'Connecting...' : '$10/mo — Monthly'}
          </button>
          <button
            onClick={() => handleSubscribe('price_1TEjOn2KM38905tQwbPUFUYy')}
            disabled={loading}
            className="skeuo-button px-4 py-2.5 rounded-xl font-bold text-xs text-blue-700 disabled:opacity-50"
          >
            {loading ? 'Connecting...' : '$100/yr — Annual (Save $20)'}
          </button>
        </div>
      )}
    </div>
  )
}
