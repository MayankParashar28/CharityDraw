'use client'

import { useState, useEffect } from 'react'
import { Select, Slider, Button, message } from 'antd'

interface Charity {
  id: string
  name: string
  description: string
}

export default function CharitySelector() {
  const [charities, setCharities] = useState<Charity[]>([])
  const [selectedCharity, setSelectedCharity] = useState<string>('')
  const [percentage, setPercentage] = useState<number>(10)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/charity/list').then(res => res.json()).then(data => {
      setCharities(data.charities || [])
      setSelectedCharity(data.userCharityId || (data.charities?.[0]?.id || ''))
      setPercentage(data.userPercentage || 10)
      setLoading(false)
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/charity/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ charityId: selectedCharity, percentage })
      })
      if (!res.ok) throw new Error('Failed to update charity preferences')
      message.success('Charity preferences updated!')
    } catch (e: any) {
      message.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6 text-center text-gray-500">Loading charity info...</div>

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6 md:w-full lg:w-1/2">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Supported Charity</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Charity</label>
        <Select 
          className="w-full" 
          size="large"
          value={selectedCharity} 
          onChange={setSelectedCharity}
          options={charities.map(c => ({ label: c.name, value: c.id }))}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Contribution Percentage ({percentage}%)</label>
        <Slider 
          min={10} 
          max={50} 
          marks={{ 10: '10%', 25: '25%', 50: '50%' }}
          value={percentage} 
          onChange={setPercentage} 
        />
        <p className="text-xs text-gray-500 mt-5">
          We default to donating 10% of your subscription to the chosen charity, but you can choose to donate up to 50%.
        </p>
      </div>

      <Button type="primary" onClick={handleSave} loading={saving} className="bg-blue-600 hover:bg-blue-700 w-full" size="large">
        Save Preferences
      </Button>
    </div>
  )
}
