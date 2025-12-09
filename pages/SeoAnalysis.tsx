import React, { useState } from 'react';
import { Search, CheckCircle, AlertTriangle, XCircle, Globe, ShieldCheck } from 'lucide-react';

const SeoAnalysis: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<boolean>(false);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult(true);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-100 tracking-tight">GetKontento SEO Denetimi</h1>
        <p className="text-slate-400 text-lg">Web sitenizin teknik SEO durumunu saniyeler içinde analiz edin.</p>
      </div>

      <div className="bg-[#1A1D23] p-8 rounded-3xl border border-[#2A2F38] shadow-2xl shadow-[#FF5A2F]/5 relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-[#FF5A2F]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-[#4EC9B0]/10 rounded-full blur-3xl"></div>

        <form onSubmit={handleAnalyze} className="relative z-10 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#FF5A2F] transition-colors" size={20} />
            <input
              type="url"
              placeholder="https://sistemglobal.com.tr"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#0D0F12] border border-slate-700 text-slate-200 placeholder:text-slate-600 focus:border-[#FF5A2F] focus:ring-4 focus:ring-[#FF5A2F]/10 outline-none transition-all duration-300"
            />
          </div>
          <button
            type="submit"
            disabled={isAnalyzing}
            className="px-8 py-4 bg-[#FF5A2F] hover:bg-[#FF5A2F]/90 text-white font-semibold rounded-xl transition-all shadow-lg shadow-[#FF5A2F]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[160px]"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                <span className="animate-pulse">Analiz...</span>
              </>
            ) : (
              <>
                <Search size={20} />
                Analiz Et
              </>
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="animate-slide-up space-y-6">
          <div className="bg-[#1A1D23]/80 backdrop-blur-md p-8 rounded-2xl border border-[#2A2F38]">
            <div className="flex flex-col sm:flex-row items-center justify-between border-b border-[#2A2F38] pb-6 mb-6 gap-4">
              <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
                <ShieldCheck className="text-[#4EC9B0]" />
                Sonuç Raporu
              </h2>
              <div className="flex items-center gap-3 bg-[#0D0F12] px-4 py-2 rounded-xl border border-[#2A2F38]">
                <span className="text-sm text-slate-400">Genel Skor:</span>
                <span className="text-2xl font-bold text-[#4EC9B0]">85<span className="text-sm text-slate-600 font-normal">/100</span></span>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="flex items-start gap-4 p-5 bg-[#4EC9B0]/5 rounded-xl border border-[#4EC9B0]/10 hover:bg-[#4EC9B0]/10 transition-colors">
                <div className="p-2 bg-[#4EC9B0]/10 rounded-full">
                   <CheckCircle className="text-[#4EC9B0]" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200 text-lg">SSL Sertifikası</h4>
                  <p className="text-sm text-slate-400 mt-1">Site güvenli bağlantı (HTTPS) kullanıyor ve sertifika geçerli.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-amber-500/5 rounded-xl border border-amber-500/10 hover:bg-amber-500/10 transition-colors">
                 <div className="p-2 bg-amber-500/10 rounded-full">
                    <AlertTriangle className="text-amber-500" size={24} />
                 </div>
                <div>
                  <h4 className="font-semibold text-slate-200 text-lg">Sayfa Hızı (LCP)</h4>
                  <p className="text-sm text-slate-400 mt-1">İlk içerik boyaması 2.8s sürdü. Görsel optimizasyonu gerekli.</p>
                </div>
              </div>

               <div className="flex items-start gap-4 p-5 bg-rose-500/5 rounded-xl border border-rose-500/10 hover:bg-rose-500/10 transition-colors">
                 <div className="p-2 bg-rose-500/10 rounded-full">
                    <XCircle className="text-rose-500" size={24} />
                 </div>
                <div>
                  <h4 className="font-semibold text-slate-200 text-lg">H1 Etiketi Kullanımı</h4>
                  <p className="text-sm text-slate-400 mt-1">Ana sayfada birden fazla H1 etiketi tespit edildi. Tek bir H1 kullanılmalıdır.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeoAnalysis;