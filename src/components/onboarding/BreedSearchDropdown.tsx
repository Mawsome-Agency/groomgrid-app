'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BreedTiming } from '@/types';

interface BreedSearchDropdownProps {
  value: string | null;
  onChange: (breed: string, timing: BreedTiming) => void;
  className?: string;
}

// Comprehensive breed timing data (mock data for now - TODO: Replace with real API)
const BREED_DATA: BreedTiming[] = [
  // Small dogs
  { name: 'Chihuahua', minMin: 45, maxMin: 60, size: 'small' },
  { name: 'Yorkshire Terrier', minMin: 45, maxMin: 60, size: 'small' },
  { name: 'Pomeranian', minMin: 45, maxMin: 60, size: 'small' },
  { name: 'Toy Poodle', minMin: 45, maxMin: 60, size: 'small' },
  { name: 'Maltese', minMin: 45, maxMin: 60, size: 'small' },
  { name: 'Shih Tzu', minMin: 50, maxMin: 65, size: 'small' },
  { name: 'Papillon', minMin: 45, maxMin: 60, size: 'small' },
  { name: 'Boston Terrier', minMin: 50, maxMin: 65, size: 'small' },
  { name: 'French Bulldog', minMin: 50, maxMin: 65, size: 'small' },
  { name: 'Pug', minMin: 50, maxMin: 65, size: 'small' },
  
  // Medium dogs
  { name: 'Beagle', minMin: 60, maxMin: 75, size: 'medium' },
  { name: 'Cocker Spaniel', minMin: 60, maxMin: 75, size: 'medium' },
  { name: 'Border Collie', minMin: 60, maxMin: 75, size: 'medium' },
  { name: 'Australian Shepherd', minMin: 60, maxMin: 75, size: 'medium' },
  { name: 'Corgi', minMin: 55, maxMin: 70, size: 'medium' },
  { name: 'Shiba Inu', minMin: 55, maxMin: 70, size: 'medium' },
  { name: 'Staffordshire Bull Terrier', minMin: 55, maxMin: 70, size: 'medium' },
  { name: 'Whippet', minMin: 50, maxMin: 65, size: 'medium' },
  
  // Large dogs
  { name: 'Golden Retriever', minMin: 60, maxMin: 75, size: 'large' },
  { name: 'Labrador Retriever', minMin: 60, maxMin: 75, size: 'large' },
  { name: 'German Shepherd', minMin: 65, maxMin: 80, size: 'large' },
  { name: 'Boxer', minMin: 55, maxMin: 70, size: 'large' },
  { name: 'Husky', minMin: 65, maxMin: 80, size: 'large' },
  { name: 'Doberman', minMin: 55, maxMin: 70, size: 'large' },
  { name: 'Great Dane', minMin: 75, maxMin: 90, size: 'large' },
  { name: 'Rottweiler', minMin: 65, maxMin: 80, size: 'large' },
  { name: 'Bernese Mountain Dog', minMin: 75, maxMin: 90, size: 'large' },
  { name: 'Newfoundland', minMin: 75, maxMin: 90, size: 'large' },
  
  // Giant / High-maintenance
  { name: 'Standard Poodle', minMin: 85, maxMin: 120, size: 'giant' },
  { name: 'Old English Sheepdog', minMin: 90, maxMin: 120, size: 'giant' },
  { name: 'Afghan Hound', minMin: 90, maxMin: 120, size: 'giant' },
  { name: 'Komondor', minMin: 90, maxMin: 120, size: 'giant' },
  { name: 'Puli', minMin: 90, maxMin: 120, size: 'giant' },
];

export default function BreedSearchDropdown({ value, onChange, className }: BreedSearchDropdownProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter breeds based on search query
  const filteredBreeds = useMemo(() => {
    if (!searchQuery.trim()) {
      return BREED_DATA.slice(0, 5); // Show top 5 by default
    }
    const query = searchQuery.toLowerCase();
    return BREED_DATA.filter((breed) =>
      breed.name.toLowerCase().includes(query)
    ).slice(0, 10);
  }, [searchQuery]);

  // Update selected index when filtered results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [filteredBreeds]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (breed: BreedTiming) => {
    onChange(breed.name, breed);
    setSearchQuery(breed.name);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next = Math.min(prev + 1, filteredBreeds.length - 1);
          return next;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next = Math.max(prev - 1, 0);
          return next;
        });
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredBreeds.length) {
          handleSelect(filteredBreeds[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <label htmlFor="breed-search" className="block text-sm font-medium text-stone-700 mb-1">
        Breed *
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
        <input
          id="breed-search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Start typing breed..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          autoComplete="off"
          aria-expanded={isOpen}
          aria-controls="breed-results"
          aria-autocomplete="list"
          role="combobox"
        />
      </div>

      {isOpen && filteredBreeds.length > 0 && (
        <ul
          id="breed-results"
          role="listbox"
          className="absolute z-10 w-full mt-1 bg-white border border-stone-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
        >
          {filteredBreeds.map((breed, index) => (
            <li
              key={breed.name}
              role="option"
              aria-selected={index === selectedIndex}
              className={cn(
                "px-4 py-3 cursor-pointer transition-colors",
                "hover:bg-green-50",
                index === selectedIndex && "bg-green-100",
                "flex items-center justify-between"
              )}
              onClick={() => handleSelect(breed)}
            >
              <span className="font-medium text-stone-900">{breed.name}</span>
              <span className="flex items-center gap-1 text-sm text-stone-500">
                <Clock className="w-3 h-3" />
                {breed.minMin}-{breed.maxMin} min
              </span>
            </li>
          ))}
        </ul>
      )}

      {isOpen && filteredBreeds.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-stone-200 rounded-xl shadow-lg p-4 text-center text-stone-500">
          No breeds found. Try a different search term.
        </div>
      )}
    </div>
  );
}
