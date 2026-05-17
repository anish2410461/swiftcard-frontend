import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, ShoppingBag, ArrowRight } from 'lucide-react';
import { searchProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types/product';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await searchProducts(query);
        setResults(data);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-[#F8F9FB] pt-12 pb-24">
      <div className="container mx-auto px-6">
        
        {/* Search Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 border-b border-slate-100 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                <SearchIcon size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Global Query</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">
              Results for: <span className="text-blue-600">"{query}"</span>
            </h1>
            <p className="text-slate-500 font-medium mt-2">
              Showing {results.length} results across all departments
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
             <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest">Electronics</div>
             <div className="px-4 py-2 bg-[#D4B996]/10 text-[#B89B74] rounded-xl text-[10px] font-black uppercase tracking-widest">Fashion</div>
          </div>
        </div>

        {/* Results Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-3xl aspect-[3/4] border border-slate-100"></div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
            {results.map((product) => (
              <ProductCard 
                key={product._id || product.id} 
                product={product} 
                viewMode={product.category?.toLowerCase() === 'fashion' ? 'fashion' : 'tech'}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[40px] p-24 text-center border border-slate-100 shadow-sm max-w-4xl mx-auto">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100">
              <ShoppingBag size={40} className="text-slate-200" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-4">No Matches Found</h2>
            <p className="text-slate-500 text-lg mb-8 max-w-md mx-auto">We couldn't find anything matching your query. Maybe try searching for a different color or department?</p>
            <div className="flex justify-center gap-4">
              <Link to="/" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center gap-2">
                Browse Tech <ArrowRight size={16} />
              </Link>
              <Link to="/fashion" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-100 flex items-center gap-2">
                Browse Fashion <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
