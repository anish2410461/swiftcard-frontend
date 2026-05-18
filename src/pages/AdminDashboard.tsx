import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  List, 
  ShoppingBag, 
  BarChart3, 
  ArrowUpRight, 
  TrendingUp, 
  Users, 
  Package 
} from 'lucide-react';
import AddProduct from './AddProduct'; 
import ProductList from './ProductList';
import AdminOrders from './AdminOrders';
import { fetchAllOrders } from '../services/orderService';
import { getAllProducts } from '../services/productService';

const AdminDashboard = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-close mobile drawer on route transitions
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <BarChart3 size={18} /> },
    { name: 'Inventory', path: '/admin/inventory', icon: <List size={18} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingBag size={18} /> },
    { name: 'New Product', path: '/admin/add', icon: <PlusCircle size={18} /> },
    { name: 'Storefront', path: '/', icon: <ArrowUpRight size={18} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F9FB] font-sans">
      {/* Mobile Drawer Navigation overlay */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Mobile Drawer Panel */}
      <aside className={`fixed top-0 bottom-0 left-0 w-72 bg-slate-900 text-white z-50 flex flex-col transition-transform duration-300 transform lg:hidden ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-2xl font-black text-blue-500 tracking-tighter">
            <img src="/logo.png" alt="SwiftCart Logo" className="h-8 w-auto filter invert brightness-0" />
            <div>
              <span>SwiftCart<span className="text-white">.</span></span>
              <span className="text-[10px] font-bold block text-slate-500 uppercase tracking-widest mt-1">Command Center</span>
            </div>
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="p-1 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer"
          >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
             </svg>
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-8 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
                  isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`}>
                  {item.icon}
                </span>
                <span className="text-sm font-bold uppercase tracking-widest">{item.name}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-8 border-t border-slate-800">
           <div className="bg-slate-800/50 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-black text-white">A</div>
              <div>
                 <p className="text-xs font-bold uppercase tracking-tight">Administrator</p>
                 <p className="text-[10px] text-slate-500 font-medium">Root Access</p>
              </div>
           </div>
        </div>
      </aside>

      {/* DESKTOP SIDEBAR: SwiftCart Dark Mode Style */}
      <aside className="w-72 bg-slate-900 text-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-2 text-2xl font-black text-blue-500 tracking-tighter">
            <img src="/logo.png" alt="SwiftCart Logo" className="h-8 w-auto filter invert brightness-0" />
            <div>
              <span>SwiftCart<span className="text-white">.</span></span>
              <span className="text-[10px] font-bold block text-slate-500 uppercase tracking-widest mt-1">Command Center</span>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-8">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
                  isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`}>
                  {item.icon}
                </span>
                <span className="text-sm font-bold uppercase tracking-widest">{item.name}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-8 border-t border-slate-800">
           <div className="bg-slate-800/50 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-black text-white">A</div>
              <div>
                 <p className="text-xs font-bold uppercase tracking-tight">Administrator</p>
                 <p className="text-[10px] text-slate-500 font-medium">Root Access</p>
              </div>
           </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 px-6 sm:px-10 flex justify-between items-center sticky top-0 z-10">
           <div className="flex items-center gap-3">
              {/* Mobile Sidebar Toggle Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer text-slate-600"
              >
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                 </svg>
              </button>
              <h2 className="text-lg sm:text-xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-2 sm:gap-3">
                 <LayoutDashboard className="text-blue-600" size={24} />
                 {menuItems.find(m => m.path === location.pathname)?.name || 'Admin'}
              </h2>
           </div>
           <div className="flex gap-4">
              <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-50 border border-slate-100 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">
                 Server: <span className="text-green-600">Active</span>
              </div>
           </div>
        </header>

        <div className="p-4 sm:p-10 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<AdminStats />} />
            <Route path="add" element={<AddProduct />} />
            <Route path="edit/:id" element={<AddProduct />} />
            <Route path="inventory" element={<ProductList />} />
            <Route path="orders" element={<AdminOrders />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function AdminStats() {
  const [stats, setStats] = useState({ revenue: 0, orderCount: 0, productCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        const [orders, products] = await Promise.all([fetchAllOrders(), getAllProducts()]);
        const calculatedRevenue = orders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);
        setStats({
          revenue: calculatedRevenue,
          orderCount: orders.length,
          productCount: products.length
        });
      } catch (error) {
        console.error("Failed to load admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardStats();
  }, []);

  const metricCards = [
    { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}`, icon: <TrendingUp className="text-green-500" />, trend: '+12% this month' },
    { label: 'Active Orders', value: stats.orderCount, icon: <ShoppingBag className="text-blue-600" />, trend: 'Running processes' },
    { label: 'Inventory SKU', value: stats.productCount, icon: <Package className="text-indigo-600" />, trend: 'Sync: Active' },
    { label: 'Platform Users', value: '432', icon: <Users className="text-slate-400" />, trend: 'Organic growth' }
  ];

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Platform Overview</h2>
        <p className="text-slate-500 font-medium">Real-time synchronization with SwiftCart global databases.</p>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
           {[1,2,3,4].map(i => <div key={i} className="h-40 bg-white rounded-[32px] border border-slate-100" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {metricCards.map((card, i) => (
            <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-50 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
               <div className="bg-slate-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  {card.icon}
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
               <p className="text-3xl font-black text-slate-900 tracking-tight">{card.value}</p>
               <p className="text-[10px] mt-4 font-bold text-slate-400 uppercase tracking-tight">{card.trend}</p>
               {/* Decorative background circle */}
               <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-700 -z-0 opacity-50" />
            </div>
          ))}
        </div>
      )}

      {/* Future space for charts/activity logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white rounded-[40px] p-10 border border-slate-50 shadow-sm min-h-[400px]">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8 flex items-center gap-3">
               <TrendingUp className="text-green-500" />
               Revenue Projection
            </h3>
            <div className="flex items-center justify-center h-full text-slate-300 font-bold italic">
               Visual analysis engine initializing...
            </div>
         </div>
         <div className="bg-slate-900 rounded-[40px] p-10 shadow-2xl shadow-slate-300">
            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-8">System Health</h3>
            <div className="space-y-6 text-xs font-bold uppercase tracking-widest">
               <div className="flex justify-between">
                  <span className="text-slate-500">API Latency</span>
                  <span className="text-blue-500">22ms</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-slate-500">DB Connectivity</span>
                  <span className="text-green-500">Optimal</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-slate-500">Auth Service</span>
                  <span className="text-green-500">Online</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
