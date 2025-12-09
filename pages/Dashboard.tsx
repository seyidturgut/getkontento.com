import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Activity, 
  FileCheck, 
  FileWarning, 
  TrendingUp, 
  AlertTriangle, 
  ArrowRight, 
  MoreHorizontal 
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

// --- Types & Dummy Data ---

interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon: React.ReactNode;
  colorClass: string; 
}

interface AlertItemProps {
  message: string;
  count?: number;
  severity: 'high' | 'medium' | 'low';
}

const chartData = [
  { name: 'Pzt', score: 65, lead: 12 },
  { name: 'Sal', score: 68, lead: 18 },
  { name: 'Çar', score: 75, lead: 24 },
  { name: 'Per', score: 72, lead: 20 },
  { name: 'Cum', score: 82, lead: 35 },
  { name: 'Cmt', score: 85, lead: 28 },
  { name: 'Paz', score: 85, lead: 32 },
];

const alertsData: AlertItemProps[] = [
  { message: 'Yazıda meta açıklaması eksik', count: 10, severity: 'high' },
  { message: 'Sayfa 404 hatası veriyor', count: 5, severity: 'high' },
  { message: 'Görsel alt etiketi eksik', count: 24, severity: 'medium' },
  { message: 'Düşük kelime sayılı içerik', count: 8, severity: 'medium' },
  { message: 'SSL sertifikası süresi yaklaşıyor', severity: 'low' },
];

// --- Sub-Components ---

const StatCard: React.FC<StatCardProps> = ({ title, value, subValue, icon, colorClass }) => (
  <div className="bg-[#1A1D23] border border-[#2A2F38] p-6 rounded-2xl hover:border-[#FF5A2F]/30 hover:shadow-lg hover:shadow-black/20 transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${colorClass} shadow-lg ring-1 ring-inset ring-white/5`}>
        {icon}
      </div>
      <button className="text-slate-500 hover:text-slate-300 transition-colors">
        <MoreHorizontal size={18} />
      </button>
    </div>
    <div>
      <h3 className="text-3xl font-bold text-slate-100 tracking-tight group-hover:translate-x-1 transition-transform duration-300">
        {value}
      </h3>
      <p className="text-sm font-medium text-slate-400 mt-1">{title}</p>
      {subValue && (
        <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1">
          {subValue}
        </p>
      )}
    </div>
  </div>
);

const TrendChart: React.FC = () => (
  <div className="bg-[#1A1D23] border border-[#2A2F38] rounded-2xl p-6 sm:p-8 h-full flex flex-col shadow-sm">
    <div className="flex items-center justify-between mb-8">
      <div>
        <h3 className="text-lg font-semibold text-slate-200">GetKontento Performans Trendi</h3>
        <p className="text-sm text-slate-500">Son 7 günlük SEO skor değişimi</p>
      </div>
      <div className="flex items-center gap-2">
         <span className="flex items-center gap-1 text-xs font-medium text-[#4EC9B0] bg-[#4EC9B0]/10 px-2 py-1 rounded">
           <TrendingUp size={12} /> +12.5%
         </span>
      </div>
    </div>
    <div className="flex-1 min-h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF5A2F" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#FF5A2F" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2A2F38" />
          <XAxis 
            dataKey="name" 
            stroke="#475569" 
            tick={{fill: '#94a3b8', fontSize: 12}}
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis 
            stroke="#475569" 
            tick={{fill: '#94a3b8', fontSize: 12}}
            axisLine={false}
            tickLine={false}
            dx={-10}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0D0F12', borderColor: '#2A2F38', color: '#f1f5f9', borderRadius: '8px' }}
            itemStyle={{ color: '#FF5A2F' }}
          />
          <Area 
            type="monotone" 
            dataKey="score" 
            stroke="#FF5A2F" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorScore)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const AlertList: React.FC = () => (
  <div className="bg-[#1A1D23] border border-[#2A2F38] rounded-2xl p-6 sm:p-8 h-full shadow-sm">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
        <AlertTriangle className="text-rose-500" size={20} />
        Kritik Uyarılar
      </h3>
      <span className="bg-rose-500/10 text-rose-400 text-xs font-bold px-2 py-1 rounded-full border border-rose-500/20">
        {alertsData.length} Sorun
      </span>
    </div>

    <div className="space-y-3">
      {alertsData.map((alert, idx) => (
        <div 
          key={idx} 
          className="group flex items-center justify-between p-4 rounded-xl border border-[#2A2F38] bg-[#0D0F12]/50 hover:bg-[#2A2F38] hover:border-slate-700 transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              alert.severity === 'high' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 
              alert.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
            }`} />
            <p className="text-sm text-slate-300 font-medium group-hover:text-slate-100 transition-colors">
              {alert.count && <span className="font-bold text-slate-100 mr-1.5">{alert.count}</span>}
              {alert.message}
            </p>
          </div>
          <ArrowRight size={16} className="text-slate-600 group-hover:text-[#FF5A2F] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
        </div>
      ))}
    </div>
    
    <button className="w-full mt-6 py-3 text-sm text-slate-400 hover:text-white font-medium bg-[#2A2F38]/50 hover:bg-[#2A2F38] rounded-xl transition-colors border border-transparent hover:border-[#4EC9B0]/20">
      Tüm Uyarıları İncele
    </button>
  </div>
);

// --- Main Dashboard Component ---

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  
  // Extract first name for greeting
  const firstName = user?.name ? user.name.split(' ')[0] : 'Misafir';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          GetKontento paneline hoş geldiniz, {firstName} 👋
        </h1>
        <p className="text-slate-400 text-base">
          GetKontento ile SEO süreçlerinizi ve içeriklerinizi tek merkezden yönetin.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="SEO Genel Skoru"
          value="%85"
          subValue="Geçen aya göre +%5"
          icon={<Activity size={24} />}
          colorClass="text-[#4EC9B0] bg-[#4EC9B0]/10"
        />
        <StatCard 
          title="Optimize İçerik"
          value={42}
          subValue="Toplam 54 içerik arasından"
          icon={<FileCheck size={24} />}
          colorClass="text-[#FF5A2F] bg-[#FF5A2F]/10"
        />
        <StatCard 
          title="İyileştirme Gerekli"
          value={12}
          subValue="Acil müdahale bekleyen"
          icon={<FileWarning size={24} />}
          colorClass="text-amber-400 bg-amber-500/10"
        />
        <StatCard 
          title="Tahmini Lead"
          value={156}
          subValue="Bu ay SEO kaynaklı"
          icon={<TrendingUp size={24} />}
          colorClass="text-violet-400 bg-violet-500/10"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TrendChart />
        <AlertList />
      </div>
    </div>
  );
};

export default Dashboard;