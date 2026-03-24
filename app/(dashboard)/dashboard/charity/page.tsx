import CharitySelector from '@/components/dashboard/CharitySelector'
import { Heart } from 'lucide-react'

export default function CharityPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="flex items-center space-x-4 relative z-10">
          <div className="p-3 bg-white/20 rounded-xl">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">My Charity</h1>
            <p className="text-pink-100 mt-1">Select the cause you want to support with your subscription.</p>
          </div>
        </div>
      </div>
      
      <CharitySelector />
    </div>
  )
}
