'use client';

import { useState } from 'react';
import { User } from '@/lib/api/admin.service';
import { X, Shield, User as UserIcon } from 'lucide-react';

interface UserEditModalProps {
  user: User | null;
  onClose: () => void;
  onSave: (userId: string, newRole: string) => Promise<void>;
}

const roles = [
  { value: 'VIEWER', label: 'Viewer', description: 'Solo puede ver contenido', icon: UserIcon },
  { value: 'ATHLETE', label: 'Athlete', description: 'Puede participar en eventos', icon: UserIcon },
  { value: 'ORGANIZER', label: 'Organizer', description: 'Puede crear eventos', icon: UserIcon },
  { value: 'ADMIN', label: 'Admin', description: 'Control total del sistema', icon: Shield },
];

export default function UserEditModal({ user, onClose, onSave }: UserEditModalProps) {
  const [selectedRole, setSelectedRole] = useState(user?.role || 'VIEWER');
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleSave = async () => {
    if (selectedRole === user.role) {
      onClose();
      return;
    }

    try {
      setLoading(true);
      await onSave(user.id, selectedRole);
      onClose();
    } catch (error) {
      console.error('Error saving user role:', error);
      alert('Error al guardar el rol');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md rounded-lg bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Editar Rol de Usuario</h3>
              <p className="mt-1 text-sm text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Selecciona el nuevo rol
            </label>
            
            <div className="space-y-3">
              {roles.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.value;
                
                return (
                  <button
                    key={role.value}
                    onClick={() => setSelectedRole(role.value)}
                    className={`
                      w-full rounded-lg border-2 p-4 text-left transition-all
                      ${isSelected 
                        ? 'border-purple-600 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-start">
                      <div className={`
                        flex h-10 w-10 items-center justify-center rounded-full
                        ${isSelected ? 'bg-purple-100' : 'bg-gray-100'}
                      `}>
                        <Icon className={`h-5 w-5 ${isSelected ? 'text-purple-600' : 'text-gray-600'}`} />
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`font-medium ${isSelected ? 'text-purple-900' : 'text-gray-900'}`}>
                            {role.label}
                          </span>
                          {isSelected && (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-600">
                              <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                                <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {role.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Warning for Admin role */}
            {selectedRole === 'ADMIN' && (
              <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-4">
                <div className="flex">
                  <Shield className="h-5 w-5 text-amber-600" />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-amber-800">
                      Cuidado con el rol Admin
                    </h4>
                    <p className="mt-1 text-sm text-amber-700">
                      Los administradores tienen acceso completo al sistema.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
            <button
              onClick={onClose}
              disabled={loading}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={loading || selectedRole === user.role}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
