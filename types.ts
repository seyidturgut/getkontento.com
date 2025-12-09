export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export interface UiState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export interface SeoMetric {
  date: string;
  visitors: number;
  pageViews: number;
  avgTime: number;
}

// --- Admin Module Types ---

export type ClientPlan = 'Basic' | 'Pro' | 'Enterprise';
export type ClientStatus = 'active' | 'passive';

export interface ClientUser {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
  status: 'active' | 'passive';
}

export interface Client {
  id: string;
  name: string;
  domain: string;
  logo?: string;
  plan: ClientPlan;
  status: ClientStatus;
  createdAt: string;
  wpConfig: {
    baseUrl: string;
    apiKey: string;
    apiSecret: string;
  };
  users: ClientUser[];
}

export interface AdminState {
  clients: Client[];
  addClient: (client: Client) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addClientUser: (clientId: string, user: ClientUser) => void;
  removeClientUser: (clientId: string, userId: string) => void;
}