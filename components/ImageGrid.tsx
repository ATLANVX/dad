import React from 'react';
import { ImageFile } from '../types';
import { TrashIcon } from './icons/Icons';

interface ImageGridProps {
  images: (ImageFile | string)[];
  onRemove?: (index: number) => void;
  onImageClick?: (src: string) => void;
  isResult?: boolean;
}

export const ImageGrid: React.FC<ImageGridProps> = ({ images, onRemove, onImageClick, isResult = false }) => {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className={`mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 ${isResult ? 'animate-fade-in' : ''}`}>
      {images.map((image, index) => {
        const src = typeof image === 'string' ? image : image.previewUrl;
        
        const imageElement = (
            <img
                src={src}
                alt={`Prévia ${index + 1}`}
                className="object-cover w-full h-full rounded-lg shadow-md"
            />
        );

        return (
          <div key={index} className="relative group aspect-w-1 aspect-h-1">
            {isResult && onImageClick ? (
                <button 
                    onClick={() => onImageClick(src)}
                    className="w-full h-full block rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-400"
                    aria-label={`Visualizar imagem ${index + 1}`}
                >
                    {imageElement}
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                        <p className="text-white font-semibold">Visualizar</p>
                    </div>
                </button>
            ) : (
                imageElement
            )}
            
            {onRemove && (
              <button
                onClick={() => onRemove(index)}
                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remover imagem"
              >
                <TrashIcon />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};