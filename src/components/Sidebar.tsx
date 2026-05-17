export default function Sidebar() {
  return (
    <aside className="w-full p-6 bg-white rounded-2xl border border-gray-100 sticky top-6 h-fit max-md:mb-8">
      <h3 className="font-bold text-gray-900 mb-5 tracking-tight uppercase text-sm">Categories</h3>

      <div className="flex flex-col gap-4 text-sm text-gray-600 font-medium">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black transition" /> 
          <span className="group-hover:text-black transition-colors">Electronics</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black transition" /> 
          <span className="group-hover:text-black transition-colors">Fashion</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black transition" /> 
          <span className="group-hover:text-black transition-colors">Home & Living</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black transition" /> 
          <span className="group-hover:text-black transition-colors">Beauty</span>
        </label>
      </div>

      <div className="w-full h-[1px] bg-gray-100 my-8"></div>

      <h3 className="font-bold text-gray-900 mb-5 tracking-tight uppercase text-sm">Price Range</h3>
      <input type="range" className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" />
      <div className="flex justify-between text-xs text-gray-500 mt-4 font-semibold">
        <span>₹0</span>
        <span>₹10,000+</span>
      </div>
    </aside>
  );
}
