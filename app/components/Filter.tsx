// app/components/Filter.tsx
'use client';
import React, { useEffect, useState, useRef } from 'react';
import { heightRanges, weightRanges, expRanges } from '@/app/lib/constants';
import { fetchTypes } from '@/app/lib/fetchMeta';

interface FilterProps {
  filter: {
    type: string[];
    height: string;
    weight: string;
    experience: string;
  };
  setFilter: React.Dispatch<React.SetStateAction<any>>;
  onClose: () => void;
  onApply: () => void;
}

const filterSections = ['type', 'height', 'weight', 'experience'];

export default function FilterPanel({ filter, setFilter, onClose, onApply }: FilterProps) {
  const [typeOptions, setTypeOptions] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<string>('type');
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTypes().then(setTypeOptions);
  }, []);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [onClose]);

  const toggleType = (type: string) => {
    setFilter((prev: any) => ({
      ...prev,
      type: prev.type.includes(type) ? prev.type.filter((t: string) => t !== type) : [...prev.type, type]
    }));
  };

  const updateFilter = (field: string, value: string) => {
    setFilter((prev: any) => ({ ...prev, [field]: value }));
  };

  const renderRightSection = () => {
    if (activeSection === 'type') {
      return (
        <div className="flex flex-wrap gap-2">
          {typeOptions.map((type) => (
            <button
              key={type}
              className={`px-2 py-1 rounded border text-sm ${filter.type.includes(type) ? 'bg-indigo-200 text-black' : 'text-white border-white'}`}
              onClick={() => toggleType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      );
    }

    const options =
      activeSection === 'height'
        ? heightRanges
        : activeSection === 'weight'
        ? weightRanges
        : expRanges;

    return (
      <div className="flex flex-col gap-1">
        {options.map((option: string) => (
          <label key={option} className="text-sm">
            <input
              type="radio"
              name={activeSection}
              value={option}
              checked={(filter as any)[activeSection] === option}
              onChange={() => updateFilter(activeSection, option)}
              className="mr-2"
            />
            {option}
          </label>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        ref={panelRef}
        className="bg-black text-white p-6 rounded-lg w-[700px] max-w-full transform transition-transform duration-300 scale-100 animate-slide-in"
      >
        <h2 className="text-lg font-semibold mb-4">Filter Options</h2>
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col gap-2 sm:w-1/3 border-r sm:pr-4 border-gray-500">
            {filterSections.map((section) => (
              <button
                key={section}
                className={`text-left capitalize py-1 px-2 rounded ${activeSection === section ? 'bg-indigo-700 font-medium' : 'hover:bg-gray-800'}`}
                onClick={() => setActiveSection(section)}
              >
                {section}
              </button>
            ))}
          </div>
          <div className="sm:w-2/3">{renderRightSection()}</div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="bg-gray-500 px-3 py-1 rounded">
            Close
          </button>
          <button onClick={onApply} className="bg-indigo-600 text-white px-3 py-1 rounded">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
