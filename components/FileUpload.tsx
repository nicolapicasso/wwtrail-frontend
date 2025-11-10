// components/FileUpload.tsx - VERSIÓN DEFINITIVA
// ✅ Fix 1: Previews con <img> normal
// ✅ Fix 2: Galería funciona con 1 o múltiples archivos
// ✅ Fix 3: Muestra preview para logo, portada y galería

'use client';

import { useState, useRef, ChangeEvent, DragEvent, useEffect } from 'react';
import { uploadFile, uploadMultipleFiles } from '@/lib/api/files.service';

interface FileUploadProps {
  onUpload: (url: string) => void;
  onUploadMultiple?: (urls: string[]) => void;
  currentUrl?: string;
  currentUrls?: string[];  // ✅ Para cargar galería existente
  multiple?: boolean;
  accept?: string;
  buttonText?: string;
  maxSizeMB?: number;
  showPreview?: boolean;
  className?: string;
  fieldname?: string;
}

export default function FileUpload({
  onUpload,
  onUploadMultiple,
  currentUrl,
  currentUrls,
  multiple = false,
  accept = 'image/*',
  buttonText = 'Subir archivo',
  maxSizeMB = 5,
  showPreview = true,
  className = '',
  fieldname = 'file',
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const [previewUrls, setPreviewUrls] = useState<string[]>(currentUrls || []);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ Actualizar previews cuando cambien las props
  useEffect(() => {
    if (currentUrl) setPreviewUrl(currentUrl);
  }, [currentUrl]);

  useEffect(() => {
    if (currentUrls) setPreviewUrls(currentUrls);
  }, [currentUrls]);

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
      // ✅ FIX: Si es múltiple, SIEMPRE usar uploadMultiple (incluso con 1 archivo)
      if (multiple) {
        const fileArray = Array.from(files);
        
        const validFiles = fileArray.filter(validateFileSize);
        if (validFiles.length === 0) {
          setIsUploading(false);
          return;
        }

        console.log(`📤 Uploading ${validFiles.length} file(s) to ${fieldname}`);
        
        const urls = await uploadMultipleFiles(validFiles, fieldname);
        
        console.log('✅ Upload successful:', urls);
        
        // ✅ Agregar a las URLs existentes en lugar de reemplazar
        const newUrls = [...previewUrls, ...urls];
        setPreviewUrls(newUrls);
        
        if (onUploadMultiple) {
          onUploadMultiple(newUrls);
        }
      } else {
        // Upload single
        const file = files[0];
        
        if (!validateFileSize(file)) {
          setIsUploading(false);
          return;
        }

        console.log(`📤 Uploading 1 file to ${fieldname}`);

        const url = await uploadFile(file, fieldname);
        
        console.log('✅ Upload successful:', url);
        
        setPreviewUrl(url);
        onUpload(url);
      }
    } catch (err: any) {
      console.error('❌ Upload error:', err);
      setError(err.message || 'Error al subir el archivo');
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

      {/* Drop zone - NO mostrar si ya hay preview en modo single */}
      {!(previewUrl && !multiple) && (
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
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* ✅ Preview single - Logo o Portada */}
      {showPreview && previewUrl && !multiple && (
        <div className="relative inline-block">
          <img
            src={previewUrl}
            alt="Preview"
            className="h-32 w-auto object-contain border border-gray-200 rounded-lg"
            onError={(e) => {
              console.error('❌ Error loading image:', previewUrl);
            }}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setPreviewUrl(null);
              onUpload('');
            }}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            title="Eliminar imagen"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {/* Botón para cambiar imagen */}
          <button
            type="button"
            onClick={handleButtonClick}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            Cambiar imagen
          </button>
        </div>
      )}

      {/* ✅ Preview múltiple (gallery) */}
      {showPreview && previewUrls.length > 0 && multiple && (
        <div className="space-y-2">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {previewUrls.map((url, index) => (
              <div key={`${url}-${index}`} className="relative group">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="h-24 w-full object-cover border border-gray-200 rounded-lg"
                  onError={(e) => {
                    console.error('❌ Error loading gallery image:', url);
                  }}
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
                  title="Eliminar imagen"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          {/* Botón para agregar más */}
          <button
            type="button"
            onClick={handleButtonClick}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            + Agregar más fotos
          </button>
        </div>
      )}
    </div>
  );
}

/*
✅ FIXES APLICADOS:

1. Galería funciona con 1 o múltiples archivos
   - Cambio: if (multiple) en lugar de if (multiple && files.length > 1)

2. Preview funciona para logo, portada y galería
   - Usando <img> HTML normal
   - Agregado currentUrls para galería existente

3. Botones para cambiar/agregar imágenes
   - Modo single: botón "Cambiar imagen"
   - Modo múltiple: botón "+ Agregar más fotos"

4. Logging mejorado para debug
   - console.log en cada upload
   - console.error si falla carga de imagen

5. Drop zone oculto cuando hay preview (modo single)
   - Mejor UX

RESULTADO:
✅ Logo muestra preview y permite cambiar
✅ Portada muestra preview y permite cambiar
✅ Galería muestra previews y permite agregar/eliminar
✅ Galería funciona con 1 archivo
✅ Todas las imágenes se ven correctamente
*/
