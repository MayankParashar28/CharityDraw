import { createServerSupabaseClient } from '@/lib/supabase'
import Link from 'next/link'

export default async function CharitiesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: charities } = await supabase.from('charities').select('*').order('name', { ascending: true })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Supported <span className="text-green-600">Charities</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
          Discover the amazing organizations you can support with your subscription.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {charities?.map(charity => (
          <div key={charity.id} className="bg-white flex flex-col rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border border-gray-100">
            <div className="h-48 bg-gray-200 relative">
              {charity.image_url ? (
                <img src={charity.image_url} alt={charity.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-green-50 text-green-400">
                  <span className="text-sm font-semibold uppercase tracking-wider">No Image</span>
                </div>
              )}
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{charity.name}</h3>
              <p className="text-gray-600 mb-6 flex-1 line-clamp-3">{charity.description}</p>
              <div className="mt-auto">
                <Link href={`/charities/${charity.id}`} className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-green-700 bg-green-100 hover:bg-green-200 transition-colors">
                  Learn More & Support
                </Link>
              </div>
            </div>
          </div>
        ))}

        {(!charities || charities.length === 0) && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No charities have been added yet. Please check back later!
          </div>
        )}
      </div>
    </div>
  )
}
