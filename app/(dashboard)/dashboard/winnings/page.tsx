import WinningsTable from '@/components/dashboard/WinningsTable'
import { Trophy } from 'lucide-react'

export default function WinningsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-20 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="flex items-center space-x-4 relative z-10">
          <div className="p-3 bg-white/20 rounded-xl">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Winnings & Payouts</h1>
            <p className="text-orange-50 mt-1">Track your jackpot wins and securely upload verification proofs.</p>
          </div>
        </div>
      </div>
      
      <WinningsTable />
    </div>
  )
}
