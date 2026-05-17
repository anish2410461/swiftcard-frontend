import { useState, useEffect } from 'react';
import { fetchAllOrders, updateOrderStatus } from '../services/orderService';
import { Loader2, ShoppingBag, Search, Filter, RefreshCw, Layers } from 'lucide-react';

interface AdminOrder {
  id: string;
  username: string;
  orderDate: string;
  totalAmount: number;
  status: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchAllOrders();
      setOrders(data.sort((a: AdminOrder, b: AdminOrder) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()));
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      loadOrders();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && orders.length === 0) return (
    <div className="flex flex-col items-center justify-center p-24 text-slate-400 gap-4">
      <Loader2 size={32} className="animate-spin text-blue-600" />
      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Syncing Order Log...</span>
    </div>
  );

  return (
    <div className="space-y-10 font-sans pb-24">
      
      {/* Search & Actions Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div className="flex-1 w-full max-w-md relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
               type="text" 
               placeholder="Search transaction memory..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-blue-50/50 focus:border-blue-600 transition-all font-bold text-slate-900 shadow-sm"
            />
         </div>
         <div className="flex gap-4 w-full md:w-auto">
            <button className="bg-white px-6 py-4 rounded-3xl border border-slate-100 text-slate-900 font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition shadow-sm">
               <Filter size={16} /> Filter Status
            </button>
            <button onClick={loadOrders} className="bg-slate-900 px-6 py-4 rounded-3xl text-white font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-black transition shadow-lg shadow-slate-200">
               <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Sync Database
            </button>
         </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-white rounded-[40px] border border-slate-50 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
           <div className="flex items-center gap-3">
              <Layers className="text-blue-600" size={20} />
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Order Processing Stack</h2>
           </div>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Live Feed Status: <span className="text-green-500">Connected</span></span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">Transaction Node</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">Customer Authority</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">Time/Date</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 text-right">Settlement</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 text-center">Status Protocol</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 text-center">Command</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                       <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                          <ShoppingBag size={18} />
                       </div>
                       <span className="font-mono text-[10px] font-black text-slate-400 uppercase tracking-widest">#{order.id.substring(order.id.length - 8)}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                     <span className="font-black text-slate-900 text-sm block uppercase tracking-tight">{order.username}</span>
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">Account Verified</span>
                  </td>
                  <td className="px-10 py-8">
                     <p className="font-black text-slate-900 text-sm tracking-tighter uppercase">{new Date(order.orderDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{new Date(order.orderDate).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</p>
                  </td>
                  <td className="px-10 py-8 text-right">
                     <p className="font-black text-lg text-slate-900 tracking-tighter">₹{order.totalAmount.toLocaleString("en-IN")}</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Settled - COD</p>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      order.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-100' : 
                      order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                      'bg-orange-50 text-orange-700 border-orange-100'
                    }`}>
                      {order.status || 'PENDING'}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex justify-center">
                      <select 
                        value={order.status || 'PENDING'} 
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-900 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition shadow-sm appearance-none cursor-pointer text-center min-w-[140px]"
                      >
                        <option value="PENDING">Initialize</option>
                        <option value="SHIPPED">Set Shipped</option>
                        <option value="DELIVERED">Complete</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                   <td colSpan={6} className="py-24 text-center">
                      <p className="text-slate-300 font-bold italic">No transaction records found in central memory.</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
