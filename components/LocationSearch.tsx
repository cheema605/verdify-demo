'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';

interface NominatimResult {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
    boundingbox?: [string, string, string, string];
    type: string;
    importance: number;
}

interface LocationSearchProps {
    onLocationSelect: (lat: number, lon: number, bounds: [number, number, number, number] | undefined, name: string) => void;
    className?: string;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onLocationSelect, className = '' }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<NominatimResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced search
    useEffect(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        if (query.trim().length < 3) {
            setResults([]);
            setShowResults(false);
            return;
        }

        setIsLoading(true);
        debounceTimeout.current = setTimeout(async () => {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
                    {
                        headers: {
                            'User-Agent': 'VerdifyDemo/1.0'
                        }
                    }
                );
                const data: NominatimResult[] = await response.json();
                setResults(data);
                setShowResults(data.length > 0);
                setSelectedIndex(-1);
            } catch (error) {
                console.error('Geocoding error:', error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 500);

        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [query]);

    const handleSelect = (result: NominatimResult) => {
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);

        let bounds: [number, number, number, number] | undefined;
        if (result.boundingbox) {
            bounds = [
                parseFloat(result.boundingbox[2]), // west (minLon)
                parseFloat(result.boundingbox[0]), // south (minLat)
                parseFloat(result.boundingbox[3]), // east (maxLon)
                parseFloat(result.boundingbox[1])  // north (maxLat)
            ];
        }

        const name = result.display_name.split(',')[0];
        console.log('Location selected:', { name, lat, lon, bounds, fullDisplayName: result.display_name });
        onLocationSelect(lat, lon, bounds, name);
        setQuery(result.display_name);
        setShowResults(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showResults || results.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, -1));
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            handleSelect(results[selectedIndex]);
        } else if (e.key === 'Escape') {
            setShowResults(false);
        }
    };

    const clearSearch = () => {
        setQuery('');
        setResults([]);
        setShowResults(false);
    };

    return (
        <div ref={searchRef} className={`relative ${className}`}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => results.length > 0 && setShowResults(true)}
                    placeholder="Search for a location..."
                    className="w-full pl-10 pr-10 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm"
                />
                {isLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-600 animate-spin" />
                )}
                {!isLoading && query && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {showResults && results.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                    {results.map((result, index) => (
                        <button
                            key={result.place_id}
                            onClick={() => handleSelect(result)}
                            className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 ${index === selectedIndex ? 'bg-indigo-50' : ''
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 truncate">
                                        {result.display_name.split(',')[0]}
                                    </p>
                                    <p className="text-xs text-slate-500 truncate">
                                        {result.display_name}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {showResults && results.length === 0 && !isLoading && query.length >= 3 && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg p-4 text-center">
                    <p className="text-sm text-slate-500">No locations found for "{query}"</p>
                </div>
            )}
        </div>
    );
};

export default LocationSearch;
