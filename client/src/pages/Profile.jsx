import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Camera, Loader, Check, X } from 'lucide-react';
import { authApi } from '../lib/api';

const Profile = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [imagePreview, setImagePreview] = useState(user.profileImage || null);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        profileImage: user.profileImage || null
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validar tipo de archivo
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setError('Formato de imagen no válido. Usa JPG, PNG o WebP.');
            return;
        }

        // Validar tamaño (2MB)
        if (file.size > 2 * 1024 * 1024) {
            setError('La imagen es muy grande. Máximo 2MB.');
            return;
        }

        // Convertir a base64
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, profileImage: reader.result });
            setImagePreview(reader.result);
            setError('');
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación
        if (!formData.firstName || !formData.lastName || !formData.email) {
            setError('Por favor, completa todos los campos obligatorios.');
            return;
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Por favor, ingresa un correo electrónico válido.');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await authApi.updateProfile(formData);

            if (response && response.data && response.data.user) {
                // Actualizar localStorage
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setUser(response.data.user);
                setSuccess('Perfil actualizado exitosamente');

                // Recargar la página después de 1.5 segundos para refrescar la barra lateral
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        } catch (err) {
            console.error(err);
            if (err.status === 409) {
                setError('El correo electrónico ya está registrado por otro usuario.');
            } else if (err.status === 400) {
                setError(err.data?.message || 'Error de validación. Verifica los datos ingresados.');
            } else {
                setError(err.data?.message || 'Error al actualizar el perfil. Inténtalo de nuevo.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-black text-white mb-2">Mi Perfil</h1>
                <p className="text-zinc-400 mb-12">Actualiza tu información personal</p>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Foto de perfil */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                        <h2 className="text-xl font-bold text-white mb-6">Foto de Perfil</h2>

                        <div className="flex items-center gap-8">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-4 border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl font-black text-white">
                                            {formData.firstName?.[0]}{formData.lastName?.[0]}
                                        </span>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 p-3 bg-indigo-600 text-white rounded-full shadow-xl hover:bg-indigo-500 transition-all active:scale-95"
                                >
                                    <Camera size={20} />
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>

                            <div className="flex-1">
                                <p className="text-sm text-zinc-300 font-medium mb-2">Formatos permitidos: JPG, PNG, WebP</p>
                                <p className="text-xs text-zinc-500">Tamaño máximo: 2MB</p>
                                <p className="text-xs text-zinc-500">Dimensiones recomendadas: 400x400px</p>
                            </div>
                        </div>
                    </div>

                    {/* Información personal */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                        <h2 className="text-xl font-bold text-white mb-6">Información Personal</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-400 ml-1">Nombre *</label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        autoComplete="given-name"
                                        className="w-full bg-black/40 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                                        placeholder="Juan"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-400 ml-1">Apellido *</label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        autoComplete="family-name"
                                        className="w-full bg-black/40 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                                        placeholder="Pérez"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 mt-6">
                            <label className="text-xs font-medium text-zinc-400 ml-1">Correo Electrónico *</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                    className="w-full bg-black/40 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                                    placeholder="juan@ejemplo.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Mensajes de error/éxito */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 px-5 py-3 rounded-2xl"
                        >
                            <X size={18} />
                            <p className="text-sm font-medium">{error}</p>
                        </motion.div>
                    )}

                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-5 py-3 rounded-2xl"
                        >
                            <Check size={18} />
                            <p className="text-sm font-medium">{success}</p>
                        </motion.div>
                    )}

                    {/* Botón de guardar */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-zinc-700 disabled:to-zinc-700 text-white font-bold rounded-2xl shadow-2xl shadow-indigo-500/20 transition-all active:scale-95 disabled:cursor-not-allowed overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            <div className="relative flex items-center gap-2">
                                {isLoading ? (
                                    <>
                                        <Loader size={20} className="animate-spin" />
                                        <span>Guardando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Check size={20} />
                                        <span>Guardar Cambios</span>
                                    </>
                                )}
                            </div>
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Profile;
