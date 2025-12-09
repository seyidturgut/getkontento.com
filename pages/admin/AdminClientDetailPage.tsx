import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building2, 
  Settings, 
  Users, 
  Save, 
  Trash2, 
  Shield, 
  Plus, 
  X, 
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import { ClientPlan, ClientStatus, ClientUser } from '../../types';

const AdminClientDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clients, updateClient, addClientUser, removeClientUser } = useAdminStore();
  
  const client = clients.find(c => c.id === id);

  // Tabs state
  const [activeTab, setActiveTab] = useState<'settings' | 'users'>('settings');

  // Forms state
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    plan: 'Basic' as ClientPlan,
    status: 'active' as ClientStatus,
    baseUrl: '',
    apiKey: '',
    apiSecret: ''
  });

  const [userModalOpen, setUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'viewer' as ClientUser['role']
  });

  // Sync state with client data
  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        domain: client.domain,
        plan: client.plan,
        status: client.status,
        baseUrl: client.wpConfig.baseUrl,
        apiKey: client.wpConfig.apiKey,
        apiSecret: client.wpConfig.apiSecret
      });
    }
  }, [client]);

  if (!client) {
    return <div className="text-center p-10 text-slate-400">Müşteri bulunamadı.</div>;
  }

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      updateClient(id, {
        name: formData.name,
        domain: formData.domain,
        plan: formData.plan,
        status: formData.status,
        wpConfig: {
          baseUrl: formData.baseUrl,
          apiKey: formData.apiKey,
          apiSecret: formData.apiSecret
        }
      });
      alert('Ayarlar kaydedildi.');
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      const newUserId = Math.random().toString(36).substr(2, 9);
      addClientUser(id, {
        id: newUserId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: 'active'
      });
      setUserModalOpen(false);
      setNewUser({ name: '', email: '', role: 'viewer' });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/app/admin/clients')}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#2A2F38] transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
           <h1 className="text-2xl font-bold text-white tracking-tight">{client.name}</h1>
           <p className="text-slate-500 text-sm font-mono mt-1">{client.domain}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase ${client.status === 'active' ? 'bg-[#4EC9B0]/10 border-[#4EC9B0]/20 text-[#4EC9B0]' : 'bg-slate-700/30 border-slate-600 text-slate-400'}`}>
            {client.status === 'active' ? 'Aktif' : 'Pasif'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#2A2F38]">
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'settings' ? 'border-[#FF5A2F] text-[#FF5A2F]' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          <Settings size={18} />
          Müşteri Ayarları
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'users' ? 'border-[#FF5A2F] text-[#FF5A2F]' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          <Users size={18} />
          Kullanıcılar ({client.users.length})
        </button>
      </div>

      {/* Content */}
      <div className="bg-[#1A1D23] border border-[#2A2F38] rounded-2xl p-6 lg:p-8 shadow-sm">
        
        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                  <Building2 size={20} className="text-[#FF5A2F]" />
                  Genel Bilgiler
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Firma Adı</label>
                    <input 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-[#0D0F12] border border-[#2A2F38] rounded-lg px-4 py-2.5 text-slate-200 focus:border-[#FF5A2F] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Alan Adı</label>
                    <input 
                      value={formData.domain}
                      onChange={(e) => setFormData({...formData, domain: e.target.value})}
                      className="w-full bg-[#0D0F12] border border-[#2A2F38] rounded-lg px-4 py-2.5 text-slate-200 focus:border-[#FF5A2F] outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Paket</label>
                      <select 
                        value={formData.plan}
                        onChange={(e) => setFormData({...formData, plan: e.target.value as ClientPlan})}
                        className="w-full bg-[#0D0F12] border border-[#2A2F38] rounded-lg px-4 py-2.5 text-slate-200 focus:border-[#FF5A2F] outline-none"
                      >
                        <option value="Basic">Basic</option>
                        <option value="Pro">Pro</option>
                        <option value="Enterprise">Enterprise</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Durum</label>
                      <select 
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value as ClientStatus})}
                        className="w-full bg-[#0D0F12] border border-[#2A2F38] rounded-lg px-4 py-2.5 text-slate-200 focus:border-[#FF5A2F] outline-none"
                      >
                        <option value="active">Aktif</option>
                        <option value="passive">Pasif</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                  <Lock size={20} className="text-amber-400" />
                  WordPress API Bağlantısı
                </h3>
                <div className="space-y-4 p-5 bg-[#0D0F12]/50 rounded-xl border border-[#2A2F38]">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">API Base URL</label>
                    <input 
                      value={formData.baseUrl}
                      onChange={(e) => setFormData({...formData, baseUrl: e.target.value})}
                      className="w-full bg-[#0D0F12] border border-[#2A2F38] rounded-lg px-4 py-2.5 text-slate-200 focus:border-[#FF5A2F] outline-none font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Consumer Key</label>
                    <input 
                      value={formData.apiKey}
                      onChange={(e) => setFormData({...formData, apiKey: e.target.value})}
                      type="password"
                      className="w-full bg-[#0D0F12] border border-[#2A2F38] rounded-lg px-4 py-2.5 text-slate-200 focus:border-[#FF5A2F] outline-none font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Consumer Secret</label>
                    <input 
                      value={formData.apiSecret}
                      onChange={(e) => setFormData({...formData, apiSecret: e.target.value})}
                      type="password"
                      className="w-full bg-[#0D0F12] border border-[#2A2F38] rounded-lg px-4 py-2.5 text-slate-200 focus:border-[#FF5A2F] outline-none font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-6 border-t border-[#2A2F38]">
               <button 
                type="button" 
                onClick={() => setFormData({ ...formData })} 
                className="text-slate-400 hover:text-white text-sm font-medium"
               >
                 Değişiklikleri Geri Al
               </button>
               <button 
                type="submit"
                className="bg-[#FF5A2F] hover:bg-[#FF5A2F]/90 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-[#FF5A2F]/20 transition-all active:scale-95 flex items-center gap-2"
               >
                 <Save size={18} />
                 Ayarları Kaydet
               </button>
            </div>
          </form>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-200">Kayıtlı Kullanıcılar</h3>
                <button 
                  onClick={() => setUserModalOpen(true)}
                  className="bg-[#FF5A2F]/10 hover:bg-[#FF5A2F] hover:text-white text-[#FF5A2F] px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                >
                  <Plus size={16} />
                  Yeni Kullanıcı
                </button>
             </div>

             <div className="overflow-hidden border border-[#2A2F38] rounded-xl">
               <table className="w-full text-left border-collapse">
                 <thead className="bg-[#0D0F12] text-slate-500 text-xs uppercase font-semibold">
                   <tr>
                     <th className="p-4">Kullanıcı</th>
                     <th className="p-4">E-posta</th>
                     <th className="p-4">Rol</th>
                     <th className="p-4 text-center">Durum</th>
                     <th className="p-4 text-right">İşlem</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-[#2A2F38]">
                   {client.users.length > 0 ? (
                      client.users.map(user => (
                        <tr key={user.id} className="hover:bg-[#2A2F38]/30">
                          <td className="p-4 font-medium text-slate-200">{user.name}</td>
                          <td className="p-4 text-slate-400 text-sm">{user.email}</td>
                          <td className="p-4">
                            <span className={`text-xs px-2 py-0.5 rounded border ${
                              user.role === 'owner' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                              user.role === 'editor' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                              'bg-slate-700/30 border-slate-600 text-slate-400'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                             <CheckCircle2 size={18} className="text-[#4EC9B0] inline-block" />
                          </td>
                          <td className="p-4 text-right">
                             <button 
                              onClick={() => removeClientUser(client.id, user.id)}
                              className="text-slate-500 hover:text-rose-500 transition-colors"
                             >
                               <Trash2 size={18} />
                             </button>
                          </td>
                        </tr>
                      ))
                   ) : (
                     <tr>
                       <td colSpan={5} className="p-8 text-center text-slate-500 italic">
                         Henüz kullanıcı eklenmemiş.
                       </td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </div>
        )}
      </div>

       {/* Add User Modal */}
       {userModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setUserModalOpen(false)}></div>
          <div className="relative bg-[#1A1D23] border border-[#2A2F38] rounded-2xl w-full max-w-md shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-[#2A2F38]">
              <h2 className="text-xl font-bold text-white">Kullanıcı Ekle</h2>
              <button onClick={() => setUserModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Ad Soyad</label>
                  <input 
                    required
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    className="w-full bg-[#0D0F12] border border-[#2A2F38] rounded-lg px-4 py-2.5 text-slate-200 focus:border-[#FF5A2F] outline-none"
                    placeholder="Ad Soyad"
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">E-posta</label>
                  <input 
                    required
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="w-full bg-[#0D0F12] border border-[#2A2F38] rounded-lg px-4 py-2.5 text-slate-200 focus:border-[#FF5A2F] outline-none"
                    placeholder="ornek@sirket.com"
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Rol</label>
                  <select 
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value as ClientUser['role']})}
                    className="w-full bg-[#0D0F12] border border-[#2A2F38] rounded-lg px-4 py-2.5 text-slate-200 focus:border-[#FF5A2F] outline-none"
                  >
                    <option value="viewer">İzleyici (Viewer)</option>
                    <option value="editor">Editör</option>
                    <option value="owner">Yönetici (Owner)</option>
                  </select>
               </div>

               <div className="pt-4 flex justify-end gap-3">
                 <button 
                  type="button"
                  onClick={() => setUserModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-[#2A2F38]"
                 >
                   İptal
                 </button>
                 <button 
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#FF5A2F] text-white hover:bg-[#FF5A2F]/90 shadow-lg shadow-[#FF5A2F]/20"
                 >
                   Ekle
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClientDetailPage;