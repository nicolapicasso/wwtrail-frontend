'use client';

import { useState } from 'react';
import { User } from '@/lib/api/admin.service';
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX,
  Shield,
  User as UserIcon
} from 'lucide-react';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onToggleStatus: (userId: string) => void;
  onDelete: (userId: string) => void;
}

export default function UserTable({ users, onEdit, onToggleStatus, onDelete }: UserTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const getRoleBadge = (role: string) => {
    const styles = {
      ADMIN: 'bg-purple-100 text-purple-700 border-purple-200',
      ORGANIZER: 'bg-blue-100 text-blue-700 border-blue-200',
      ATHLETE: 'bg-green-100 text-green-700 border-green-200',
      VIEWER: 'bg-gray-100 text-gray-700 border-gray-200',
    };

    const icons = {
      ADMIN: Shield,
      ORGANIZER: UserIcon,
      ATHLETE: UserIcon,
      VIEWER: UserIcon,
    };

    const Icon = icons[role as keyof typeof icons] || UserIcon;
    const style = styles[role as keyof typeof styles] || styles.VIEWER;

    return (
      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${style}`}>
        <Icon className="h-3 w-3" />
        {role}
      </span>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 border border-green-200 px-2.5 py-0.5 text-xs font-medium">
        <UserCheck className="h-3 w-3" />
        Activo
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 text-red-700 border border-red-200 px-2.5 py-0.5 text-xs font-medium">
        <UserX className="h-3 w-3" />
        Inactivo
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Registro
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 font-semibold">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name || 'Sin nombre'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {getRoleBadge(user.role)}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {getStatusBadge(user.isActive)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {formatDate(user.createdAt)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <div className="relative inline-block">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                      className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                    
                    {openMenuId === user.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenMenuId(null)}
                        />
                        <div className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                onEdit(user);
                                setOpenMenuId(null);
                              }}
                              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Edit className="mr-3 h-4 w-4" />
                              Editar rol
                            </button>
                            <button
                              onClick={() => {
                                onToggleStatus(user.id);
                                setOpenMenuId(null);
                              }}
                              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {user.isActive ? (
                                <>
                                  <UserX className="mr-3 h-4 w-4" />
                                  Desactivar
                                </>
                              ) : (
                                <>
                                  <UserCheck className="mr-3 h-4 w-4" />
                                  Activar
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('¿Estás seguro de eliminar este usuario?')) {
                                  onDelete(user.id);
                                }
                                setOpenMenuId(null);
                              }}
                              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="mr-3 h-4 w-4" />
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {users.length === 0 && (
        <div className="py-12 text-center">
          <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay usuarios</h3>
          <p className="mt-1 text-sm text-gray-500">
            No se encontraron usuarios con los filtros aplicados.
          </p>
        </div>
      )}
    </div>
  );
}
