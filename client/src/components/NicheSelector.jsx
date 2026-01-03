import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check, Briefcase } from 'lucide-react';
import clsx from 'clsx';

const NICHES = [
    { name: 'Videojuegos', emoji: '🎮' },
    { name: 'Gaming', emoji: '🕹️' },
    { name: 'Desarrollo de Software', emoji: '💻' },
    { name: 'Marketing Digital', emoji: '📱' },
    { name: 'Recursos Humanos', emoji: '👥' },
    { name: 'Salud y Bienestar', emoji: '🏥' },
    { name: 'E-learning / EdTech', emoji: '📚' },
    { name: 'FinTech', emoji: '💳' },
    { name: 'Logística', emoji: '📦' },
    { name: 'E-commerce', emoji: '🛒' },
    { name: 'Consultoría Estratégica', emoji: '💼' },
    { name: 'Ciberseguridad', emoji: '🔐' },
    { name: 'Inmobiliaria / Real Estate', emoji: '🏢' },
    { name: 'Turismo y Hospitalidad', emoji: '✈️' },
    { name: 'Banca y Seguros', emoji: '🏦' },
    { name: 'Agroindustria', emoji: '🌾' },
    { name: 'Energías Renovables', emoji: '⚡' },
    { name: 'Diseño Gráfico / Multimedia', emoji: '🎨' },
    { name: 'Legal / Abogacía', emoji: '⚖️' },
    { name: 'Arquitectura y Construcción', emoji: '🏗️' },
    { name: 'Telecomunicaciones', emoji: '📡' },
    { name: 'Medios y Entretenimiento', emoji: '🎬' },
    { name: 'Publicidad y Relaciones Públicas', emoji: '📢' },
    { name: 'Retail / Comercio Minorista', emoji: '🛍️' },
    { name: 'Manufactura', emoji: '🏭' },
    { name: 'Automotriz', emoji: '🚗' },
    { name: 'Aeroespacial', emoji: '🚀' },
    { name: 'Farmacéutica', emoji: '💊' },
    { name: 'Biotecnología', emoji: '🧬' },
    { name: 'Inteligencia Artificial', emoji: '🤖' },
    { name: 'Big Data / Analytics', emoji: '📊' },
    { name: 'Cloud Computing', emoji: '☁️' },
    { name: 'IoT (Internet de las Cosas)', emoji: '🌐' },
    { name: 'Blockchain / Criptomonedas', emoji: '₿' },
    { name: 'Robótica', emoji: '🦾' },
    { name: 'Realidad Virtual / Aumentada', emoji: '🥽' },
    { name: 'SaaS (Software as a Service)', emoji: '⚙️' },
    { name: 'Hardware / Electrónica', emoji: '🔌' },
    { name: 'Redes Sociales', emoji: '📲' },
    { name: 'Streaming / OTT', emoji: '📺' },
    { name: 'Podcasting', emoji: '🎙️' },
    { name: 'Influencer Marketing', emoji: '⭐' },
    { name: 'Alimentación y Bebidas', emoji: '🍽️' },
    { name: 'Gastronomía', emoji: '👨‍🍳' },
    { name: 'Moda y Textil', emoji: '👗' },
    { name: 'Cosmética y Belleza', emoji: '💄' },
    { name: 'Deportes y Fitness', emoji: '⚽' },
    { name: 'Educación', emoji: '🎓' },
    { name: 'Investigación Científica', emoji: '🔬' },
    { name: 'ONGs / Organizaciones sin fines de lucro', emoji: '🤝' },
    { name: 'Gobierno y Sector Público', emoji: '🏛️' },
    { name: 'Medioambiente y Sostenibilidad', emoji: '🌱' },
    { name: 'Reciclaje', emoji: '♻️' },
    { name: 'Agricultura / Agtech', emoji: '🚜' },
    { name: 'Pesca y Acuicultura', emoji: '🐟' },
    { name: 'Minería', emoji: '⛏️' },
    { name: 'Petróleo y Gas', emoji: '🛢️' },
    { name: 'Servicios Profesionales', emoji: '🎯' },
    { name: 'Contabilidad', emoji: '🧮' },
    { name: 'Auditoría', emoji: '📋' },
    { name: 'Traducción e Interpretación', emoji: '🌍' },
    { name: 'Eventos y Conferencias', emoji: '🎪' },
    { name: 'Catering', emoji: '🍴' },
    { name: 'Fotografía y Videografía', emoji: '📷' },
    { name: 'Música', emoji: '🎵' },
    { name: 'Artes Plásticas', emoji: '🖼️' },
    { name: 'Editorial / Publicaciones', emoji: '📖' },
    { name: 'Bibliotecas y Archivos', emoji: '📚' },
    { name: 'Mobiliario y Decoración', emoji: '🛋️' },
    { name: 'Jardines y Paisajismo', emoji: '🌳' },
    { name: 'Seguridad Privada', emoji: '🔒' },
    { name: 'Limpieza y Mantenimiento', emoji: '🧹' },
    { name: 'Transporte y Movilidad', emoji: '🚌' },
    { name: 'Aviación', emoji: '✈️' },
    { name: 'Marítimo / Naviero', emoji: '⚓' },
    { name: 'Ferroviario', emoji: '🚂' },
    { name: 'Courier / Mensajería', emoji: '📮' },
    { name: 'Almacenamiento / Warehousing', emoji: '🏬' },
];

