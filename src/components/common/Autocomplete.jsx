import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

const Autocomplete = ({ label, options = [], onSelect, placeholder, required = false }) => {
    const [query, setQuery] = useState('');
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    useEffect(() => {
        // Debounce local filtering
        const timer = setTimeout(() => {
            if (query.length >= 1 && !selectedItem) {
                const lowerQuery = query.toLowerCase();
                const filtered = options.filter(item => {
                    const name = item.name || item.Name || item.label || "";
                    return name.toLowerCase().includes(lowerQuery);
                });
                setFilteredOptions(filtered);
                setIsOpen(true);
            }
            // Show all if clicking results
            else if (query.length === 0) {
                setFilteredOptions([]);
                setIsOpen(false);
            }
        }, 150);

        return () => clearTimeout(timer);
    }, [query, options, selectedItem]);

    const handleSelect = (item) => {
        setSelectedItem(item);
        const labelText = item.name || item.Name || item.label || "Record";
        setQuery(labelText);
        setIsOpen(false);

        // ROBUST ID EXTRACTION: Preference order: sfId (our map) > Id (SF Pascal) > _id (Mongo)
        const id = item.sfId || item.Id || item._id;
        onSelect(id);
    };

    return (
        <div className="space-y-1 relative" ref={wrapperRef}>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                {label} {required && '*'}
            </label>
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setSelectedItem(null);
                        onSelect(''); // Clear parent selection
                    }}
                    onFocus={() => {
                        if (query.length >= 1) setIsOpen(true);
                    }}
                    placeholder={placeholder || `Search...`}
                    required={required && !selectedItem}
                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-3 pr-10 py-2 text-white focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-600"
                />
                <div className="absolute right-3 top-2.5 text-slate-500 pointer-events-none">
                    <Search size={16} />
                </div>
            </div>

            {/* Dropdown Results */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-[#1a1f2e] border border-white/10 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    {filteredOptions.length === 0 && (
                        <div className="p-3 text-sm text-slate-400 text-center">No matching records</div>
                    )}

                    {filteredOptions.map((item) => (
                        <button
                            key={item.sfId || item._id || Math.random()}
                            type="button"
                            onClick={() => handleSelect(item)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-indigo-600/20 hover:text-white transition-colors border-b border-white/5 last:border-0"
                        >
                            <span className="font-medium block">{item.name || item.Name || item.label}</span>
                            <span className="text-xs text-slate-500">{item.sfId ? `SF: ${item.sfId}` : "ID: " + (item._id || "").substr(0, 8)}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Autocomplete;
