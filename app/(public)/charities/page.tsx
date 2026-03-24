import { createServerSupabaseClient } from '@/lib/supabase'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Supported Charities',
  description: 'Discover the charities you can support through CharityDraw. Every subscription helps fund their missions.',
}

export default async function CharitiesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: charities } = await supabase.from('charities').select('*').order('name', { ascending: true })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 skeuo-base">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black skeuo-text-emboss">
          Supported Charities
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 font-medium">
          Discover the amazing organizations you can support with your subscription.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {charities?.map(charity => (
          <div key={charity.id} className="skeuo-card flex flex-col rounded-3xl overflow-hidden group hover:shadow-lg transition-all">
            <div className="h-48 skeuo-inset relative">
              {charity.image_url ? (
                <img src={charity.image_url} alt={charity.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Heart className="w-12 h-12 text-gray-300" />
                </div>
              )}
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-black text-gray-700 mb-2">{charity.name}</h3>
              <p className="text-gray-500 font-medium mb-6 flex-1 line-clamp-3">{charity.description}</p>
              <div className="mt-auto">
                <Link href={`/charities/${charity.id}`} className="w-full inline-flex justify-center items-center px-4 py-3 skeuo-button rounded-xl text-green-700 font-black uppercase tracking-widest text-xs">
                  Learn More & Support
                </Link>
              </div>
            </div>
          </div>
        ))}

        {(!charities || charities.length === 0) && (
          <div className="col-span-full skeuo-inset rounded-3xl text-center py-16 text-gray-500">
            <Heart className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="font-black text-lg">No charities have been added yet.</p>
            <p className="font-medium mt-2">Please check back later!</p>
          </div>
        )}
      </div>
    </div>
  )
}
