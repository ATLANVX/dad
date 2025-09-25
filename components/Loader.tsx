import React from 'react';

interface LoaderProps {
  progress?: number | null;
}

export const Loader: React.FC<LoaderProps> = ({ progress = null }) => {
  const progressPercent = progress !== null ? Math.round(progress * 100) : null;

  return (
    <div className="flex flex-col items-center justify-center p-10 bg-gray-800 rounded-lg">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
        <p className="mt-4 text-lg font-semibold text-gray-300">Gerando seu ensaio fotográfico...</p>
        
        {progress !== null && (
          <div className="w-full max-w-md mt-4">
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-cyan-500 h-2.5 rounded-full transition-all duration-300 ease-linear" 
                style={{ width: `${progressPercent ?? 0}%` }}>
              </div>
            </div>
            <p className="text-sm text-gray-400 text-center mt-2">{progressPercent}% concluído...</p>
          </div>
        )}
        
        {progress === null && (
            <p className="text-sm text-gray-500 mt-2">Isso pode levar um momento. A IA está sendo criativa!</p>
        )}
    </div>
  );
};