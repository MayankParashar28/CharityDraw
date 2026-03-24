import { createServerSupabaseClient } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function CharityProfile({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createServerSupabaseClient()
  
  const { data: charity } = await supabase.from('charities').select('*').eq('id', resolvedParams.id).single()

  if (!charity) {
    notFound()
  }

  const events = Array.isArray(charity.events) ? charity.events : []

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12 border border-gray-100">
        <div className="h-64 sm:h-80 lg:h-96 w-full bg-gray-200 relative">
          {charity.image_url ? (
            <img src={charity.image_url} alt={charity.name} className="w-full h-full object-cover" />
          ) : (
             <div className="w-full h-full flex items-center justify-center bg-green-50 text-green-400">
               <span className="text-xl font-bold uppercase tracking-widest opacity-50">No Cover Image</span>
             </div>
          )}
        </div>
        <div className="p-8 sm:p-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">{charity.name}</h1>
            <Link 
              href="/#pricing" 
              className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-green-600 hover:bg-green-700 transition shadow-lg transform hover:-translate-y-0.5"
            >
              Support This Charity
            </Link>
          </div>
          
          <div className="prose prose-lg text-gray-600 max-w-none">
            {charity.description?.split('\n').map((para: string, idx: number) => (
              <p key={idx} className="mb-4">{para}</p>
            ))}
          </div>

          {charity.website && (
            <div className="mt-8">
              <a href={charity.website} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 font-semibold flex items-center">
                Visit Official Website →
              </a>
            </div>
          )}
        </div>
      </div>

      {events.length > 0 && (
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((evt: any, idx: number) => (
              <div key={idx} className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="text-green-600 font-semibold text-sm uppercase tracking-wide mb-2">{evt.date}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{evt.title}</h3>
                <p className="text-gray-600">{evt.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
