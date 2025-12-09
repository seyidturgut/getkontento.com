import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Globe, 
  Tag, 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Wand2 
} from 'lucide-react';

// --- Types ---

interface ContentDetail {
  id: string;
  title: string;
  slug: string;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
  metaTitle: string;
  metaDescription: string;
  categories: string[];
  contentSummary: string;
  rules: {
    intent: boolean;
    slug: boolean;
    structure: boolean;
    internalLinks: boolean;
    canonical: boolean;
  };
}

interface SeoSuggestions {
  title: string;
  description: string;
  focusKeyword: string;
  keywords: string;
  h1: string;
}

// --- Mock Data ---

const mockContentDB: Record<string, ContentDetail> = {
  '1': {
    id: '1',
    title: 'SEO Nedir? Kapsamlı Başlangıç Rehberi',
    slug: 'seo-nedir-baslangic-rehberi',
    status: 'published',
    createdAt: '2023-10-15',
    updatedAt: '2023-12-01',
    metaTitle: 'SEO Nedir? Yeni Başlayanlar İçin Rehber',
    metaDescription: 'SEO (Arama Motoru Optimizasyonu) hakkında bilmeniz gereken her şey. Google sıralamanızı yükseltmek için temel ipuçları.',
    categories: ['Dijital Pazarlama', 'SEO', 'Rehber'],
    contentSummary: 'Bu makale arama motoru optimizasyonunun temellerini, site içi ve site dışı SEO kavramlarını ve 2024 stratejilerini ele almaktadır...',
    rules: {
      intent: true,
      slug: true,
      structure: true,
      internalLinks: false, // failed
      canonical: true,
    }
  },
  '2': {
    id: '2',
    title: '2024 Dijital Pazarlama Trendleri',
    slug: '2024-dijital-pazarlama-trendleri',
    status: 'published',
    createdAt: '2023-11-20',
    updatedAt: '2023-11-22',
    metaTitle: '2024 Pazarlama Trendleri',
    metaDescription: '', // Missing
    categories: ['Trendler', 'Pazarlama'],
    contentSummary: 'Yapay zeka, sesli arama ve kişiselleştirilmiş deneyimler 2024 yılında pazarlamanın seyrini değiştiriyor.',
    rules: {
      intent: true,
      slug: true,
      structure: false,
      internalLinks: false,
      canonical: true,
    }
  }
};

// --- Sub-Components ---

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className="text-slate-500 hover:text-[#FF5A2F] p-2 transition-colors relative"
      title="Panoya kopyala"
    >
      {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
    </button>
  );
};

