import CharitySelector from '@/components/dashboard/CharitySelector'
import { Heart } from 'lucide-react'

export default function CharityPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="skeuo-card rounded-3xl p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-pink-400 rounded-full blur-[80px] opacity-20 -mr-10 -mt-10"></div>
        <div className="flex items-center space-x-4 relative z-10">
          <div className="w-16 h-16 skeuo-inset rounded-2xl flex items-center justify-center border border-white/30">
            <Heart className="w-8 h-8 text-pink-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black skeuo-text-emboss">My Charity</h1>
            <p className="text-gray-500 font-medium tracking-wide mt-1 text-sm">Select the cause you want to support with your subscription.</p>
          </div>
        </div>
      </div>
      
      <CharitySelector />
    </div>
  )
}
