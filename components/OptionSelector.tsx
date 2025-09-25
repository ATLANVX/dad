import React from 'react';
import { Option } from '../types';

interface OptionSelectorProps {
  options: Option[];
  selectedOption: Option | null;
  onSelect: (option: Option) => void;
  isImage?: boolean;
  isColor?: boolean;
}

export const OptionSelector: React.FC<OptionSelectorProps> = ({ options, selectedOption, onSelect, isImage = false, isColor = false }) => {
  return (
    <div className={`grid gap-4 ${isImage ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5' : isColor ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5' : 'grid-cols-2 md:grid-cols-3'}`}>
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option)}
          className={`p-4 rounded-lg text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-400
            ${selectedOption?.id === option.id ? 'bg-cyan-600 text-white shadow-lg ring-2 ring-cyan-400' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          {isImage && option.imageUrl && (
            <img src={option.imageUrl} alt={option.name} className="w-full h-24 object-cover rounded-md mb-2" />
          )}
          {isColor ? (
             <div className="flex items-center gap-3">
                {option.colorHex && <div className="w-6 h-6 rounded-full border-2 border-white/50" style={{ backgroundColor: option.colorHex }} />}
                <p className="font-semibold">{option.name}</p>
             </div>
          ) : (
            <p className="font-semibold">{option.name}</p>
          )}

          {option.description && !isColor && <p className="text-sm opacity-80">{option.description}</p>}
        </button>
      ))}
    </div>
  );
};
