import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Calendar, 
  MoreVertical,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

// --- Types ---

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
  seoScore: number;
  hasMetaTitle: boolean;
  hasMetaDescription: boolean;
  needsUpdate: boolean;
}

// --- Dummy Data ---

const mockContents: ContentItem[] = [
  {
    id: '1',
    title: 'SEO Nedir? Kapsamlı Başlangıç Rehberi',
    slug: 'seo-nedir-baslangic-rehberi',
    status: 'published',
    createdAt: '2023-10-15',
    updatedAt: '2023-12-01',
    seoScore: 92,
    hasMetaTitle: true,
    hasMetaDescription: true,
    needsUpdate: false,
  },
  {
    id: '2',
    title: '2024 Dijital Pazarlama Trendleri',
    slug: '2024-dijital-pazarlama-trendleri',
    status: 'published',
    createdAt: '2023-11-20',
    updatedAt: '2023-11-22',
    seoScore: 85,
    hasMetaTitle: true,
    hasMetaDescription: true,
    needsUpdate: false,
  },
  {
    id: '3',
    title: 'Backlink Stratejileri ve Önemi',
    slug: 'backlink-stratejileri',
    status: 'draft',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05',
    seoScore: 45,
    hasMetaTitle: true,
    hasMetaDescription: false,
    needsUpdate: true,
  },
  {
    id: '4',
    title: 'E-Ticaret Siteleri İçin SEO İpuçları',
    slug: 'e-ticaret-seo-ipuclari',
    status: 'published',
    createdAt: '2023-08-10',
    updatedAt: '2023-08-10',
    seoScore: 65,
    hasMetaTitle: false,
    hasMetaDescription: true,
    needsUpdate: true,
  },
  {
    id: '5',
    title: 'Google Search Console Kullanımı',
    slug: 'google-search-console-kullanimi',
    status: 'published',
    createdAt: '2023-09-12',
    updatedAt: '2024-01-10',
    seoScore: 78,
    hasMetaTitle: true,
    hasMetaDescription: true,
    needsUpdate: false,
  },
  {
    id: '6',
    title: 'Yerel SEO Nasıl Yapılır?',
    slug: 'yerel-seo-rehberi',
    status: 'draft',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    seoScore: 30,
    hasMetaTitle: false,
    hasMetaDescription: false,
    needsUpdate: true,
  },
  {
    id: '7',
    title: 'Core Web Vitals Nedir?',
    slug: 'core-web-vitals-nedir',
    status: 'published',
    createdAt: '2023-12-25',
    updatedAt: '2024-01-02',
    seoScore: 88,
    hasMetaTitle: true,
    hasMetaDescription: true,
    needsUpdate: false,
  },
];

// --- Component ---

