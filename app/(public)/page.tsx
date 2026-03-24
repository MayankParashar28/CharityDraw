import Link from 'next/link'
import { ArrowRight, Gift, Target, Heart, Star } from 'lucide-react'
import { createServerSupabaseClient } from '@/lib/supabase'
import { signout } from '@/app/(auth)/actions'
import MobileNav from '@/components/MobileNav'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
  description: 'CharityDraw — A subscription-based golf lottery. Enter your Stableford scores, match the draw numbers, and win massive cash prizes while funding charities.',
  openGraph: {
    title: 'CharityDraw — Win Big, Support Charities',
    description: 'Play golf, enter scores, win prizes, and fund charities. Subscribe monthly or yearly.',
  },
}

export default async function Home() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: featuredCharity } = await supabase.from('charities').select('*').eq('is_featured', true).limit(1).single()

  return (
    <div className="min-h-screen skeuo-base flex flex-col font-sans">
      <header className="fixed w-full skeuo-glass z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-18 flex items-center justify-between">
          <div className="text-2xl font-black skeuo-text-emboss">
            CharityDraw
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-bold text-gray-500 uppercase tracking-widest">
            <a href="#how-it-works" className="hover:text-gray-800 transition-colors">Mechanism</a>
            <Link href="/charities" className="hover:text-gray-800 transition-colors">Charities</Link>
            <a href="#pricing" className="hover:text-gray-800 transition-colors">Pricing</a>
          </nav>
          <div className="hidden md:flex gap-4 items-center">
            {user ? (
              <>
                <Link href="/dashboard" className="skeuo-button text-gray-700 px-6 py-2.5 rounded-full font-bold uppercase text-xs tracking-wider">
                  Dashboard
                </Link>
                <form action={signout}>
                  <button className="skeuo-button text-red-600 px-6 py-2.5 rounded-full font-bold uppercase text-xs tracking-wider">Eject</button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="skeuo-button text-gray-600 px-6 py-2.5 rounded-full font-bold uppercase text-xs tracking-wider">Log in</Link>
                <Link href="/signup" className="skeuo-button text-blue-700 px-6 py-2.5 rounded-full font-bold uppercase text-xs tracking-wider border-blue-200">Sign up</Link>
              </>
            )}
          </div>
          <MobileNav user={!!user} />
        </div>
      </header>

      <section className="pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400 rounded-full blur-[120px] opacity-20 -z-10"></div>
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-gray-600 to-gray-400 drop-shadow-sm tracking-tighter leading-tight mb-6 md:mb-8">
          Physical Plays. <br className="hidden md:block"/>
          <span className="skeuo-text-emboss">Real Change.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-xl font-medium text-gray-500 mb-8 md:mb-12 px-2">
          A fully mechanical lottery experience. Enter your golf scores into the master cylinder. Win massive cash prizes while powering world-class charities.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link href="/signup" className="skeuo-button inline-flex items-center justify-center px-6 sm:px-10 py-4 sm:py-5 text-sm sm:text-lg rounded-2xl text-blue-700 font-extrabold uppercase tracking-widest border-blue-200">
            Start Engine <ArrowRight className="ml-3 w-6 h-6" />
          </Link>
          <a href="#how-it-works" className="skeuo-button inline-flex items-center justify-center px-6 sm:px-10 py-4 sm:py-5 text-sm sm:text-lg rounded-2xl text-gray-600 font-extrabold uppercase tracking-widest">
            View Schematics
          </a>
        </div>
      </section>

      <section id="how-it-works" className="py-24 skeuo-inset border-t border-b border-gray-300/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black skeuo-text-emboss">System Architecture</h2>
            <p className="mt-4 text-base sm:text-xl text-gray-500 font-medium">Three mechanical steps to jackpot engagement.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10 text-center">
            <div className="p-8 rounded-3xl skeuo-card">
              <div className="w-20 h-20 skeuo-inset text-pink-500 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-200">
                <Heart className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-gray-700 mb-4">1. Calibrate Charity</h3>
              <p className="text-gray-500 font-medium text-lg leading-relaxed">Lock in your monthly or yearly plan and assign your mechanical foundation output to a charity.</p>
            </div>
            <div className="p-8 rounded-3xl skeuo-card">
              <div className="w-20 h-20 skeuo-inset text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-200">
                <Target className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-gray-700 mb-4">2. Input Parameters</h3>
              <p className="text-gray-500 font-medium text-lg leading-relaxed">Play golf and physically log your scores into our array. The machine holds your last 5 parameters.</p>
            </div>
            <div className="p-8 rounded-3xl skeuo-card">
              <div className="w-20 h-20 skeuo-inset text-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-200">
                <Gift className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-gray-700 mb-4">3. Await Actuation</h3>
              <p className="text-gray-500 font-medium text-lg leading-relaxed">The algorithm cycles every Friday. Match your parameters against the master cylinder to extract payouts.</p>
            </div>
          </div>
        </div>
      </section>

      {featuredCharity && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="skeuo-card rounded-3xl overflow-hidden flex flex-col md:flex-row">
              <div className="md:w-2/5 h-48 md:h-auto skeuo-inset relative">
                {featuredCharity.image_url ? (
                  <img src={featuredCharity.image_url} alt={featuredCharity.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Heart className="w-16 h-16 text-gray-300" />
                  </div>
                )}
              </div>
              <div className="p-8 sm:p-10 md:w-3/5 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                  <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Featured Charity</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-700 mb-3">{featuredCharity.name}</h3>
                <p className="text-gray-500 font-medium leading-relaxed mb-6 line-clamp-3">{featuredCharity.description}</p>
                <Link href={`/charities/${featuredCharity.id}`} className="skeuo-button px-6 py-3 rounded-xl text-green-700 font-black uppercase tracking-widest text-xs inline-flex items-center self-start">
                  Learn More <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="pricing" className="py-32">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 skeuo-text-emboss">Power Requirements</h2>
           <p className="text-base sm:text-xl text-gray-500 mb-10 md:mb-16 font-medium">Supply energy to the prize pool and directly fund your chosen cause.</p>
           
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
               <form action="/api/stripe/create-subscription" method="POST">
                 <input type="hidden" name="priceId" value="price_monthly" />
                 <button className="w-full skeuo-button py-4 sm:py-5 rounded-2xl font-black uppercase tracking-widest text-gray-700 text-sm sm:text-lg">Initialize Monthly</button>
               </form>
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
               <form action="/api/stripe/create-subscription" method="POST">
                 <input type="hidden" name="priceId" value="price_yearly" />
                 <button className="w-full skeuo-button py-4 sm:py-5 rounded-2xl font-black uppercase tracking-widest text-blue-700 border-blue-300 text-sm sm:text-lg">Initialize Array</button>
               </form>
             </div>
           </div>
         </div>
      </section>

      <footer className="skeuo-inset py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="skeuo-text-emboss font-bold uppercase tracking-widest text-sm">© 2026 CharityDraw System Registry.</p>
        </div>
      </footer>

      {/* JSON-LD Structured Data for rich search results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'CharityDraw',
            description: 'A subscription-based golf lottery that funds charities while offering cash prizes.',
            url: 'https://charitydraw.com',
            applicationCategory: 'GameApplication',
            offers: [
              {
                '@type': 'Offer',
                name: 'Monthly Subscription',
                price: '10.00',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
              },
              {
                '@type': 'Offer',
                name: 'Annual Subscription',
                price: '100.00',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
              },
            ],
          }),
        }}
      />
    </div>
  )
}
