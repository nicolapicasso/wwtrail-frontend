// lib/api/v2/index.ts
// ✅ Central export for v2 services

// Export services only, NOT types
export { default as eventsService } from './events.service';
export { default as competitionsService } from './competitions.service';
export { default as editionsService } from './editions.service';

// Types should be imported from @/types/v2 instead