const ContentList: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [seoFilter, setSeoFilter] = useState<'all' | 'good' | 'medium' | 'weak'>('all');
  const [showNeedsUpdateOnly, setShowNeedsUpdateOnly] = useState(false);

  // Filter Logic
  const filteredContents = useMemo(() => {
    return mockContents.filter((item) => {
      // Search
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.slug.toLowerCase().includes(searchTerm.toLowerCase());

      // Status
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

      // SEO Score
      let matchesSeo = true;
      if (seoFilter === 'good') matchesSeo = item.seoScore >= 80;
      else if (seoFilter === 'medium') matchesSeo = item.seoScore >= 50 && item.seoScore < 80;
      else if (seoFilter === 'weak') matchesSeo = item.seoScore < 50;

      // Needs Update
      const matchesUpdate = showNeedsUpdateOnly ? item.needsUpdate : true;

      return matchesSearch && matchesStatus && matchesSeo && matchesUpdate;
    });
  }, [searchTerm, statusFilter, seoFilter, showNeedsUpdateOnly]);

  // Formatters
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getSeoScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#4EC9B0] bg-[#4EC9B0]/10 border-[#4EC9B0]/20';
    if (score >= 50) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">GetKontento İçerik Modülü</h1>
          <p className="text-slate-400 mt-1">Web sitenizdeki içeriklerin SEO performansını yönetin.</p>
        </div>
        <button className="bg-[#FF5A2F] hover:bg-[#FF5A2F]/90 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-[#FF5A2F]/20 transition-all active:scale-95 flex items-center gap-2">
          <Edit3 size={18} />
          Yeni İçerik
        </button>
      </div>

      {/* Toolbar / Filters */}
      <div className="bg-[#1A1D23] border border-[#2A2F38] rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          
          {/* Search */}
          <div className="relative group w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#FF5A2F] transition-colors" size={18} />
            <input
              type="text"
              placeholder="Başlık veya slug ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0D0F12] border border-[#2A2F38] rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:border-[#FF5A2F] focus:ring-4 focus:ring-[#FF5A2F]/10 outline-none transition-all"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center w-full lg:w-auto">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-40">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full appearance-none bg-[#0D0F12] border border-[#2A2F38] rounded-xl pl-9 pr-8 py-2.5 text-sm text-slate-300 focus:border-[#FF5A2F] outline-none cursor-pointer"
                >
                  <option value="all">Tüm Durumlar</option>
                  <option value="published">Yayında</option>
                  <option value="draft">Taslak</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l border-[#2A2F38] pl-2">
                   <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-slate-500"></div>
                </div>
              </div>

              <div className="relative w-full sm:w-40">
                 {/* Reusing styling for SEO Filter */}
                 <select 
                  value={seoFilter}
                  onChange={(e) => setSeoFilter(e.target.value as any)}
                  className="w-full appearance-none bg-[#0D0F12] border border-[#2A2F38] rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:border-[#FF5A2F] outline-none cursor-pointer"
                >
                  <option value="all">Tüm Skorlar</option>
                  <option value="good">İyi (80+)</option>
                  <option value="medium">Orta (50-79)</option>
                  <option value="weak">Zayıf (0-49)</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l border-[#2A2F38] pl-2">
                   <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-slate-500"></div>
                </div>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none border border-[#2A2F38] bg-[#0D0F12]/50 px-3 py-2.5 rounded-xl hover:bg-[#0D0F12] transition-colors w-full sm:w-auto justify-center sm:justify-start">
              <input 
                type="checkbox" 
                checked={showNeedsUpdateOnly}
                onChange={(e) => setShowNeedsUpdateOnly(e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-[#FF5A2F] focus:ring-offset-slate-900 focus:ring-2 focus:ring-[#FF5A2F]"
              />
              <span className="text-sm text-slate-300 whitespace-nowrap">Güncelleme Gerekli</span>
            </label>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-[#1A1D23] border border-[#2A2F38] rounded-2xl overflow-hidden shadow-sm">
        
        {/* Desktop View (Table) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2A2F38] bg-[#0D0F12]/30">
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Başlık / Slug</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Durum</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Son Güncelleme</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">SEO Skoru</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Meta Durumu</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2F38]/50">
              {filteredContents.length > 0 ? (
                filteredContents.map((item) => (
                  <tr 
                    key={item.id} 
                    onClick={() => navigate(`/app/content/${item.id}`)}
                    className="group hover:bg-[#2A2F38]/40 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-200 group-hover:text-[#FF5A2F] transition-colors">{item.title}</span>
                        <span className="text-xs text-slate-500 mt-1 font-mono">{item.slug}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        item.status === 'published' 
                          ? 'bg-[#4EC9B0]/10 text-[#4EC9B0] border-[#4EC9B0]/20' 
                          : 'bg-slate-700/30 text-slate-400 border-slate-600'
                      }`}>
                        {item.status === 'published' ? 'Yayında' : 'Taslak'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Calendar size={14} className="text-slate-600" />
                        {formatDate(item.updatedAt)}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className={`inline-flex items-center justify-center w-12 h-8 rounded-lg border font-bold text-sm ${getSeoScoreColor(item.seoScore)}`}>
                        {item.seoScore}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-3">
                         <div className="flex flex-col items-center group/tooltip relative">
                           {item.hasMetaTitle ? <CheckCircle2 size={18} className="text-[#4EC9B0]/80" /> : <XCircle size={18} className="text-rose-500/80" />}
                           <span className="text-[10px] text-slate-600 mt-1 uppercase">Title</span>
                         </div>
                         <div className="w-px h-6 bg-[#2A2F38]"></div>
                         <div className="flex flex-col items-center">
                           {item.hasMetaDescription ? <CheckCircle2 size={18} className="text-[#4EC9B0]/80" /> : <XCircle size={18} className="text-rose-500/80" />}
                           <span className="text-[10px] text-slate-600 mt-1 uppercase">Desc</span>
                         </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/app/content/${item.id}`);
                        }}
                        className="text-slate-400 hover:text-[#FF5A2F] p-2 hover:bg-[#FF5A2F]/10 rounded-lg transition-all"
                      >
                        <ExternalLink size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    Arama kriterlerine uygun içerik bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View (Cards) */}
        <div className="md:hidden">
          <div className="divide-y divide-[#2A2F38]/50">
             {filteredContents.length > 0 ? (
                filteredContents.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => navigate(`/app/content/${item.id}`)}
                    className="p-5 active:bg-[#2A2F38]/40 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-3">
                       <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                        item.status === 'published' 
                          ? 'bg-[#4EC9B0]/10 text-[#4EC9B0] border-[#4EC9B0]/20' 
                          : 'bg-slate-700/30 text-slate-400 border-slate-600'
                      }`}>
                        {item.status === 'published' ? 'Yayında' : 'Taslak'}
                      </span>
                      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-bold ${getSeoScoreColor(item.seoScore)}`}>
                        SEO: {item.seoScore}
                      </div>
                    </div>

                    <h3 className="text-base font-semibold text-slate-100 mb-1">{item.title}</h3>
                    <p className="text-xs text-slate-500 font-mono mb-4 truncate">{item.slug}</p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                         <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                           <Calendar size={14} />
                           {formatDate(item.updatedAt)}
                         </div>
                         
                         <div className="flex items-center gap-2">
                            {item.hasMetaTitle ? <div className="w-2 h-2 rounded-full bg-[#4EC9B0]"></div> : <div className="w-2 h-2 rounded-full bg-rose-500"></div>}
                            {item.hasMetaDescription ? <div className="w-2 h-2 rounded-full bg-[#4EC9B0]"></div> : <div className="w-2 h-2 rounded-full bg-rose-500"></div>}
                         </div>
                      </div>
                      
                      <button className="text-[#FF5A2F] flex items-center gap-1 text-xs font-medium">
                        Detay <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ))
             ) : (
                <div className="p-12 text-center text-slate-500 text-sm">
                  Kriterlere uygun içerik yok.
                </div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContentList;