
import React, { useState, ChangeEvent, useRef } from 'react';
import { ImageFile } from '../types';
import { ImageGrid } from './ImageGrid';
import { UploadIcon } from './icons/Icons';

interface FileUploadProps {
  onFilesChange: (files: ImageFile[]) => void;
  title: string;
  description: string;
  maxFiles?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesChange, title, description, maxFiles = 5 }) => {
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);


  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newImageFiles: ImageFile[] = Array.from(files).map(file => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    const combinedFiles = [...imageFiles, ...newImageFiles].slice(0, maxFiles);
    // Clean up old object URLs before setting new state to prevent memory leaks
    imageFiles.forEach(f => URL.revokeObjectURL(f.previewUrl));
    
    setImageFiles(combinedFiles);
    onFilesChange(combinedFiles);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const handleRemoveImage = (index: number) => {
    const newFiles = [...imageFiles];
    URL.revokeObjectURL(newFiles[index].previewUrl); // Clean up memory
    newFiles.splice(index, 1);
    setImageFiles(newFiles);
    onFilesChange(newFiles);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <p className="text-gray-400">{description}</p>
      </div>
      <div
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
          ${dragActive ? 'border-cyan-400 bg-gray-700' : 'border-gray-600 hover:border-cyan-500'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleChange}
            accept="image/png, image/jpeg, image/webp"
        />
        <div className="flex flex-col items-center justify-center text-gray-400 pointer-events-none">
            <UploadIcon className="w-12 h-12 mb-2" />
            <p>Arraste e solte os arquivos aqui, ou clique para selecionar</p>
            <p className="text-sm text-gray-500">(Até {maxFiles} imagens)</p>
        </div>
      </div>

      {imageFiles.length > 0 && <ImageGrid images={imageFiles} onRemove={handleRemoveImage} />}
    </div>
  );
};