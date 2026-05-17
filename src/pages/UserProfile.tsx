import { useState, useEffect } from 'react';
import { 
  Package, 
  User, 
  Settings, 
  LogOut, 
  CreditCard, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Truck,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getOrders } from '../services/orderService';
import { useNavigate, Link } from 'react-router-dom';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface UserOrder {
  id: string;
  username: string;
  orderDate: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
}

export default function UserProfile() {
  const { username, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'settings'>('overview');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await getOrders();
        setOrders(data.sort((a: UserOrder, b: UserOrder) => 
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        ));
      } catch (error) {
        console.error("Failed to load user dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'DELIVERED': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'SHIPPED': return <Truck className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'DELIVERED': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'SHIPPED': return 'bg-blue-50 text-blue-700 border-blue-100';
      default: return 'bg-amber-50 text-amber-700 border-amber-100';
    }
  };

  // Stats calculation
  const totalSpent = orders.reduce((acc, order) => acc + order.totalAmount, 0);
  const activeOrders = orders.filter(o => o.status !== 'DELIVERED').length;

  return (
    <div className="min-h-screen bg-[#F8F9FB] pt-8 pb-24">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* DASHBOARD HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-200">
                <User size={24} strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Verified Member</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">
              {username?.split('@')[0] || "My Account"}
            </h1>
            <p className="text-slate-500 font-medium mt-1">{username}</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all shadow-sm"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SIDEBAR NAVIGATION */}
          <div className="lg:col-span-3 space-y-2">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest ${
                activeTab === 'overview' ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-500 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-3"><Package size={18} /> Overview</span>
              <ChevronRight size={14} className={activeTab === 'overview' ? 'opacity-100' : 'opacity-0'} />
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest ${
                activeTab === 'orders' ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-500 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-3"><CreditCard size={18} /> Order History</span>
              <ChevronRight size={14} className={activeTab === 'orders' ? 'opacity-100' : 'opacity-0'} />
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest ${
                activeTab === 'settings' ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-500 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-3"><Settings size={18} /> Settings</span>
              <ChevronRight size={14} className={activeTab === 'settings' ? 'opacity-100' : 'opacity-0'} />
            </button>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-9">
            
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* STATS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm group hover:shadow-xl transition-all">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Investment</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">₹{totalSpent.toLocaleString('en-IN')}</h3>
                    <div className="mt-6 w-12 h-1.5 bg-blue-600 rounded-full group-hover:w-20 transition-all duration-500"></div>
                  </div>
                  <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm group hover:shadow-xl transition-all">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Active Deployments</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{activeOrders}</h3>
                    <div className="mt-6 w-12 h-1.5 bg-amber-500 rounded-full group-hover:w-20 transition-all duration-500"></div>
                  </div>
                  <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm group hover:shadow-xl transition-all">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Ecosystem Tier</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">PLATINUM</h3>
                    <div className="mt-6 w-12 h-1.5 bg-emerald-500 rounded-full group-hover:w-20 transition-all duration-500"></div>
                  </div>
                </div>

                {/* RECENT ORDERS PREVIEW */}
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
                    <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Recent Logistics</h2>
                    <button onClick={() => setActiveTab('orders')} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:translate-x-1 transition-transform">View All</button>
                  </div>
                  
                  {isLoading ? (
                    <div className="p-12 text-center animate-pulse">
                      <div className="h-8 bg-slate-50 rounded-full w-48 mx-auto mb-4"></div>
                      <div className="h-4 bg-slate-50 rounded-full w-64 mx-auto"></div>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="p-20 text-center">
                      <ShoppingBag className="mx-auto h-16 w-16 text-slate-100 mb-6" />
                      <p className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2">No Active Nodes</p>
                      <Link to="/" className="text-blue-600 font-bold text-xs uppercase tracking-widest border-b-2 border-blue-100 pb-1">Begin Procurement</Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-50">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="px-8 py-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                          <div className="flex items-center gap-4 md:gap-8">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getStatusStyles(order.status)}`}>
                              {getStatusIcon(order.status)}
                            </div>
                            <div>
                              <p className="text-xs font-mono text-slate-400 mb-1">ID: {order.id.substring(0, 8)}...</p>
                              <h4 className="font-black text-slate-900 uppercase tracking-tight">
                                {order.items[0]?.productName || "SwiftCart Package"}
                                {order.items.length > 1 && <span className="text-slate-400 font-medium ml-2 text-xs">+{order.items.length - 1} more</span>}
                              </h4>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-black text-slate-900 mb-1">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(order.orderDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Logistics History</h2>
                  <span className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {orders.length} Records Found
                  </span>
                </div>

                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500">
                    <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50 flex flex-wrap justify-between items-center gap-4">
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Timestamp</p>
                          <p className="text-sm font-bold text-slate-900">{new Date(order.orderDate).toLocaleString()}</p>
                        </div>
                        <div className="w-px h-8 bg-slate-200 hidden md:block"></div>
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Sequence ID</p>
                          <p className="text-sm font-mono font-bold text-slate-600">{order.id}</p>
                        </div>
                      </div>
                      <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 ${getStatusStyles(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status || 'PROCESSING'}
                      </div>
                    </div>

                    <div className="p-8">
                      <div className="space-y-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100 group">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-black text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                                {item.quantity}x
                              </div>
                              <h5 className="font-bold text-slate-900 uppercase tracking-tight">{item.productName || "Product Node"}</h5>
                            </div>
                            <span className="font-black text-slate-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 flex justify-between items-end">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Shipping Designation</p>
                          <p className="text-sm font-bold text-slate-900 max-w-xs leading-tight">Standard Priority Fulfillment — SwiftCart Direct</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Grand Total</p>
                          <p className="text-3xl font-black text-blue-600 tracking-tighter">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {orders.length === 0 && !isLoading && (
                  <div className="p-32 text-center bg-white rounded-[40px] border border-slate-100">
                    <ShoppingBag className="mx-auto h-20 w-20 text-slate-100 mb-8" />
                    <p className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Logistics manifest empty</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white p-12 rounded-[40px] border border-slate-100 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Settings className="text-slate-300 w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">Control Center Offline</h2>
                <p className="text-slate-500 max-w-md mx-auto mb-8">User profile modifications and security protocols are currently hardcoded for system stability.</p>
                <div className="h-px w-24 bg-slate-100 mx-auto"></div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
