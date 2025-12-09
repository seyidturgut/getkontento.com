import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  BarChart2, 
  Search, 
  FileText, 
  Shield, 
  Globe, 
  ChevronDown, 
  Menu, 
  X,
  Star,
  LayoutDashboard,
  TrendingUp,
  Users,
  Plus,
  Minus
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Small timeout to allow mobile menu to close animation to start
      setMobileMenuOpen(false);
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0F12] text-slate-200 font-inter overflow-x-hidden selection:bg-[#FF5A2F] selection:text-white">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#FF5A2F]/5 rounded-full blur-[80px] md:blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#4EC9B0]/5 rounded-full blur-[80px] md:blur-[100px]" />
      </div>

      {/* 1. HEADER */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          scrolled || mobileMenuOpen 
            ? 'bg-[#0D0F12]/90 backdrop-blur-md border-[#2A2F38] py-3' 
            : 'bg-transparent border-transparent py-4 md:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <button 
            className="flex items-center gap-3 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A2F] rounded-lg p-1" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="GetKontento Anasayfa"
          >
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#FF5A2F] to-[#d94018] flex items-center justify-center shadow-lg shadow-[#FF5A2F]/20 group-hover:scale-105 transition-transform duration-300">
              <span className="font-bold text-white text-lg">G</span>
            </div>
            <span className="font-bold text-lg md:text-xl tracking-tight text-white group-hover:text-[#FF5A2F] transition-colors">
              GetKontento
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center bg-[#1A1D23]/50 backdrop-blur-sm px-2 py-1.5 rounded-full border border-[#2A2F38]/50">
            {['features', 'pricing', 'faq', 'footer'].map((section) => (
              <button 
                key={section}
                onClick={() => scrollToSection(section)} 
                className="text-sm font-medium text-slate-400 hover:text-white px-4 py-2 transition-colors rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A2F]"
              >
                {section === 'features' && 'Özellikler'}
                {section === 'pricing' && 'Fiyatlandırma'}
                {section === 'faq' && 'SSS'}
                {section === 'footer' && 'İletişim'}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 bg-[#FF5A2F] hover:bg-[#FF5A2F]/90 text-white rounded-full text-sm font-bold shadow-lg shadow-[#FF5A2F]/20 transition-all hover:shadow-[#FF5A2F]/40 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0F12]"
            >
              Giriş Yap
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-slate-400 p-2 rounded-lg hover:bg-[#2A2F38] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A2F]" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menüyü Aç/Kapat"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div 
          className={`md:hidden fixed inset-0 top-[65px] bg-[#0D0F12] z-40 transition-transform duration-300 ease-in-out flex flex-col ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col p-6 gap-2 h-full overflow-y-auto pb-20">
            <button onClick={() => scrollToSection('features')} className="text-left text-lg font-medium text-slate-300 py-4 border-b border-[#2A2F38]/50 hover:text-white hover:pl-2 transition-all">Özellikler</button>
            <button onClick={() => scrollToSection('pricing')} className="text-left text-lg font-medium text-slate-300 py-4 border-b border-[#2A2F38]/50 hover:text-white hover:pl-2 transition-all">Fiyatlandırma</button>
            <button onClick={() => scrollToSection('faq')} className="text-left text-lg font-medium text-slate-300 py-4 border-b border-[#2A2F38]/50 hover:text-white hover:pl-2 transition-all">SSS</button>
            <button onClick={() => scrollToSection('footer')} className="text-left text-lg font-medium text-slate-300 py-4 border-b border-[#2A2F38]/50 hover:text-white hover:pl-2 transition-all">İletişim</button>
            
            <div className="mt-8">
               <button 
                onClick={() => navigate('/login')} 
                className="w-full py-4 bg-[#FF5A2F] text-white rounded-xl font-bold text-lg text-center shadow-lg shadow-[#FF5A2F]/20 active:scale-95 transition-transform"
              >
                Giriş Yap
              </button>
              <p className="text-center text-slate-500 text-sm mt-4">Henüz üye değil misiniz? <span className="text-[#4EC9B0]">Demo Talep Edin</span></p>
            </div>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 px-6 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left: Text Content */}
          <div className="flex-1 space-y-6 md:space-y-8 text-center lg:text-left z-10 w-full">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF5A2F]/10 border border-[#FF5A2F]/20 text-[#FF5A2F] text-[10px] md:text-xs font-bold uppercase tracking-wide animate-fade-in shadow-[0_0_15px_rgba(255,90,47,0.15)] mx-auto lg:mx-0">
              <Star size={12} className="fill-[#FF5A2F]" />
              SEO Yönetiminde Devrim
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.15]">
              GetKontento ile SEO süreçlerinizi <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A2F] to-[#4EC9B0] animate-pulse">tek panelden yönetin.</span>
            </h1>
            
            <p className="text-base md:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              AI destekli meta title, açıklama ve içerik analizi ile WordPress sitenizin tüm SEO sürecini tek kokpitten kontrol edin. Karmaşadan kurtulun.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-2 w-full sm:w-auto">
              <button 
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-8 py-4 bg-[#FF5A2F] hover:bg-[#FF5A2F]/90 text-white rounded-2xl font-bold text-lg shadow-xl shadow-[#FF5A2F]/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0F12]"
              >
                Giriş Yap <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => scrollToSection('dashboard-preview')}
                className="w-full sm:w-auto px-8 py-4 bg-transparent border border-[#2A2F38] hover:bg-[#2A2F38]/50 text-white rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
              >
                Demoyu Gör
              </button>
            </div>
          </div>

          {/* Right: Animated UI Mockup */}
          <div className="flex-1 w-full max-w-md md:max-w-xl lg:max-w-full relative group perspective-1000 mt-8 lg:mt-0">
             {/* Glow Effect */}
             <div className="absolute inset-0 bg-gradient-to-tr from-[#FF5A2F]/20 to-[#4EC9B0]/20 rounded-3xl blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-700 animate-pulse"></div>
             
             {/* Card Container */}
             <div className="relative bg-[#0D0F12] rounded-3xl border border-[#2A2F38] shadow-2xl p-4 sm:p-6 transition-all duration-500 ease-out transform group-hover:scale-[1.02] lg:group-hover:-rotate-1 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                
                {/* Mock Header */}
                <div className="flex items-center justify-between mb-6 border-b border-[#2A2F38] pb-4">
                   <div className="flex items-center gap-4">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500/80"></div>
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500/80"></div>
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500/80"></div>
                      </div>
                      <div className="h-2 w-20 bg-[#2A2F38] rounded-full ml-2 hidden sm:block"></div>
                   </div>
                   <div className="flex gap-3">
                      <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-[#2A2F38]"></div>
                      <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-[#FF5A2F] opacity-20"></div>
                   </div>
                </div>

                {/* Mock Dashboard Layout */}
                <div className="flex gap-6">
                   {/* Sidebar Mock */}
                   <div className="hidden sm:block w-16 space-y-4 pt-2">
                      <div className="h-10 w-10 bg-[#FF5A2F] rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-[#FF5A2F]/20">
                         <Zap size={20} className="text-white fill-white" />
                      </div>
                      <div className="h-8 w-8 bg-[#2A2F38] rounded-lg mx-auto"></div>
                      <div className="h-8 w-8 bg-[#2A2F38] rounded-lg mx-auto opacity-60"></div>
                      <div className="h-8 w-8 bg-[#2A2F38] rounded-lg mx-auto opacity-60"></div>
                      <div className="h-8 w-8 bg-[#2A2F38] rounded-lg mx-auto opacity-60"></div>
                   </div>

                   {/* Main Area */}
                   <div className="flex-1 space-y-6">
                      {/* Stats Row */}
                      <div className="grid grid-cols-2 gap-4">
                         <div className="bg-[#1A1D23] p-3 sm:p-4 rounded-xl border border-[#2A2F38]">
                            <div className="flex items-center gap-2 mb-2">
                               <div className="p-1 sm:p-1.5 bg-[#4EC9B0]/10 rounded text-[#4EC9B0]">
                                  <TrendingUp size={14} className="sm:w-4 sm:h-4" />
                               </div>
                               <div className="h-1.5 sm:h-2 w-10 sm:w-12 bg-[#2A2F38] rounded"></div>
                            </div>
                            <div className="h-5 sm:h-6 w-12 sm:w-16 bg-slate-200 rounded mb-1"></div>
                            <div className="h-1.5 sm:h-2 w-20 sm:w-24 bg-[#2A2F38] rounded opacity-50"></div>
                         </div>
                         <div className="bg-[#1A1D23] p-3 sm:p-4 rounded-xl border border-[#2A2F38]">
                            <div className="flex items-center gap-2 mb-2">
                               <div className="p-1 sm:p-1.5 bg-[#FF5A2F]/10 rounded text-[#FF5A2F]">
                                  <FileText size={14} className="sm:w-4 sm:h-4" />
                               </div>
                               <div className="h-1.5 sm:h-2 w-10 sm:w-12 bg-[#2A2F38] rounded"></div>
                            </div>
                            <div className="h-5 sm:h-6 w-12 sm:w-16 bg-slate-200 rounded mb-1"></div>
                            <div className="h-1.5 sm:h-2 w-20 sm:w-24 bg-[#2A2F38] rounded opacity-50"></div>
                         </div>
                      </div>

                      {/* Chart Area */}
                      <div className="bg-[#1A1D23] p-4 sm:p-5 rounded-xl border border-[#2A2F38] h-28 sm:h-32 relative overflow-hidden flex items-end gap-2 sm:gap-3">
                         <div className="absolute top-4 left-5 h-2 w-32 bg-[#2A2F38] rounded hidden sm:block"></div>
                         {/* Bars */}
                         {[30, 50, 40, 70, 55, 85, 65, 90, 75, 60, 80].map((h, i) => (
                           <div key={i} style={{height: `${h}%`}} className="flex-1 bg-gradient-to-t from-[#FF5A2F] to-[#FF5A2F]/50 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"></div>
                         ))}
                      </div>

                      {/* List Items */}
                      <div className="space-y-3">
                         {[1, 2].map((i) => (
                           <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#1A1D23]/50 border border-[#2A2F38]">
                              <div className="flex items-center gap-3">
                                 <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#2A2F38]"></div>
                                 <div className="space-y-1">
                                    <div className="h-1.5 sm:h-2 w-20 sm:w-24 bg-[#2A2F38] rounded"></div>
                                    <div className="h-1.5 sm:h-2 w-12 sm:w-16 bg-[#2A2F38] rounded opacity-50"></div>
                                 </div>
                              </div>
                              <div className="h-5 sm:h-6 w-10 sm:w-12 bg-[#4EC9B0]/10 rounded border border-[#4EC9B0]/20"></div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard Preview (For "Demo" Button Target) */}
      <div id="dashboard-preview" className="pb-16 md:pb-20 pt-6 md:pt-10 px-4 md:px-6 scroll-mt-24">
        <div className="max-w-6xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#FF5A2F] to-[#4EC9B0] rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
          <div className="relative bg-[#0D0F12] rounded-2xl border border-[#2A2F38] shadow-2xl overflow-hidden aspect-[16/9] md:aspect-[16/8]">
            <div className="h-8 md:h-10 bg-[#1A1D23] border-b border-[#2A2F38] flex items-center px-4 gap-2">
              <div className="flex gap-1.5 md:gap-2">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-rose-500/50" />
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-amber-500/50" />
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-emerald-500/50" />
              </div>
              <div className="ml-2 md:ml-4 bg-[#0D0F12] px-3 py-1 rounded text-[10px] md:text-xs text-slate-500 flex items-center gap-2 w-48 md:w-64 border border-[#2A2F38]">
                <Shield size={10} /> app.getkontento.com/dashboard
              </div>
            </div>
            {/* Extended Mock Dashboard */}
            <div className="p-4 md:p-8 grid grid-cols-12 gap-4 md:gap-6 h-full bg-[#0D0F12]">
              <div className="hidden md:block col-span-2 space-y-4">
                <div className="h-8 w-8 bg-[#FF5A2F] rounded-lg mb-8 shadow-lg shadow-[#FF5A2F]/20"></div>
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="h-4 w-full bg-[#2A2F38] rounded animate-pulse" style={{opacity: 1 - (i * 0.15)}} />
                ))}
              </div>
              <div className="col-span-12 md:col-span-10 space-y-4 md:space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="h-6 md:h-8 w-32 md:w-48 bg-[#2A2F38] rounded"></div>
                  <div className="h-6 md:h-8 w-6 md:w-8 rounded-full bg-[#2A2F38]"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-20 md:h-24 bg-[#1A1D23] border border-[#2A2F38] rounded-xl p-3 md:p-4 flex flex-col justify-between hover:border-[#FF5A2F]/30 transition-colors">
                      <div className="h-6 md:h-8 w-6 md:w-8 bg-[#2A2F38] rounded-full opacity-50"></div>
                      <div className="h-3 md:h-4 w-12 md:w-16 bg-[#2A2F38] rounded opacity-50"></div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-48 md:h-64">
                  <div className="col-span-2 bg-[#1A1D23] border border-[#2A2F38] rounded-xl p-4 flex items-end justify-between gap-2">
                     {[40, 60, 45, 70, 50, 80, 75, 90].map((h, i) => (
                       <div key={i} style={{height: `${h}%`}} className="w-full bg-[#FF5A2F] opacity-80 rounded-t-sm" />
                     ))}
                  </div>
                  <div className="hidden md:block col-span-1 bg-[#1A1D23] border border-[#2A2F38] rounded-xl p-4 space-y-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-amber-500" />
                         <div className="h-3 w-full bg-[#2A2F38] rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-[#0D0F12] relative scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 space-y-4">
             <h2 className="text-3xl md:text-5xl font-bold text-white">
               Tüm SEO İhtiyaçlarınız Tek Çatı Altında
             </h2>
             <p className="text-slate-400 text-sm md:text-base">
               Karmaşık analiz araçları arasında kaybolmayın. GetKontento ile odaklanmanız gereken tek şey stratejiniz.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
             <FeatureCard 
               icon={<BarChart2 className="text-[#FF5A2F]" size={32} />}
               title="Gelişmiş Raporlama"
               desc="Site trafiğinizi, anahtar kelime sıralamalarınızı ve SEO sağlığınızı tek ekrandan anlık takip edin."
             />
             <FeatureCard 
               icon={<FileText className="text-[#4EC9B0]" size={32} />}
               title="İçerik Optimizasyonu"
               desc="Yazılarınızı yayınlamadan önce 5 temel SEO kuralına göre analiz edin ve AI önerileriyle iyileştirin."
             />
             <FeatureCard 
               icon={<Search className="text-violet-500" size={32} />}
               title="Teknik Denetim"
               desc="Kırık linkler, eksik meta etiketleri ve hız sorunlarını otomatik olarak tespit edin ve çözüm önerileri alın."
             />
             <FeatureCard 
               icon={<Globe className="text-amber-500" size={32} />}
               title="Rakip Analizi"
               desc="Rakiplerinizin stratejilerini inceleyin, hangi kelimelerde sıralandıklarını görün ve fırsatları yakalayın."
             />
             <FeatureCard 
               icon={<Zap className="text-blue-500" size={32} />}
               title="AI İçerik Asistanı"
               desc="Yapay zeka desteği ile saniyeler içinde SEO uyumlu başlıklar, açıklamalar ve içerik taslakları oluşturun."
             />
             <FeatureCard 
               icon={<Shield className="text-emerald-500" size={32} />}
               title="Sürekli İzleme"
               desc="Sitenizi 7/24 izleyen botlarımız, kritik bir hata oluştuğunda sizi anında uyarır."
             />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 bg-[#1A1D23]/30 border-y border-[#2A2F38] scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white">İhtiyacınıza göre ölçeklenen planlar</h2>
            <p className="text-slate-400 text-sm md:text-base">Ajanslar ve kurumsal ekipler için esnek GetKontento lisans modelleri.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-8 items-start lg:items-stretch">
             {/* Basic Plan */}
             <div className="bg-[#1A1D23] p-6 md:p-8 rounded-3xl border border-[#2A2F38] hover:border-[#FF5A2F]/30 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#FF5A2F]/5 transition-all duration-300 group flex flex-col h-full">
               <div className="mb-6">
                 <h3 className="text-xl font-bold text-slate-100 mb-2">Basic</h3>
                 <p className="text-slate-400 text-sm h-10">Freelance ve küçük ekipler için</p>
               </div>
               <div className="text-4xl font-bold text-white mb-8">₺299<span className="text-sm text-slate-500 font-normal">/ay</span></div>
               
               <ul className="space-y-4 mb-8 flex-1">
                 <li className="flex items-center gap-3 text-sm text-slate-300">
                   <CheckCircle2 size={18} className="text-[#4EC9B0] shrink-0" /> 1 Web Sitesi
                 </li>
                 <li className="flex items-center gap-3 text-sm text-slate-300">
                   <CheckCircle2 size={18} className="text-[#4EC9B0] shrink-0" /> Temel İçerik Analizi
                 </li>
                 <li className="flex items-center gap-3 text-sm text-slate-300">
                   <CheckCircle2 size={18} className="text-[#4EC9B0] shrink-0" /> AI Meta Önerisi (Sınırlı)
                 </li>
               </ul>

               <button 
                onClick={() => scrollToSection('footer')} 
                className="w-full py-3 bg-[#2A2F38] hover:bg-slate-700 text-white rounded-xl font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
               >
                 Teklif Al
               </button>
             </div>

             {/* Pro Plan (Highlighted) */}
             <div className="bg-[#1A1D23] p-6 md:p-8 rounded-3xl border-2 border-[#FF5A2F] relative shadow-2xl shadow-[#FF5A2F]/10 transform scale-100 lg:scale-110 z-10 flex flex-col h-full">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FF5A2F] text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">En Popüler</div>
               
               <div className="mb-6">
                 <h3 className="text-xl font-bold text-slate-100 mb-2 text-[#FF5A2F]">Pro</h3>
                 <p className="text-slate-400 text-sm h-10">Ajanslar ve büyüyen ekipler için</p>
               </div>
               <div className="text-4xl font-bold text-white mb-8">₺599<span className="text-sm text-slate-500 font-normal">/ay</span></div>
               
               <ul className="space-y-4 mb-8 flex-1">
                 <li className="flex items-center gap-3 text-sm text-slate-200">
                   <CheckCircle2 size={18} className="text-[#FF5A2F] shrink-0" /> 5 Web Sitesi
                 </li>
                 <li className="flex items-center gap-3 text-sm text-slate-200">
                   <CheckCircle2 size={18} className="text-[#FF5A2F] shrink-0" /> Gelişmiş İçerik Raporları
                 </li>
                 <li className="flex items-center gap-3 text-sm text-slate-200">
                   <CheckCircle2 size={18} className="text-[#FF5A2F] shrink-0" /> Tam AI Asistanı
                 </li>
                 <li className="flex items-center gap-3 text-sm text-slate-200">
                   <CheckCircle2 size={18} className="text-[#FF5A2F] shrink-0" /> Öncelikli Destek
                 </li>
               </ul>

               <button 
                onClick={() => scrollToSection('footer')} 
                className="w-full py-3 bg-[#FF5A2F] hover:bg-[#FF5A2F]/90 text-white rounded-xl font-bold transition-colors shadow-lg shadow-[#FF5A2F]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
               >
                 Teklif Al
               </button>
             </div>

             {/* Enterprise Plan */}
             <div className="bg-[#1A1D23] p-6 md:p-8 rounded-3xl border border-[#2A2F38] hover:border-[#FF5A2F]/30 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#FF5A2F]/5 transition-all duration-300 group flex flex-col h-full md:col-span-2 lg:col-span-1">
               <div className="mb-6">
                 <h3 className="text-xl font-bold text-slate-100 mb-2">Enterprise</h3>
                 <p className="text-slate-400 text-sm h-10">Kurumsal ve çok lokasyonlu yapılar için</p>
               </div>
               <div className="text-4xl font-bold text-white mb-8">Özel<span className="text-sm text-slate-500 font-normal">/yıllık</span></div>
               
               <ul className="space-y-4 mb-8 flex-1">
                 <li className="flex items-center gap-3 text-sm text-slate-300">
                   <CheckCircle2 size={18} className="text-[#4EC9B0] shrink-0" /> Sınırsız Web Sitesi
                 </li>
                 <li className="flex items-center gap-3 text-sm text-slate-300">
                   <CheckCircle2 size={18} className="text-[#4EC9B0] shrink-0" /> Özel Entegrasyonlar
                 </li>
                 <li className="flex items-center gap-3 text-sm text-slate-300">
                   <CheckCircle2 size={18} className="text-[#4EC9B0] shrink-0" /> Onboarding ve Eğitim
                 </li>
                 <li className="flex items-center gap-3 text-sm text-slate-300">
                   <CheckCircle2 size={18} className="text-[#4EC9B0] shrink-0" /> SLA Kapsamlı Destek
                 </li>
               </ul>

               <button 
                onClick={() => scrollToSection('footer')} 
                className="w-full py-3 bg-[#2A2F38] hover:bg-slate-700 text-white rounded-xl font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
               >
                 Teklif Al
               </button>
             </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-24 max-w-3xl mx-auto px-6 scroll-mt-24">
        <div className="text-center mb-10 md:mb-12 space-y-3">
          <h2 className="text-3xl font-bold text-white">Sık Sorulan Sorular</h2>
          <p className="text-slate-400 text-sm md:text-base">GetKontento hakkında merak edilen temel sorular.</p>
        </div>

        <div className="space-y-4">
          {[
            { 
              q: "GetKontento nedir ve kimler için uygundur?", 
              a: "GetKontento, WordPress tabanlı web siteleri için geliştirilmiş, AI destekli bir SEO ve içerik yönetim platformudur. Freelancerlar, dijital ajanslar ve kurumsal pazarlama ekipleri için içerik optimizasyonunu hızlandırmak amacıyla tasarlanmıştır." 
            },
            { 
              q: "WordPress dışındaki sistemlerle de çalışır mı?", 
              a: "Şu an için tam entegrasyonu WordPress ile sağlıyoruz. Ancak özel yazılım (custom) altyapıya sahip kurumsal müşterilerimiz için API tabanlı çözümler sunmaktayız." 
            },
            { 
              q: "SEO skorları nasıl hesaplanıyor?", 
              a: "Skorlarımız; Google'ın Core Web Vitals metrikleri, içerik okunabilirliği, anahtar kelime yoğunluğu, meta etiket yapısı ve teknik SEO kriterlerinin (H1, canonical, vb.) birleşiminden oluşan 50+ parametreye dayanır." 
            },
            { 
              q: "AI ile üretilen içerikler manuel olarak düzenlenebilir mi?", 
              a: "Kesinlikle. GetKontento'nun yapay zekası size en iyi başlangıç noktasını (taslak, başlık, meta) verir. Ancak son kontrol tamamen sizdedir; önerileri dilediğiniz gibi düzenleyip yayınlayabilirsiniz." 
            },
            { 
              q: "Verilerim ve içeriklerim güvende mi?", 
              a: "Evet. Tüm verileriniz endüstri standardı şifreleme ile korunur. İçerikleriniz asla 3. parti modelleri eğitmek için kullanılmaz ve sunucularımızda güvenle saklanır." 
            }
          ].map((item, idx) => (
            <div key={idx} className="border-b border-[#2A2F38] last:border-0">
              <button 
                onClick={() => toggleFaq(idx)}
                className={`w-full flex items-center justify-between py-5 md:py-6 text-left font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A2F] rounded-lg px-2 -mx-2 ${activeFaq === idx ? 'text-[#FF5A2F]' : 'text-slate-200 hover:text-white'}`}
              >
                <span className="text-base md:text-lg pr-4">{item.q}</span>
                {activeFaq === idx ? <Minus className="shrink-0" size={20} /> : <Plus className="shrink-0 text-slate-500" size={20} />}
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out px-2 ${activeFaq === idx ? 'max-h-48 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-slate-400 leading-relaxed text-sm md:text-base pr-4">
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="bg-[#050608] border-t border-[#2A2F38] py-12 md:py-16 px-6 scroll-mt-24">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FF5A2F] flex items-center justify-center shadow-lg">
                  <Zap className="text-white fill-white" size={16} />
                </div>
                <span className="font-bold text-lg text-white">GetKontento</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Yeni nesil SEO ve içerik yönetim platformu. Başarınızı şansa bırakmayın.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Ürün</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-[#FF5A2F] transition-colors focus:outline-none focus-visible:text-[#FF5A2F]">Özellikler</a></li>
                <li><a href="#" className="hover:text-[#FF5A2F] transition-colors focus:outline-none focus-visible:text-[#FF5A2F]">Fiyatlandırma</a></li>
                <li><a href="#" className="hover:text-[#FF5A2F] transition-colors focus:outline-none focus-visible:text-[#FF5A2F]">API</a></li>
                <li><a href="#" className="hover:text-[#FF5A2F] transition-colors focus:outline-none focus-visible:text-[#FF5A2F]">Yol Haritası</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Şirket</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-[#FF5A2F] transition-colors focus:outline-none focus-visible:text-[#FF5A2F]">Hakkımızda</a></li>
                <li><a href="#" className="hover:text-[#FF5A2F] transition-colors focus:outline-none focus-visible:text-[#FF5A2F]">Kariyer</a></li>
                <li><a href="#" className="hover:text-[#FF5A2F] transition-colors focus:outline-none focus-visible:text-[#FF5A2F]">Blog</a></li>
                <li><a href="#" className="hover:text-[#FF5A2F] transition-colors focus:outline-none focus-visible:text-[#FF5A2F]">İletişim</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Yasal</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-[#FF5A2F] transition-colors focus:outline-none focus-visible:text-[#FF5A2F]">Gizlilik Politikası</a></li>
                <li><a href="#" className="hover:text-[#FF5A2F] transition-colors focus:outline-none focus-visible:text-[#FF5A2F]">Kullanım Şartları</a></li>
                <li><a href="#" className="hover:text-[#FF5A2F] transition-colors focus:outline-none focus-visible:text-[#FF5A2F]">KVKK</a></li>
              </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[#2A2F38] text-center text-sm text-slate-600">
            &copy; {new Date().getFullYear()} GetKontento Teknoloji A.Ş. Tüm hakları saklıdır.
         </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="bg-[#1A1D23] p-6 md:p-8 rounded-3xl border border-[#2A2F38] hover:border-[#FF5A2F]/30 hover:shadow-2xl hover:shadow-[#FF5A2F]/5 transition-all group">
    <div className="w-12 h-12 md:w-14 md:h-14 bg-[#0D0F12] rounded-2xl flex items-center justify-center mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300 border border-[#2A2F38]">
      {icon}
    </div>
    <h3 className="text-lg md:text-xl font-bold text-slate-100 mb-2 md:mb-3 group-hover:text-[#FF5A2F] transition-colors">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-sm">
      {desc}
    </p>
  </div>
);

export default LandingPage;