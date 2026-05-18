import { useState, useEffect, useRef } from 'react';
import ProductCard from '../components/ProductCard';
import { fetchAllProducts } from '../services/productService'; 
import { useCategory } from '../context/CategoryContext';
import type { Product } from '../types/product';

const Home = () => {
  const { activeCategory, setActiveCategory } = useCategory();
  const [allProducts, setAllProducts] = useState<Product[]>([]); 
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const catalogueRef = useRef<HTMLDivElement>(null);

  const categoryFilters = [
    { name: 'ALL', icon: '✨' },
    { name: 'LAPTOPS', icon: '💻' },
    { name: 'TABLETS', icon: '📱' },
    { name: 'AUDIO', icon: '🎧' },
    { name: 'WEARABLES', icon: '⌚' }
  ];

  // 1. Fetch ALL products once on page load
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const data = await fetchAllProducts();
        const techOnly = data.filter((product: any) => product.category !== 'FASHION');
        setAllProducts(techOnly);
        setFilteredProducts(techOnly); 
      } catch (error) {
        console.error("SwiftCart Sync Error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // 2. INSTANT FILTER LOGIC
  useEffect(() => {
    if (activeCategory === 'ALL') {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter(product => 
        product.category?.toUpperCase() === activeCategory
      );
      setFilteredProducts(filtered);
    }
  }, [activeCategory, allProducts]);

  const heroProducts = [
    {
      id: 1,
      name: "Lumina X Pro",
      tagline: "The pinnacle of mobile engineering. Designed for creators, powered by intelligence.",
      specs: [
        { label: "Display", value: "6.9\" Pro-Motion OLED" },
        { label: "Camera", value: "200 MP Quad-Lens" },
        { label: "Battery", value: "72h Ultra Life" },
        { label: "Chip", value: "Bionic A18 Titan" }
      ],
      image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000",
      gradient: "from-blue-600 to-indigo-900"
    },
    {
      id: 2,
      name: "AuraBook Pro",
      tagline: "Redefining professional performance. The ultimate tool for the modern visionary.",
      specs: [
        { label: "Processor", value: "M3 Max Ultra" },
        { label: "Display", value: "16\" Liquid Retina" },
        { label: "Memory", value: "128GB Unified" },
        { label: "Storage", value: "8TB SSD" }
      ],
      image: "/images/laptop_hero.png",
      gradient: "from-slate-800 to-slate-950"
    },
    {
      id: 3,
      name: "Zenith Watch",
      tagline: "Time, evolved. Precision craftsmanship meets futuristic intelligence on your wrist.",
      specs: [
        { label: "Display", value: "Holographic AMOLED" },
        { label: "Durability", value: "Titanium Grade 5" },
        { label: "Sensors", value: "Bio-Sync 3.0" },
        { label: "Battery", value: "14 Days" }
      ],
      image: "/images/watch_hero.png",
      gradient: "from-purple-800 to-indigo-950"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroProducts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentProduct = heroProducts[currentSlide];

  return (
    <div className="bg-[#F8F9FB] min-h-screen font-sans">
      
      {/* 1. DYNAMIC HERO SLIDER */}
      <div className="container mx-auto px-6 pt-8">
        <div className={`relative overflow-hidden rounded-[40px] bg-gradient-to-br ${currentProduct.gradient} min-h-[600px] flex items-center shadow-2xl transition-all duration-1000`}>
          
          {/* Animated Image Container */}
          <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block overflow-hidden">
            <div 
              key={currentProduct.id}
              className="w-full h-full animate-in fade-in slide-in-from-right-20 duration-1000 ease-out"
            >
              <img 
                src={currentProduct.image} 
                className="w-full h-full object-contain scale-110 drop-shadow-2xl" 
                alt={currentProduct.name}
              />
            </div>
          </div>

          <div className="relative z-10 px-12 lg:px-24 text-white max-w-2xl">
            <div 
              key={currentProduct.id}
              className="animate-in fade-in slide-in-from-left-10 duration-700 ease-out"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.2em] mb-8 border border-white/10">
                Premium Selection
              </span>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter mb-6 leading-none text-white">
                {currentProduct.name}
              </h1>
              <p className="text-xl text-blue-100 mb-12 font-light leading-relaxed">
                {currentProduct.tagline}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 mb-12 md:border-l md:border-white/20 md:pl-8">
                {currentProduct.specs.map((spec, idx) => (
                  <div key={idx}>
                    <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-1">{spec.label}</p>
                    <p className="font-bold text-lg text-white">{spec.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button className="bg-white text-blue-700 font-black px-10 py-4 rounded-full shadow-xl hover:scale-105 transition-all text-xs uppercase tracking-widest">
                  Discover Now
                </button>
                <button className="bg-transparent border border-white/30 text-white font-bold px-10 py-4 rounded-full hover:bg-white/10 transition-colors text-xs uppercase tracking-widest">
                  View Specs
                </button>
              </div>
            </div>

            {/* Slider Navigation Dots */}
            <div className="flex gap-3 mt-16">
              {heroProducts.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === idx ? 'w-12 bg-white' : 'w-4 bg-white/30'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ECOSYSTEM CATALOGUE - RESPONSIVE GRID */}
      <div id="catalogue-grid" ref={catalogueRef} className="container mx-auto px-4 md:px-6 py-10 md:py-16 mt-0 md:mt-12">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10 gap-4">
          <div>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase">Ecosystem Catalogue</h2>
            <p className="text-xs md:text-base text-slate-500 font-medium">Filter your experience across every SwiftCart dimension.</p>
          </div>
          <span className="bg-white text-slate-400 text-[8px] md:text-[10px] font-black px-4 md:px-6 py-2 md:2.5 rounded-full uppercase tracking-widest border border-slate-100 shadow-sm">
            {filteredProducts.length} Units Found
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-6">
          {categoryFilters.map((cat) => (
            <button 
              key={cat.name} 
              onClick={() => setActiveCategory(cat.name)}
              className={`p-4 md:p-8 rounded-[24px] md:rounded-[40px] border transition-all duration-500 text-left cursor-pointer group flex flex-col items-start w-full relative overflow-hidden ${
                activeCategory === cat.name 
                  ? 'bg-blue-600 border-blue-700 shadow-xl shadow-blue-200 -translate-y-1 md:-translate-y-2 text-white' 
                  : 'bg-white border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1' 
              }`}
            >
              <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl text-xl md:text-2xl flex items-center justify-center mb-4 md:mb-8 shadow-inner transition-all duration-500 ${
                activeCategory === cat.name ? 'bg-white/20 text-white scale-110' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
              }`}>
                {cat.icon}
              </div>
              <h3 className={`text-sm md:text-xl font-black mb-0.5 md:mb-1 uppercase tracking-tighter ${activeCategory === cat.name ? 'text-white' : 'text-slate-900'}`}>
                {cat.name}
              </h3>
              <p className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] ${activeCategory === cat.name ? 'text-blue-100' : 'text-slate-400'}`}>
                {activeCategory === cat.name ? 'Selected' : 'View Collection'}
              </p>
              {activeCategory === cat.name && (
                <div className="absolute -bottom-4 -right-4 w-12 h-12 md:w-24 md:h-24 bg-white/10 rounded-full blur-xl md:blur-2xl" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* MARKET FAVORITES - RESPONSIVE GRID */}
      <div className="container mx-auto px-4 md:px-6 pb-24">
        <div className="flex items-center gap-3 md:gap-6 mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase shrink-0">Market Favorites</h2>
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="text-[8px] md:text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] md:tracking-[0.3em] px-3 md:px-6 py-2 md:py-3 bg-blue-50 rounded-full border border-blue-100 shrink-0 shadow-sm">
                Node: {activeCategory}
            </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-48 md:h-[450px] bg-white rounded-[16px] md:rounded-[40px] animate-pulse border border-slate-50 shadow-sm p-2 md:p-8 space-y-3 md:space-y-6">
                 <div className="h-2/3 bg-slate-50 rounded-[12px] md:rounded-[32px]"></div>
                 <div className="space-y-2">
                    <div className="h-3 bg-slate-50 rounded w-3/4"></div>
                    <div className="h-2 bg-slate-50 rounded w-1/2"></div>
                 </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-16 md:p-32 text-center bg-white rounded-[40px] md:rounded-[60px] border-2 border-dashed border-slate-100 shadow-inner">
            <p className="text-4xl md:text-6xl mb-4 md:mb-8">🔍</p>
            <p className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">Inventory Anomaly</p>
            <p className="text-xs md:text-slate-400 font-medium uppercase tracking-tight">No products matching "{activeCategory}" found in the SwiftCart memory.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-10">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id || product._id} product={product} viewMode="tech" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
