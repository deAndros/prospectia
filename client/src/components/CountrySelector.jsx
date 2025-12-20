import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check, MapPin } from 'lucide-react';
import clsx from 'clsx';

const COUNTRIES = [
    // América Latina
    { name: 'Argentina', flag: '🇦🇷' },
    { name: 'México', flag: '🇲🇽' },
    { name: 'Chile', flag: '🇨🇱' },
    { name: 'Colombia', flag: '🇨🇴' },
    { name: 'Perú', flag: '🇵🇪' },
    { name: 'Uruguay', flag: '🇺🇾' },
    { name: 'Brasil', flag: '🇧🇷' },
    { name: 'Ecuador', flag: '🇪🇨' },
    { name: 'Bolivia', flag: '🇧🇴' },
    { name: 'Paraguay', flag: '🇵🇾' },
    { name: 'Venezuela', flag: '🇻🇪' },
    { name: 'Costa Rica', flag: '🇨🇷' },
    { name: 'Panamá', flag: '🇵🇦' },
    { name: 'Guatemala', flag: '🇬🇹' },
    { name: 'Honduras', flag: '🇭🇳' },
    { name: 'El Salvador', flag: '🇸🇻' },
    { name: 'Nicaragua', flag: '🇳🇮' },
    { name: 'República Dominicana', flag: '🇩🇴' },
    { name: 'Cuba', flag: '🇨🇺' },
    { name: 'Puerto Rico', flag: '🇵🇷' },

    // América del Norte
    { name: 'Estados Unidos', flag: '🇺🇸' },
    { name: 'Canadá', flag: '🇨🇦' },

    // Europa Occidental
    { name: 'España', flag: '🇪🇸' },
    { name: 'Francia', flag: '🇫🇷' },
    { name: 'Alemania', flag: '🇩🇪' },
    { name: 'Italia', flag: '🇮🇹' },
    { name: 'Portugal', flag: '🇵🇹' },
    { name: 'Reino Unido', flag: '🇬🇧' },
    { name: 'Países Bajos', flag: '🇳🇱' },
    { name: 'Bélgica', flag: '🇧🇪' },
    { name: 'Suiza', flag: '🇨🇭' },
    { name: 'Austria', flag: '🇦🇹' },
    { name: 'Irlanda', flag: '🇮🇪' },
    { name: 'Luxemburgo', flag: '🇱🇺' },

    // Europa del Norte
    { name: 'Suecia', flag: '🇸🇪' },
    { name: 'Noruega', flag: '🇳🇴' },
    { name: 'Dinamarca', flag: '🇩🇰' },
    { name: 'Finlandia', flag: '🇫🇮' },
    { name: 'Islandia', flag: '🇮🇸' },

    // Europa del Este
    { name: 'Polonia', flag: '🇵🇱' },
    { name: 'República Checa', flag: '🇨🇿' },
    { name: 'Hungría', flag: '🇭🇺' },
    { name: 'Rumania', flag: '🇷🇴' },
    { name: 'Bulgaria', flag: '🇧🇬' },
    { name: 'Croacia', flag: '🇭🇷' },
    { name: 'Eslovaquia', flag: '🇸🇰' },
    { name: 'Eslovenia', flag: '🇸🇮' },
    { name: 'Estonia', flag: '🇪🇪' },
    { name: 'Letonia', flag: '🇱🇻' },
    { name: 'Lituania', flag: '🇱🇹' },

    // Europa del Sur
    { name: 'Grecia', flag: '🇬🇷' },
    { name: 'Turquía', flag: '🇹🇷' },

    // Asia Oriental
    { name: 'Japón', flag: '🇯🇵' },
    { name: 'Corea del Sur', flag: '🇰🇷' },
    { name: 'China', flag: '🇨🇳' },
    { name: 'Taiwán', flag: '🇹🇼' },
    { name: 'Hong Kong', flag: '🇭🇰' },

    // Asia del Sur
    { name: 'India', flag: '🇮🇳' },
    { name: 'Pakistán', flag: '🇵🇰' },
    { name: 'Bangladesh', flag: '🇧🇩' },
    { name: 'Sri Lanka', flag: '🇱🇰' },

    // Sudeste Asiático
    { name: 'Singapur', flag: '🇸🇬' },
    { name: 'Tailandia', flag: '🇹🇭' },
    { name: 'Vietnam', flag: '🇻🇳' },
    { name: 'Filipinas', flag: '🇵🇭' },
    { name: 'Indonesia', flag: '🇮🇩' },
    { name: 'Malasia', flag: '🇲🇾' },

    // Medio Oriente
    { name: 'Emiratos Árabes Unidos', flag: '🇦🇪' },
    { name: 'Arabia Saudita', flag: '🇸🇦' },
    { name: 'Israel', flag: '🇮🇱' },

    // Oceanía
    { name: 'Australia', flag: '🇦🇺' },
    { name: 'Nueva Zelanda', flag: '🇳🇿' },
    { name: 'Fiji', flag: '🇫🇯' },
    { name: 'Papua Nueva Guinea', flag: '🇵🇬' },

    // África
    { name: 'Sudáfrica', flag: '🇿🇦' },
    { name: 'Egipto', flag: '🇪🇬' },
    { name: 'Marruecos', flag: '🇲🇦' },
    { name: 'Kenia', flag: '🇰🇪' },
    { name: 'Nigeria', flag: '🇳🇬' },
];

