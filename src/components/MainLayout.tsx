import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 py-24">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <img src="/logo.png" alt="SwiftCart Logo" className="h-8 w-auto grayscale opacity-80" />
            <h3 className="text-2xl font-black text-blue-600">SwiftCart.</h3>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed">
            Redefining the digital commerce experience through intentional design and precision technology.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-6">Customer Service</h4>
          <ul className="space-y-4 text-sm text-slate-500 font-medium">
            <li className="hover:text-blue-600 cursor-pointer">Sustainability</li>
            <li className="hover:text-blue-600 cursor-pointer">Shipping</li>
            <li className="hover:text-blue-600 cursor-pointer">Returns</li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-6">Company</h4>
          <ul className="space-y-4 text-sm text-slate-500 font-medium">
            <li className="hover:text-blue-600 cursor-pointer">Privacy Policy</li>
            <li className="hover:text-blue-600 cursor-pointer">Terms of Service</li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-6">Stay Inspired</h4>
          <div className="flex gap-2">
            <input type="text" placeholder="Your Email" className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl flex-1 text-sm outline-none focus:border-blue-600" />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest">Join</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FB]">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