const NicheSelector = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeIndex, setActiveIndex] = useState(-1);
    const dropdownRef = useRef(null);
    const listRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setActiveIndex(-1);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredNiches = NICHES.filter(niche =>
        niche.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (nicheName) => {
        onChange(nicheName);
        setSearchTerm(nicheName);
        setIsOpen(false);
        setActiveIndex(-1);
    };

    const handleInputChange = (e) => {
        const next = e.target.value;
        // Prevent "free text" from being treated as a selected value in the parent.
        // While typing, clear the selected value; it will be set again only via selecting an option
        // or an exact match on blur.
        if (value) onChange('');
        setSearchTerm(next);
        setIsOpen(true);
        setActiveIndex(-1); // Reset selection on typing
    };

    const handleKeyDown = (e) => {
        if (!isOpen) {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                setIsOpen(true);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex(prev => (prev < filteredNiches.length - 1 ? prev + 1 : prev));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (activeIndex >= 0 && activeIndex < filteredNiches.length) {
                    handleSelect(filteredNiches[activeIndex].name);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                break;
            default:
                break;
        }
    };

    // Scroll active item into view
    useEffect(() => {
        if (isOpen && activeIndex >= 0 && listRef.current) {
            const list = listRef.current;
            const element = list.children[activeIndex];
            if (element) {
                element.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [activeIndex, isOpen]);

    const handleBlur = () => {
        // Allow a small delay to handle click on dropdown items
        setTimeout(() => {
            const exactMatch = NICHES.find(
                n => n.name.toLowerCase() === searchTerm.toLowerCase()
            );

            if (exactMatch) {
                onChange(exactMatch.name);
                setSearchTerm(exactMatch.name);
            } else {
                if (value) {
                    setSearchTerm(value);
                } else {
                    setSearchTerm('');
                    onChange('');
                }
            }
        }, 200);
    };

    const displayValue = isOpen ? searchTerm : (value || '');

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="relative">
                <input
                    type="text"
                    placeholder="Escribe para buscar rubro..."
                    value={displayValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 pl-12 text-white text-base focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all placeholder:text-zinc-600 shadow-inner h-[50px]"
                />
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={18} />
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={18} />
            </div>

            {isOpen && searchTerm.length > 0 && filteredNiches.length > 0 && (
                <div
                    ref={listRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-[99999] divide-y divide-white/5"
                >
                    {filteredNiches.map((niche, index) => (
                        <button
                            key={niche.name}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleSelect(niche.name)}
                            className={clsx(
                                "w-full text-left px-4 py-3 flex items-center justify-between group transition-colors",
                                index === activeIndex ? "bg-white/10" : "hover:bg-white/5"
                            )}
                        >
                            <span className="flex items-center gap-3 text-zinc-300 group-hover:text-white">
                                <span className="text-xl">{niche.emoji}</span>
                                {niche.name}
                            </span>
                            {value === niche.name && <Check size={16} className="text-purple-400" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NicheSelector;
