import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import { authApi } from '../lib/api';

const GoogleCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState('');

    useEffect(() => {
        const processCallback = async () => {
            const params = new URLSearchParams(location.search);
            const code = params.get('code');

            if (!code) {
                setError('No se recibió el código de autorización de Google.');
                setTimeout(() => navigate('/login'), 3000);
                return;
            }

            try {
                const response = await authApi.googleAuth(code);
                if (response && response.data && response.data.token) {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    navigate('/discovery');
                } else {
                    throw new Error('No se recibió el token de acceso.');
                }
            } catch (err) {
                setError(err.data?.message || 'Error al autenticar con Google. Inténtalo de nuevo.');
                setTimeout(() => navigate('/login'), 3000);
            }
        };

        processCallback();
    }, [location, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-6 p-8 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl max-w-sm w-full"
            >
                {!error ? (
                    <>
                        <div className="flex justify-center">
                            <Loader className="w-12 h-12 text-purple-500 animate-spin" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Autenticando con Google</h2>
                        <p className="text-zinc-400 text-sm">Por favor espera un momento...</p>
                    </>
                ) : (
                    <>
                        <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-red-500 text-2xl font-bold">!</span>
                        </div>
                        <h2 className="text-xl font-bold text-white">Error de Autenticación</h2>
                        <p className="text-red-400 text-sm">{error}</p>
                        <p className="text-zinc-500 text-xs mt-4">Redirigiendo al login...</p>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default GoogleCallback;
