export default function Hero() {
  return (
    <div className="mx-8 mt-6 rounded-2xl overflow-hidden relative shadow-sm group">
      <img
        src="https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&q=80"
        className="w-full h-[360px] object-cover group-hover:scale-105 transition duration-700"
        alt="Hero Banner"
      />
      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute top-1/2 -translate-y-1/2 left-12 text-white max-w-md">
        <p className="text-xs font-semibold tracking-widest uppercase mb-3">Seasonal Exclusive</p>
        <h2 className="text-4xl font-bold tracking-tight">
          The Spring Collection
        </h2>
        <p className="mt-3 text-sm font-medium opacity-90 leading-relaxed">
          Discover curated styles for modern living. Elevate your everyday essentials.
        </p>

        <button className="mt-6 bg-white text-black px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-100 transition shadow-sm">
          Shop Collection
        </button>
      </div>
    </div>
  );
}
