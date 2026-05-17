import { useState, useEffect } from 'react';
import { getOrders } from '../services/orderService';
import { getProfile, updateProfile } from '../services/userService';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('address');
  const [orders, setOrders] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState<string | null>(null);
  const { username } = useAuth();

  const toggleTracking = (orderId: string) => {
    setTrackingOrder(trackingOrder === orderId ? null : orderId);
  };

  const handleDownloadInvoice = (order: any) => {
    const invoiceContent = `
SWIFTCART INVOICE
=================
Order ID: ${order.id}
Date: ${new Date(order.orderDate).toLocaleDateString()}
Customer: ${userProfile?.fullName || username || 'Customer'}
-----------------
ITEMS:
${order.items.map((item: any) => `- ${item.productName} (Qty: ${item.quantity}) = ₹${item.price.toLocaleString()}`).join('\n')}
-----------------
TOTAL: ₹${order.totalAmount.toLocaleString()}
STATUS: ${order.status}
=================
Thank you for shopping with SwiftCart!
`;
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${order.id.substring(0, 8)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ordersData, profileData] = await Promise.all([
          getOrders().catch(() => []), 
          getProfile().catch(() => null)
        ]);
        
        // Sort by date descending
        if (ordersData && Array.isArray(ordersData)) {
          setOrders(ordersData.sort((a: any, b: any) => 
            new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
          ));
        }
        if (profileData) {
          setUserProfile(profileData);
        }
      } catch (err) {
        console.error("Failed to fetch profile data", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile(userProfile);
      console.log('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      console.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const displayUsername = username || localStorage.getItem('username') || "Guest User";
  // Format the name nicely (capitalize first letter of username/email prefix)
  const formattedName = displayUsername.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="bg-[#F8F9FB] min-h-screen pt-12 pb-24">
      <div className="container mx-auto px-6 max-w-6xl">
        
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* LEFT: Profile Sidebar */}
          <div className="lg:w-72 space-y-2">
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm mb-6 text-center">
              <div className="w-20 h-20 rounded-full bg-blue-50 border-2 border-white shadow-md mx-auto mb-4 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayUsername}`} alt="Avatar" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">{formattedName}</h3>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Premium Member</p>
            </div>

            {[
              { id: 'orders', label: 'Order History', icon: '📦' },
              { id: 'address', label: 'Shipping Info', icon: '📍' },
              { id: 'payment', label: 'Payment Methods', icon: '💳' },
              { id: 'settings', label: 'Account Settings', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                    : 'bg-transparent text-slate-500 hover:bg-white hover:text-slate-900'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* RIGHT: Dynamic Content Area */}
          <div className="flex-1">
            {activeTab === 'orders' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex justify-between items-end mb-4">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter">My Orders</h2>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{orders.length} Total Orders</span>
                </div>

                {isLoading ? (
                  <div className="space-y-8 animate-pulse">
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-white rounded-[40px] h-64 border border-slate-100 shadow-sm"></div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-white rounded-[40px] p-20 text-center border border-slate-100">
                    <div className="text-4xl mb-4">📦</div>
                    <h3 className="text-xl font-bold text-slate-900">No orders found</h3>
                    <p className="text-slate-400 mt-2">Start shopping to see your history here!</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-500">
                      {/* Order Header */}
                      <div className="bg-slate-50 px-8 py-6 flex flex-wrap justify-between items-center gap-4 border-b border-slate-100">
                        <div className="flex gap-8">
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order ID</p>
                            <p className="font-bold text-slate-900">#{order.id.substring(0, 8)}...</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Placed On</p>
                            <p className="font-bold text-slate-900">{new Date(order.orderDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
                            <p className="font-bold text-blue-600">₹{order.totalAmount.toLocaleString()}</p>
                          </div>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          order.status === 'DELIVERED' 
                            ? 'bg-green-50 text-green-600 border-green-100' 
                            : 'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                          {order.status}
                        </span>
                      </div>

                      {/* Order Items */}
                      <div className="p-4 sm:p-8">
                        <div className="space-y-6">
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                              <div className="flex items-center gap-4 sm:gap-6">
                                <div className="w-16 h-20 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0">
                                  <img 
                                    src={item.mainImage ? `data:${item.mainImageType};base64,${item.mainImage}` : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200"} 
                                    className="w-full h-full object-cover" 
                                    alt={item.productName} 
                                  />
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">{item.productName}</h4>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.category || 'Tech'} Collection</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 sm:gap-8 w-full sm:w-auto justify-between sm:justify-end">
                                <div className="text-left sm:text-right">
                                  <p className="text-xs font-bold text-slate-900">₹{item.price.toLocaleString()}</p>
                                  <p className="text-[10px] font-bold text-slate-400 italic">Qty: {item.quantity}</p>
                                </div>
                                <button className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-widest">Buy Again</button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {trackingOrder === order.id && (
                          <div className="mt-6 p-6 bg-blue-50 border border-blue-100 rounded-2xl animate-in fade-in slide-in-from-top-4">
                            <h5 className="font-black text-slate-900 text-sm tracking-widest uppercase mb-4">Shipment Status Tracker</h5>
                            <div className="flex justify-between items-center relative">
                               <div className="absolute left-0 top-1/2 w-full h-1 bg-blue-200 -z-10 -translate-y-1/2"></div>
                               {[
                                 { step: 'Ordered', done: true },
                                 { step: 'Processing', done: true },
                                 { step: 'Shipped', done: order.status === 'DELIVERED' },
                                 { step: 'Delivered', done: order.status === 'DELIVERED' }
                               ].map((s, i) => (
                                 <div key={i} className="flex flex-col items-center gap-2 bg-blue-50 px-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${s.done ? 'bg-blue-600 text-white' : 'bg-white border-2 border-blue-200 text-slate-400'}`}>
                                      {s.done ? '✓' : i + 1}
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${s.done ? 'text-blue-900' : 'text-slate-400'}`}>{s.step}</span>
                                 </div>
                               ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Action Footer */}
                        <div className="mt-8 pt-8 border-t border-slate-50 flex justify-end gap-4">
                           <button onClick={() => toggleTracking(order.id)} className="px-6 py-3 bg-slate-100 text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors">
                             {trackingOrder === order.id ? 'Close Tracker' : 'Track Shipment'}
                           </button>
                           <button onClick={() => handleDownloadInvoice(order)} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-colors shadow-lg">Download Invoice</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'address' && (
              <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm animate-in fade-in zoom-in-95 duration-500">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl">📍</div>
                   <div>
                     <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Shipping Information</h3>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage your delivery addresses</p>
                   </div>
                </div>

                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                     <div className="h-12 bg-slate-100 rounded-xl"></div>
                     <div className="h-12 bg-slate-100 rounded-xl"></div>
                     <div className="h-12 bg-slate-100 rounded-xl"></div>
                  </div>
                ) : (
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                        <input type="text" value={userProfile?.fullName || ''} onChange={(e) => setUserProfile({...userProfile, fullName: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none transition-all" placeholder="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Street Address</label>
                        <input type="text" value={userProfile?.streetAddress || ''} onChange={(e) => setUserProfile({...userProfile, streetAddress: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none transition-all" placeholder="123 Main St" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">City</label>
                        <input type="text" value={userProfile?.city || ''} onChange={(e) => setUserProfile({...userProfile, city: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none transition-all" placeholder="New York" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">State / Province</label>
                        <input type="text" value={userProfile?.state || ''} onChange={(e) => setUserProfile({...userProfile, state: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none transition-all" placeholder="NY" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ZIP / Postal Code</label>
                        <input type="text" value={userProfile?.zipCode || ''} onChange={(e) => setUserProfile({...userProfile, zipCode: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none transition-all" placeholder="10001" />
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-slate-100 flex justify-end">
                      <button type="submit" disabled={isSaving} className="px-8 py-4 bg-blue-600 text-white rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors disabled:opacity-50">
                        {isSaving ? 'Saving...' : 'Save Address'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm animate-in fade-in zoom-in-95 duration-500">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-xl">💳</div>
                   <div>
                     <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Payment Methods</h3>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Secure payment handling</p>
                   </div>
                </div>

                <div className="bg-slate-50 p-10 rounded-3xl text-center border border-slate-100">
                  <div className="text-5xl mb-4">🔒</div>
                  <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2">Secure Gateway</h4>
                  <p className="text-sm font-bold text-slate-500 max-w-sm mx-auto">
                    For your security, we do not store any credit card information on our servers. All payments are processed securely in real-time through Stripe.
                  </p>
                  <button className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-black transition-colors shadow-lg">
                    View Stripe Policies
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm animate-in fade-in zoom-in-95 duration-500">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center text-xl">⚙️</div>
                   <div>
                     <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Account Settings</h3>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage your account details</p>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="p-6 bg-slate-50 rounded-3xl flex justify-between items-center border border-slate-100">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Username</p>
                        <p className="font-bold text-slate-900 text-lg">{userProfile?.username || displayUsername}</p>
                      </div>
                      <span className="px-4 py-2 bg-slate-200 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest">Read-only</span>
                   </div>
                   <div className="p-6 bg-slate-50 rounded-3xl flex justify-between items-center border border-slate-100">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                        <p className="font-bold text-slate-900 text-lg">{userProfile?.email || 'N/A'}</p>
                      </div>
                   </div>
                   <div className="p-6 bg-blue-50 rounded-3xl flex justify-between items-center border border-blue-100">
                      <div>
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Account Role</p>
                        <p className="font-black text-blue-600 text-xl">{userProfile?.role || 'USER'}</p>
                      </div>
                      <span className="px-4 py-2 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">Active</span>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
