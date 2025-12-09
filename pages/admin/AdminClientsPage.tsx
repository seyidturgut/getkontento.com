import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Search, 
  ExternalLink, 
  MoreHorizontal, 
  Calendar,
  Building2,
  X
} from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import { ClientPlan, ClientStatus } from '../../types';

const AdminClientsPage: React.FC = () => {
  const navigate = useNavigate();
  const { clients, addClient } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Client Form State
  const [newClient, setNewClient] = useState({
    name: '',
    domain: '',
    plan: 'Basic' as ClientPlan,
    status: 'active' as ClientStatus,
    baseUrl: '',
    apiKey: '',
    apiSecret: ''
  });

  const filteredClients = useMemo(() => {
    return clients.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.domain.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm]);

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Math.random().toString(36).substr(2, 9);
    addClient({
      id,
      name: newClient.name,
      domain: newClient.domain,
      plan: newClient.plan,
      status: newClient.status,
      createdAt: new Date().toISOString(),
      wpConfig: {
        baseUrl: newClient.baseUrl,
        apiKey: newClient.apiKey,
        apiSecret: newClient.apiSecret
      },
      users: []
    });
    setIsModalOpen(false);
    // Reset form
    setNewClient({
      name: '',
      domain: '',
      plan: 'Basic',
      status: 'active',
      baseUrl: '',
      apiKey: '',
      apiSecret: ''
    });
  };

  const getStatusBadge = (status: ClientStatus) => {
    if (status === 'active') return 'bg-[#4EC9B0]/10 text-[#4EC9B0] border-[#4EC9B0]/20';
    return 'bg-slate-700/30 text-slate-400 border-slate-600';
  };

  const getPlanBadge = (plan: ClientPlan) => {
    switch (plan) {
      case 'Enterprise': return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
      case 'Pro': return 'bg-[#FF5A2F]/10 text-[#FF5A2F] border-[#FF5A2F]/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Müşteri Yönetimi (GetKontento Admin)</h1>
          <p className="text-slate-400 mt-1">SaaS müşterilerini ve WordPress bağlantılarını yönetin.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#FF5A2F] hover:bg-[#FF5A2F]/90 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-[#FF5A2F]/20 transition-all active:scale-95 flex items-center gap-2"
        >
          <Plus size={18} />
          Yeni Müşteri Ekle
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-[#1A1D23] border border-[#2A2F38] rounded-2xl p-4 shadow-sm">
        <div className="relative group max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#FF5A2F] transition-colors" size={18} />
          <input
            type="text"
            placeholder="Firma adı veya domain ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0D0F12] border border-[#2A2F38] rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:border-[#FF5A2F] focus:ring-4 focus:ring-[#FF5A2F]/10 outline-none transition-all"
          />
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredClients.map((client) => (
          <div 
            key={client.id}
            className="bg-[#1A1D23] border border-[#2A2F38] rounded-2xl p-6 hover:border-slate-700 transition-all group"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0D0F12] to-[#2A2F38] border border-[#2A2F38] flex items-center justify-center shadow-lg">
                  <Building2 className="text-[#FF5A2F]" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-[#FF5A2F] transition-colors">
                    {client.name}
                  </h3>
                  <a href={`https://${client.domain}`} target="_blank" rel="noreferrer" className="text-sm text-slate-500 font-mono hover:text-slate-300 flex items-center gap-1 mt-1">
                    {client.domain}
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                 <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Plan</span>
                    <span className={`text-xs px-2 py-0.5 rounded border inline-block text-center ${getPlanBadge(client.plan)}`}>
                      {client.plan}
                    </span>
                 </div>
                 
                 <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Durum</span>
                    <span className={`text-xs px-2 py-0.5 rounded border inline-block text-center ${getStatusBadge(client.status)}`}>
                      {client.status === 'active' ? 'Aktif' : 'Pasif'}
                    </span>
                 </div>

                 <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Kullanıcılar</span>
                    <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                       <Users size={16} />
                       {client.users.length}
                    </div>
                 </div>

                 <div className="flex flex-col gap-1 min-w-[100px]">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Kayıt</span>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                       <Calendar size={14} />
                       {new Date(client.createdAt).toLocaleDateString('tr-TR')}
                    </div>
                 </div>

                 <button 
                  onClick={() => navigate(`/app/admin/clients/${client.id}`)}
                  className="px-4 py-2 bg-[#2A2F38] hover:bg-[#FF5A2F] text-slate-200 hover:text-white rounded-lg transition-all text-sm font-medium ml-auto md:ml-0"
                 >
                   Yönet
                 </button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredClients.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            Müşteri bulunamadı.
          </div>
        )}
      </div>

      {/* Create Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-[#1A1D23] border border-[#2A2F38] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-[#2A2F38]">
              <h2 className="text-xl font-bold text-white">Yeni Müşteri Ekle</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateClient} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Firma Adı</label>
                  <input 
                    required
                    value={newClient.name}
                    onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                    className="w-full bg-[#0D0F12] border border-[#2A2F38] rounded-lg px-4 py-2.5 text-slate-200 focus:border-[#FF5A2F] focus:ring-2 focus:ring-[#FF5A2F]/20 outline-none"
                    placeholder="Örn: Sistem Global"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Alan Adı (Domain)</label>
                  <input 
                    required
                    value={newClient.domain}
                    onChange={(e) => setNewClient({...newClient, domain: e.target.value})}
                    className="w-full bg-[#0D0F12] border border-[#2A2F38] rounded-lg px-4 py-2.5 text-slate-200 focus:border-[#FF5A2F] focus:ring-2 focus:ring-[#FF5A2F]/20 outline-none"
                    placeholder="sistemglobal.com.tr"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Plan</label>
                  <select 
                    value={newClient.plan}
                    onChange={(e) => setNewClient({...newClient, plan: e.target.value as ClientPlan})}
                    className="w-full bg-[#0D0F12] border border-[#2A2F38] rounded-lg px-4 py-2.5 text-slate-200 focus:border-[#FF5A2F] outline-none"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Pro">Pro</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Durum</label>
                  <select 
                    value={newClient.status}
                    onChange={(e) => setNewClient({...newClient, status: e.target.value as ClientStatus})}
                    className="w-full bg-[#0D0F12] border border-[#2A2F38] rounded-lg px-4 py-2.5 text-slate-200 focus:border-[#FF5A2F] outline-none"
                  >
                    <option value="active">Aktif</option>
                    <option value="passive">Pasif</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-[#2A2F38] pt-6">
                <h3 className="text-sm font-bold text-[#FF5A2F] uppercase tracking-wider mb-4">WordPress API Ayarları</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">API Base URL</label>
                    <input 
                      value={newClient.baseUrl}
                      onChange={(e) => setNewClient({...newClient, baseUrl: e.target.value})}
                      className="w-full bg-[#0D0F12] border border-[#2A2F38] rounded-lg px-4 py-2.5 text-slate-200 focus:border-[#FF5A2F] focus:ring-2 focus:ring-[#FF5A2F]/20 outline-none font-mono text-sm"
                      placeholder="https://site.com/wp-json"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Consumer Key</label>
                      <input 
                        value={newClient.apiKey}
                        onChange={(e) => setNewClient({...newClient, apiKey: e.target.value})}
                        className="w-full bg-[#0D0F12] border border-[#2A2F38] rounded-lg px-4 py-2.5 text-slate-200 focus:border-[#FF5A2F] focus:ring-2 focus:ring-[#FF5A2F]/20 outline-none font-mono text-sm"
                        placeholder="ck_..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Consumer Secret</label>
                      <input 
                        value={newClient.apiSecret}
                        onChange={(e) => setNewClient({...newClient, apiSecret: e.target.value})}
                        className="w-full bg-[#0D0F12] border border-[#2A2F38] rounded-lg px-4 py-2.5 text-slate-200 focus:border-[#FF5A2F] focus:ring-2 focus:ring-[#FF5A2F]/20 outline-none font-mono text-sm"
                        placeholder="cs_..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-[#2A2F38] transition-colors font-medium"
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#FF5A2F] text-white hover:bg-[#FF5A2F]/90 transition-colors font-medium shadow-lg shadow-[#FF5A2F]/20"
                >
                  Müşteriyi Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClientsPage;