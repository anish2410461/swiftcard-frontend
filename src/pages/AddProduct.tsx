import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Plus, X, ImagePlus, Loader2, ArrowLeft, Save, ShoppingBag } from 'lucide-react';
import API from '../api/axios';

const CATEGORIES = ['LAPTOPS', 'TABLETS', 'AUDIO', 'WEARABLES', 'ELECTRONICS', 'FASHION', 'HOME', 'OTHER'];

export default function AddProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  // Text fields
  const [name, setName]             = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice]           = useState('');
  const [stock, setStock]           = useState('0');
  const [category, setCategory]     = useState('');

  // Image fields
  const [mainImage, setMainImage]               = useState<File | null>(null);
  const [mainPreview, setMainPreview]           = useState<string>('');
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([]);
  const [existingImageUrl, setExistingImageUrl] = useState<string>('');

  const [loading, setLoading]       = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);

  const mainInputRef       = useRef<HTMLInputElement>(null);
  const additionalInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      API.get(`/products/${id}`)
        .then(res => {
          const p = res.data;
          setName(p.name || '');
          setDescription(p.description || '');
          setPrice(p.price ? String(p.price) : '');
          setStock(p.stock != null ? String(p.stock) : '0');
          setCategory(p.category || '');
          if (p.mainImage && p.mainImageType) {
            setExistingImageUrl(`data:${p.mainImageType};base64,${p.mainImage}`);
          }
          if (p.additionalImages && p.additionalImageTypes) {
            const files: File[] = [];
            const previews: string[] = [];
            
            p.additionalImages.forEach((base64: string, i: number) => {
              const type = p.additionalImageTypes[i];
              const binaryString = atob(base64);
              const bytes = new Uint8Array(binaryString.length);
              for (let j = 0; j < binaryString.length; j++) {
                bytes[j] = binaryString.charCodeAt(j);
              }
              const blob = new Blob([bytes], { type });
              const file = new File([blob], `gallery_${i}`, { type });
              files.push(file);
              previews.push(URL.createObjectURL(blob));
            });
            
            setAdditionalImages(files);
            setAdditionalPreviews(previews);
          }
        })
        .catch(err => {
          console.error(err);
          navigate('/admin/inventory');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditing, navigate]);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMainImage(file);
    setMainPreview(URL.createObjectURL(file));
  };

  const handleAdditionalImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    setAdditionalImages(prev => [...prev, ...files]);
    setAdditionalPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
    setAdditionalPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('stock', stock);
      formData.append('category', category);
      if (mainImage) formData.append('image', mainImage);
      additionalImages.forEach(file => formData.append('additionalImages', file));

      if (isEditing) {
        await API.put(`/products/${id}`, formData);
        console.log('Product updated successfully ✅');
        navigate('/admin/inventory');
      } else {
        await API.post('/products', formData);
        console.log('Product published successfully ✅');
        navigate('/admin/inventory');
      }
    } catch (err) {
      console.error(err);
      console.error('Error indexing product ❌');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-24 text-slate-400 gap-4">
      <Loader2 size={32} className="animate-spin text-blue-600" />
      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Decoding Manifest...</span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 font-sans">
      
      {/* Header with back button */}
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-6">
            <Link to="/admin/inventory" className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-100 hover:border-blue-600 text-slate-400 hover:text-blue-600 transition shadow-sm group">
               <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div>
               <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                 {isEditing ? 'Index Modification' : 'New Curated Release'}
               </h2>
               <p className="text-slate-500 font-medium text-sm italic">Product ID: {id || 'PENDING_INITIALIZATION'}</p>
            </div>
         </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT: Core Details (2/3) */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white p-10 rounded-[40px] border border-slate-50 shadow-xl shadow-slate-200/40 space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Core Specification</h3>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Product Manifest Title</label>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="e.g. Lumina Pro Display"
                  className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-50/50 focus:border-blue-600 transition-all font-bold text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Base Price (INR)</label>
                  <input
                    type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)}
                    placeholder="999"
                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-50/50 focus:border-blue-600 transition-all font-bold text-slate-900"
                    required min="0"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Inventory Stock</label>
                  <input
                    type="number" value={stock} onChange={e => setStock(e.target.value)}
                    placeholder="50"
                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-50/50 focus:border-blue-600 transition-all font-bold text-slate-900"
                    required min="0"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Platform Category</label>
                <div className="relative">
                  <select
                    value={category} onChange={e => setCategory(e.target.value)}
                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-50/50 focus:border-blue-600 transition-all font-bold text-slate-900 appearance-none"
                    required
                  >
                    <option value="">Define category...</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Deep Metadata (Description)</label>
                <textarea
                  rows={6} value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="Architectural breakdown of product features..."
                  className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[32px] outline-none focus:bg-white focus:ring-4 focus:ring-blue-50/50 focus:border-blue-600 transition-all resize-none font-medium text-slate-600 text-sm leading-relaxed"
                  required
                />
              </div>
           </div>
        </div>

        {/* RIGHT: Visual Assets (1/3) */}
        <div className="space-y-8">
           <div className="bg-slate-900 p-10 rounded-[40px] border border-slate-800 shadow-2xl text-white space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Visual Engine</h3>
              
              {/* Primary Image Slot */}
              <div className="space-y-4">
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Primary Capture</p>
                 <div 
                   onClick={() => mainInputRef.current?.click()}
                   className="aspect-square bg-slate-800 rounded-[32px] overflow-hidden border-2 border-dashed border-slate-700 hover:border-blue-500 transition-all cursor-pointer group flex items-center justify-center relative shadow-inner"
                 >
                    {mainPreview ? (
                      <img src={mainPreview} className="w-full h-full object-cover" alt="Preview" />
                    ) : existingImageUrl ? (
                      <img src={existingImageUrl} className="w-full h-full object-cover opacity-60" alt="Current" />
                    ) : (
                      <div className="text-center group-hover:scale-110 transition-transform">
                        <ImagePlus className="mx-auto mb-3 text-slate-600 group-hover:text-blue-500" size={32} />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Deploy File</p>
                      </div>
                    )}
                 </div>
                 <input ref={mainInputRef} type="file" accept="image/*" className="hidden" onChange={handleMainImageChange} />
              </div>

              {/* Additional Slots */}
              <div className="space-y-4">
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gallery Expansion</p>
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {additionalPreviews.map((src, i) => (
                      <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-700 bg-slate-800">
                        <img src={src} className="w-full h-full object-cover" alt="" />
                        <button
                          type="button"
                          onClick={() => removeAdditionalImage(i)}
                          className="absolute bottom-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg hover:bg-red-700 transition"
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => additionalInputRef.current?.click()}
                      className="aspect-square rounded-2xl border-2 border-dashed border-slate-700 bg-slate-800 flex items-center justify-center text-slate-600 hover:border-blue-600 hover:text-blue-500 transition-all shadow-inner"
                    >
                      <Plus size={24} />
                    </button>
                 </div>
                 <input ref={additionalInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleAdditionalImageChange} />
              </div>

              {/* Submit Action */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white font-black py-6 rounded-[32px] shadow-xl shadow-blue-900 border-2 border-blue-500 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-3 uppercase tracking-widest text-[10px]"
                >
                  {submitting ? (
                    <><Loader2 size={18} className="animate-spin" /> Indexing...</>
                  ) : (
                    <>
                      {isEditing ? 'Store Synchronization' : 'Finalize Deployment'}
                      <Save size={18} strokeWidth={3} />
                    </>
                  )}
                </button>
              </div>
           </div>

           <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                 <ShoppingBag size={18} />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-1">Live Preview</p>
                 <p className="text-[10px] font-medium text-slate-500 leading-relaxed uppercase tracking-tight">Changes made to the manifest will be synchronized globally across all SwiftCart nodes instantly.</p>
              </div>
           </div>
        </div>

      </form>
    </div>
  );
}
