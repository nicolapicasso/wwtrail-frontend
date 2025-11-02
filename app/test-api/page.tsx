'use client';

import { useState } from 'react';
import { competitionsService } from '@/lib/api';

export default function TestApiPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [data, setData] = useState<any>(null);

  const testConnection = async () => {
    setStatus('loading');
    setMessage('Probando conexión con el backend...');
    
    try {
      const response = await competitionsService.getAll({ limit: 5 });
      const total = response.data?.length || 0;
setMessage(`✅ Conexión exitosa! Se encontraron ${total} competiciones`);
setData(response.data);
      setData(response.data);
    } catch (error: any) {
      setStatus('error');
      setMessage(`❌ Error: ${error.message || 'No se pudo conectar con el backend'}`);
      setData(null);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-8">
          🧪 Test API - WWTRAIL
        </h1>

        <div className="bg-card rounded-lg border p-6 shadow-sm mb-6">
          <h2 className="text-2xl font-semibold mb-4">Conexión con Backend</h2>
          <p className="text-muted-foreground mb-6">
            Backend URL: <code className="bg-muted px-2 py-1 rounded">
              {process.env.NEXT_PUBLIC_API_URL}
            </code>
          </p>

          <button
            onClick={testConnection}
            disabled={status === 'loading'}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Probando...' : 'Probar Conexión'}
          </button>
        </div>

        {message && (
          <div className={`rounded-lg border p-6 shadow-sm mb-6 ${
            status === 'success' ? 'bg-green-50 border-green-200' : 
            status === 'error' ? 'bg-red-50 border-red-200' : 
            'bg-blue-50 border-blue-200'
          }`}>
            <p className="font-semibold">{message}</p>
          </div>
        )}

        {data && data.length > 0 && (
          <div className="bg-card rounded-lg border p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Competiciones Recibidas:</h3>
            <ul className="space-y-3">
              {data.map((comp: any) => (
                <li key={comp.id} className="border-l-4 border-primary pl-4">
                  <p className="font-semibold">{comp.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {comp.location} - {new Date(comp.startDate).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 bg-card rounded-lg border p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-4">✅ Fase 2 - Checklist</h3>
          <ul className="space-y-2">
            <li>✅ Tipos TypeScript creados</li>
            <li>✅ Cliente Axios configurado</li>
            <li>✅ Interceptores JWT implementados</li>
            <li>✅ Servicios de API creados</li>
            <li>✅ Hooks personalizados implementados</li>
            <li>✅ Manejo de errores centralizado</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