const CountrySelector = ({ value, onChange }) => {
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

    const filteredCountries = COUNTRIES.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (countryName) => {
        onChange(countryName);
        setSearchTerm(countryName);
        setIsOpen(false);
        setActiveIndex(-1);
    };

    const handleInputChange = (e) => {
        const next = e.target.value;
        // Keep behavior consistent with NicheSelector: while typing, clear the selected value.
        // The value will be set again only via selecting an option or an exact match on blur.
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
                setActiveIndex(prev => (prev < filteredCountries.length - 1 ? prev + 1 : prev));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (activeIndex >= 0 && activeIndex < filteredCountries.length) {
                    handleSelect(filteredCountries[activeIndex].name);
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
            const exactMatch = COUNTRIES.find(
                c => c.name.toLowerCase() === searchTerm.toLowerCase()
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
            // Only close if we're not interacting (handled by click outside usually, 
            // but for blur we want to be careful not to kill the click)
            // The preventDefault on mousedown handles the click.
        }, 200);
    };

    const displayValue = isOpen ? searchTerm : (value || '');

    // Find selected country object for flag display in input
    const selectedCountryObj = COUNTRIES.find(c => c.name.toLowerCase() === displayValue.toLowerCase());

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="relative">
                {selectedCountryObj ? (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl pointer-events-none">
                        {selectedCountryObj.flag}
                    </div>
                ) : (
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={18} />
                )}
                <input
                    type="text"
                    placeholder="Escribe para buscar país..."
                    value={displayValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    className={clsx(
                        "w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-zinc-600 shadow-inner pl-12"
                    )}
                />
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={18} />
            </div>

            {isOpen && searchTerm.length > 0 && filteredCountries.length > 0 && (
                <div
                    ref={listRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-[99999] divide-y divide-white/5"
                >
                    {filteredCountries.map((country, index) => (
                        <button
                            key={country.name}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleSelect(country.name)}
                            className={clsx(
                                "w-full text-left px-4 py-3 flex items-center justify-between group transition-colors",
                                index === activeIndex ? "bg-white/10" : "hover:bg-white/5"
                            )}
                        >
                            <span className="flex items-center gap-3 text-zinc-300 group-hover:text-white">
                                <span className="text-xl">{country.flag}</span>
                                {country.name}
                            </span>
                            {value === country.name && <Check size={16} className="text-indigo-400" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CountrySelector;
