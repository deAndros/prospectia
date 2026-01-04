import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check, MapPin } from 'lucide-react';
import clsx from 'clsx';
import { COUNTRIES } from '../constants';

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
        // Mantener comportamiento consistente con NicheSelector: mientras se escribe, borrar el valor seleccionado.
        // El valor se establecerá nuevamente solo vía selección de una opción o una coincidencia exacta al perder el foco.
        if (value) onChange('');
        setSearchTerm(next);
        setIsOpen(true);
        setActiveIndex(-1); // Reiniciar selección al escribir
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

    // Desplazar elemento activo a la vista
    useEffect(() => {
        if (isOpen && activeIndex >= 0 && listRef.current) {
            const list = listRef.current;
            const element = list.children[activeIndex];
            if (element) {
                element.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [activeIndex, isOpen]);

    // Permitir un pequeño retraso para manejar el clic en elementos desplegables
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
        // Solo cerrar si no estamos interactuando (manejado por clic afuera generalmente,
        // pero para blur queremos tener cuidado de no matar el clic)
        // El preventDefault en mousedown maneja el clic.
    }, 200);
};

const displayValue = isOpen ? searchTerm : (value || '');

// Buscar objeto de país seleccionado para mostrar bandera en input
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
                    "w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-zinc-600 shadow-inner pl-12 h-[50px]"
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
