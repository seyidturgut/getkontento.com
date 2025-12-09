/// <reference types="vite/client" />

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, Building, Globe, ArrowRight, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        company_name: '',
        domain: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const { setUser, setToken } = useAuthStore();

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'İsim gereklidir';
        if (!formData.email.trim()) newErrors.email = 'Email gereklidir';
        if (!formData.password) newErrors.password = 'Şifre gereklidir';
        if (formData.password.length < 6) newErrors.password = 'Şifre en az 6 karakter olmalıdır';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Şifreler eşleşmiyor';
        if (!formData.company_name.trim()) newErrors.company_name = 'Şirket adı gereklidir';
        if (!formData.domain.trim()) newErrors.domain = 'Domain gereklidir';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/self-register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    company_name: formData.company_name,
                    domain: formData.domain
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setErrors({ submit: data.message || 'Kayıt başarısız' });
                setIsLoading(false);
                return;
            }

            // Başarılı kayıt
            setSuccess(true);
            setToken(data.token);
            setUser(data.user);

            // 1.5 saniye sonra dashboard'a yönlendir
            setTimeout(() => {
                navigate('/app/dashboard');
            }, 1500);

        } catch (error) {
            setErrors({ submit: 'Bağlantı hatası oluştu' });
            setIsLoading(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#0D0F12] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-[#1A1D23]/60 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-[#2A2F38] text-center animate-fade-in">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-[#4EC9B0]/10 text-[#4EC9B0] rounded-full mb-6">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Kayıt Başarılı!</h2>
                    <p className="text-slate-400">Hesabınız oluşturuldu. Dashboard'a yönlendiriliyorsunuz...</p>
                    <div className="mt-6">
                        <Loader2 className="animate-spin text-[#FF5A2F] mx-auto" size={24} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0D0F12] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-[#FF5A2F]/10 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-[#4EC9B0]/10 rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="max-w-2xl w-full bg-[#1A1D23]/60 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/50 p-8 sm:p-10 border border-[#2A2F38] relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0D0F12] border border-[#2A2F38] text-[#FF5A2F] rounded-2xl mb-4 shadow-xl shadow-[#FF5A2F]/10">
                        <UserPlus size={32} strokeWidth={1.5} />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Hesap Oluştur</h1>
                    <p className="text-slate-400 mt-2 text-sm">GetKontento'ya hoş geldiniz</p>
                </div>

                {errors.submit && (
                    <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
                        <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={18} />
                        <p className="text-sm text-rose-400 font-medium">{errors.submit}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* İsim */}
                        <div className="space-y-1">
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">
                                İsim Soyisim
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl bg-[#0D0F12] border ${errors.name ? 'border-rose-500' : 'border-[#2A2F38]'} text-slate-200 placeholder:text-slate-600 focus:border-[#FF5A2F] focus:ring-4 focus:ring-[#FF5A2F]/10 outline-none transition-all`}
                                placeholder="Ahmet Yılmaz"
                            />
                            {errors.name && <p className="text-xs text-rose-400 ml-1">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">
                                E-posta Adresi
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#FF5A2F] transition-colors" size={18} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className={`w-full pl-12 pr-4 py-3 rounded-xl bg-[#0D0F12] border ${errors.email ? 'border-rose-500' : 'border-[#2A2F38]'} text-slate-200 placeholder:text-slate-600 focus:border-[#FF5A2F] focus:ring-4 focus:ring-[#FF5A2F]/10 outline-none transition-all`}
                                    placeholder="ahmet@sirketim.com"
                                />
                            </div>
                            {errors.email && <p className="text-xs text-rose-400 ml-1">{errors.email}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Şifre */}
                        <div className="space-y-1">
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">
                                Şifre
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#FF5A2F] transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    className={`w-full pl-12 pr-4 py-3 rounded-xl bg-[#0D0F12] border ${errors.password ? 'border-rose-500' : 'border-[#2A2F38]'} text-slate-200 placeholder:text-slate-600 focus:border-[#FF5A2F] focus:ring-4 focus:ring-[#FF5A2F]/10 outline-none transition-all`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="text-xs text-rose-400 ml-1">{errors.password}</p>}
                        </div>

                        {/* Şifre Tekrar */}
                        <div className="space-y-1">
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">
                                Şifre Tekrar
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#FF5A2F] transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                    className={`w-full pl-12 pr-4 py-3 rounded-xl bg-[#0D0F12] border ${errors.confirmPassword ? 'border-rose-500' : 'border-[#2A2F38]'} text-slate-200 placeholder:text-slate-600 focus:border-[#FF5A2F] focus:ring-4 focus:ring-[#FF5A2F]/10 outline-none transition-all`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.confirmPassword && <p className="text-xs text-rose-400 ml-1">{errors.confirmPassword}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Şirket Adı */}
                        <div className="space-y-1">
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">
                                Şirket Adı
                            </label>
                            <div className="relative group">
                                <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#FF5A2F] transition-colors" size={18} />
                                <input
                                    type="text"
                                    value={formData.company_name}
                                    onChange={(e) => handleChange('company_name', e.target.value)}
                                    className={`w-full pl-12 pr-4 py-3 rounded-xl bg-[#0D0F12] border ${errors.company_name ? 'border-rose-500' : 'border-[#2A2F38]'} text-slate-200 placeholder:text-slate-600 focus:border-[#FF5A2F] focus:ring-4 focus:ring-[#FF5A2F]/10 outline-none transition-all`}
                                    placeholder="Şirketim A.Ş."
                                />
                            </div>
                            {errors.company_name && <p className="text-xs text-rose-400 ml-1">{errors.company_name}</p>}
                        </div>

                        {/* Domain */}
                        <div className="space-y-1">
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">
                                Website Domain
                            </label>
                            <div className="relative group">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#FF5A2F] transition-colors" size={18} />
                                <input
                                    type="text"
                                    value={formData.domain}
                                    onChange={(e) => handleChange('domain', e.target.value)}
                                    className={`w-full pl-12 pr-4 py-3 rounded-xl bg-[#0D0F12] border ${errors.domain ? 'border-rose-500' : 'border-[#2A2F38]'} text-slate-200 placeholder:text-slate-600 focus:border-[#FF5A2F] focus:ring-4 focus:ring-[#FF5A2F]/10 outline-none transition-all`}
                                    placeholder="sirketim.com"
                                />
                            </div>
                            {errors.domain && <p className="text-xs text-rose-400 ml-1">{errors.domain}</p>}
                            <p className="text-xs text-slate-500 ml-1">SEO analizi bu domain üzerinden yapılacak</p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-[#FF5A2F] hover:bg-[#FF5A2F]/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-[#FF5A2F]/25 hover:shadow-[#FF5A2F]/40 active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Kayıt Yapılıyor...
                            </>
                        ) : (
                            <>
                                Hesap Oluştur
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-[#2A2F38]/50 text-center">
                    <p className="text-slate-400 text-sm">
                        Zaten hesabınız var mı?{' '}
                        <Link to="/login" className="text-[#4EC9B0] font-medium hover:text-[#4EC9B0]/80 hover:underline">
                            Giriş Yap
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
