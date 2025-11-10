// lib/api/files.service.ts
// Service para gestión de archivos en frontend
// ✅ CORREGIDO: Agregado parámetro fieldname

import { apiClientV1 } from './client';

export interface FileUploadResponse {
  id: string;
  url: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType?: string;
}

/**
 * Sube un archivo único
 * @param file - Archivo a subir
 * @param fieldname - Nombre del campo (logo, cover, gallery, avatar, file)
 */
export async function uploadFile(file: File, fieldname: string = 'file'): Promise<string> {
  try {
    const formData = new FormData();
    formData.append(fieldname, file);  // ✅ Ahora fieldname está definido

    const response = await apiClientV1.post<{
      status: string;
      data: FileUploadResponse;
    }>('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.status === 'success' && response.data.data.url) {
      return response.data.data.url;
    }

    throw new Error('Error al subir el archivo');
  } catch (error: any) {
    console.error('Error uploading file:', error);
    throw new Error(
      error.response?.data?.message || 'Error al subir el archivo'
    );
  }
}

/**
 * Sube múltiples archivos (para galerías)
 * @param files - Array de archivos a subir
 * @param fieldname - Nombre del campo (generalmente 'gallery')
 */
export async function uploadMultipleFiles(files: File[], fieldname: string = 'gallery'): Promise<string[]> {
  try {
    const formData = new FormData();
    
    files.forEach((file) => {
      formData.append(fieldname, file);  // ✅ Ahora fieldname está definido
    });

    const response = await apiClientV1.post<{
      status: string;
      data: FileUploadResponse[];
    }>('/files/upload-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.status === 'success' && Array.isArray(response.data.data)) {
      return response.data.data.map((file) => file.url);
    }

    throw new Error('Error al subir los archivos');
  } catch (error: any) {
    console.error('Error uploading multiple files:', error);
    throw new Error(
      error.response?.data?.message || 'Error al subir los archivos'
    );
  }
}

/**
 * Elimina un archivo
 */
export async function deleteFile(fileId: string): Promise<void> {
  try {
    await apiClientV1.delete(`/files/${fileId}`);  // ✅ Corregido: template string
  } catch (error: any) {
    console.error('Error deleting file:', error);
    throw new Error(
      error.response?.data?.message || 'Error al eliminar el archivo'
    );
  }
}

/**
 * Obtiene los archivos del usuario actual
 */
export async function getUserFiles(page: number = 1, limit: number = 20) {
  try {
    const response = await apiClientV1.get<{
      status: string;
      data: FileUploadResponse[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>('/files/my-files', {
      params: { page, limit },
    });

    return response.data;
  } catch (error: any) {
    console.error('Error fetching user files:', error);
    throw new Error(
      error.response?.data?.message || 'Error al obtener los archivos'
    );
  }
}

/**
 * Obtiene información de un archivo
 */
export async function getFileInfo(fileId: string) {
  try {
    const response = await apiClientV1.get<{
      status: string;
      data: FileUploadResponse;
    }>(`/files/${fileId}`);  // ✅ Corregido: template string

    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching file info:', error);
    throw new Error(
      error.response?.data?.message || 'Error al obtener información del archivo'
    );
  }
}

export const filesService = {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
  getUserFiles,
  getFileInfo,
};

export default filesService;

/*
✅ CAMBIOS APLICADOS:
1. uploadFile(file, fieldname = 'file') - Agregado parámetro fieldname
2. uploadMultipleFiles(files, fieldname = 'gallery') - Agregado parámetro fieldname
3. deleteFile - Corregido template string
4. getFileInfo - Corregido template string

USO:
uploadFile(file, 'logo') → Sube a /uploads/logos/
uploadFile(file, 'cover') → Sube a /uploads/covers/
uploadMultipleFiles(files, 'gallery') → Sube a /uploads/gallery/
*/