import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { fetchAllProducts } from '../services/productService';
import type { Product } from '../types/product';

const Fashion = () => {
  const [fashionItems, setFashionItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFashionData = async () => {
      setLoading(true);
      try {
        const data = await fetchAllProducts();
        const fashion = data.filter((p: Product) => p.category?.toUpperCase() === 'FASHION');
        setFashionItems(fashion);
      } catch (error) {
        console.error("Failed to sync fashion inventory:", error);
      } finally {
        setLoading(false);
      }
    };
    loadFashionData();
  }, []);

  const fashionHeroProducts = [
    {
      id: 1,
      name: "Summer Trend",
      subtitle: "Volume 04 // Summer Edition",
      image: "/images/summer_hero.png",
      bgColor: "bg-[#D4B996]",
      accentColor: "bg-black/10"
    },
    {
      id: 2,
      name: "Winter Atelier",
      subtitle: "Volume 01 // Winter Edition",
      image: "/images/winter_hero.png",
      bgColor: "bg-[#2C3E50]",
      accentColor: "bg-white/10"
    },
    {
      id: 3,
      name: "Spring Blossom",
      subtitle: "Volume 02 // Spring Edition",
      image: "/images/spring_hero.png",
      bgColor: "bg-[#E8D5D8]",
      accentColor: "bg-black/10"
    }
  ];

  const [currentFashionSlide, setCurrentFashionSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFashionSlide((prev) => (prev + 1) % fashionHeroProducts.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const activeFashionHero = fashionHeroProducts[currentFashionSlide];

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      {/* 1. THE FASHION HERO SLIDER */}
      <div className="container mx-auto px-6 pt-8">
        <div className={`relative overflow-hidden rounded-[40px] ${activeFashionHero.bgColor} h-[700px] flex items-center shadow-2xl transition-all duration-1000`}>
          
          <div className="relative z-10 px-12 lg:px-24 text-white max-w-2xl">
            <div key={activeFashionHero.id} className="animate-in fade-in slide-in-from-left-10 duration-700">
              <span className={`text-[10px] font-bold uppercase tracking-[0.3em] ${activeFashionHero.accentColor} px-4 py-1.5 rounded-full mb-8 inline-block`}>
                {activeFashionHero.subtitle}
              </span>
              <h1 className="text-4xl sm:text-7xl md:text-8xl font-black leading-none mb-6 tracking-tighter">
                {activeFashionHero.name.split(' ')[0]} <br/> 
                <span className="italic font-light">{activeFashionHero.name.split(' ')[1]}</span> <br/> 
                Collection
              </h1>
              <div className="flex gap-3 md:gap-4 mt-8 md:mt-12 flex-wrap">
                <button className="bg-blue-600 text-white font-bold px-5 py-3 md:px-10 md:py-4 rounded-full shadow-xl hover:bg-blue-700 transition-all text-[10px] md:text-xs uppercase tracking-widest shrink-0">
                  Explore Lookbook
                </button>
                <button className="bg-transparent border border-white text-white font-bold px-5 py-3 md:px-10 md:py-4 rounded-full hover:bg-white hover:text-slate-900 transition-all text-[10px] md:text-xs uppercase tracking-widest shrink-0">
                  Shop Arrivals
                </button>
              </div>
            </div>

            {/* Slider Navigation Dots */}
            <div className="flex gap-3 mt-16">
              {fashionHeroProducts.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentFashionSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${currentFashionSlide === idx ? 'w-12 bg-white' : 'w-4 bg-white/30'}`}
                />
              ))}
            </div>
          </div>

          <div className="absolute right-4 bottom-16 sm:bottom-8 lg:right-0 lg:top-0 w-28 h-28 sm:w-40 sm:h-40 lg:w-1/2 lg:h-full overflow-hidden pointer-events-none lg:pointer-events-auto rounded-3xl lg:rounded-none">
            <div key={activeFashionHero.id} className="w-full h-full animate-in fade-in slide-in-from-right-20 duration-1000">
              <img 
                src={activeFashionHero.image} 
                className="w-full h-full object-cover" 
                alt={activeFashionHero.name} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. CURATED COLLECTIONS - UPDATED BENTO GRID */}
      <div className="container mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Curated Collections</h2>
            <p className="text-slate-500 mt-2">Intentional designs for every facet of modern life.</p>
          </div>
          <button 
            onClick={() => document.getElementById('trending-now')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-blue-600 font-bold flex items-center gap-2 hover:gap-4 transition-all"
          >
            View All <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </button>
        </div>

        {/* We use a 12-column grid to get the 60/40 split feel */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[800px]">
          
          {/* Left Side: Large Featured Collection (The Minimalism Edit) */}
          <div className="md:col-span-7 relative rounded-[40px] overflow-hidden group shadow-2xl bg-slate-200 min-h-[450px] md:min-h-0">
            <img 
              src="/images/minimalism.png" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
              alt="Minimalism" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 md:bottom-12 md:left-12 md:right-auto text-white max-w-md">
              <h3 className="text-2xl sm:text-4xl font-bold mb-2 md:mb-4 leading-tight">The Minimalism Edit</h3>
              <p className="text-xs sm:text-sm text-white/80 mb-4 md:mb-8 font-medium">Clean lines, neutral palettes, and effortless sophistication for the modern professional.</p>
              <button 
                onClick={() => document.getElementById('trending-now')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-slate-900 px-6 py-3 md:px-10 md:py-4 rounded-full font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-blue-600 hover:text-white transition-colors"
              >
                Shop Collection
              </button>
            </div>
          </div>

          {/* Right Side: Two Stacked Cards */}
          <div className="md:col-span-5 grid grid-rows-2 gap-6">
            
            {/* Urban Streetwear Card */}
            <div className="relative rounded-[40px] overflow-hidden group shadow-xl min-h-[250px] md:min-h-0">
              <img 
                src="/images/streetwear.png" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                alt="Streetwear" 
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Urban Streetwear</h3>
                <p 
                  onClick={() => document.getElementById('trending-now')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-xs font-black uppercase tracking-[0.2em] border-b-2 border-white inline-block pb-1 cursor-pointer"
                >
                  Browse Now
                </p>
              </div>
            </div>

            {/* Finishing Touch Card */}
            <div className="relative rounded-[40px] overflow-hidden group shadow-xl min-h-[250px] md:min-h-0">
              <img 
                src="/images/accessories.png" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                alt="Accessories" 
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-xl sm:text-2xl font-bold mb-2">The Finishing Touch</h3>
                <p className="text-xs sm:text-sm font-medium text-white/80">Curated eyewear, watches, and leather goods.</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 3. TRENDING NOW - FASHION EDITION */}
      <div id="trending-now" className="container mx-auto px-6 pb-24">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-8 h-[2px] bg-slate-900"></div>
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Trending Now</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-10">
            {[1,2,3,4].map(i => (
              <div key={i} className="aspect-[3/4] bg-slate-100 rounded-[20px] sm:rounded-[32px] animate-pulse"></div>
            ))}
          </div>
        ) : fashionItems.length === 0 ? (
          <div className="p-24 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-100 italic text-slate-400">
            No active Atelier collections found in memory.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-10">
            {fashionItems.map((item) => (
              <ProductCard key={item.id || item._id} product={item} viewMode="fashion" />
            ))}
          </div>
        )}
      </div>

      {/* 4. BRAND QUOTE (Editorial Bridge) */}
      <div className="bg-slate-900 py-32 mt-24">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <div className="w-1 h-1 bg-blue-600 rounded-full mx-auto mb-10"></div>
          <h2 className="text-5xl md:text-6xl font-light text-white leading-tight tracking-tighter italic">
            "Fashion is not just about clothes, it's about the <span className="font-bold text-blue-500">architecture of self</span>. Our collection is built to frame your narrative."
          </h2>
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 border border-white/10 overflow-hidden">
              <img src="/images/anish.png" className="w-full h-full object-cover" alt="Anish M" />
            </div>
            <p className="text-[10px] font-black text-white uppercase tracking-[0.4em]">ANISH M • CREATIVE DIRECTOR & CHIEF DEVELOPER</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fashion;