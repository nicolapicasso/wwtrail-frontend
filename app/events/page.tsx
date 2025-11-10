// app/events/page.tsx - Enhanced Events listing page with rich visuals
// FIXED VERSION - Todos los problemas corregidos

'use client';

import { useState } from 'react';
import { MapPin, Calendar, Users, Mountain, Search, Filter, Globe, Star } from 'lucide-react';
import { EventList } from '@/components/EventList';

export default function EventsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Mountain className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4">
              Discover Trail Running Events
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Find your next adventure in the mountains. From 5K to ultra marathons, discover events worldwide.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">360+</div>
                <div className="text-sm text-white/80">Active Events</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">15+</div>
                <div className="text-sm text-white/80">Countries</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">13K+</div>
                <div className="text-sm text-white/80">Athletes</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">6</div>
                <div className="text-sm text-white/80">Languages</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Featured Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900">Featured Events</h2>
          </div>
          {/* 
            FIX #4: Agregar EventList con featuredOnly 
            - Mostrar solo 6 eventos destacados en modo grid
            - Sin filtros visibles (showFilters={false})
          */}
          <EventList 
            viewMode="grid" 
            featuredOnly={true}
            showFilters={false}
            limit={6}
          />
        </div>

        {/* All Events Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">All Events</h2>
              <p className="text-gray-600">Browse through all trail running events</p>
            </div>
            
            {/* View Toggle - FIX #3: Asegurar que funciona */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                aria-pressed={viewMode === 'grid'}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                aria-pressed={viewMode === 'list'}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* 
          Events list with filters 
          FIX #1: Los filtros están dentro de EventList
          FIX #3: Pasar viewMode correctamente
        */}
        <EventList 
          viewMode={viewMode} 
          showFilters={true}
        />
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Organize Your Own Event?</h2>
          <p className="text-xl text-white/90 mb-8">
            Join hundreds of organizers sharing their trail running events on WWTRAIL
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Become an Organizer
          </button>
        </div>
      </div>
    </div>
  );
}
