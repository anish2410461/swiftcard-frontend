import { useState, useEffect } from 'react';
import { fetchAllProducts, deleteProduct } from '../services/productService'; 
import { Link, useNavigate } from 'react-router-dom';

const ManageProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const data = await fetchAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to sync inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this product from SwiftCart?")) {
      await deleteProduct(id);
      loadInventory();
    }
  };

  return (
    <div className="bg-[#F8F9FB] min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Inventory Control</h1>
          <p className="text-slate-500 font-medium">Manage your SwiftCart catalog and stock levels.</p>
        </div>
        <Link to="/admin/add" className="bg-blue-600 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2 uppercase tracking-widest text-[10px]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4"/></svg>
          Add New Product
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 relative z-10">Total SKUs</p>
          <p className="text-3xl font-black text-slate-900 relative z-10">{products.length}</p>
          <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50" />
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 relative z-10">Low Stock</p>
          <p className="text-3xl font-black text-orange-500 relative z-10">
             {products.filter(p => !p.stock || p.stock < 5).length} Items
          </p>
          <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-orange-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50" />
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 relative z-10">Inventory Value</p>
          <p className="text-3xl font-black text-blue-600 relative z-10">₹{products.reduce((acc, p) => acc + p.price, 0).toLocaleString()}</p>
          <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50" />
        </div>
      </div>

      {/* Product Table Card */}
      <div className="bg-white rounded-[40px] border border-slate-50 shadow-xl shadow-slate-200/50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit / Manifest Details</th>
              <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valuation</th>
              <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol</th>
              <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Command</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={4} className="p-24 text-center text-slate-300 font-bold italic">Synchronizing with central memory...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={4} className="p-24 text-center text-slate-300 font-bold italic">No active SKUs found in manifest.</td></tr>
            ) : products.map((product) => {
              const productId = product.id || product._id;
              return (
              <tr key={productId} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-10 py-8">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-24 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-50 shadow-inner group-hover:scale-110 transition-transform duration-500">
                       {product.mainImage ? (
                          <img 
                            src={`data:${product.mainImageType};base64,${product.mainImage}`} 
                            className="w-full h-full object-cover" 
                            alt={product.name}
                          />
                       ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                             <svg className="w-8 h-8 font-thin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                          </div>
                       )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-black text-slate-900 text-lg tracking-tighter uppercase">{product.name}</p>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${
                          product.category === 'FASHION' 
                            ? 'bg-[#D4B996]/10 text-[#D4B996]' 
                            : 'bg-blue-50 text-blue-600'
                        }`}>
                          {product.category || 'TECH'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">ID: {productId.substring(productId.length - 8)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <p className="text-xl font-black text-slate-900 tracking-tighter">₹{product.price.toLocaleString()}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Settled Price</p>
                </td>
                <td className="px-10 py-8">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${
                      (!product.stock || product.stock < 5) 
                      ? 'bg-orange-50 text-orange-600 border-orange-100' 
                      : 'bg-green-50 text-green-600 border-green-100'
                  }`}>
                    {(!product.stock || product.stock < 5) ? 'Low Stock' : 'Active'}
                  </span>
                </td>
                <td className="px-10 py-8 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-4 group-hover:translate-x-0">
                    <button 
                      onClick={() => navigate(`/admin/edit/${productId}`)}
                      className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                    </button>
                    <button 
                      onClick={() => handleDelete(productId)}
                      className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProducts;
