import { create } from 'zustand';
import { AdminState, Client, ClientUser } from '../types';

// Dummy Data
const initialClients: Client[] = [
  {
    id: '1',
    name: 'Sistem Global Danışmanlık',
    domain: 'sistemglobal.com.tr',
    plan: 'Enterprise',
    status: 'active',
    createdAt: '2023-01-15',
    wpConfig: {
      baseUrl: 'https://sistemglobal.com.tr/wp-json',
      apiKey: 'ck_8472...',
      apiSecret: 'cs_9283...',
    },
    users: [
      { id: 'u1', name: 'Ahmet Yılmaz', email: 'ahmet@sistemglobal.com', role: 'owner', status: 'active' },
      { id: 'u2', name: 'Ayşe Demir', email: 'ayse@sistemglobal.com', role: 'editor', status: 'active' },
    ]
  },
  {
    id: '2',
    name: 'TechStart Yazılım A.Ş.',
    domain: 'techstart.io',
    plan: 'Pro',
    status: 'active',
    createdAt: '2023-06-20',
    wpConfig: {
      baseUrl: 'https://techstart.io/wp-json',
      apiKey: 'ck_1122...',
      apiSecret: 'cs_3344...',
    },
    users: [
      { id: 'u3', name: 'Mehmet Öz', email: 'mehmet@techstart.io', role: 'owner', status: 'active' },
    ]
  },
  {
    id: '3',
    name: 'Blog Atölyesi',
    domain: 'blogatolyesi.net',
    plan: 'Basic',
    status: 'passive',
    createdAt: '2023-11-05',
    wpConfig: {
      baseUrl: 'https://blogatolyesi.net/wp-json',
      apiKey: 'ck_5566...',
      apiSecret: 'cs_7788...',
    },
    users: []
  }
];

export const useAdminStore = create<AdminState>((set) => ({
  clients: initialClients,

  addClient: (client) => set((state) => ({ 
    clients: [client, ...state.clients] 
  })),

  updateClient: (id, data) => set((state) => ({
    clients: state.clients.map((c) => (c.id === id ? { ...c, ...data } : c))
  })),

  deleteClient: (id) => set((state) => ({
    clients: state.clients.filter((c) => c.id !== id)
  })),

  addClientUser: (clientId, user) => set((state) => ({
    clients: state.clients.map((c) => {
      if (c.id === clientId) {
        return { ...c, users: [...c.users, user] };
      }
      return c;
    })
  })),

  removeClientUser: (clientId, userId) => set((state) => ({
    clients: state.clients.map((c) => {
      if (c.id === clientId) {
        return { ...c, users: c.users.filter((u) => u.id !== userId) };
      }
      return c;
    })
  })),
}));