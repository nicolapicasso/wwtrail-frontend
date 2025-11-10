'use client';
import React from 'react';
import { Calendar, CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react';

interface EventStatsData {
  total: number;
  published: number;
  draft: number;
  rejected: number;
  approvalRate?: number | string; // ✅ Puede ser número o string
}

interface EventStatsProps {
  stats: EventStatsData;
  isLoading?: boolean;
}

export default function EventStats({ stats, isLoading = false }: EventStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const statsItems = [
    {
      label: 'Total',
      value: stats.total,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Publicados',
      value: stats.published,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Pendientes',
      value: stats.draft,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'Rechazados',
      value: stats.rejected,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      label: 'Tasa Aprobación',
      value: stats.approvalRate ? `${parseFloat(stats.approvalRate.toString()).toFixed(0)}%` : '—', // ✅ CORREGIDO
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      {statsItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">{item.label}</span>
              <div className={`${item.bgColor} rounded-full p-2`}>
                <Icon className={`h-4 w-4 ${item.color}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {item.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}