const SuggestionField: React.FC<{ 
  label: string; 
  value: string; 
  onChange: (val: string) => void;
  helperText?: string;
  isTextArea?: boolean;
}> = ({ label, value, onChange, helperText, isTextArea }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="text-sm font-semibold text-slate-300">{label}</label>
      {value && <span className="text-[10px] text-slate-500 font-mono bg-[#0D0F12] px-2 py-0.5 rounded border border-[#2A2F38]">{value.length} krk</span>}
    </div>
    <div className="relative group">
      {isTextArea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full bg-[#0D0F12]/50 border border-[#2A2F38] rounded-xl p-3 pr-10 text-sm text-slate-200 focus:border-[#FF5A2F] focus:ring-4 focus:ring-[#FF5A2F]/10 outline-none transition-all resize-none placeholder:text-slate-600"
          placeholder={`${label} önerisi burada görünecek...`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#0D0F12]/50 border border-[#2A2F38] rounded-xl p-3 pr-10 text-sm text-slate-200 focus:border-[#FF5A2F] focus:ring-4 focus:ring-[#FF5A2F]/10 outline-none transition-all placeholder:text-slate-600"
          placeholder={`${label} önerisi burada görünecek...`}
        />
      )}
      <div className="absolute right-2 top-2">
        <CopyButton text={value} />
      </div>
    </div>
    {helperText && <p className="text-xs text-slate-500">{helperText}</p>}
  </div>
);

const RuleItem: React.FC<{ 
  title: string; 
  desc: string; 
  passed: boolean 
}> = ({ title, desc, passed }) => (
  <div className={`p-4 rounded-xl border flex items-start gap-4 transition-all ${
    passed 
      ? 'bg-[#4EC9B0]/5 border-[#4EC9B0]/20' 
      : 'bg-rose-500/5 border-rose-500/20'
  }`}>
    <div className={`p-2 rounded-full shrink-0 ${
      passed ? 'bg-[#4EC9B0]/10 text-[#4EC9B0]' : 'bg-rose-500/10 text-rose-500'
    }`}>
      {passed ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
    </div>
    <div>
      <h4 className={`text-sm font-bold ${passed ? 'text-slate-200' : 'text-slate-200'}`}>
        {title}
      </h4>
      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
        {desc}
      </p>
    </div>
  </div>
);

// --- Main Page Component ---

const ContentDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<ContentDetail | null>(null);
  
  // Suggestion State
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<SeoSuggestions>({
    title: '',
    description: '',
    focusKeyword: '',
    keywords: '',
    h1: ''
  });

  // Load Data
  useEffect(() => {
    // Simulate fetch
    setTimeout(() => {
      if (id && mockContentDB[id]) {
        setContent(mockContentDB[id]);
      } else {
        // Fallback for demo if id not in mock
        setContent(mockContentDB['1']);
      }
      setLoading(false);
    }, 500);
  }, [id]);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI delay
    setTimeout(() => {
      setSuggestions({
        title: 'SEO Temelleri: 2024 İçin Kapsamlı Başlangıç Rehberi',
        description: 'SEO nedir ve nasıl yapılır? Site içi ve site dışı optimizasyon teknikleriyle Google sıralamanızı yükseltmenin yollarını keşfedin. Güncel stratejiler burada.',
        focusKeyword: 'SEO başlangıç rehberi',
        keywords: 'arama motoru optimizasyonu, site içi seo, backlink, google sıralama faktörleri',
        h1: 'SEO Nedir? Sıfırdan Zirveye Başlangıç Rehberi'
      });
      setIsGenerating(false);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <RefreshCw className="animate-spin text-[#FF5A2F]" size={32} />
      </div>
    );
  }

  if (!content) return <div>İçerik bulunamadı.</div>;

  const passedRuleCount = Object.values(content.rules).filter(Boolean).length;

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/app/content')}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#2A2F38] transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
           <div className="flex items-center gap-3">
             <h1 className="text-2xl font-bold text-white tracking-tight line-clamp-1">{content.title}</h1>
             <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                content.status === 'published' 
                  ? 'bg-[#4EC9B0]/10 text-[#4EC9B0] border-[#4EC9B0]/20' 
                  : 'bg-slate-700/30 text-slate-400 border-slate-600'
              }`}>
                {content.status === 'published' ? 'Yayında' : 'Taslak'}
              </span>
           </div>
           <p className="text-slate-500 text-sm font-mono mt-1">{content.slug}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* LEFT COLUMN: Current Data */}
        <div className="space-y-8">
          <div className="bg-[#1A1D23] border border-[#2A2F38] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2 mb-6 pb-4 border-b border-[#2A2F38]">
              <FileText size={20} className="text-[#FF5A2F]" />
              Mevcut WordPress Verisi
            </h3>

            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Başlık (H1)</span>
                <p className="text-slate-200 text-base">{content.title}</p>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Meta Başlık (Title)</span>
                <div className="flex items-start gap-3">
                  {content.metaTitle ? (
                    <p className="text-slate-300 text-sm bg-[#0D0F12] p-3 rounded-lg border border-[#2A2F38] w-full">
                      {content.metaTitle}
                    </p>
                  ) : (
                    <p className="text-rose-400 text-sm italic flex items-center gap-2">
                      <AlertTriangle size={14} /> Tanımlanmamış
                    </p>
                  )}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Meta Açıklama (Desc)</span>
                {content.metaDescription ? (
                   <p className="text-slate-300 text-sm bg-[#0D0F12] p-3 rounded-lg border border-[#2A2F38] leading-relaxed">
                    {content.metaDescription}
                  </p>
                ) : (
                  <p className="text-rose-400 text-sm italic flex items-center gap-2">
                    <AlertTriangle size={14} /> Tanımlanmamış
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Kategoriler</span>
                    <div className="flex flex-wrap gap-2">
                      {content.categories.map((cat, idx) => (
                        <span key={idx} className="text-xs text-slate-400 bg-[#2A2F38] px-2 py-1 rounded-md border border-[#2A2F38] flex items-center gap-1">
                          <Tag size={10} /> {cat}
                        </span>
                      ))}
                    </div>
                 </div>
                 <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Tarih</span>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Calendar size={14} />
                      {new Date(content.updatedAt).toLocaleDateString('tr-TR')}
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* 5 Rules Section */}
          <div className="bg-[#1A1D23] border border-[#2A2F38] rounded-2xl p-6 shadow-sm">
             <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#2A2F38]">
                <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                  <ShieldCheck size={20} className="text-[#4EC9B0]" />
                  5 Kural Kontrolü
                </h3>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  passedRuleCount === 5 
                    ? 'bg-[#4EC9B0]/10 text-[#4EC9B0] border-[#4EC9B0]/20' 
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {passedRuleCount}/5 Başarılı
                </span>
             </div>

             <div className="space-y-3">
                <RuleItem 
                  title="Arama Niyeti Uyumu" 
                  desc="İçerik, hedeflenen anahtar kelimelerdeki kullanıcı niyetini (bilgi alma, satın alma vb.) karşılıyor mu?"
                  passed={content.rules.intent}
                />
                <RuleItem 
                  title="Slug Yapısı" 
                  desc="URL kısa, anlaşılır ve anahtar kelime içeriyor mu?"
                  passed={content.rules.slug}
                />
                 <RuleItem 
                  title="İçerik Derinliği ve Yapısı" 
                  desc="Hiyerarşik başlık kullanımı (H1-H6) ve konu derinliği yeterli mi?"
                  passed={content.rules.structure}
                />
                 <RuleItem 
                  title="İç Link ve CTA" 
                  desc="Site içi diğer sayfalara yönlendirme ve aksiyon çağrısı var mı?"
                  passed={content.rules.internalLinks}
                />
                 <RuleItem 
                  title="Canonical ve Teknik" 
                  desc="Canonical etiketi doğru yapılandırılmış mı? Teknik engel var mı?"
                  passed={content.rules.canonical}
                />
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SEO Assistant */}
        <div className="bg-gradient-to-b from-[#1A1D23] to-[#0D0F12] border border-[#FF5A2F]/20 rounded-2xl p-6 lg:p-8 shadow-2xl shadow-[#FF5A2F]/5 sticky top-24">
          <div className="mb-6 space-y-2">
            <div className="flex items-center gap-2 text-[#FF5A2F] mb-1">
              <Sparkles size={20} className="animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest">GetKontento AI</span>
            </div>
            <h3 className="text-xl font-bold text-white">SEO Asistanı</h3>
            <p className="text-slate-400 text-sm">
              GetKontento AI ile optimize edilmiş meta verileri ve anahtar kelimeleri anında oluşturun.
            </p>
          </div>

          <div className="space-y-6">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 bg-[#FF5A2F] hover:bg-[#FF5A2F]/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-[#FF5A2F]/25 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group mb-8"
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Öneriler Oluşturuluyor...
                </>
              ) : (
                <>
                  <Wand2 size={18} className="group-hover:rotate-12 transition-transform" />
                  SEO Önerisi Üret
                </>
              )}
            </button>

            <div className={`space-y-5 transition-opacity duration-500 ${suggestions.title ? 'opacity-100' : 'opacity-40 pointer-events-none grayscale'}`}>
              <SuggestionField
                label="Önerilen H1 Başlığı"
                value={suggestions.h1}
                onChange={(val) => setSuggestions({...suggestions, h1: val})}
                helperText="Ana başlık ilgi çekici ve anahtar kelime içermeli."
              />

              <SuggestionField
                label="Önerilen SEO Title"
                value={suggestions.title}
                onChange={(val) => setSuggestions({...suggestions, title: val})}
                helperText="Google arama sonuçlarında görünen başlık (Max 60 krk)."
              />

              <SuggestionField
                label="Önerilen Meta Açıklama"
                value={suggestions.description}
                onChange={(val) => setSuggestions({...suggestions, description: val})}
                helperText="Kullanıcıyı tıklamaya teşvik eden özet (140-160 krk)."
                isTextArea
              />

              <div className="grid grid-cols-1 gap-5">
                <SuggestionField
                  label="Odak Anahtar Kelime"
                  value={suggestions.focusKeyword}
                  onChange={(val) => setSuggestions({...suggestions, focusKeyword: val})}
                />
                <SuggestionField
                  label="Yan Anahtar Kelimeler"
                  value={suggestions.keywords}
                  onChange={(val) => setSuggestions({...suggestions, keywords: val})}
                  helperText="Virgülle ayırarak giriniz."
                />
              </div>
            </div>
            
            {!suggestions.title && !isGenerating && (
              <div className="text-center p-4 rounded-xl bg-[#FF5A2F]/5 border border-[#FF5A2F]/10 text-[#FF5A2F] text-sm">
                Öneri almak için yukarıdaki butonu kullanın.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetailPage;