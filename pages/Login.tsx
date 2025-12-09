import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Zap, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      const success = await login(email, password);
      if (success) {
        navigate('/app/dashboard');
      }
    }
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    clearError();
    setter(value);
  };

  return (
    <div className="min-h-screen bg-[#0D0F12] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-[#FF5A2F]/10 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-[#4EC9B0]/10 rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-md w-full bg-[#1A1D23]/60 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/50 p-8 sm:p-10 border border-[#2A2F38] relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#0D0F12] border border-[#2A2F38] text-[#FF5A2F] rounded-2xl mb-6 shadow-xl shadow-[#FF5A2F]/10 transition-transform hover:scale-105 duration-300">
            <Zap size={40} strokeWidth={1.5} className="fill-[#FF5A2F]/10" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">GetKontento</h1>
          <p className="text-slate-400 mt-3 text-sm">Giriş Paneli</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 animate-fade-in">
            <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-rose-400 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">
              E-posta Adresi
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#FF5A2F] transition-colors" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => handleInputChange(setEmail, e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#0D0F12] border border-[#2A2F38] text-slate-200 placeholder:text-slate-600 focus:border-[#FF5A2F] focus:ring-4 focus:ring-[#FF5A2F]/10 outline-none transition-all duration-300"
                placeholder="demo@sistemglobal.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">
              Şifre
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#FF5A2F] transition-colors" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => handleInputChange(setPassword, e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#0D0F12] border border-[#2A2F38] text-slate-200 placeholder:text-slate-600 focus:border-[#FF5A2F] focus:ring-4 focus:ring-[#FF5A2F]/10 outline-none transition-all duration-300"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300 select-none">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-[#0D0F12] text-[#FF5A2F] focus:ring-offset-[#0D0F12] focus:ring-2 focus:ring-[#FF5A2F]" />
              Beni Hatırla
            </label>
            <a href="#" className="text-[#4EC9B0] font-medium hover:text-[#4EC9B0]/80 hover:underline">Şifremi unuttum</a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#FF5A2F] hover:bg-[#FF5A2F]/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-[#FF5A2F]/25 hover:shadow-[#FF5A2F]/40 active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Giriş Yapılıyor...
              </>
            ) : (
              <>
                Giriş Yap
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#2A2F38]/50 text-center space-y-4">
          <p className="text-slate-400 text-sm">
            Hesabınız yok mu?{' '}
            <Link to="/register" className="text-[#4EC9B0] font-medium hover:text-[#4EC9B0]/80 hover:underline">
              Kayıt Olun
            </Link>
          </p>
          <p className="text-slate-500 text-sm">
            Demo Hesap: <br />
            <span className="text-slate-400 font-mono text-xs bg-[#0D0F12] px-2 py-1 rounded border border-[#2A2F38] mx-1">demo@sistemglobal.com</span>
            <span className="text-slate-400 font-mono text-xs bg-[#0D0F12] px-2 py-1 rounded border border-[#2A2F38] mx-1">Demo123!</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;