// components/FileUpload.tsx - VERSIÓN CORREGIDA
// ✅ Agregado: fieldname prop para determinar carpeta de destino

'use client';

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { uploadFile, uploadMultipleFiles } from '@/lib/api/files.service';

interface FileUploadProps {
  onUpload: (url: string) => void;
  onUploadMultiple?: (urls: string[]) => void;
  currentUrl?: string;
  multiple?: boolean;
  accept?: string;
  buttonText?: string;
  maxSizeMB?: number;
  showPreview?: boolean;
  className?: string;
  fieldname?: string; // ✅ AGREGADO: 'logo' | 'cover' | 'gallery' | 'avatar'
}

export default function FileUpload({
  onUpload,
  onUploadMultiple,
  currentUrl,
  multiple = false,
  accept = 'image/*',
  buttonText = 'Subir archivo',
  maxSizeMB = 5,
  showPreview = true,
  className = '',
  fieldname = 'file', // ✅ AGREGADO: default 'file'
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFileSize = (file: File): boolean => {
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`El archivo es demasiado grande. Máximo ${maxSizeMB}MB.`);
      return false;
    }
    return true;
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setError(null);
    setIsUploading(true);

    try {
      if (multiple && files.length > 1) {
        // Upload múltiple
        const fileArray = Array.from(files);
        
        const validFiles = fileArray.filter(validateFileSize);
        if (validFiles.length === 0) {
          setIsUploading(false);
          return;
        }

        // ✅ CAMBIO: Pasar fieldname
        const urls = await uploadMultipleFiles(validFiles, fieldname);
        
        setPreviewUrls(urls);
        
        if (onUploadMultiple) {
          onUploadMultiple(urls);
        }
      } else {
        // Upload single
        const file = files[0];
        
        if (!validateFileSize(file)) {
          setIsUploading(false);
          return;
        }

        const localPreview = URL.createObjectURL(file);
        setPreviewUrl(localPreview);

        // ✅ CAMBIO: Pasar fieldname
        const url = await uploadFile(file, fieldname);
        
        setPreviewUrl(url);
        onUpload(url);
      }
    } catch (err: any) {
      setError(err.message || 'Error al subir el archivo');
      setPreviewUrl(null);
      setPreviewUrls([]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
      />

      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors duration-200
          ${isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
        onClick={handleButtonClick}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <p className="text-sm text-gray-600">Subiendo...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-700">
                {buttonText}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                o arrastra {multiple ? 'archivos' : 'un archivo'} aquí
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Máximo {maxSizeMB}MB por archivo
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {showPreview && previewUrl && !multiple && (
        <div className="relative inline-block">
          <img
            src={previewUrl}
            alt="Preview"
            className="h-32 w-auto object-contain border border-gray-200 rounded-lg"
            onError={() => setPreviewUrl(null)}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setPreviewUrl(null);
              onUpload('');
            }}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {showPreview && previewUrls.length > 0 && multiple && (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="h-24 w-full object-cover border border-gray-200 rounded-lg"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const newUrls = previewUrls.filter((_, i) => i !== index);
                  setPreviewUrls(newUrls);
                  if (onUploadMultiple) {
                    onUploadMultiple(newUrls);
                  }
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/*
✅ CAMBIOS:
1. Agregado prop fieldname
2. Pasado fieldname a uploadFile() y uploadMultipleFiles()

USO EN FORMULARIO:
<FileUpload
  fieldname="gallery"  // ← AGREGAR ESTO
  multiple={true}
  onUploadMultiple={(urls) => handleChange('gallery', urls)}
  buttonText="Subir fotos"
  maxSizeMB={3}
  accept="image/*"
  showPreview={true}
/>
*/
